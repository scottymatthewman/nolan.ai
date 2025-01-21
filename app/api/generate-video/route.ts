import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs/promises"
import path from "path"
import OpenAI from "openai"
import { v4 as uuidv4 } from "uuid"
import type { VideoGenerationRequest, VideoGenerationResponse } from "@/app/types/video"

const execAsync = promisify(exec)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const TEMP_DIR = "/tmp"
const OUTPUT_DIR = "/tmp"
const FRAME_RATE = 30
const RECORDING_DURATION = 10 // seconds

export async function POST(req: Request) {
  try {
    const { url } = (await req.json()) as VideoGenerationRequest

    if (!url) {
      return NextResponse.json({ error: "Figma prototype URL is required" }, { status: 400 })
    }

    const videoId = uuidv4()
    const outputPath = path.join(OUTPUT_DIR, `${videoId}.mp4`)

    // 1. Navigate and record the Figma prototype
    const frames = await navigateAndRecordPrototype(url, videoId)

    // 2. Analyze frames to determine important moments
    const analysis = await analyzeFrames(frames)

    // 3. Generate video with smart zooms
    const videoBuffer = await generateVideo(frames, analysis, outputPath)

    // 4. Clean up temporary files
    await Promise.all(frames.map((frame) => fs.unlink(frame)))
    await fs.unlink(outputPath).catch(() => {})

    return new Response(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": 'attachment; filename="nolan-ai-demo.mp4"',
      },
    })
  } catch (error) {
    console.error("Error generating video:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate video" },
      { status: 500 },
    )
  }
}

async function navigateAndRecordPrototype(url: string, videoId: string): Promise<string[]> {
  const browserlessApiKey = process.env.BROWSERLESS_API_KEY
  if (!browserlessApiKey) {
    throw new Error("BROWSERLESS_API_KEY is not set")
  }

  const frames: string[] = []
  const startTime = Date.now()

  while (Date.now() - startTime < RECORDING_DURATION * 1000) {
    const response = await fetch("https://chrome.browserless.io/screenshot", {
      method: "POST",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        Authorization: `Bearer ${browserlessApiKey}`,
      },
      body: JSON.stringify({
        url,
        options: {
          fullPage: false,
          type: "png",
          encoding: "base64",
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to capture screenshot: ${response.statusText}`)
    }

    const result = await response.json()
    const screenshot = result.data

    const framePath = path.join(TEMP_DIR, `${videoId}-frame-${frames.length}.png`)
    await fs.writeFile(framePath, screenshot, "base64")
    frames.push(framePath)

    // Simulate interaction (in a real scenario, you'd need to implement this on Browserless)
    await new Promise((resolve) => setTimeout(resolve, 1000 / FRAME_RATE))
  }

  return frames
}

async function analyzeFrames(frames: string[]): Promise<any> {
  const imageBuffers = await Promise.all(frames.map((frame) => fs.readFile(frame)))

  const analysis = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze these frames from a Figma prototype and identify key moments or interactions. For each important frame, provide an object with 'frameIndex', 'description', and 'zoomArea' (an object with 'x', 'y', 'width', and 'height' as percentages of the frame). Return the results as a JSON array.",
          },
          // ...imageBuffers.map((buffer) => ({
          //   type: "image",
          //   image_url: `data:image/png;base64,${buffer.toString("base64")}`,
          // })),
        ],
      },
    ],
    max_tokens: 1000,
  })

  const content = analysis.choices[0].message.content
  if (!content) {
    throw new Error("Failed to analyze frames")
  }

  return JSON.parse(content)
}

async function generateVideo(frames: string[], analysis: any, outputPath: string): Promise<Buffer> {
  const frameList = path.join(TEMP_DIR, "frames.txt")
  await fs.writeFile(frameList, frames.map((f) => `file '${f}'`).join("\n"))

  const zoomFilters = analysis
    .map((item: any) => {
      const { frameIndex, zoomArea } = item
      const startTime = frameIndex / FRAME_RATE
      const endTime = (frameIndex + 1) / FRAME_RATE
      return `zoompan=z='if(between(t,${startTime},${endTime}),1.5,1)':x='if(between(t,${startTime},${endTime}),${zoomArea.x}*iw,0)':y='if(between(t,${startTime},${endTime}),${zoomArea.y}*ih,0)':d=1:s=1920x1080`
    })
    .join(",")

  const ffmpegCommand = `ffmpeg -f concat -safe 0 -i ${frameList} -filter_complex "${zoomFilters}" -c:v libx264 -pix_fmt yuv420p -movflags +faststart ${outputPath}`

  try {
    await execAsync(ffmpegCommand)
    return await fs.readFile(outputPath)
  } catch (error) {
    throw new Error("Failed to generate video with FFmpeg")
  }
}


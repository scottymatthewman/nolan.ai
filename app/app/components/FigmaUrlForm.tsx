"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import type { GenerationStatus } from "../types/video"

export default function FigmaUrlForm() {
  const [url, setUrl] = useState("")
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    status: "idle",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGenerationStatus({ status: "loading" })

    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || "Failed to generate video")
        }
        throw new Error("Unexpected JSON response from server")
      } else if (contentType && contentType.includes("video/mp4")) {
        const videoBlob = await response.blob()
        const videoUrl = URL.createObjectURL(videoBlob)
        setGenerationStatus({
          status: "success",
          videoUrl,
        })
      } else {
        throw new Error(`Unexpected response type: ${contentType}`)
      }
    } catch (error) {
      console.error("Error in video generation:", error)
      setGenerationStatus({
        status: "error",
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    }
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Figma prototype URL"
          required
          disabled={generationStatus.status === "loading"}
        />
        <Button type="submit" disabled={generationStatus.status === "loading"} className="w-full">
          {generationStatus.status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Video...
            </>
          ) : (
            "Generate Demo Video"
          )}
        </Button>
      </form>

      {generationStatus.status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{generationStatus.error}</AlertDescription>
        </Alert>
      )}

      {generationStatus.status === "success" && generationStatus.videoUrl && (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>Your Nolan AI demo video has been generated successfully!</AlertDescription>
          </Alert>
          <div className="rounded-lg overflow-hidden border">
            <video
              src={generationStatus.videoUrl}
              controls
              className="w-full"
              poster="/placeholder.svg?height=400&width=600"
            />
          </div>
          <Button asChild className="w-full">
            <a href={generationStatus.videoUrl} download="nolan-ai-demo.mp4">
              Download Video
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}


export interface VideoGenerationRequest {
  url: string
}

export interface VideoGenerationResponse {
  videoUrl?: string
  error?: string
}

export interface GenerationStatus {
  status: "idle" | "loading" | "success" | "error"
  error?: string
  videoUrl?: string
}

export interface FrameAnalysis {
  frameIndex: number
  description: string
  zoomArea: {
    x: number
    y: number
    width: number
    height: number
  }
}


export type GenerationStage = 'idle' | 'enhancing' | 'generating' | 'rendering' | 'completed'

export interface AnimationRequest {
  prompt: string
}

export interface EnhancePromptResponse {
  enhancedPrompt: string
}

export interface GenerateAnimationRequest {
  enhancedPrompt: string
  settings?: AnimationSettings
}

export interface GenerateAnimationResponse {
  code: string
  videoBase64: string
  renderTime: number
  videoSize: number
}

export interface ErrorResponse {
  error: string
  details?: string
}

export interface AnimationSettings {
  colorTheme: string
  textColor: string
  shapeColor: string
  backgroundColor: string
  fontStyle: string
  fontSize: number
  fontBold: boolean
  fontItalic: boolean
  backgroundType: string
  backgroundImage?: string
  lineType: string
  lineThickness: number
}

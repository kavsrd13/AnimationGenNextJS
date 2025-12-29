'use client'

import { useState } from 'react'
import PromptInput from '@/components/PromptInput'
import ProgressIndicator from '@/components/ProgressIndicator'
import AnimationPreview from '@/components/AnimationPreview'
import ErrorDisplay from '@/components/ErrorDisplay'
import AnimationSettings from '@/components/AnimationSettings'
import CodePreview from '@/components/CodePreview'
import { GenerationStage, AnimationSettings as AnimationSettingsType } from '@/types'

export default function Home() {
  const [stage, setStage] = useState<GenerationStage>('idle')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generatedCode, setGeneratedCode] = useState<string>('')
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('')
  const [modifiedPrompt, setModifiedPrompt] = useState<string>('')
  const [settings, setSettings] = useState<AnimationSettingsType>({
    colorTheme: 'classic',
    textColor: '#FFFFFF',
    shapeColor: '#FFFFFF',
    backgroundColor: '#000000',
    fontStyle: 'Arial',
    fontSize: 24,
    fontBold: false,
    fontItalic: false,
    backgroundType: 'Solid Color',
    lineType: 'Solid',
    lineThickness: 2,
  })

  const handleGenerate = async (prompt: string) => {
    setStage('enhancing')
    setError(null)
    setVideoUrl(null)
    setGeneratedCode('')
    setEnhancedPrompt('')

    try {
      // Create modified prompt with settings
      const settingsDescription = `
Settings to apply:
- Color Theme: ${settings.colorTheme}
- Text Color: ${settings.textColor}
- Shape Color: ${settings.shapeColor}
- Background: ${settings.backgroundType} (${settings.backgroundColor})
- Font: ${settings.fontStyle}, ${settings.fontSize}px${settings.fontBold ? ', Bold' : ''}${settings.fontItalic ? ', Italic' : ''}
- Lines: ${settings.lineType}, ${settings.lineThickness}px thickness
`
      const fullPrompt = `${prompt}\n\n${settingsDescription}`
      setModifiedPrompt(fullPrompt)

      // Step 1: Enhance prompt
      const enhanceResponse = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      })

      if (!enhanceResponse.ok) {
        const errorData = await enhanceResponse.json()
        throw new Error(errorData.error || 'Failed to enhance prompt')
      }

      const { enhancedPrompt: enhanced } = await enhanceResponse.json()
      setEnhancedPrompt(enhanced)

      // Step 2: Generate code
      setStage('generating')
      const generateResponse = await fetch('/api/generate-animation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enhancedPrompt: enhanced, settings }),
      })

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json()
        throw new Error(errorData.error || 'Failed to generate animation')
      }

      const { code, videoBase64, renderTime, videoSize } = await generateResponse.json()
      setGeneratedCode(code)

      // Validate video data
      if (!videoBase64) {
        throw new Error('No video data received from server')
      }

      // Step 3: Display video
      setStage('completed')
      try {
        const videoBlob = base64ToBlob(videoBase64, 'video/mp4')
        const url = URL.createObjectURL(videoBlob)
        setVideoUrl(url)
      } catch (decodeError: any) {
        throw new Error(`Failed to decode video: ${decodeError.message}`)
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      setStage('idle')
    }
  }

  const base64ToBlob = (base64: string, type: string): Blob => {
    // Remove any whitespace and data URL prefix if present
    let cleanBase64 = base64.replace(/\s/g, '')
    if (cleanBase64.startsWith('data:')) {
      cleanBase64 = cleanBase64.split(',')[1]
    }
    
    // Decode base64 string
    const byteCharacters = atob(cleanBase64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type })
  }

  const handleReset = () => {
    setStage('idle')
    setVideoUrl(null)
    setError(null)
    setGeneratedCode('')
    setEnhancedPrompt('')
    setModifiedPrompt('')
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Python Animation Generator
          </h1>
          <p className="text-white/90 text-lg">
            Create stunning mathematical animations using AI and Python
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Settings */}
          <div className="lg:col-span-1">
            <AnimationSettings settings={settings} onSettingsChange={setSettings} />
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              {stage !== 'idle' && (
                <ProgressIndicator 
                  stage={stage}
                  enhancedPrompt={enhancedPrompt}
                  generatedCode={generatedCode}
                />
              )}

              {error && <ErrorDisplay error={error} />}

              {stage === 'idle' || stage === 'enhancing' ? (
                <PromptInput onGenerate={handleGenerate} isLoading={stage === 'enhancing'} />
              ) : null}

              {videoUrl && stage === 'completed' && (
                <AnimationPreview videoUrl={videoUrl} onReset={handleReset} />
              )}

              {(stage === 'generating' || stage === 'rendering') && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
                  <p className="mt-4 text-gray-600 font-medium">
                    {stage === 'generating' ? 'Generating Python code...' : 'Rendering animation...'}
                  </p>
                </div>
              )}
            </div>

            {/* Code Preview Section */}
            {(modifiedPrompt || generatedCode) && (
              <CodePreview modifiedPrompt={modifiedPrompt} generatedCode={generatedCode} />
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-white/80 text-sm">
          <p>Powered by Azure OpenAI & Python</p>
        </div>
      </div>
    </main>
  )
}

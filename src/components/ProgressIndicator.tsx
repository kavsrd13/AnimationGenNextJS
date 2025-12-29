'use client'

import { GenerationStage } from '@/types'
import { CheckCircle, Circle, Loader2 } from 'lucide-react'

interface ProgressIndicatorProps {
  stage: GenerationStage
  enhancedPrompt?: string
  generatedCode?: string
}

export default function ProgressIndicator({ 
  stage, 
  enhancedPrompt, 
  generatedCode 
}: ProgressIndicatorProps) {
  const steps = [
    { id: 'enhancing', label: 'Enhancing Prompt', stage: 'enhancing' },
    { id: 'generating', label: 'Generating Code', stage: 'generating' },
    { id: 'rendering', label: 'Rendering Video', stage: 'rendering' },
  ]

  const getStepStatus = (stepStage: string) => {
    const stageOrder = ['enhancing', 'generating', 'rendering', 'completed']
    const currentIndex = stageOrder.indexOf(stage)
    const stepIndex = stageOrder.indexOf(stepStage)

    if (currentIndex > stepIndex) return 'completed'
    if (currentIndex === stepIndex) return 'active'
    return 'pending'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.stage)
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className="relative">
                  {status === 'completed' && (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  )}
                  {status === 'active' && (
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                  )}
                  {status === 'pending' && (
                    <Circle className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <span className={`mt-2 text-sm font-medium ${
                  status === 'completed' ? 'text-green-600' :
                  status === 'active' ? 'text-purple-600' :
                  'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${
                  status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          )
        })}
      </div>

      {enhancedPrompt && (
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
          <h3 className="font-semibold text-purple-900 mb-2">Enhanced Prompt:</h3>
          <p className="text-sm text-purple-800">{enhancedPrompt}</p>
        </div>
      )}

      {generatedCode && (
        <details className="bg-gray-50 border border-gray-200 rounded-lg">
          <summary className="cursor-pointer p-4 font-semibold text-gray-700 hover:bg-gray-100">
            View Generated Code
          </summary>
          <pre className="p-4 overflow-x-auto text-xs bg-gray-900 text-gray-100 rounded-b-lg">
            <code>{generatedCode}</code>
          </pre>
        </details>
      )}
    </div>
  )
}

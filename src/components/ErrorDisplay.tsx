'use client'

import { AlertTriangle } from 'lucide-react'

interface ErrorDisplayProps {
  error: string
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
      <div className="flex items-start">
        <AlertTriangle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 mb-2">Error</h3>
          <p className="text-sm text-red-800 whitespace-pre-wrap">{error}</p>
          <div className="mt-3 text-sm text-red-700">
            <p className="font-medium">Troubleshooting tips:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Verify your Azure OpenAI API key and endpoint are configured correctly</li>
              <li>Check that the Manim animation server is running and accessible</li>
              <li>Ensure your prompt is clear and describes the educational concept</li>
              <li>Try a simpler concept first, then add complexity</li>
              <li>LaTeX is supported - use MathTex() for equations freely</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

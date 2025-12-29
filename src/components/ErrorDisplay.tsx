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
              <li>Try simplifying your prompt</li>
              <li>Avoid requesting complex mathematical notation</li>
              <li>Use basic shapes and animations</li>
              <li>Check that your Azure OpenAI credentials are configured</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

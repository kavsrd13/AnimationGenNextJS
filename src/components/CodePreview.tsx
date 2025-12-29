'use client'

interface CodePreviewProps {
  modifiedPrompt: string
  generatedCode: string
}

export default function CodePreview({ modifiedPrompt, generatedCode }: CodePreviewProps) {
  return (
    <div className="space-y-4">
      {/* Modified Prompt Preview */}
      {modifiedPrompt && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h3 className="font-semibold text-gray-800">Modified Prompt</h3>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <p className="text-gray-700 whitespace-pre-wrap">{modifiedPrompt}</p>
          </div>
        </div>
      )}

      {/* Generated Code Display */}
      {generatedCode && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <h3 className="font-semibold text-gray-800">Generated Python Code</h3>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(generatedCode)}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              Copy Code
            </button>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm font-mono whitespace-pre">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

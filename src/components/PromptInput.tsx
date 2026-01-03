'use client'

import { useState, FormEvent } from 'react'

interface PromptInputProps {
  onGenerate: (prompt: string) => void
  isLoading: boolean
}

export default function PromptInput({ onGenerate, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt.trim())
    }
  }

  const examplePrompts = [
    // Mathematics
    "Teach the Pythagorean theorem a² + b² = c² with visual proof",
    "Explain derivatives using tangent lines and limits",
    "Show the quadratic formula derivation step by step",
    
    // Physics
    "Demonstrate Newton's second law F=ma with examples",
    "Visualize wave interference with mathematical equations",
    "Explain kinetic and potential energy in a pendulum",
    
    // Calculus
    "Teach integration as area under a curve",
    "Show the fundamental theorem of calculus visually",
    "Demonstrate the chain rule with nested functions",
    
    // Algebra
    "Explain matrix multiplication step by step",
    "Visualize eigenvalues and eigenvectors",
    "Teach solving systems of equations with elimination method",
  ]

  return (
    <div className="space-y-4">
      {/* App Description */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-2 border-purple-200 mb-6">
        <h3 className="font-semibold text-purple-800 mb-2">Create Educational Animations with LaTeX Support:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            <span>Mathematical concepts with professional LaTeX equations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            <span>Step-by-step teaching animations for students</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            <span>Physics and calculus visualizations with formulas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            <span>Algebraic proofs and derivations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            <span>Scientific concept explanations with annotations</span>
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Describe your animation
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Teach the quadratic formula with a step-by-step derivation using LaTeX equations..."
            className="input-field min-h-[120px] resize-y"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Generate Animation'
          )}
        </button>
      </form>

      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Try an example prompt:</p>
        <div className="grid grid-cols-1 gap-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              disabled={isLoading}
              className="text-left text-sm p-3 rounded-lg border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

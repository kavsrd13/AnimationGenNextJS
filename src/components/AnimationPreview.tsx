'use client'

import { Download, RotateCcw } from 'lucide-react'

interface AnimationPreviewProps {
  videoUrl: string
  onReset: () => void
}

export default function AnimationPreview({ videoUrl, onReset }: AnimationPreviewProps) {
  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = videoUrl
    a.download = `manim-animation-${Date.now()}.mp4`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-6">
      <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
        <video
          src={videoUrl}
          controls
          autoPlay
          loop
          className="w-full h-auto"
          style={{ maxHeight: '500px' }}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleDownload}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download Video
        </button>
        <button
          onClick={onReset}
          className="btn-primary flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <RotateCcw className="w-5 h-5" />
          Create Another
        </button>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
        <p className="text-green-800 font-medium">
          ✓ Animation generated successfully!
        </p>
      </div>
    </div>
  )
}

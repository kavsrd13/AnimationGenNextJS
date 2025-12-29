'use client'

import { useState, ChangeEvent } from 'react'
import { AnimationSettings as AnimationSettingsType } from '@/types'

interface AnimationSettingsProps {
  settings: AnimationSettingsType
  onSettingsChange: (settings: AnimationSettingsType) => void
}

export default function AnimationSettings({ settings, onSettingsChange }: AnimationSettingsProps) {
  const [backgroundFile, setBackgroundFile] = useState<string>('')

  const colorThemes = [
    { value: 'classic', label: 'Classic (Black/White)' },
    { value: 'vibrant', label: 'Vibrant (Red/Blue/Yellow)' },
    { value: 'pastel', label: 'Pastel (Pink/Peach/Light Blue)' },
    { value: 'custom', label: 'Custom Colors' },
  ]

  const fonts = ['Arial', 'Times New Roman', 'Courier New', 'Helvetica', 'Georgia']
  const backgroundTypes = ['Solid Color', 'Gradient', 'Image']
  const lineTypes = ['Solid', 'Dashed', 'Glow']

  const handleThemeChange = (theme: string) => {
    let newSettings = { ...settings, colorTheme: theme }
    
    // Apply preset colors based on theme
    if (theme === 'classic') {
      newSettings = {
        ...newSettings,
        textColor: '#FFFFFF',
        shapeColor: '#FFFFFF',
        backgroundColor: '#000000',
      }
    } else if (theme === 'vibrant') {
      newSettings = {
        ...newSettings,
        textColor: '#FF0000',
        shapeColor: '#0000FF',
        backgroundColor: '#FFFF00',
      }
    } else if (theme === 'pastel') {
      newSettings = {
        ...newSettings,
        textColor: '#FFB6C1',
        shapeColor: '#FFDAB9',
        backgroundColor: '#ADD8E6',
      }
    }
    
    onSettingsChange(newSettings)
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBackgroundFile(file.name)
      onSettingsChange({ ...settings, backgroundImage: file.name })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Animation Settings</h2>

      {/* Color Themes */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Color Theme</label>
        <select
          value={settings.colorTheme}
          onChange={(e) => handleThemeChange(e.target.value)}
          className="input-field"
        >
          {colorThemes.map((theme) => (
            <option key={theme.value} value={theme.value}>
              {theme.label}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Colors */}
      {settings.colorTheme === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.textColor}
                onChange={(e) => onSettingsChange({ ...settings, textColor: e.target.value })}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.textColor}
                onChange={(e) => onSettingsChange({ ...settings, textColor: e.target.value })}
                className="input-field flex-1"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shape Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.shapeColor}
                onChange={(e) => onSettingsChange({ ...settings, shapeColor: e.target.value })}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.shapeColor}
                onChange={(e) => onSettingsChange({ ...settings, shapeColor: e.target.value })}
                className="input-field flex-1"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => onSettingsChange({ ...settings, backgroundColor: e.target.value })}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) => onSettingsChange({ ...settings, backgroundColor: e.target.value })}
                className="input-field flex-1"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      )}

      {/* Fonts & Typography */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800">Fonts & Typography</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
            <select
              value={settings.fontStyle}
              onChange={(e) => onSettingsChange({ ...settings, fontStyle: e.target.value })}
              className="input-field"
            >
              {fonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size: {settings.fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="72"
              value={settings.fontSize}
              onChange={(e) => onSettingsChange({ ...settings, fontSize: parseInt(e.target.value) })}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>12px</span>
              <span>72px</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.fontBold}
              onChange={(e) => onSettingsChange({ ...settings, fontBold: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">Bold</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.fontItalic}
              onChange={(e) => onSettingsChange({ ...settings, fontItalic: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">Italic</span>
          </label>
        </div>
      </div>

      {/* Backgrounds */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800">Background</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Background Type</label>
          <select
            value={settings.backgroundType}
            onChange={(e) => onSettingsChange({ ...settings, backgroundType: e.target.value })}
            className="input-field"
          >
            {backgroundTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {settings.backgroundType === 'Image' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {backgroundFile && (
              <p className="text-sm text-gray-600 mt-2">Selected: {backgroundFile}</p>
            )}
          </div>
        )}
      </div>

      {/* Line Styles */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800">Line Styles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Line Type</label>
            <select
              value={settings.lineType}
              onChange={(e) => onSettingsChange({ ...settings, lineType: e.target.value })}
              className="input-field"
            >
              {lineTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Line Thickness: {settings.lineThickness}px
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={settings.lineThickness}
              onChange={(e) => onSettingsChange({ ...settings, lineThickness: parseFloat(e.target.value) })}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1px</span>
              <span>10px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <h3 className="font-semibold text-gray-800">Settings Preview</h3>
        </div>
        <div 
          className="p-4 rounded-lg"
          style={{ 
            backgroundColor: settings.backgroundColor,
            color: settings.textColor,
            fontFamily: settings.fontStyle,
            fontSize: `${settings.fontSize}px`,
            fontWeight: settings.fontBold ? 'bold' : 'normal',
            fontStyle: settings.fontItalic ? 'italic' : 'normal',
          }}
        >
          <p>Sample Text Preview</p>
          <div 
            className="mt-2 w-16 h-16 rounded"
            style={{ 
              backgroundColor: settings.shapeColor,
              border: `${settings.lineThickness}px ${settings.lineType.toLowerCase()} ${settings.textColor}`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

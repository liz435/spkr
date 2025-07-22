'use client'

import React from 'react';

interface MotionBlurControlsProps {
  motionBlurEnabled: boolean;
  motionBlurStrength: number;
  onMotionBlurToggle: (enabled: boolean) => void;
  onMotionBlurStrengthChange: (strength: number) => void;
}

export function MotionBlurControls({
  motionBlurEnabled,
  motionBlurStrength,
  onMotionBlurToggle,
  onMotionBlurStrengthChange
}: MotionBlurControlsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        EXTREME Motion Blur
      </h3>
      
      {/* Motion Blur Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Enable EXTREME Blur
        </label>
        <button
          onClick={() => onMotionBlurToggle(!motionBlurEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
            motionBlurEnabled ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              motionBlurEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Motion Blur Strength */}
      {motionBlurEnabled && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Blur Intensity
            </label>
            <span className="text-sm text-red-600 dark:text-red-400 font-bold">
              {motionBlurStrength.toFixed(2)}x EXTREME
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={motionBlurStrength}
            onChange={(e) => onMotionBlurStrengthChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(motionBlurStrength - 0.1) / (3.0 - 0.1) * 100}%, #d1d5db ${(motionBlurStrength - 0.1) / (3.0 - 0.1) * 100}%, #d1d5db 100%)`
            }}
          />
          
          {/* Preset Buttons */}
          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => onMotionBlurStrengthChange(0.5)}
              className="px-3 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800 dark:hover:bg-yellow-700 rounded-md transition-colors"
            >
              Mild
            </button>
            <button
              onClick={() => onMotionBlurStrengthChange(1.0)}
              className="px-3 py-1 text-xs bg-orange-100 hover:bg-orange-200 dark:bg-orange-800 dark:hover:bg-orange-700 rounded-md transition-colors"
            >
              Strong
            </button>
            <button
              onClick={() => onMotionBlurStrengthChange(2.0)}
              className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 rounded-md transition-colors text-red-800 dark:text-red-200"
            >
              EXTREME
            </button>
            <button
              onClick={() => onMotionBlurStrengthChange(3.0)}
              className="px-3 py-1 text-xs bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-md transition-colors font-bold"
            >
              🔥 INSANE 🔥
            </button>
          </div>
        </div>
      )}

      {/* Info Text */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 p-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-md border border-red-200 dark:border-red-800">
        <p className="font-semibold text-red-700 dark:text-red-300">🎬 EXTREME CINEMATIC EFFECTS:</p>
        <p className="mt-1">• 64-sample motion blur for ultra-smooth effects</p>
        <p>• Automatic scene transition blur (4x intensity)</p>
        <p>• Chromatic aberration & desaturation</p>
        <p>• Radial + directional + zoom blur combined</p>
        {motionBlurEnabled && (
          <p className="mt-2 text-red-600 dark:text-red-400 font-medium">
            🚀 Try rotating the camera or switching scenes for DRAMATIC effects!
          </p>
        )}
      </div>
    </div>
  );
}

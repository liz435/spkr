'use client'

import React from 'react';

interface MaterialControlsProps {
  roughness: number;
  onRoughnessChange: (value: number) => void;
  metalness: number;
  onMetalnessChange: (value: number) => void;
  transmission: number;
  onTransmissionChange: (value: number) => void;
  opacity: number;
  onOpacityChange: (value: number) => void;
  emissiveIntensity: number;
  onEmissiveIntensityChange: (value: number) => void;
  iridescence: number;
  onIridescenceChange: (value: number) => void;
}

export function MaterialControls({
  roughness,
  onRoughnessChange,
  metalness,
  onMetalnessChange,
  transmission,
  onTransmissionChange,
  opacity,
  onOpacityChange,
  emissiveIntensity,
  onEmissiveIntensityChange,
  iridescence,
  onIridescenceChange,
}: MaterialControlsProps) {
  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
      <h3 className="text-white font-medium mb-4">Material Properties</h3>
      
      <div className="space-y-4">
        {/* Roughness */}
        <div>
          <label className="text-white/80 text-sm block mb-2">
            Roughness: {roughness.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={roughness}
            onChange={(e) => onRoughnessChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Metalness */}
        <div>
          <label className="text-white/80 text-sm block mb-2">
            Metalness: {metalness.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={metalness}
            onChange={(e) => onMetalnessChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Transmission */}
        <div>
          <label className="text-white/80 text-sm block mb-2">
            Transmission: {transmission.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={transmission}
            onChange={(e) => onTransmissionChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Opacity */}
        <div>
          <label className="text-white/80 text-sm block mb-2">
            Opacity: {opacity.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Emissive Intensity */}
        <div>
          <label className="text-white/80 text-sm block mb-2">
            Emissive: {emissiveIntensity.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={emissiveIntensity}
            onChange={(e) => onEmissiveIntensityChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Iridescence */}
        <div>
          <label className="text-white/80 text-sm block mb-2">
            Iridescence: {iridescence.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={iridescence}
            onChange={(e) => onIridescenceChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Material Presets */}
        <div>
          <label className="text-white/80 text-sm block mb-2">Material Presets</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onRoughnessChange(0.1);
                onMetalnessChange(0.9);
                onTransmissionChange(0);
                onOpacityChange(1);
                onEmissiveIntensityChange(0);
                onIridescenceChange(0);
              }}
              className="px-3 py-2 bg-gray-500/20 hover:bg-gray-500/30 rounded-lg text-white/80 text-sm transition-colors"
            >
              Metal
            </button>
            <button
              onClick={() => {
                onRoughnessChange(0.2);
                onMetalnessChange(0);
                onTransmissionChange(0.9);
                onOpacityChange(0.8);
                onEmissiveIntensityChange(0.3);
                onIridescenceChange(0.3);
              }}
              className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-white/80 text-sm transition-colors"
            >
              Glass
            </button>
            <button
              onClick={() => {
                onRoughnessChange(0.8);
                onMetalnessChange(0);
                onTransmissionChange(0);
                onOpacityChange(1);
                onEmissiveIntensityChange(0);
                onIridescenceChange(0);
              }}
              className="px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-white/80 text-sm transition-colors"
            >
              Plastic
            </button>
            <button
              onClick={() => {
                onRoughnessChange(0.3);
                onMetalnessChange(0);
                onTransmissionChange(0.5);
                onOpacityChange(0.9);
                onEmissiveIntensityChange(1.2);
                onIridescenceChange(0.8);
              }}
              className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-white/80 text-sm transition-colors"
            >
              Hologram
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}

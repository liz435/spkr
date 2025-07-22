'use client'

import React from 'react';
import { TEXTURE_PRESETS, type TexturePreset } from '@/components/TextureManager';

interface TextureControlsProps {
  currentTexture: TexturePreset | string;
  onTextureChange: (texture: TexturePreset | string) => void;
  disabled?: boolean;
}

export function TextureControls({ 
  currentTexture, 
  onTextureChange, 
  disabled = false 
}: TextureControlsProps) {
  const presetEntries = Object.entries(TEXTURE_PRESETS);
  
  return (
    <div className="flex flex-col gap-3 p-4 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10">
      <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
        🎨 Wall Texture
      </h3>
      
      <div className="grid grid-cols-2 gap-2">
        {presetEntries.map(([key, value]) => {
          // Skip file-based textures for now (show only procedural)
          if (typeof value === 'string') return null;
          
          const isSelected = currentTexture === key;
          const displayName = key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
          
          return (
            <button
              key={key}
              onClick={() => !disabled && onTextureChange(key as TexturePreset)}
              disabled={disabled}
              className={`
                px-3 py-2 rounded-md text-xs font-medium transition-all duration-200
                ${isSelected 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105' 
                  : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-102'}
              `}
            >
              {displayName}
            </button>
          );
        })}
      </div>
      
      {/* Custom texture input */}
      <div className="mt-2 pt-2 border-t border-white/10">
        <label className="text-white/60 text-xs uppercase tracking-wide block mb-2">
          Custom Texture Path
        </label>
        <input
          type="text"
          placeholder="/textures/your-texture.jpg"
          value={typeof currentTexture === 'string' && !(currentTexture in TEXTURE_PRESETS) ? currentTexture : ''}
          onChange={(e) => !disabled && onTextureChange(e.target.value)}
          disabled={disabled}
          className="w-full px-2 py-1 bg-black/30 border border-white/20 rounded text-white text-xs
                     placeholder-white/40 focus:border-blue-400 focus:outline-none"
        />
        <p className="text-white/40 text-xs mt-1">
          Add texture files to public/textures/ folder
        </p>
      </div>
      
      {/* Preview info */}
      <div className="mt-2 p-2 bg-black/20 rounded text-xs">
        <div className="text-white/60 uppercase tracking-wide mb-1">Current:</div>
        <div className="text-white font-mono">
          {(() => {
            if (currentTexture in TEXTURE_PRESETS) {
              const config = TEXTURE_PRESETS[currentTexture as TexturePreset];
              if (typeof config === 'object') {
                if (config.type === 'pbr') {
                  return '🎨 PBR Material';
                } else if (config.type === 'procedural') {
                  return '🖌️ Procedural';
                }
              }
              return '🎨 Preset';
            }
            return '📁 External';
          })()} : {currentTexture}
        </div>
        {(currentTexture === 'brick' || currentTexture === 'wood-panels') && (
          <div className="text-white/50 text-xs mt-1">
            📦 5 Maps: Diffuse, Normal, Roughness, AO, Height
          </div>
        )}
      </div>
    </div>
  );
}

// Texture preview component (optional)
export function TexturePreview({ texture }: { texture: TexturePreset | string }) {
  if (!texture || texture in TEXTURE_PRESETS) {
    // For procedural textures, show a simple preview
    const config = TEXTURE_PRESETS[texture as TexturePreset];
    if (typeof config === 'object') {
      return (
        <div 
          className="w-16 h-16 rounded border border-white/20"
          style={{ backgroundColor: config.baseColor }}
          title={`Procedural ${texture} texture`}
        >
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded"></div>
        </div>
      );
    }
  }
  
  // For external textures, could show actual image preview
  return (
    <div className="w-16 h-16 rounded border border-white/20 bg-gray-500/20 flex items-center justify-center">
      <span className="text-white/40 text-xs">IMG</span>
    </div>
  );
}

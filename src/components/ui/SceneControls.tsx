'use client'

import React from 'react';
import { type TexturePreset } from '../TextureManager';

interface SceneControlsProps {
  sceneType: string;
  onSceneTypeChange: (type: string) => void;
  wallColor: string;
  onWallColorChange?: (color: string) => void;
  wallTexture?: TexturePreset | string; // 新增纹理属性
  onWallTextureChange?: (texture: TexturePreset | string) => void; // 新增纹理更改函数
  floorType: string;
  onFloorTypeChange?: (type: string) => void;
  showObjects: {
    speaker: boolean;
    couch: boolean;
    woofer: boolean;
  };
  onObjectToggle?: (object: string, visible: boolean) => void;
}

export function SceneControls({
  sceneType,
  onSceneTypeChange,
  wallColor,
  onWallColorChange,
  wallTexture = "white-plaster", // 默认纹理
  onWallTextureChange, // 纹理更改处理函数
  floorType,
  onFloorTypeChange,
  showObjects,
  onObjectToggle,
}: SceneControlsProps) {
  const sceneTypes = [
    { name: "Room", value: "room", icon: "🏠" },
    { name: "Studio", value: "studio", icon: "🎬" },
    { name: "Outdoor", value: "outdoor", icon: "🌳" },
    { name: "Abstract", value: "abstract", icon: "🔮" },
  ];

  const wallColors = [
    { name: "White", value: "#f5f5f5" },
    { name: "Light Gray", value: "#e0e0e0" },
    { name: "Cream", value: "#f5f5dc" },
    { name: "Light Blue", value: "#e3f2fd" },
    { name: "Light Green", value: "#e8f5e8" },
    { name: "Warm White", value: "#faf7f0" },
  ];

  const floorTypes = [
    { name: "Wood", value: "wood", icon: "🪵" },
    { name: "Wood Panels", value: "wood-panels", icon: "🏠" },
    { name: "Wood Floor PBR", value: "wood-floor-pbr", icon: "🌳" },
    { name: "Concrete", value: "concrete", icon: "🧱" },
    { name: "Marble", value: "marble", icon: "💎" },
    { name: "Carpet", value: "carpet", icon: "🟫" },
  ];

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
      <h3 className="text-white font-medium mb-4">Scene Controls</h3>
      
      <div className="space-y-4">
        {/* Scene Type */}
        <div>
          <label className="text-white/80 text-sm block mb-2">Scene Type</label>
          <div className="grid grid-cols-2 gap-2">
            {sceneTypes.map((scene) => (
              <button
                key={scene.value}
                onClick={() => onSceneTypeChange(scene.value)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  sceneType === scene.value
                    ? 'bg-blue-500/30 border border-blue-400/50 text-white'
                    : 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                }`}
              >
                <span className="mr-1">{scene.icon}</span>
                {scene.name}
              </button>
            ))}
          </div>
        </div>

        {/* Wall Color (only for room scene) */}
        {sceneType === 'room' && (
          <div>
            <label className="text-white/80 text-sm block mb-2">Wall Color</label>
            <div className="grid grid-cols-3 gap-2">
              {wallColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => onWallColorChange?.(color.value)}
                  className={`h-8 rounded-lg border-2 transition-all ${
                    wallColor === color.value
                      ? 'border-white scale-110'
                      : 'border-white/30 hover:border-white/60'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Wall Texture (only for room scene) */}
        {sceneType === 'room' && onWallTextureChange && (
          <div>
            <label className="text-white/80 text-sm block mb-2">🎨 Wall Texture</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Plaster", value: "white-plaster", icon: "🏠" },
                { name: "Concrete", value: "concrete", icon: "🧱" },
                { name: "Brick PBR", value: "brick", icon: "🧱" },
                { name: "Wood PBR", value: "wood-panels", icon: "🪵" } // 更新为Wood PBR
              ].map((texture) => (
                <button
                  key={texture.value}
                  onClick={() => onWallTextureChange?.(texture.value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    wallTexture === texture.value
                      ? 'bg-blue-500/30 border border-blue-400/50 text-white'
                      : 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <span className="mr-1">{texture.icon}</span>
                  {texture.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Floor Type (only for room scene) */}
        {sceneType === 'room' && (
          <div>
            <label className="text-white/80 text-sm block mb-2">Floor Type</label>
            <div className="grid grid-cols-2 gap-2">
              {floorTypes.map((floor) => (
                <button
                  key={floor.value}
                  onClick={() => onFloorTypeChange?.(floor.value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    floorType === floor.value
                      ? 'bg-orange-500/30 border border-orange-400/50 text-white'
                      : 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <span className="mr-1">{floor.icon}</span>
                  {floor.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Object Visibility */}
        <div>
          <label className="text-white/80 text-sm block mb-2">Objects</label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">🔊 Speaker</span>
              <button
                onClick={() => onObjectToggle?.('speaker', !showObjects.speaker)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  showObjects.speaker ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    showObjects.speaker ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">🛋️ Couch</span>
              <button
                onClick={() => onObjectToggle?.('couch', !showObjects.couch)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  showObjects.couch ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    showObjects.couch ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">🔈 Woofer</span>
              <button
                onClick={() => onObjectToggle?.('woofer', !showObjects.woofer)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  showObjects.woofer ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    showObjects.woofer ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Scene Presets */}
        <div>
          <label className="text-white/80 text-sm block mb-2">Quick Presets</label>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => {
                onSceneTypeChange('room');
                onWallColorChange?.('#f5f5f5');
                onFloorTypeChange?.('wood');
                onObjectToggle?.('speaker', true);
                onObjectToggle?.('couch', true);
                onObjectToggle?.('woofer', true);
              }}
              className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-white/80 text-sm transition-colors"
            >
              🏠 Living Room
            </button>
            <button
              onClick={() => {
                onSceneTypeChange('studio');
                onObjectToggle?.('speaker', true);
                onObjectToggle?.('couch', false);
                onObjectToggle?.('woofer', true);
              }}
              className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-white/80 text-sm transition-colors"
            >
              🎬 Studio Setup
            </button>
            <button
              onClick={() => {
                onSceneTypeChange('abstract');
                onObjectToggle?.('speaker', true);
                onObjectToggle?.('couch', false);
                onObjectToggle?.('woofer', false);
              }}
              className="px-3 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg text-white/80 text-sm transition-colors"
            >
              🔮 Minimalist
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

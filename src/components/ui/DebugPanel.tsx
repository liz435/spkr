'use client'

import React, { useState } from 'react';

interface DebugPanelProps {
  // Motion Blur Controls
  motionBlurIntensity?: number;
  onMotionBlurIntensityChange?: (value: number) => void;
  motionBlurSamples?: number;
  onMotionBlurSamplesChange?: (value: number) => void;
  velocityFactor?: number;
  onVelocityFactorChange?: (value: number) => void;
  
  // Face Box Position Controls
  faceBoxPosition?: [number, number, number];
  onFaceBoxPositionChange?: (position: [number, number, number]) => void;
  faceBoxRotation?: [number, number, number];
  onFaceBoxRotationChange?: (rotation: [number, number, number]) => void;
  faceBoxScale?: [number, number, number];
  onFaceBoxScaleChange?: (scale: [number, number, number]) => void;
  
  // Rendering Controls
  materialType?: string;
  onMaterialTypeChange?: (type: string) => void;
  renderingMode?: string;
  onRenderingModeChange?: (mode: string) => void;
  toneMappingExposure?: number;
  onToneMappingExposureChange?: (value: number) => void;
  
  // Post Processing Controls
  postProcessingEnabled?: boolean;
  onPostProcessingToggle?: (enabled: boolean) => void;
  bloomStrength?: number;
  onBloomStrengthChange?: (value: number) => void;
  ssaoIntensity?: number;
  onSSAOIntensityChange?: (value: number) => void;
  
  // Scene Controls
  sceneType?: string;
  onSceneTypeChange?: (type: string) => void;
  wallColor?: string;
  onWallColorChange?: (color: string) => void;
  wallTexture?: string;
  onWallTextureChange?: (texture: string) => void;
  floorType?: string;
  onFloorTypeChange?: (type: string) => void;
}

export function DebugPanel({
  // Motion Blur props
  motionBlurIntensity = 1,
  onMotionBlurIntensityChange,
  motionBlurSamples = 16,
  onMotionBlurSamplesChange,
  velocityFactor = 1,
  onVelocityFactorChange,
  
  // Face Box props
  faceBoxPosition = [0, 0, 0],
  onFaceBoxPositionChange,
  faceBoxRotation = [0, 0, 0],
  onFaceBoxRotationChange,
  faceBoxScale = [1, 1, 1],
  onFaceBoxScaleChange,
  
  // Rendering props
  materialType = 'physical',
  onMaterialTypeChange,
  renderingMode = 'realistic',
  onRenderingModeChange,
  toneMappingExposure = 1,
  onToneMappingExposureChange,
  
  // Post Processing props
  postProcessingEnabled = true,
  onPostProcessingToggle,
  bloomStrength = 0.4,
  onBloomStrengthChange,
  ssaoIntensity = 0.6,
  onSSAOIntensityChange,
  
  // Scene props
  sceneType = 'room',
  onSceneTypeChange,
  wallColor = '#ffffff',
  onWallColorChange,
  wallTexture = 'brick',
  onWallTextureChange,
  floorType = 'wood-floor-pbr',
  onFloorTypeChange,
}: DebugPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    motionBlur: false,
    faceBox: false,
    rendering: false,
    scene: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const materialTypes = [
    { name: "Physical", value: "physical" },
    { name: "Standard", value: "standard" },
    { name: "Lambert", value: "lambert" },
    { name: "Phong", value: "phong" },
    { name: "Toon", value: "toon" },
    { name: "Basic", value: "basic" },
  ];

  const renderingModes = [
    { name: "Realistic", value: "realistic" },
    { name: "Wireframe", value: "wireframe" },
    { name: "Depth", value: "depth" },
    { name: "Normal", value: "normal" },
  ];

  const sceneTypes = [
    { name: "Studio", value: "studio", icon: "🎬" },
    { name: "Room", value: "room", icon: "🏠" },
    { name: "Outdoor", value: "outdoor", icon: "🌿" },
    { name: "Abstract", value: "abstract", icon: "🎨" },
  ];

  const floorTypes = [
    { name: "Wood", value: "wood", icon: "🪵" },
    { name: "Wood Panels", value: "wood-panels", icon: "🏠" },
    { name: "Wood Floor PBR", value: "wood-floor-pbr", icon: "🌳" },
    { name: "Concrete", value: "concrete", icon: "🧱" },
    { name: "Marble", value: "marble", icon: "💎" },
    { name: "Carpet", value: "carpet", icon: "🟫" },
  ];

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-3 rounded-full border border-white/20 transition-all"
          title="Open Debug Panel"
        >
          ⚙️
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="font-medium text-white">🛠️ Debug Panel</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-sm">
        {/* Motion Blur Section */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('motionBlur')}
            className="flex items-center justify-between w-full text-white/80 hover:text-white transition-colors"
          >
            <span className="font-medium">💨 Motion Blur</span>
            {expandedSections.motionBlur ? "▲" : "▼"}
          </button>
          
          {expandedSections.motionBlur && (
            <div className="space-y-3 pl-4 border-l-2 border-blue-500/30">
              <div>
                <label className="text-white/80 text-sm block mb-1">Intensity: {motionBlurIntensity.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={motionBlurIntensity}
                  onChange={(e) => onMotionBlurIntensityChange?.(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
              
              <div>
                <label className="text-white/80 text-sm block mb-1">Samples: {motionBlurSamples}</label>
                <input
                  type="range"
                  min="4"
                  max="32"
                  step="4"
                  value={motionBlurSamples}
                  onChange={(e) => onMotionBlurSamplesChange?.(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
              
              <div>
                <label className="text-white/80 text-sm block mb-1">Velocity Factor: {velocityFactor.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={velocityFactor}
                  onChange={(e) => onVelocityFactorChange?.(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Face Box Section */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('faceBox')}
            className="flex items-center justify-between w-full text-white/80 hover:text-white transition-colors"
          >
            <span className="font-medium">📦 Face Box Transform</span>
            {expandedSections.faceBox ? "▲" : "▼"}
          </button>
          
          {expandedSections.faceBox && (
            <div className="space-y-3 pl-4 border-l-2 border-green-500/30">
              {/* Position */}
              <div>
                <label className="text-white/80 text-sm block mb-1">Position</label>
                <div className="grid grid-cols-3 gap-2">
                  {['X', 'Y', 'Z'].map((axis, index) => (
                    <div key={axis}>
                      <label className="text-xs text-white/60">{axis}</label>
                      <input
                        type="number"
                        step="0.1"
                        value={faceBoxPosition[index]}
                        onChange={(e) => {
                          const newPos = [...faceBoxPosition] as [number, number, number];
                          newPos[index] = parseFloat(e.target.value) || 0;
                          onFaceBoxPositionChange?.(newPos);
                        }}
                        className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Rotation */}
              <div>
                <label className="text-white/80 text-sm block mb-1">Rotation (rad)</label>
                <div className="grid grid-cols-3 gap-2">
                  {['X', 'Y', 'Z'].map((axis, index) => (
                    <div key={axis}>
                      <label className="text-xs text-white/60">{axis}</label>
                      <input
                        type="number"
                        step="0.1"
                        value={faceBoxRotation[index]}
                        onChange={(e) => {
                          const newRot = [...faceBoxRotation] as [number, number, number];
                          newRot[index] = parseFloat(e.target.value) || 0;
                          onFaceBoxRotationChange?.(newRot);
                        }}
                        className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Scale */}
              <div>
                <label className="text-white/80 text-sm block mb-1">Scale</label>
                <div className="grid grid-cols-3 gap-2">
                  {['X', 'Y', 'Z'].map((axis, index) => (
                    <div key={axis}>
                      <label className="text-xs text-white/60">{axis}</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={faceBoxScale[index]}
                        onChange={(e) => {
                          const newScale = [...faceBoxScale] as [number, number, number];
                          newScale[index] = parseFloat(e.target.value) || 1;
                          onFaceBoxScaleChange?.(newScale);
                        }}
                        className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rendering Section */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('rendering')}
            className="flex items-center justify-between w-full text-white/80 hover:text-white transition-colors"
          >
            <span className="font-medium">🎨 Rendering</span>
            {expandedSections.rendering ? "▲" : "▼"}
          </button>
          
          {expandedSections.rendering && (
            <div className="space-y-3 pl-4 border-l-2 border-purple-500/30">
              {/* Material Type */}
              <div>
                <label className="text-white/80 text-sm block mb-2">Material Type</label>
                <div className="grid grid-cols-2 gap-1">
                  {materialTypes.map((material) => (
                    <button
                      key={material.value}
                      onClick={() => onMaterialTypeChange?.(material.value)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        materialType === material.value
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {material.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Rendering Mode */}
              <div>
                <label className="text-white/80 text-sm block mb-2">Rendering Mode</label>
                <div className="grid grid-cols-2 gap-1">
                  {renderingModes.map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => onRenderingModeChange?.(mode.value)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        renderingMode === mode.value
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {mode.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tone Mapping Exposure */}
              <div>
                <label className="text-white/80 text-sm block mb-1">Exposure: {toneMappingExposure.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={toneMappingExposure}
                  onChange={(e) => onToneMappingExposureChange?.(parseFloat(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
              
              {/* Post Processing Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-white/80 text-sm">✨ Post Processing</label>
                <button
                  onClick={() => onPostProcessingToggle?.(!postProcessingEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    postProcessingEnabled ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                    postProcessingEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              {/* Post Processing Controls (only when enabled) */}
              {postProcessingEnabled && (
                <>
                  {/* Bloom Strength */}
                  <div>
                    <label className="text-white/80 text-sm block mb-1">Bloom: {bloomStrength.toFixed(2)}</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={bloomStrength}
                      onChange={(e) => onBloomStrengthChange?.(parseFloat(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Scene Section */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('scene')}
            className="flex items-center justify-between w-full text-white/80 hover:text-white transition-colors"
          >
            <span className="font-medium">🏠 Scene</span>
            {expandedSections.scene ? "▲" : "▼"}
          </button>
          
          {expandedSections.scene && (
            <div className="space-y-3 pl-4 border-l-2 border-orange-500/30">
              {/* Scene Type */}
              <div>
                <label className="text-white/80 text-sm block mb-2">Scene Type</label>
                <div className="grid grid-cols-2 gap-1">
                  {sceneTypes.map((scene) => (
                    <button
                      key={scene.value}
                      onClick={() => onSceneTypeChange?.(scene.value)}
                      className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                        sceneType === scene.value
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <span>{scene.icon}</span>
                      <span>{scene.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Wall Color */}
              <div>
                <label className="text-white/80 text-sm block mb-1">Wall Color</label>
                <input
                  type="color"
                  value={wallColor}
                  onChange={(e) => onWallColorChange?.(e.target.value)}
                  className="w-full h-8 rounded border border-white/20"
                />
              </div>
              
              {/* Wall Texture (only for room scene) */}
              {sceneType === 'room' && onWallTextureChange && (
                <div>
                  <label className="text-white/80 text-sm block mb-2">🎨 Wall Texture</label>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { name: "Plaster", value: "white-plaster", icon: "🏠" },
                      { name: "Concrete", value: "concrete", icon: "🏗️" },
                      { name: "Brick PBR", value: "brick", icon: "🧱" },
                      { name: "Wood PBR", value: "wood-panels", icon: "🪵" }
                    ].map((texture) => (
                      <button
                        key={texture.value}
                        onClick={() => onWallTextureChange?.(texture.value)}
                        className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                          wallTexture === texture.value
                            ? 'bg-orange-500 text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        <span>{texture.icon}</span>
                        <span>{texture.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Floor Type */}
              <div>
                <label className="text-white/80 text-sm block mb-2">Floor Type</label>
                <div className="grid grid-cols-1 gap-1">
                  {floorTypes.map((floor) => (
                    <button
                      key={floor.value}
                      onClick={() => onFloorTypeChange?.(floor.value)}
                      className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-2 ${
                        floorType === floor.value
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <span>{floor.icon}</span>
                      <span>{floor.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DebugPanel;

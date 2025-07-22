'use client'

import React from 'react';

interface RenderingControlsProps {
  environmentMap: string;
  onEnvironmentMapChange: (map: string) => void;
  materialType: string;
  onMaterialTypeChange?: (type: string) => void;
  renderingMode: string;
  onRenderingModeChange?: (mode: string) => void;
  toneMappingExposure: number;
  onToneMappingExposureChange?: (exposure: number) => void;
}

export function RenderingControls({
  environmentMap,
  onEnvironmentMapChange,
  materialType,
  onMaterialTypeChange,
  renderingMode,
  onRenderingModeChange,
  toneMappingExposure,
  onToneMappingExposureChange,
}: RenderingControlsProps) {
  const environmentMaps = [
    { name: "City", value: "city" },
    { name: "Forest", value: "forest" },
    { name: "Sunset", value: "sunset" },
    { name: "Studio", value: "studio" },
    { name: "Warehouse", value: "warehouse" },
    { name: "Night", value: "night" },
    { name: "Dawn", value: "dawn" },
    { name: "Apartment", value: "apartment" },
    { name: "None", value: "none" },
  ];

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
    { name: "Normals", value: "normals" },
    { name: "Depth", value: "depth" },
    { name: "UV", value: "uv" },
  ];

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
      <h3 className="text-white font-medium mb-4">Rendering Controls</h3>
      
      <div className="space-y-4">
        {/* Environment Map */}
        <div>
          <label className="text-white/80 text-sm block mb-2">Environment Map</label>
          <select
            value={environmentMap}
            onChange={(e) => onEnvironmentMapChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40"
          >
            {environmentMaps.map((map) => (
              <option key={map.value} value={map.value} className="bg-gray-800">
                {map.name}
              </option>
            ))}
          </select>
        </div>

        {/* Material Type */}
        <div>
          <label className="text-white/80 text-sm block mb-2">Material Type</label>
          <select
            value={materialType}
            onChange={(e) => onMaterialTypeChange?.(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40"
          >
            {materialTypes.map((material) => (
              <option key={material.value} value={material.value} className="bg-gray-800">
                {material.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rendering Mode */}
        <div>
          <label className="text-white/80 text-sm block mb-2">Rendering Mode</label>
          <select
            value={renderingMode}
            onChange={(e) => onRenderingModeChange?.(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40"
          >
            {renderingModes.map((mode) => (
              <option key={mode.value} value={mode.value} className="bg-gray-800">
                {mode.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tone Mapping Exposure */}
        <div>
          <label className="text-white/80 text-sm block mb-2">
            Tone Mapping Exposure: {toneMappingExposure.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={toneMappingExposure}
            onChange={(e) => onToneMappingExposureChange?.(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Quick Presets */}
        <div>
          <label className="text-white/80 text-sm block mb-2">Quick Presets</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onEnvironmentMapChange("studio");
                onMaterialTypeChange?.("physical");
                onRenderingModeChange?.("realistic");
                onToneMappingExposureChange?.(1.0);
              }}
              className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-white/80 text-sm transition-colors"
            >
              Studio
            </button>
            <button
              onClick={() => {
                onEnvironmentMapChange("sunset");
                onMaterialTypeChange?.("physical");
                onRenderingModeChange?.("realistic");
                onToneMappingExposureChange?.(1.5);
              }}
              className="px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-white/80 text-sm transition-colors"
            >
              Dramatic
            </button>
            <button
              onClick={() => {
                onEnvironmentMapChange("none");
                onMaterialTypeChange?.("toon");
                onRenderingModeChange?.("realistic");
                onToneMappingExposureChange?.(0.8);
              }}
              className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-white/80 text-sm transition-colors"
            >
              Cartoon
            </button>
            <button
              onClick={() => {
                onEnvironmentMapChange("city");
                onMaterialTypeChange?.("standard");
                onRenderingModeChange?.("wireframe");
                onToneMappingExposureChange?.(1.2);
              }}
              className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-white/80 text-sm transition-colors"
            >
              Debug
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

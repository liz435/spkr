import React, { useState } from 'react';

interface AudioControlsProps {
  onVolumeChange?: (volume: number) => void;
  onBassChange?: (bass: number) => void;
  onTrebleChange?: (treble: number) => void;
  onPresetSelect?: (preset: string) => void;
  onSavePreset?: (name: string) => void;
  onExportSettings?: () => void;
  onImportSettings?: (file: File) => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  onVolumeChange,
  onBassChange,
  onTrebleChange,
  onPresetSelect,
  onSavePreset,
  onExportSettings,
  onImportSettings
}) => {
  const [volume, setVolume] = useState(50);
  const [bass, setBass] = useState(50);
  const [treble, setTreble] = useState(50);

  const presets = ["Default", "Rock", "Jazz", "Classical", "Electronic", "Bass Boost"];

  const handleSliderChange = (value: number, type: 'volume' | 'bass' | 'treble') => {
    switch (type) {
      case 'volume':
        setVolume(value);
        onVolumeChange?.(value);
        break;
      case 'bass':
        setBass(value);
        onBassChange?.(value);
        break;
      case 'treble':
        setTreble(value);
        onTrebleChange?.(value);
        break;
    }
  };

  return (
    <div className="space-y-4">
      {/* Audio Controls */}
      <div className="bg-gray-800 rounded-lg p-4 space-y-4">
        <h3 className="text-md font-semibold text-white mb-3">Audio Controls</h3>
        
        {/* Volume Control */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Volume: {volume}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleSliderChange(parseInt(e.target.value), 'volume')}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Bass Control */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Bass: {bass}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={bass}
            onChange={(e) => handleSliderChange(parseInt(e.target.value), 'bass')}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Treble Control */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Treble: {treble}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={treble}
            onChange={(e) => handleSliderChange(parseInt(e.target.value), 'treble')}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-md font-semibold text-white mb-3">Audio Presets</h3>
        <div className="space-y-2">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => onPresetSelect?.(preset)}
              className="w-full p-3 text-left bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 hover:text-white transition-all duration-200"
            >
              🎵 {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Manage Presets */}
      <div className="bg-gray-800 rounded-lg p-4 space-y-3">
        <h3 className="text-md font-semibold text-white">Manage Presets</h3>
        <div className="space-y-2">
          <button
            onClick={() => onSavePreset?.('Custom Preset')}
            className="w-full p-3 bg-green-600 hover:bg-green-500 rounded-lg text-white transition-all duration-200"
          >
            💾 Save Current Settings
          </button>
          <button
            onClick={onExportSettings}
            className="w-full p-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-all duration-200"
          >
            📤 Export Settings
          </button>
          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={(e) => e.target.files?.[0] && onImportSettings?.(e.target.files[0])}
              className="hidden"
            />
            <span className="block w-full p-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-center cursor-pointer transition-all duration-200">
              📥 Import Settings
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AudioControls;

import { useState } from 'react';

interface SideBarProps {
  onRotateSpeaker: () => void;
  onChangeSpeakerColor: (color: string) => void;
  onChangeFaceColor: (color: string, face: string) => void;
  onVolumeChange?: (volume: number) => void;
  onBassChange?: (bass: number) => void;
  onTrebleChange?: (treble: number) => void;
  onPresetSelect?: (preset: string) => void;
  onSavePreset?: (name: string) => void;
  onExportSettings?: () => void;
  onImportSettings?: (file: File) => void;
  selectedFace?: string | null;
  currentFaceColors?: { [key: string]: string };
}

const SideBar: React.FC<SideBarProps> = ({
  onRotateSpeaker,
  onChangeSpeakerColor,
  onChangeFaceColor,
  onVolumeChange,
  onBassChange,
  onTrebleChange,
  onPresetSelect,
  onSavePreset,
  onExportSettings,
  onImportSettings,
  selectedFace,
  currentFaceColors,
}) => {
  const [activeTab, setActiveTab] = useState('controls');
  const [volume, setVolume] = useState(50);
  const [bass, setBass] = useState(50);
  const [treble, setTreble] = useState(50);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const colors = [
    { name: "blue", class: "bg-blue-500", hover: "hover:bg-blue-400" },
    { name: "green", class: "bg-green-500", hover: "hover:bg-green-400" },
    { name: "orange", class: "bg-orange-500", hover: "hover:bg-orange-400" },
    { name: "red", class: "bg-red-500", hover: "hover:bg-red-400" },
    { name: "purple", class: "bg-purple-500", hover: "hover:bg-purple-400" },
    { name: "yellow", class: "bg-yellow-500", hover: "hover:bg-yellow-400" },
    { name: "pink", class: "bg-pink-500", hover: "hover:bg-pink-400" },
    { name: "teal", class: "bg-teal-500", hover: "hover:bg-teal-400" },
  ];

  const presets = ["Default", "Rock", "Jazz", "Classical", "Electronic", "Bass Boost"];

  const tabs = [
    { id: 'controls', name: 'Controls', icon: '🎛️' },
    { id: 'colors', name: 'Colors', icon: '🎨' },
    { id: 'audio', name: 'Audio', icon: '🔊' },
    { id: 'presets', name: 'Presets', icon: '💾' },
  ];

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
    <aside className={`${isCollapsed ? 'w-16' : 'w-full sm:w-80'} bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700 transition-all duration-300 ease-in-out`}>
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        {!isCollapsed && <h2 className="text-lg font-semibold text-white">Control Panel</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Tab Navigation */}
          <div className="p-4 border-b border-gray-700">
            <div className="grid grid-cols-2 gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span className="block mb-1">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 space-y-6 overflow-y-auto h-full">
            {/* Controls Tab */}
            {activeTab === 'controls' && (
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                  <h3 className="text-md font-semibold text-white mb-3">Speaker Controls</h3>
                  
                  <button
                    onClick={onRotateSpeaker}
                    className="w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    🔄 Rotate Speaker
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 hover:text-white transition-all duration-200">
                      ⏸️ Pause
                    </button>
                    <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 hover:text-white transition-all duration-200">
                      🔀 Shuffle
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-md font-semibold text-white mb-3">Speaker Color</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => onChangeSpeakerColor(color.name)}
                        className={`w-12 h-12 rounded-lg ${color.class} ${color.hover} transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg border-2 border-gray-600 hover:border-gray-400`}
                        title={`Change to ${color.name}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-md font-semibold text-white mb-3">Face Color</h3>
                  {selectedFace ? (
                    <div className="space-y-3">
                      <div className="bg-gray-700 rounded-lg p-3">
                        <p className="text-sm text-gray-300 mb-2">
                          Selected Face: <span className="text-blue-400 font-medium capitalize">{selectedFace}</span>
                        </p>
                        <div className="grid grid-cols-4 gap-3">
                          {colors.map((color) => (
                            <button
                              key={color.name}
                              onClick={() => onChangeFaceColor(color.name, selectedFace)}
                              className={`w-12 h-12 rounded-lg ${color.class} ${color.hover} transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg border-2 ${
                                currentFaceColors?.[selectedFace] === color.name ? 'border-white' : 'border-gray-600 hover:border-gray-400'
                              }`}
                              title={`Change ${selectedFace} face to ${color.name}`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => onChangeFaceColor('', selectedFace)} // Reset to default
                          className="w-full mt-3 p-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white text-sm transition-all duration-200"
                        >
                          Reset to Default
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm">
                        Click on a face in the 3D view to customize its color
                      </p>
                      <div className="mt-3 text-xs text-gray-500">
                        💡 Faces: front, back, left, right, top, bottom
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Audio Tab */}
            {activeTab === 'audio' && (
              <div className="space-y-4">
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
              </div>
            )}

            {/* Presets Tab */}
            {activeTab === 'presets' && (
              <div className="space-y-4">
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
            )}
          </div>
        </>
      )}

      {/* Collapsed State */}
      {isCollapsed && (
        <div className="p-2 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsCollapsed(false);
              }}
              className="w-full p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
              title={tab.name}
            >
              {tab.icon}
            </button>
          ))}
        </div>
      )}
    </aside>
  );
};

export default SideBar;
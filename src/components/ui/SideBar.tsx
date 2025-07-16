import { useState } from 'react';
import SpeakerControls from './SpeakerControls';
import FaceSelector from './FaceSelector';
import AudioControls from './AudioControls';

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
  onFaceSelect?: (faceId: string) => void;
  onFaceHover?: (faceId: string | null) => void;
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
  onFaceSelect,
  onFaceHover,
}) => {
  const [activeTab, setActiveTab] = useState('controls');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: 'controls', name: 'Controls', icon: '🎛️' },
    { id: 'faces', name: 'Faces', icon: '🎨' },
    { id: 'audio', name: 'Audio', icon: '🔊' },
  ];

  const handleFaceSelect = (faceId: string) => {
    onFaceSelect?.(faceId);
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
            <div className="grid grid-cols-3 gap-2">
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
              <SpeakerControls
                onRotateSpeaker={onRotateSpeaker}
                onChangeSpeakerColor={onChangeSpeakerColor}
              />
            )}

            {/* Faces Tab */}
            {activeTab === 'faces' && (
              <FaceSelector
                selectedFace={selectedFace || null}
                onFaceSelect={handleFaceSelect}
                onChangeFaceColor={onChangeFaceColor}
                currentFaceColors={currentFaceColors}
                onFaceHover={onFaceHover}
              />
            )}

            {/* Audio Tab */}
            {activeTab === 'audio' && (
              <AudioControls
                onVolumeChange={onVolumeChange}
                onBassChange={onBassChange}
                onTrebleChange={onTrebleChange}
                onPresetSelect={onPresetSelect}
                onSavePreset={onSavePreset}
                onExportSettings={onExportSettings}
                onImportSettings={onImportSettings}
              />
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

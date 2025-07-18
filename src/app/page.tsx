'use client'

import { useState } from "react";
import FloatingHeader from "@/components/ui/FloatingHeader";
import FloatingCards from "@/components/ui/FloatingCards";
import SPKR from "@/components/Speaker";

export default function Home() {
  const [speakerState, setSpeakerState] = useState({ 
    rotation: 0, 
    color: "orange",
    volume: 50,
    bass: 50,
    treble: 50,
    currentPreset: "Default",
    faceColors: {} as { [key: string]: string }
  });
  const [selectedFace, setSelectedFace] = useState<string | null>(null);
  const [hoveredFace, setHoveredFace] = useState<string | null>(null);

  const rotateSpeaker = () => {
    setSpeakerState((prev) => ({ ...prev, rotation: prev.rotation + Math.PI / 4 }));
  };

  const changeSpeakerColor = (color: string) => {
    setSpeakerState((prev) => ({ ...prev, color }));
  };

  const changeFaceColor = (color: string, face: string) => {
    setSpeakerState((prev) => {
      const newFaceColors = { ...prev.faceColors };
      if (color) {
        newFaceColors[face] = color;
      } else {
        delete newFaceColors[face];
      }
      return { ...prev, faceColors: newFaceColors };
    });
  };

  const handleFaceSelect = (faceId: string) => {
    if (faceId === '') {
      setSelectedFace(null);
      console.log('Face deselected');
    } else {
      setSelectedFace(faceId);
      console.log(`Face selected: ${faceId}`);
    }
  };

  const handleFaceHover = (faceId: string | null) => {
    setHoveredFace(faceId);
    if (faceId) {
      console.log(`Face hovered: ${faceId}`);
    }
  };

  // New handler functions for extended functionality
  const handleVolumeChange = (volume: number) => {
    setSpeakerState((prev) => ({ ...prev, volume }));
    console.log(`Volume changed to: ${volume}%`);
  };

  const handleBassChange = (bass: number) => {
    setSpeakerState((prev) => ({ ...prev, bass }));
    console.log(`Bass changed to: ${bass}%`);
  };

  const handleTrebleChange = (treble: number) => {
    setSpeakerState((prev) => ({ ...prev, treble }));
    console.log(`Treble changed to: ${treble}%`);
  };

  const handlePresetSelect = (preset: string) => {
    setSpeakerState((prev) => ({ ...prev, currentPreset: preset }));
    console.log(`Preset selected: ${preset}`);
    // Apply preset-specific audio settings
    switch (preset) {
      case "Rock":
        setSpeakerState((prev) => ({ ...prev, bass: 70, treble: 60 }));
        break;
      case "Jazz":
        setSpeakerState((prev) => ({ ...prev, bass: 40, treble: 55 }));
        break;
      case "Classical":
        setSpeakerState((prev) => ({ ...prev, bass: 30, treble: 70 }));
        break;
      case "Electronic":
        setSpeakerState((prev) => ({ ...prev, bass: 80, treble: 65 }));
        break;
      case "Bass Boost":
        setSpeakerState((prev) => ({ ...prev, bass: 90, treble: 45 }));
        break;
      default:
        setSpeakerState((prev) => ({ ...prev, bass: 50, treble: 50 }));
    }
  };

  const handleSavePreset = (name: string) => {
    const preset = {
      name,
      settings: {
        volume: speakerState.volume,
        bass: speakerState.bass,
        treble: speakerState.treble,
        color: speakerState.color
      }
    };
    console.log("Saving preset:", preset);
    // TODO: Implement preset saving to localStorage or backend
  };

  const handleExportSettings = () => {
    const settings = {
      speakerState,
      timestamp: new Date().toISOString(),
      version: "1.0"
    };
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spkr-settings-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);
        if (settings.speakerState) {
          setSpeakerState(settings.speakerState);
          console.log("Settings imported successfully");
        }
      } catch (error) {
        console.error("Error importing settings:", error);
      }
    };
    reader.readAsText(file);
  };

  // Header callback functions
  const handleSettingsToggle = () => {
    console.log("Settings panel toggled");
    // TODO: Implement settings modal
  };

  const handleThemeToggle = () => {
    console.log("Theme toggled");
    // TODO: Implement theme switching
  };

  const handleNotificationToggle = () => {
    console.log("Notifications toggled");
    // TODO: Implement notification panel
  };


  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Main Scene */}
        <main className="h-full bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0">
            <SPKR 
              speakerState={speakerState} 
              onFaceSelect={handleFaceSelect}
              hoveredFace={hoveredFace}
            />
          </div>

          {/* Floating Header */}
          <FloatingHeader 
            onSettingsToggle={handleSettingsToggle}
            onThemeToggle={handleThemeToggle}
            onNotificationToggle={handleNotificationToggle}
          />

          {/* Floating Cards */}
          <FloatingCards 
            onChangeSpeakerColor={changeSpeakerColor}
            onChangeFaceColor={changeFaceColor}
            selectedFace={selectedFace}
            currentFaceColors={speakerState.faceColors}
            onFaceSelect={handleFaceSelect}
            onFaceHover={handleFaceHover}
          />
          
          {/* Status Bar */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
            <div className="flex justify-between items-center text-sm">
              <div className="flex space-x-4">
                <span className="text-gray-300">Preset: <span className="text-blue-400 font-medium">{speakerState.currentPreset}</span></span>
                <span className="text-gray-300">Volume: <span className="text-green-400 font-medium">{speakerState.volume}%</span></span>
                <span className="text-gray-300">Bass: <span className="text-orange-400 font-medium">{speakerState.bass}%</span></span>
                <span className="text-gray-300">Treble: <span className="text-purple-400 font-medium">{speakerState.treble}%</span></span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse">

                </div>
                <span className="text-green-400 font-medium">Connected</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
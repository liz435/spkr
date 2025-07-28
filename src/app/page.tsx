'use client'

import { useState } from "react";
import FloatingHeader from "@/components/ui/FloatingHeader";
import FloatingCards from "@/components/ui/FloatingCards";
import SPKR from "@/components/Speaker";
import DebugPanel from "@/components/ui/DebugPanel";
import ShaderFilters from "@/components/ShaderFilters";

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
  const [faceBoxPosition, setFaceBoxPosition] = useState<[number, number, number]>([-3, -3, -7]);
  
  // Rendering controls state
  const [environmentMap, setEnvironmentMap] = useState("city");
  const [materialType, setMaterialType] = useState("physical");
  const [renderingMode, setRenderingMode] = useState("realistic");
  const [toneMappingExposure, setToneMappingExposure] = useState(1.0);
  
  // Scene controls state
  const [sceneType, setSceneType] = useState("room");
  const [previousSceneType, setPreviousSceneType] = useState<string>();
  const [wallColor, setWallColor] = useState("#f5f5f5");
  const [wallTexture, setWallTexture] = useState("brick"); // Default to brick PBR
  const [floorType, setFloorType] = useState("wood-floor-pbr"); // Default to wood floor PBR
  const [showObjects, setShowObjects] = useState({
    speaker: true,
    couch: true,
    woofer: true
  });
  
  // Motion blur state
  const [motionBlurEnabled, setMotionBlurEnabled] = useState(false);
  const [motionBlurStrength, setMotionBlurStrength] = useState(0.5);
  
  // Post processing state
  const [postProcessingEnabled, setPostProcessingEnabled] = useState(true);
  const [bloomStrength, setBloomStrength] = useState(0.4);
  const [ssaoIntensity, setSSAOIntensity] = useState(0.6);
  
  // Glitch effect state
  const [glitchEnabled, setGlitchEnabled] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0.5);
  const [glitchSpeed, setGlitchSpeed] = useState(10.0);
  
  // Shockwave effect state
  const [shockwaveEnabled, setShockwaveEnabled] = useState(false);
  const [shockwaveIntensity, setShockwaveIntensity] = useState(1.0);
  const [shockwaveSize, setShockwaveSize] = useState(0.1);
  const [shockwaveSpeed, setShockwaveSpeed] = useState(1.0);

  // Handle scene type changes with tracking
  const handleSceneTypeChange = (newSceneType: string) => {
    console.log(`🎬 SCENE CHANGE: ${sceneType} → ${newSceneType}`);
    setPreviousSceneType(sceneType);
    setSceneType(newSceneType);
  };

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

  // Scene control handlers
  const handleObjectToggle = (object: string, visible: boolean) => {
    setShowObjects(prev => ({
      ...prev,
      [object]: visible
    }));
    console.log(`${object} visibility: ${visible}`);
  };


  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Main Scene */}
        <main className="h-full relative overflow-hidden">
          <div className="absolute inset-0">
            <SPKR 
              speakerState={speakerState} 
              onFaceSelect={handleFaceSelect}
              hoveredFace={hoveredFace}
              faceBoxPosition={faceBoxPosition}
              environmentMap={environmentMap}
              materialType={materialType}
              renderingMode={renderingMode}
              toneMappingExposure={toneMappingExposure}
              sceneType={sceneType}
              wallColor={wallColor}
              wallTexture={wallTexture} // 传递纹理参数
              floorType={floorType}
              showObjects={showObjects}
              motionBlur={{
                enabled: motionBlurEnabled,
                strength: motionBlurStrength
              }}
              postProcessing={{
                enabled: postProcessingEnabled,
                bloomStrength: bloomStrength,
                ssaoIntensity: ssaoIntensity
              }}
              glitch={{
                enabled: glitchEnabled,
                intensity: glitchIntensity,
                speed: glitchSpeed
              }}
              shockwave={{
                enabled: shockwaveEnabled,
                intensity: shockwaveIntensity,
                size: shockwaveSize,
                speed: shockwaveSpeed
              }}
              previousSceneType={previousSceneType}
            />
          </div>

          {/* Floating Header */}
          <FloatingHeader 
            onSettingsToggle={handleSettingsToggle}
            onThemeToggle={handleThemeToggle}
            onNotificationToggle={handleNotificationToggle}
          />

          {/* Floating Cards - 已替换为 DebugPanel */}
          
          <FloatingCards 
            onChangeSpeakerColor={changeSpeakerColor}
            onChangeFaceColor={changeFaceColor}
            selectedFace={selectedFace}
            currentFaceColors={speakerState.faceColors}
            onFaceSelect={handleFaceSelect}
            onFaceHover={handleFaceHover}
          />
         
          
          {/* Status Bar */}
          <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 bg-black/20 backdrop-blur-sm rounded-lg p-2 md:p-4 shadow-lg z-30">
            <div className="flex justify-between items-center text-xs md:text-sm">
              <div className="flex space-x-2 md:space-x-4 overflow-x-auto">
                <span className="text-gray-300 whitespace-nowrap">Preset: <span className="text-blue-400 font-medium">{speakerState.currentPreset}</span></span>
                <span className="text-gray-300 whitespace-nowrap">Volume: <span className="text-green-400 font-medium">{speakerState.volume}%</span></span>
                <span className="text-gray-300 whitespace-nowrap hidden sm:inline">Bass: <span className="text-orange-400 font-medium">{speakerState.bass}%</span></span>
                <span className="text-gray-300 whitespace-nowrap hidden sm:inline">Treble: <span className="text-purple-400 font-medium">{speakerState.treble}%</span></span>
              </div>

              <div className="flex items-center space-x-1 md:space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse">

                </div>
                <span className="text-green-400 font-medium text-xs md:text-sm">Connected</span>
              </div>
            </div>
          </div>

          {/* Debug Panel - 统一的调试控制面板 */}
          <DebugPanel
            // Motion Blur
            motionBlurIntensity={motionBlurStrength}
            onMotionBlurIntensityChange={setMotionBlurStrength}
            
            // Face Box Position
            faceBoxPosition={faceBoxPosition}
            onFaceBoxPositionChange={setFaceBoxPosition}
            
            // Rendering
            materialType={materialType}
            onMaterialTypeChange={setMaterialType}
            renderingMode={renderingMode}
            onRenderingModeChange={setRenderingMode}
            toneMappingExposure={toneMappingExposure}
            onToneMappingExposureChange={setToneMappingExposure}
            
            // Post Processing
            postProcessingEnabled={postProcessingEnabled}
            onPostProcessingToggle={setPostProcessingEnabled}
            bloomStrength={bloomStrength}
            onBloomStrengthChange={setBloomStrength}
            ssaoIntensity={ssaoIntensity}
            onSSAOIntensityChange={setSSAOIntensity}
            
            // Glitch Filter
            glitchEnabled={glitchEnabled}
            onGlitchToggle={setGlitchEnabled}
            glitchIntensity={glitchIntensity}
            onGlitchIntensityChange={setGlitchIntensity}
            glitchSpeed={glitchSpeed}
            onGlitchSpeedChange={setGlitchSpeed}
            
            // Shockwave Filter
            shockwaveEnabled={shockwaveEnabled}
            onShockwaveToggle={setShockwaveEnabled}
            shockwaveIntensity={shockwaveIntensity}
            onShockwaveIntensityChange={setShockwaveIntensity}
            shockwaveSize={shockwaveSize}
            onShockwaveSizeChange={setShockwaveSize}
            shockwaveSpeed={shockwaveSpeed}
            onShockwaveSpeedChange={setShockwaveSpeed}
            
            // Scene
            sceneType={sceneType}
            onSceneTypeChange={handleSceneTypeChange}
            wallColor={wallColor}
            onWallColorChange={setWallColor}
            wallTexture={wallTexture}
            onWallTextureChange={setWallTexture}
            floorType={floorType}
            onFloorTypeChange={setFloorType}
          />
        </main>
      </div>
    </div>
  );
}
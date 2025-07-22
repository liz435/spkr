import { useState } from 'react';
import FaceSelector from './FaceSelector';
import { PositionControls } from './PositionControls';
import { RenderingControls } from './RenderingControls';
import { SceneControls } from './SceneControls';

interface FloatingCardsProps {
  onChangeSpeakerColor: (color: string) => void;
  onChangeFaceColor: (color: string, face: string) => void;
  selectedFace?: string | null;
  currentFaceColors?: { [key: string]: string };
  onFaceSelect?: (faceId: string) => void;
  onFaceHover?: (faceId: string | null) => void;
  faceBoxPosition?: [number, number, number];
  onFaceBoxPositionChange?: (position: [number, number, number]) => void;
  // Rendering controls
  environmentMap?: string;
  onEnvironmentMapChange?: (map: string) => void;
  materialType?: string;
  onMaterialTypeChange?: (type: string) => void;
  renderingMode?: string;
  onRenderingModeChange?: (mode: string) => void;
  toneMappingExposure?: number;
  onToneMappingExposureChange?: (exposure: number) => void;
  // Scene controls
  sceneType?: string;
  onSceneTypeChange?: (type: string) => void;
  wallColor?: string;
  onWallColorChange?: (color: string) => void;
  floorType?: string;
  onFloorTypeChange?: (type: string) => void;
  showObjects?: {
    speaker: boolean;
    couch: boolean;
    woofer: boolean;
  };
  onObjectToggle?: (object: string, visible: boolean) => void;
}

const FloatingCards: React.FC<FloatingCardsProps> = ({
  onChangeSpeakerColor,
  onChangeFaceColor,
  selectedFace,
  currentFaceColors,
  onFaceSelect,
  onFaceHover,
  faceBoxPosition = [0, 0, 0],
  onFaceBoxPositionChange,
  environmentMap = "city",
  onEnvironmentMapChange,
  materialType = "physical",
  onMaterialTypeChange,
  renderingMode = "realistic",
  onRenderingModeChange,
  toneMappingExposure = 1.0,
  onToneMappingExposureChange,
  sceneType = "room",
  onSceneTypeChange,
  wallColor = "#f5f5f5",
  onWallColorChange,
  floorType = "wood",
  onFloorTypeChange,
  showObjects = { speaker: true, couch: true, woofer: true },
  onObjectToggle,
}) => {
  const [embedType, setEmbedType] = useState<'track' | 'playlist' | 'album'>('playlist');
  
  // Spotify content IDs
  const spotifyContent = {
    track: "4iV5W9uYEdYUVa79Axb7Rh", // Never Gonna Give You Up
    playlist: "37i9dQZF1DX0XUsuxWHRQd", // RapCaviar
    album: "4aawyAB9vmqN3uQ7FjRGTy" // Global Warming - Pitbull
  };

  const handleFaceSelect = (faceId: string) => {
    onFaceSelect?.(faceId);
  };

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

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      {/* Spotify Player Card - Top Right on desktop, Top on mobile */}
      <div className="absolute top-6 md:top-26 right-2 md:right-6 w-[calc(100vw-1rem)] md:w-[28rem] max-w-md md:max-w-none bg-black/20 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/10 shadow-2xl pointer-events-auto">
        <div className="text-white text-sm font-medium mb-3 flex items-center gap-2">
          <span className="animate-pulse text-green-400">●</span>
          Now Playing
        </div>
        
        {/* Spotify Type Selector */}
        <div className="flex gap-2 mb-4">
          {(['playlist', 'track', 'album'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setEmbedType(type)}
              className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium transition-all ${
                embedType === type 
                  ? 'bg-green-500 text-black' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Spotify Embed */}
        <div className="rounded-xl overflow-hidden">
          <iframe
            src={`https://open.spotify.com/embed/${embedType}/${spotifyContent[embedType]}?utm_source=generator&theme=0`}
            width="100%"
            height="160"
            frameBorder="0"
            allowFullScreen={false}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl md:h-[160px]"
          />
        </div>
      </div>

      {/* Face Selector Card - Left on desktop, Bottom Left on mobile */}
      <div className="absolute left-2 md:left-4 bottom-32 md:bottom-auto md:top-32 bg-black/20 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/20 shadow-xl pointer-events-auto">
        <FaceSelector
          selectedFace={selectedFace || null}
          onFaceSelect={handleFaceSelect}
          onChangeFaceColor={onChangeFaceColor}
          currentFaceColors={currentFaceColors}
          onFaceHover={onFaceHover}
        />
      </div>

      {/* FaceBox Position Controls Card - Left side */}
      {onFaceBoxPositionChange && (
        <div className="absolute top-1/2 left-2 md:left-6 transform -translate-y-1/2 w-64 pointer-events-auto">
          <PositionControls
            position={faceBoxPosition}
            onPositionChange={onFaceBoxPositionChange}
            label="FaceBox"
          />
        </div>
      )}

      {/* Rendering Controls Card - Left side, below position controls */}
      {onEnvironmentMapChange && (
        <div className="absolute top-1/2 left-2 md:left-6 transform translate-y-20 w-64 pointer-events-auto">
          <RenderingControls
            environmentMap={environmentMap}
            onEnvironmentMapChange={onEnvironmentMapChange}
            materialType={materialType}
            onMaterialTypeChange={onMaterialTypeChange}
            renderingMode={renderingMode}
            onRenderingModeChange={onRenderingModeChange}
            toneMappingExposure={toneMappingExposure}
            onToneMappingExposureChange={onToneMappingExposureChange}
          />
        </div>
      )}

      {/* Scene Controls Card - Right side */}
      {onSceneTypeChange && (
        <div className="absolute top-1/2 right-2 md:right-6 transform -translate-y-1/2 w-64 pointer-events-auto">
          <SceneControls
            sceneType={sceneType}
            onSceneTypeChange={onSceneTypeChange}
            wallColor={wallColor}
            onWallColorChange={onWallColorChange}
            floorType={floorType}
            onFloorTypeChange={onFloorTypeChange}
            showObjects={showObjects}
            onObjectToggle={onObjectToggle}
          />
        </div>
      )}

      {/* Speaker Controls Card - Bottom Right on all screens */}
      <div className="absolute bottom-16 md:bottom-20 right-2 md:right-6 w-52 md:w-64 bg-black/20 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/10 shadow-2xl pointer-events-auto">
        <div className="text-white text-sm font-medium mb-3 md:mb-4">Speaker Colors</div>
        
        {/* Color Selector */}
        <div>
          <div className="text-xs text-white/70 mb-2 md:mb-3">Choose a color</div>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-1.5 md:gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => onChangeSpeakerColor(color.name)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${color.class} ${color.hover} transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg border-2 border-white/20 hover:border-white/40`}
                title={`Change speaker to ${color.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingCards;

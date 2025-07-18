import { useState } from 'react';
import FaceSelector from './FaceSelector';

interface FloatingCardsProps {
  onChangeSpeakerColor: (color: string) => void;
  onChangeFaceColor: (color: string, face: string) => void;
  selectedFace?: string | null;
  currentFaceColors?: { [key: string]: string };
  onFaceSelect?: (faceId: string) => void;
  onFaceHover?: (faceId: string | null) => void;
}

const FloatingCards: React.FC<FloatingCardsProps> = ({
  onChangeSpeakerColor,
  onChangeFaceColor,
  selectedFace,
  currentFaceColors,
  onFaceSelect,
  onFaceHover,
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
    <div className="absolute inset-0 pointer-events-none">
      {/* Spotify Player Card - Top Left */}
      <div className="absolute top-26 right-6 w-[28rem] bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-2xl pointer-events-auto ">
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
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
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
            height="200"
            frameBorder="0"
            allowFullScreen={false}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
          />
        </div>
      </div>

      {/* Face Selector Card - Top Left (Transparent) */}
      <div className="absolute left-4 top-32 bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-xl pointer-events-auto">
        <FaceSelector
          selectedFace={selectedFace || null}
          onFaceSelect={handleFaceSelect}
          onChangeFaceColor={onChangeFaceColor}
          currentFaceColors={currentFaceColors}
          onFaceHover={onFaceHover}
        />
      </div>

      {/* Speaker Controls Card - Bottom Right */}
      <div className="absolute bottom-20 right-6 w-64 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-2xl pointer-events-auto">
        <div className="text-white text-sm font-medium mb-4">Speaker Colors</div>
        
        {/* Color Selector */}
        <div>
          <div className="text-xs text-white/70 mb-3">Choose a color for your speaker</div>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => onChangeSpeakerColor(color.name)}
                className={`w-12 h-12 rounded-lg ${color.class} ${color.hover} transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg border-2 border-white/20 hover:border-white/40`}
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

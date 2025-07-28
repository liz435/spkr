import React, { useState } from 'react';
import {SquareArrowUp, SquareArrowDown, SquareArrowLeft, SquareArrowRight, Square, SquaresSubtract } from 'lucide-react';

interface FaceSelectorProps {
  selectedFace: string | null;
  onFaceSelect: (faceId: string) => void;
  onChangeFaceColor: (color: string, face: string) => void;
  currentFaceColors?: { [key: string]: string };
  onFaceHover?: (faceId: string | null) => void;
}

const FaceSelector: React.FC<FaceSelectorProps> = ({
  selectedFace,
  onFaceSelect,
  onChangeFaceColor,
  currentFaceColors,
  onFaceHover
}) => {
  const [embedType, setEmbedType] = useState<'track' | 'playlist' | 'album'>('playlist');
  
  // Spotify content IDs
  const spotifyContent = {
    track: "4iV5W9uYEdYUVa79Axb7Rh", // Never Gonna Give You Up
    playlist: "37i9dQZF1DX0XUsuxWHRQd", // RapCaviar
    album: "4aawyAB9vmqN3uQ7FjRGTy" // Global Warming - Pitbull
  };

  const faces = [
    { id: 'top', icon: <SquareArrowUp />, position: 'top' },
    { id: 'left', icon: <SquareArrowLeft/>, position: 'left' },
    { id: 'front', icon: <Square />, position: 'front' },
    { id: 'right', icon: <SquareArrowRight />, position: 'right' },
    { id: 'bottom', icon: <SquareArrowDown />, position: 'bottom' },
    { id: 'back', icon: <SquaresSubtract />, position: 'back' }
  ];

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

  const handleFaceClick = (faceId: string) => {
    if (selectedFace === faceId) {
      onFaceSelect(''); // Deselect if same face is clicked
    } else {
      onFaceSelect(faceId);
    }
  };

  const renderFaceButton = (face: typeof faces[0]) => (
    <button
      key={face.id}
      onClick={() => handleFaceClick(face.id)}
      onMouseEnter={() => onFaceHover?.(face.id)}
      onMouseLeave={() => onFaceHover?.(null)}
      className={`p-3 rounded-none text-sm font-medium transition-all duration-200 w-16 h-16 flex flex-col items-center justify-center ${
        selectedFace === face.id
          ? 'bg-blue-600/40 border-2 border-blue-400 text-white shadow-lg backdrop-blur'
          : 'bg-white/20 shadow-lg border-2 border-transparent text-gray-300 hover:bg-gray-600/40 hover:border-gray-400'
      }`}
    >
      <span className="text-lg mb-1">{face.icon}</span>

      {currentFaceColors?.[face.id] && (
        <div className="mt-1 w-8 h-1 rounded-full">
          <div 
            className={`h-full rounded-full ${colors.find(c => c.name === currentFaceColors[face.id])?.class || 'bg-gray-400'}`}
            style={{ width: '100%' }}
          />
        </div>
      )}
    </button>
  );

  return (
    <div className="space-y-4 w-[25rem]"
    >

      {/* Box Unfolding Face Selection */}
      <div className="rounded-xl p-6">

        {/* Box Unfolding Layout */}
        <div className="flex flex-col items-center space-y-2">
          {/* Row 1: Top */}
          <div className="flex justify-center">
            {renderFaceButton(faces[0])} {/* top */}
          </div>
          
          {/* Row 2: Left, Front, Right */}
          <div className="flex space-x-2">
            {renderFaceButton(faces[1])} {/* left */}
            {renderFaceButton(faces[2])} {/* front */}
            {renderFaceButton(faces[3])} {/* right */}
          </div>
          
          {/* Row 3: Bottom */}
          <div className="flex justify-center">
            {renderFaceButton(faces[4])} {/* bottom */}
          </div>
          
          {/* Row 4: Back */}
          <div className="flex justify-center">
            {renderFaceButton(faces[5])} {/* back */}
          </div>
        </div>
      </div>

      {/* Face Color Customization */}
      <div className="rounded-lg p-4">
        <h3 className="text-md font-semibold text-white mb-3">Face Color</h3>
        {selectedFace ? (
          <div className="space-y-3">
            <div className="rounded-lg p-3">
              <p className="text-sm text-gray-300 mb-2">
                Selected Face: <span className="text-blue-400 font-medium capitalize">{selectedFace}</span>
              </p>
              <div className="grid grid-cols-4 gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => onChangeFaceColor(color.name, selectedFace)}
                    className={`w-12 h-12 rounded-lg ${color.class} ${color.hover} transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-sm border-2 ${
                      currentFaceColors?.[selectedFace] === color.name ? 'border-white' : 'border-transparent hover:border-white/50'
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
          <div className="bg-black/20 shadow-lg rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">
              Select a face above or click on a face in the 3D view
            </p>
            <div className="mt-3 text-xs text-gray-500">
              💡 You can customize each face individually
            </div>
          </div>
        )}
      </div>

      {/* Spotify Integration */}
      <div className="rounded-lg p-4">

        {/* Spotify Type Selection */}
        <div className="mb-4 flex gap-2 justify-center">
          <button
            onClick={() => setEmbedType('playlist')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              embedType === 'playlist' 
                ? 'bg-green-600 text-white shadow-lg' 
                : 'bg-white/20 text-gray-300 hover:bg-white/30'
            }`}
          >
            Playlist
          </button>
          <button
            onClick={() => setEmbedType('track')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              embedType === 'track' 
                ? 'bg-green-600 text-white shadow-lg' 
                : 'bg-white/20 text-gray-300 hover:bg-white/30'
            }`}
          >
            Track
          </button>
          <button
            onClick={() => setEmbedType('album')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              embedType === 'album' 
                ? 'bg-green-600 text-white shadow-lg' 
                : 'bg-white/20 text-gray-300 hover:bg-white/30'
            }`}
          >
            Album
          </button>
        </div>

        {/* Spotify Embed Container */}
        <div
          className="w-full rounded-2xl p-3 relative"
          style={{
            background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
            boxShadow: `
              inset 0 2px 4px rgba(0, 0, 0, 0.3),
              inset 0 -1px 2px rgba(255, 255, 255, 0.1),
              0 4px 12px rgba(0, 0, 0, 0.4)
            `,
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Header */}
          <div className="text-white text-xs font-mono mb-2 tracking-wider opacity-80 text-center">
            SPOTIFY {">"} {embedType.toUpperCase()}
          </div>

          {/* Spotify Embed */}
          <div className="rounded-xl overflow-hidden">
            <iframe
              src={`https://open.spotify.com/embed/${embedType}/${spotifyContent[embedType]}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              frameBorder="0"
              allowFullScreen={false}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceSelector;

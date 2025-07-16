import React from 'react';

interface SpeakerControlsProps {
  onRotateSpeaker: () => void;
  onChangeSpeakerColor: (color: string) => void;
}

const SpeakerControls: React.FC<SpeakerControlsProps> = ({
  onRotateSpeaker,
  onChangeSpeakerColor
}) => {
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
    <div className="space-y-4">
      {/* Speaker Controls */}
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

      {/* Speaker Color */}
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
    </div>
  );
};

export default SpeakerControls;

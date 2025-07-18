import React from 'react';

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
  const faces = [
    { id: 'front', name: 'Front', icon: '🔲', position: 'front' },
    { id: 'back', name: 'Back', icon: '🔳', position: 'back' },
    { id: 'left', name: 'Left', icon: '⬅️', position: 'left' },
    { id: 'right', name: 'Right', icon: '➡️', position: 'right' },
    { id: 'top', name: 'Top', icon: '⬆️', position: 'top' },
    { id: 'bottom', name: 'Bottom', icon: '⬇️', position: 'bottom' }
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

  return (
    <div className="space-y-4 w-[16rem]">
      {/* Face Selection Buttons */}
      <div className=" rounded-lg p-4">
        <h3 className="text-md font-semibold text-white mb-3">Select Face</h3>
        <div className="grid grid-cols-2 gap-2">
          {faces.map((face) => (
            <button
              key={face.id}
              onClick={() => handleFaceClick(face.id)}
              onMouseEnter={() => onFaceHover?.(face.id)}
              onMouseLeave={() => onFaceHover?.(null)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                selectedFace === face.id
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500'
              }`}
            >
              <span className="block mb-1">{face.icon}</span>
              {face.name}
              {currentFaceColors?.[face.id] && (
                <div className="mt-1 w-full h-2 rounded-full bg-gray-600">
                  <div 
                    className={`h-full rounded-full ${colors.find(c => c.name === currentFaceColors[face.id])?.class || 'bg-gray-400'}`}
                    style={{ width: '100%' }}
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Face Color Customization */}
      <div className=" rounded-lg p-4">
        <h3 className="text-md font-semibold text-white mb-3">Face Color</h3>
        {selectedFace ? (
          <div className="space-y-3">
            <div className=" rounded-lg p-3">
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
              Select a face above or click on a face in the 3D view
            </p>
            <div className="mt-3 text-xs text-gray-500">
              💡 You can customize each face individually
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceSelector;

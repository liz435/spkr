import React from 'react';

interface ModelControlsProps {
  modelConfigs: {
    concrete: {
      scale: [number, number, number];
      position: [number, number, number];
      rotation: [number, number, number];
    };
    woofer: {
      scale: [number, number, number];
      position: [number, number, number];
      rotation: [number, number, number];
    };
  };
  onUpdateModelConfig: (
    modelName: 'concrete' | 'woofer',
    property: 'scale' | 'position' | 'rotation',
    value: [number, number, number]
  ) => void;
}

const ModelControls: React.FC<ModelControlsProps> = ({
  modelConfigs,
  onUpdateModelConfig,
}) => {
  const handleSliderChange = (
    modelName: 'concrete' | 'woofer',
    property: 'scale' | 'position' | 'rotation',
    axis: 0 | 1 | 2,
    value: number
  ) => {
    const currentValue = modelConfigs[modelName][property];
    const newValue = [...currentValue] as [number, number, number];
    newValue[axis] = value;
    onUpdateModelConfig(modelName, property, newValue);
  };

  const resetModel = (modelName: 'concrete' | 'woofer') => {
    if (modelName === 'woofer') {
      onUpdateModelConfig(modelName, 'position', [0, -0.5, 0]);
    } else {
      onUpdateModelConfig(modelName, 'position', [0, -1.4, 0]);
    }
    onUpdateModelConfig(modelName, 'rotation', [0, 0, 0]);
    onUpdateModelConfig(modelName, 'scale', [2, 2, 2]);
  };

  return (
    <div className="space-y-6">
      {/* Concrete Model Controls */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-semibold text-white">Concrete Model</h3>
          <button
            onClick={() => resetModel('concrete')}
            className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-white transition-colors"
          >
            Reset
          </button>
        </div>
        
        {/* Position Controls */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Position</label>
          <div className="grid grid-cols-3 gap-2">
            {['X', 'Y', 'Z'].map((axis, index) => (
              <div key={axis} className="space-y-1">
                <label className="text-xs text-gray-400">{axis}</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={modelConfigs.concrete.position[index]}
                  onChange={(e) => handleSliderChange('concrete', 'position', index as 0 | 1 | 2, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-400 text-center">
                  {modelConfigs.concrete.position[index].toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rotation Controls */}
        <div className="space-y-2 mt-4">
          <label className="text-sm text-gray-300">Rotation</label>
          <div className="grid grid-cols-3 gap-2">
            {['X', 'Y', 'Z'].map((axis, index) => (
              <div key={axis} className="space-y-1">
                <label className="text-xs text-gray-400">{axis}</label>
                <input
                  type="range"
                  min="-3.14"
                  max="3.14"
                  step="0.1"
                  value={modelConfigs.concrete.rotation[index]}
                  onChange={(e) => handleSliderChange('concrete', 'rotation', index as 0 | 1 | 2, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-400 text-center">
                  {modelConfigs.concrete.rotation[index].toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Woofer Model Controls */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-semibold text-white">Woofer Model</h3>
          <button
            onClick={() => resetModel('woofer')}
            className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-white transition-colors"
          >
            Reset
          </button>
        </div>
        
        {/* Position Controls */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Position</label>
          <div className="grid grid-cols-3 gap-2">
            {['X', 'Y', 'Z'].map((axis, index) => (
              <div key={axis} className="space-y-1">
                <label className="text-xs text-gray-400">{axis}</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={modelConfigs.woofer.position[index]}
                  onChange={(e) => handleSliderChange('woofer', 'position', index as 0 | 1 | 2, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-400 text-center">
                  {modelConfigs.woofer.position[index].toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rotation Controls */}
        <div className="space-y-2 mt-4">
          <label className="text-sm text-gray-300">Rotation</label>
          <div className="grid grid-cols-3 gap-2">
            {['X', 'Y', 'Z'].map((axis, index) => (
              <div key={axis} className="space-y-1">
                <label className="text-xs text-gray-400">{axis}</label>
                <input
                  type="range"
                  min="-3.14"
                  max="3.14"
                  step="0.1"
                  value={modelConfigs.woofer.rotation[index]}
                  onChange={(e) => handleSliderChange('woofer', 'rotation', index as 0 | 1 | 2, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-400 text-center">
                  {modelConfigs.woofer.rotation[index].toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-md font-semibold text-white mb-3">Quick Presets</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              onUpdateModelConfig('woofer', 'position', [0, -0.2, 0]);
            }}
            className="p-2 bg-blue-600 hover:bg-blue-500 rounded text-white text-sm transition-colors"
          >
            Woofer High
          </button>
          <button
            onClick={() => {
              onUpdateModelConfig('woofer', 'position', [0, -0.8, 0]);
            }}
            className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white text-sm transition-colors"
          >
            Woofer Mid
          </button>
          <button
            onClick={() => {
              onUpdateModelConfig('woofer', 'position', [0, -1.4, 0]);
            }}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white text-sm transition-colors"
          >
            Woofer Low
          </button>
          <button
            onClick={() => {
              onUpdateModelConfig('woofer', 'rotation', [0, Math.PI, 0]);
            }}
            className="p-2 bg-purple-600 hover:bg-purple-500 rounded text-white text-sm transition-colors"
          >
            Flip Woofer
          </button>
          <button
            onClick={() => {
              onUpdateModelConfig('concrete', 'position', [0, -2, 0]);
            }}
            className="p-2 bg-green-600 hover:bg-green-500 rounded text-white text-sm transition-colors"
          >
            Lower Concrete
          </button>
          <button
            onClick={() => {
              onUpdateModelConfig('woofer', 'position', [1, -0.5, 0]);
              onUpdateModelConfig('concrete', 'position', [-1, -1.4, 0]);
            }}
            className="p-2 bg-orange-600 hover:bg-orange-500 rounded text-white text-sm transition-colors"
          >
            Separate Models
          </button>
          <button
            onClick={() => {
              resetModel('concrete');
              resetModel('woofer');
            }}
            className="p-2 bg-gray-600 hover:bg-gray-500 rounded text-white text-sm transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelControls;

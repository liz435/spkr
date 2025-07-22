'use client'

import React from 'react';

interface PositionControlsProps {
  position: [number, number, number];
  onPositionChange: (position: [number, number, number]) => void;
  label: string;
}

export function PositionControls({ position, onPositionChange, label }: PositionControlsProps) {
  const handleChange = (axis: number, value: number) => {
    const newPosition = [...position] as [number, number, number];
    newPosition[axis] = value;
    onPositionChange(newPosition);
  };

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
      <h3 className="text-white font-medium mb-3">{label} Position</h3>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <label className="text-white/80 text-sm w-4">X:</label>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={position[0]}
            onChange={(e) => handleChange(0, parseFloat(e.target.value))}
            className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-white/60 text-xs w-12 text-right">
            {position[0].toFixed(1)}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-white/80 text-sm w-4">Y:</label>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={position[1]}
            onChange={(e) => handleChange(1, parseFloat(e.target.value))}
            className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-white/60 text-xs w-12 text-right">
            {position[1].toFixed(1)}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-white/80 text-sm w-4">Z:</label>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={position[2]}
            onChange={(e) => handleChange(2, parseFloat(e.target.value))}
            className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-white/60 text-xs w-12 text-right">
            {position[2].toFixed(1)}
          </span>
        </div>
        
        <button
          onClick={() => onPositionChange([0, 0, 0])}
          className="w-full mt-3 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-sm transition-colors"
        >
          Reset to Center
        </button>
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}

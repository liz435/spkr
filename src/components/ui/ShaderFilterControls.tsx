'use client'

import React, { useState } from 'react';

interface ShaderFilterControlsProps {
  onEdgeDetectionChange: (enabled: boolean) => void;
  onEdgeThresholdChange: (threshold: number) => void;
  onEdgeIntensityChange: (intensity: number) => void;
  onPixelationChange: (enabled: boolean) => void;
  onPixelSizeChange: (size: number) => void;
  onMotionBlurChange: (enabled: boolean) => void;
  onMotionBlurStrengthChange: (strength: number) => void;
  onMotionBlurSamplesChange: (samples: number) => void;
}

export function ShaderFilterControls({
  onEdgeDetectionChange,
  onEdgeThresholdChange,
  onEdgeIntensityChange,
  onPixelationChange,
  onPixelSizeChange,
  onMotionBlurChange,
  onMotionBlurStrengthChange,
  onMotionBlurSamplesChange
}: ShaderFilterControlsProps) {
  const [edgeDetectionEnabled, setEdgeDetectionEnabled] = useState(false);
  const [edgeThreshold, setEdgeThreshold] = useState(0.1);
  const [edgeIntensity, setEdgeIntensity] = useState(1.0);
  const [pixelationEnabled, setPixelationEnabled] = useState(false);
  const [pixelSize, setPixelSize] = useState(8);
  const [motionBlurEnabled, setMotionBlurEnabled] = useState(false);
  const [motionBlurStrength, setMotionBlurStrength] = useState(0.5);
  const [motionBlurSamples, setMotionBlurSamples] = useState(8);

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      minWidth: '300px',
      zIndex: 1000
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#00ff88' }}>🎨 Shader Filters</h3>
      
      {/* Edge Detection Controls */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#88ff88' }}>🖼️ Edge Detection</h4>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="checkbox"
            checked={edgeDetectionEnabled}
            onChange={(e) => {
              setEdgeDetectionEnabled(e.target.checked);
              onEdgeDetectionChange(e.target.checked);
            }}
            style={{ marginRight: '10px' }}
          />
          Enable Edge Detection
        </label>
        
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Threshold: {edgeThreshold.toFixed(2)}
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={edgeThreshold}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setEdgeThreshold(value);
              onEdgeThresholdChange(value);
            }}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            disabled={!edgeDetectionEnabled}
          />
        </label>
        
        <label style={{ display: 'block' }}>
          Intensity: {edgeIntensity.toFixed(2)}
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={edgeIntensity}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setEdgeIntensity(value);
              onEdgeIntensityChange(value);
            }}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            disabled={!edgeDetectionEnabled}
          />
        </label>
      </div>

      {/* Pixelation Controls */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#88ff88' }}>🟫 Pixelation</h4>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="checkbox"
            checked={pixelationEnabled}
            onChange={(e) => {
              setPixelationEnabled(e.target.checked);
              onPixelationChange(e.target.checked);
            }}
            style={{ marginRight: '10px' }}
          />
          Enable Pixelation
        </label>
        
        <label style={{ display: 'block' }}>
          Pixel Size: {pixelSize}
          <input
            type="range"
            min="2"
            max="32"
            step="1"
            value={pixelSize}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setPixelSize(value);
              onPixelSizeChange(value);
            }}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            disabled={!pixelationEnabled}
          />
        </label>
      </div>

      {/* Motion Blur Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#88ff88' }}>💨 Motion Blur</h4>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="checkbox"
            checked={motionBlurEnabled}
            onChange={(e) => {
              setMotionBlurEnabled(e.target.checked);
              onMotionBlurChange(e.target.checked);
            }}
            style={{ marginRight: '10px' }}
          />
          Enable Motion Blur
        </label>
        
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Strength: {motionBlurStrength.toFixed(2)}
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={motionBlurStrength}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setMotionBlurStrength(value);
              onMotionBlurStrengthChange(value);
            }}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            disabled={!motionBlurEnabled}
          />
        </label>
        
        <label style={{ display: 'block' }}>
          Samples: {motionBlurSamples}
          <input
            type="range"
            min="4"
            max="16"
            step="1"
            value={motionBlurSamples}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setMotionBlurSamples(value);
              onMotionBlurSamplesChange(value);
            }}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            disabled={!motionBlurEnabled}
          />
        </label>
      </div>

      {/* Preset Buttons */}
      <div style={{ borderTop: '1px solid #333', paddingTop: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#ffaa88' }}>🎭 Presets</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              // Artistic preset
              setEdgeDetectionEnabled(true);
              setEdgeThreshold(0.05);
              setEdgeIntensity(0.8);
              setPixelationEnabled(false);
              setMotionBlurEnabled(false);
              
              onEdgeDetectionChange(true);
              onEdgeThresholdChange(0.05);
              onEdgeIntensityChange(0.8);
              onPixelationChange(false);
              onMotionBlurChange(false);
            }}
            style={{
              background: '#ff6b6b',
              border: 'none',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🎨 Artistic
          </button>
          
          <button
            onClick={() => {
              // Retro preset
              setPixelationEnabled(true);
              setPixelSize(12);
              setEdgeDetectionEnabled(false);
              setMotionBlurEnabled(false);
              
              onPixelationChange(true);
              onPixelSizeChange(12);
              onEdgeDetectionChange(false);
              onMotionBlurChange(false);
            }}
            style={{
              background: '#4ecdc4',
              border: 'none',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🕹️ Retro
          </button>
          
          <button
            onClick={() => {
              // Speed preset
              setMotionBlurEnabled(true);
              setMotionBlurStrength(1.2);
              setMotionBlurSamples(12);
              setEdgeDetectionEnabled(false);
              setPixelationEnabled(false);
              
              onMotionBlurChange(true);
              onMotionBlurStrengthChange(1.2);
              onMotionBlurSamplesChange(12);
              onEdgeDetectionChange(false);
              onPixelationChange(false);
            }}
            style={{
              background: '#45b7d1',
              border: 'none',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            💨 Speed
          </button>
          
          <button
            onClick={() => {
              // Clear all filters
              setEdgeDetectionEnabled(false);
              setPixelationEnabled(false);
              setMotionBlurEnabled(false);
              
              onEdgeDetectionChange(false);
              onPixelationChange(false);
              onMotionBlurChange(false);
            }}
            style={{
              background: '#666',
              border: 'none',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🚫 Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShaderFilterControls;

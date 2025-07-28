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
  // New effects callbacks
  onWaveDistortionChange?: (enabled: boolean) => void;
  onWaveAmplitudeChange?: (amplitude: number) => void;
  onWaveFrequencyChange?: (frequency: number) => void;
  onWaveSpeedChange?: (speed: number) => void;
  onFireChange?: (enabled: boolean) => void;
  onFireIntensityChange?: (intensity: number) => void;
  onFireScaleChange?: (scale: number) => void;
  onGlitchChange?: (enabled: boolean) => void;
  onGlitchIntensityChange?: (intensity: number) => void;
  onGlitchSpeedChange?: (speed: number) => void;
  onOilPaintingChange?: (enabled: boolean) => void;
  onOilBrushSizeChange?: (size: number) => void;
  onOilIntensityChange?: (intensity: number) => void;
  // Improved Shockwave callbacks
  onImprovedShockwaveChange?: (enabled: boolean) => void;
  onImprovedShockwaveIntensityChange?: (intensity: number) => void;
  onImprovedShockwaveWidthChange?: (width: number) => void;
  onImprovedShockwaveStrengthChange?: (strength: number) => void;
}

export function ShaderFilterControls({
  onEdgeDetectionChange,
  onEdgeThresholdChange,
  onEdgeIntensityChange,
  onPixelationChange,
  onPixelSizeChange,
  onMotionBlurChange,
  onMotionBlurStrengthChange,
  onMotionBlurSamplesChange,
  // New effects
  onWaveDistortionChange,
  onWaveAmplitudeChange,
  onWaveFrequencyChange,
  onWaveSpeedChange,
  onFireChange,
  onFireIntensityChange,
  onFireScaleChange,
  onGlitchChange,
  onGlitchIntensityChange,
  onGlitchSpeedChange,
  onOilPaintingChange,
  onOilBrushSizeChange,
  onOilIntensityChange,
  // Improved Shockwave
  onImprovedShockwaveChange,
  onImprovedShockwaveIntensityChange,
  onImprovedShockwaveWidthChange,
  onImprovedShockwaveStrengthChange
}: ShaderFilterControlsProps) {
  const [edgeDetectionEnabled, setEdgeDetectionEnabled] = useState(false);
  const [edgeThreshold, setEdgeThreshold] = useState(0.1);
  const [edgeIntensity, setEdgeIntensity] = useState(1.0);
  const [pixelationEnabled, setPixelationEnabled] = useState(false);
  const [pixelSize, setPixelSize] = useState(8);
  const [motionBlurEnabled, setMotionBlurEnabled] = useState(false);
  const [motionBlurStrength, setMotionBlurStrength] = useState(0.5);
  const [motionBlurSamples, setMotionBlurSamples] = useState(8);
  
  // New effects state
  const [waveDistortionEnabled, setWaveDistortionEnabled] = useState(false);
  const [waveAmplitude, setWaveAmplitude] = useState(0.05);
  const [waveFrequency, setWaveFrequency] = useState(10.0);
  const [waveSpeed, setWaveSpeed] = useState(2.0);
  const [fireEnabled, setFireEnabled] = useState(false);
  const [fireIntensity, setFireIntensity] = useState(1.0);
  const [fireScale, setFireScale] = useState(8.0);
  const [glitchEnabled, setGlitchEnabled] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0.5);
  const [glitchSpeed, setGlitchSpeed] = useState(10.0);
  const [oilPaintingEnabled, setOilPaintingEnabled] = useState(false);
  const [oilBrushSize, setOilBrushSize] = useState(3.0);
  const [oilIntensity, setOilIntensity] = useState(1.0);
  
  // Improved Shockwave state
  const [improvedShockwaveEnabled, setImprovedShockwaveEnabled] = useState(false);
  const [improvedShockwaveIntensity, setImprovedShockwaveIntensity] = useState(1.0);
  const [improvedShockwaveWidth, setImprovedShockwaveWidth] = useState(0.1);
  const [improvedShockwaveStrength, setImprovedShockwaveStrength] = useState(10.0);

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

      {/* Wave Distortion Controls */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#88ff88' }}>🌊 Wave Distortion</h4>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="checkbox"
            checked={waveDistortionEnabled}
            onChange={(e) => {
              setWaveDistortionEnabled(e.target.checked);
              onWaveDistortionChange?.(e.target.checked);
            }}
            style={{ marginRight: '10px' }}
          />
          Enable Wave Distortion
        </label>
        
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Amplitude: {waveAmplitude.toFixed(3)}
          <input
            type="range"
            min="0.001"
            max="0.2"
            step="0.001"
            value={waveAmplitude}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setWaveAmplitude(value);
              onWaveAmplitudeChange?.(value);
            }}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            disabled={!waveDistortionEnabled}
          />
        </label>
        
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Frequency: {waveFrequency.toFixed(1)}
          <input
            type="range"
            min="1.0"
            max="50.0"
            step="0.1"
            value={waveFrequency}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setWaveFrequency(value);
              onWaveFrequencyChange?.(value);
            }}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            disabled={!waveDistortionEnabled}
          />
        </label>
        
        <label style={{ display: 'block' }}>
          Speed: {waveSpeed.toFixed(1)}
          <input
            type="range"
            min="0.1"
            max="10.0"
            step="0.1"
            value={waveSpeed}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setWaveSpeed(value);
              onWaveSpeedChange?.(value);
            }}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            disabled={!waveDistortionEnabled}
          />
        </label>
      </div>

      {/* Fire Effect Controls */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#88ff88' }}>🔥 Fire Effect</h4>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="checkbox"
            checked={fireEnabled}
            onChange={(e) => {
              setFireEnabled(e.target.checked);
              onFireChange?.(e.target.checked);
            }}
            style={{ marginRight: '10px' }}
          />
          Enable Fire Effect
        </label>
        
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Intensity: {fireIntensity.toFixed(1)}
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={fireIntensity}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setFireIntensity(value);
              onFireIntensityChange?.(value);
            }}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            disabled={!fireEnabled}
          />
        </label>
        
        <label style={{ display: 'block' }}>
          Scale: {fireScale.toFixed(1)}
          <input
            type="range"
            min="2.0"
            max="20.0"
            step="0.1"
            value={fireScale}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setFireScale(value);
              onFireScaleChange?.(value);
            }}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            disabled={!fireEnabled}
          />
        </label>
      </div>

      {/* Glitch Effect Controls */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#88ff88' }}>👾 Glitch Effect</h4>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="checkbox"
            checked={glitchEnabled}
            onChange={(e) => {
              setGlitchEnabled(e.target.checked);
              onGlitchChange?.(e.target.checked);
            }}
            style={{ marginRight: '10px' }}
          />
          Enable Glitch Effect
        </label>
        
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Intensity: {glitchIntensity.toFixed(1)}
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={glitchIntensity}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setGlitchIntensity(value);
              onGlitchIntensityChange?.(value);
            }}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            disabled={!glitchEnabled}
          />
        </label>
        
        <label style={{ display: 'block' }}>
          Speed: {glitchSpeed.toFixed(1)}
          <input
            type="range"
            min="1.0"
            max="50.0"
            step="1.0"
            value={glitchSpeed}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setGlitchSpeed(value);
              onGlitchSpeedChange?.(value);
            }}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            disabled={!glitchEnabled}
          />
        </label>
      </div>

      {/* Oil Painting Effect Controls */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#88ff88' }}>🌈 Oil Painting</h4>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="checkbox"
            checked={oilPaintingEnabled}
            onChange={(e) => {
              setOilPaintingEnabled(e.target.checked);
              onOilPaintingChange?.(e.target.checked);
            }}
            style={{ marginRight: '10px' }}
          />
          Enable Oil Painting
        </label>
        
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Brush Size: {oilBrushSize.toFixed(1)}
          <input
            type="range"
            min="1.0"
            max="8.0"
            step="0.1"
            value={oilBrushSize}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setOilBrushSize(value);
              onOilBrushSizeChange?.(value);
            }}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            disabled={!oilPaintingEnabled}
          />
        </label>
        
        <label style={{ display: 'block' }}>
          Intensity: {oilIntensity.toFixed(1)}
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={oilIntensity}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setOilIntensity(value);
              onOilIntensityChange?.(value);
            }}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            disabled={!oilPaintingEnabled}
          />
        </label>
      </div>

      {/* Improved Shockwave Effect Controls */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#ff8844' }}>💥 Improved Shockwave</h4>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="checkbox"
            checked={improvedShockwaveEnabled}
            onChange={(e) => {
              setImprovedShockwaveEnabled(e.target.checked);
              onImprovedShockwaveChange?.(e.target.checked);
            }}
            style={{ marginRight: '10px' }}
          />
          Enable Improved Shockwave
        </label>
        
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Intensity: {improvedShockwaveIntensity.toFixed(1)}
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={improvedShockwaveIntensity}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setImprovedShockwaveIntensity(value);
              onImprovedShockwaveIntensityChange?.(value);
            }}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            disabled={!improvedShockwaveEnabled}
          />
        </label>
        
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Wave Width: {improvedShockwaveWidth.toFixed(2)}
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={improvedShockwaveWidth}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setImprovedShockwaveWidth(value);
              onImprovedShockwaveWidthChange?.(value);
            }}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            disabled={!improvedShockwaveEnabled}
          />
        </label>
        
        <label style={{ display: 'block' }}>
          Wave Strength: {improvedShockwaveStrength.toFixed(1)}
          <input
            type="range"
            min="5.0"
            max="50.0"
            step="1.0"
            value={improvedShockwaveStrength}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setImprovedShockwaveStrength(value);
              onImprovedShockwaveStrengthChange?.(value);
            }}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            disabled={!improvedShockwaveEnabled}
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
        
        <div style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
          💡 Move camera or use orbit controls to see motion blur effect
        </div>
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
              setMotionBlurStrength(1.5);
              setEdgeDetectionEnabled(false);
              setPixelationEnabled(false);
              
              onMotionBlurChange(true);
              onMotionBlurStrengthChange(1.5);
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
              // Wave preset
              setWaveDistortionEnabled(true);
              setWaveAmplitude(0.08);
              setWaveFrequency(15.0);
              setWaveSpeed(3.0);
              setEdgeDetectionEnabled(false);
              setPixelationEnabled(false);
              setMotionBlurEnabled(false);
              
              onWaveDistortionChange?.(true);
              onWaveAmplitudeChange?.(0.08);
              onWaveFrequencyChange?.(15.0);
              onWaveSpeedChange?.(3.0);
              onEdgeDetectionChange(false);
              onPixelationChange(false);
              onMotionBlurChange(false);
            }}
            style={{
              background: '#20b2aa',
              border: 'none',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🌊 Ocean
          </button>
          
          <button
            onClick={() => {
              // Fire preset
              setFireEnabled(true);
              setFireIntensity(2.0);
              setFireScale(12.0);
              setEdgeDetectionEnabled(false);
              setPixelationEnabled(false);
              setMotionBlurEnabled(false);
              
              onFireChange?.(true);
              onFireIntensityChange?.(2.0);
              onFireScaleChange?.(12.0);
              onEdgeDetectionChange(false);
              onPixelationChange(false);
              onMotionBlurChange(false);
            }}
            style={{
              background: '#ff4500',
              border: 'none',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🔥 Fire
          </button>
          
          <button
            onClick={() => {
              // Glitch preset
              setGlitchEnabled(true);
              setGlitchIntensity(1.2);
              setGlitchSpeed(25.0);
              setEdgeDetectionEnabled(false);
              setPixelationEnabled(false);
              setMotionBlurEnabled(false);
              
              onGlitchChange?.(true);
              onGlitchIntensityChange?.(1.2);
              onGlitchSpeedChange?.(25.0);
              onEdgeDetectionChange(false);
              onPixelationChange(false);
              onMotionBlurChange(false);
            }}
            style={{
              background: '#9932cc',
              border: 'none',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            👾 Glitch
          </button>
          
          <button
            onClick={() => {
              // Oil painting preset
              setOilPaintingEnabled(true);
              setOilBrushSize(4.0);
              setOilIntensity(1.5);
              setEdgeDetectionEnabled(false);
              setPixelationEnabled(false);
              setMotionBlurEnabled(false);
              
              onOilPaintingChange?.(true);
              onOilBrushSizeChange?.(4.0);
              onOilIntensityChange?.(1.5);
              onEdgeDetectionChange(false);
              onPixelationChange(false);
              onMotionBlurChange(false);
            }}
            style={{
              background: '#ff69b4',
              border: 'none',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🌈 Paint
          </button>
          
          <button
            onClick={() => {
              // Clear all filters
              setEdgeDetectionEnabled(false);
              setPixelationEnabled(false);
              setMotionBlurEnabled(false);
              setWaveDistortionEnabled(false);
              setFireEnabled(false);
              setGlitchEnabled(false);
              setOilPaintingEnabled(false);
              
              onEdgeDetectionChange(false);
              onPixelationChange(false);
              onMotionBlurChange(false);
              onWaveDistortionChange?.(false);
              onFireChange?.(false);
              onGlitchChange?.(false);
              onOilPaintingChange?.(false);
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

'use client'

import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Torus } from '@react-three/drei';
import ShaderFilters from "@/components/ShaderFilters";
import ShaderFilterControls from '../../components/ui/ShaderFilterControls';

// Simple animated scene for testing filters
function TestScene() {
  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <directionalLight position={[0, 5, 5]} intensity={0.8} />
      
      {/* Test objects */}
      <Box position={[-3, 0, 0]} args={[1, 1, 1]}>
        <meshStandardMaterial color="#ff6b6b" />
      </Box>
      
      <Sphere position={[0, 0, 0]} args={[0.8, 32, 16]}>
        <meshStandardMaterial color="#4ecdc4" />
      </Sphere>
      
      <Torus position={[3, 0, 0]} args={[0.6, 0.2, 16, 100]}>
        <meshStandardMaterial color="#45b7d1" />
      </Torus>
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      
      {/* Background plane */}
      <mesh position={[0, 2, -3]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
    </group>
  );
}

export default function ShaderFilterDemoPage() {
  // Filter states
  const [edgeDetectionEnabled, setEdgeDetectionEnabled] = useState(false);
  const [edgeThreshold, setEdgeThreshold] = useState(0.1);
  const [edgeIntensity, setEdgeIntensity] = useState(1.0);
  const [pixelationEnabled, setPixelationEnabled] = useState(false);
  const [pixelSize, setPixelSize] = useState(8);
  const [motionBlurEnabled, setMotionBlurEnabled] = useState(false);
  const [motionBlurStrength, setMotionBlurStrength] = useState(0.5);
  const [motionBlurSamples, setMotionBlurSamples] = useState(8);
  
  // New effects states
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
  
  // Improved Shockwave states
  const [improvedShockwaveEnabled, setImprovedShockwaveEnabled] = useState(false);
  const [improvedShockwaveIntensity, setImprovedShockwaveIntensity] = useState(1.0);
  const [improvedShockwaveWidth, setImprovedShockwaveWidth] = useState(0.1);
  const [improvedShockwaveStrength, setImprovedShockwaveStrength] = useState(10.0);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 2, 8], fov: 75 }}>
        <Suspense fallback={null}>
          <TestScene />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          
          {/* Apply shader filters */}
          <ShaderFilters
            edgeDetectionEnabled={edgeDetectionEnabled}
            edgeThreshold={edgeThreshold}
            edgeIntensity={edgeIntensity}
            pixelationEnabled={pixelationEnabled}
            pixelSize={pixelSize}
            motionBlurEnabled={motionBlurEnabled}
            motionBlurStrength={motionBlurStrength}
            motionBlurSamples={motionBlurSamples}
            waveDistortionEnabled={waveDistortionEnabled}
            waveAmplitude={waveAmplitude}
            waveFrequency={waveFrequency}
            waveSpeed={waveSpeed}
            fireEnabled={fireEnabled}
            fireIntensity={fireIntensity}
            fireScale={fireScale}
            glitchEnabled={glitchEnabled}
            glitchIntensity={glitchIntensity}
            glitchSpeed={glitchSpeed}
            oilPaintingEnabled={oilPaintingEnabled}
            oilBrushSize={oilBrushSize}
            oilIntensity={oilIntensity}
            improvedShockwaveEnabled={improvedShockwaveEnabled}
            improvedShockwaveIntensity={improvedShockwaveIntensity}
            improvedShockwaveWidth={improvedShockwaveWidth}
            improvedShockwaveStrength={improvedShockwaveStrength}
          />
        </Suspense>
      </Canvas>
      
      {/* Controls Panel */}
      <ShaderFilterControls
        onEdgeDetectionChange={setEdgeDetectionEnabled}
        onEdgeThresholdChange={setEdgeThreshold}
        onEdgeIntensityChange={setEdgeIntensity}
        onPixelationChange={setPixelationEnabled}
        onPixelSizeChange={setPixelSize}
        onMotionBlurChange={setMotionBlurEnabled}
        onMotionBlurStrengthChange={setMotionBlurStrength}
        onMotionBlurSamplesChange={setMotionBlurSamples}
        onWaveDistortionChange={setWaveDistortionEnabled}
        onWaveAmplitudeChange={setWaveAmplitude}
        onWaveFrequencyChange={setWaveFrequency}
        onWaveSpeedChange={setWaveSpeed}
        onFireChange={setFireEnabled}
        onFireIntensityChange={setFireIntensity}
        onFireScaleChange={setFireScale}
        onGlitchChange={setGlitchEnabled}
        onGlitchIntensityChange={setGlitchIntensity}
        onGlitchSpeedChange={setGlitchSpeed}
        onOilPaintingChange={setOilPaintingEnabled}
        onOilBrushSizeChange={setOilBrushSize}
        onOilIntensityChange={setOilIntensity}
        onImprovedShockwaveChange={setImprovedShockwaveEnabled}
        onImprovedShockwaveIntensityChange={setImprovedShockwaveIntensity}
        onImprovedShockwaveWidthChange={setImprovedShockwaveWidth}
        onImprovedShockwaveStrengthChange={setImprovedShockwaveStrength}
      />
      
      {/* Info Panel */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        fontSize: '14px',
        maxWidth: '300px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#00ff88' }}>🎮 Advanced Shader Demo</h4>
        <p style={{ margin: '5px 0', fontSize: '12px' }}>
          🖼️ <strong>Edge Detection:</strong> Highlights object edges for artistic effects
        </p>
        <p style={{ margin: '5px 0', fontSize: '12px' }}>
          🟫 <strong>Pixelation:</strong> Creates retro pixel-art style rendering
        </p>
        <p style={{ margin: '5px 0', fontSize: '12px' }}>
          💨 <strong>Motion Blur:</strong> Framebuffer-based blur with camera tracking
        </p>
        <p style={{ margin: '5px 0', fontSize: '12px' }}>
          🌊 <strong>Wave Distortion:</strong> Animated wave effects with customizable frequency
        </p>
        <p style={{ margin: '5px 0', fontSize: '12px' }}>
          🔥 <strong>Fire Effect:</strong> Procedural fire simulation with noise
        </p>
        <p style={{ margin: '5px 0', fontSize: '12px' }}>
          👾 <strong>Glitch Effect:</strong> Digital artifacts and color separation
        </p>
        <p style={{ margin: '5px 0', fontSize: '12px' }}>
          🌈 <strong>Oil Painting:</strong> Artistic brush stroke simulation
        </p>
        <p style={{ margin: '5px 0', fontSize: '12px' }}>
          💥 <strong>Improved Shockwave:</strong> Enhanced ripple distortion with better control
        </p>
        <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#aaa' }}>
          🔄 Use the animated objects and orbit controls to test effects. 
          Try the preset buttons for quick setups!
        </p>
      </div>
    </div>
  );
}

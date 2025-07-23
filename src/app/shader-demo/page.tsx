'use client'

import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Torus } from '@react-three/drei';
import ShaderFilters from '../../components/ShaderFilters';
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
        <h4 style={{ margin: '0 0 10px 0', color: '#00ff88' }}>🎮 Shader Filter Demo</h4>
        <p style={{ margin: '5px 0', fontSize: '12px' }}>
          🖼️ <strong>Edge Detection:</strong> Highlights object edges for artistic effects
        </p>
        <p style={{ margin: '5px 0', fontSize: '12px' }}>
          🟫 <strong>Pixelation:</strong> Creates retro pixel-art style rendering
        </p>
        <p style={{ margin: '5px 0', fontSize: '12px' }}>
          💨 <strong>Motion Blur:</strong> Simulates camera/object movement blur
        </p>
        <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#aaa' }}>
          Use the controls on the right to adjust filter parameters or try the presets!
        </p>
      </div>
    </div>
  );
}

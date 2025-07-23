'use client'

import React, { useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { TEXTURE_PRESETS, useWallTexture, usePBRMaterial, type TexturePreset } from './TextureManager';

// Safe texture loading component with error boundaries
const PBRMaterial = ({ 
  pbrConfig, 
  textureScale,
  wallColor 
}: { 
  pbrConfig: any;
  textureScale: number;
  wallColor: string;
}) => {
  // Always load the base color texture (required)
  const baseColorTexture = useLoader(THREE.TextureLoader, pbrConfig.baseColor) as THREE.Texture;
  
  // For optional textures, provide fallback paths to ensure consistent hook calls
  const normalPath = pbrConfig.normal || pbrConfig.baseColor;
  const roughnessPath = pbrConfig.roughness || pbrConfig.baseColor;
  const aoPath = pbrConfig.ao || pbrConfig.baseColor;
  const heightPath = pbrConfig.height || pbrConfig.baseColor;
  
  // Always call the same number of hooks
  const normalTextureRaw = useLoader(THREE.TextureLoader, normalPath) as THREE.Texture;
  const roughnessTextureRaw = useLoader(THREE.TextureLoader, roughnessPath) as THREE.Texture;
  const aoTextureRaw = useLoader(THREE.TextureLoader, aoPath) as THREE.Texture;
  const heightTextureRaw = useLoader(THREE.TextureLoader, heightPath) as THREE.Texture;
  
  // Only use textures if they were originally specified
  const normalTexture = pbrConfig.normal ? normalTextureRaw : null;
  const roughnessTexture = pbrConfig.roughness ? roughnessTextureRaw : null;
  const aoTexture = pbrConfig.ao ? aoTextureRaw : null;
  const heightTexture = pbrConfig.height ? heightTextureRaw : null;

  // Configure textures
  const configuredTextures = useMemo(() => {
    [baseColorTexture, normalTexture, roughnessTexture, aoTexture, heightTexture]
      .filter(Boolean)
      .forEach(texture => {
        if (texture && texture instanceof THREE.Texture) {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          // Use different scaling for horizontal and vertical to make bricks look more natural
          texture.repeat.set(textureScale * 3, textureScale); // More repetition horizontally
          texture.needsUpdate = true;
        }
      });

    return {
      baseColor: baseColorTexture,
      normal: normalTexture,
      roughness: roughnessTexture,
      ao: aoTexture,
      height: heightTexture,
    };
  }, [baseColorTexture, normalTexture, roughnessTexture, aoTexture, heightTexture, textureScale]);

  return (
    <meshStandardMaterial 
      map={configuredTextures.baseColor}
      normalMap={configuredTextures.normal}
      roughnessMap={configuredTextures.roughness}
      aoMap={configuredTextures.ao}
      displacementMap={configuredTextures.height}
      displacementScale={0.02}
      roughness={1.0}
      metalness={0.0}
    />
  );
};

// Fallback component for loading states
const LoadingMaterial = ({ color }: { color: string }) => (
  <meshLambertMaterial color={color} />
);

interface SceneEnvironmentProps {
  sceneType: 'studio' | 'room' | 'outdoor' | 'abstract';
  wallColor?: string;
  wallTexture?: TexturePreset | string;
  textureScale?: number;
  width?: number;
  height?: number;
  depth?: number;
  floorType?: 'wood' | 'wood-panels' | 'wood-floor-pbr' | 'concrete' | 'marble' | 'carpet';
  showStats?: boolean;
  cameraPosition?: [number, number, number];
}

export function SceneEnvironment({
  sceneType = 'studio',
  wallColor = '#ffffff',
  wallTexture,
  textureScale = 1,
  width = 25,
  height = 20,
  depth = 15,
  floorType = 'wood-panels',
  showStats = false,
  cameraPosition = [0, 5, 10]
}: SceneEnvironmentProps) {
  // Get procedural texture if it's a preset
  const proceduralTexture = useWallTexture(wallTexture || 'white-plaster');
  
  // Get PBR material configuration
  const pbrConfig = usePBRMaterial(wallTexture || 'white-plaster');
  
  // Get PBR material configuration for floor
  const floorPbrConfig = usePBRMaterial('wood-floor-pbr');

  // Create wall material with proper loading
  const createWallMaterial = () => {
    // Only render PBRMaterial if pbrConfig exists, has baseColor, and type is pbr
    if (pbrConfig && pbrConfig.baseColor && pbrConfig.type === 'pbr') {
      return (
        <Suspense fallback={<LoadingMaterial color={wallColor} />}>
          <PBRMaterial 
            pbrConfig={pbrConfig} 
            textureScale={textureScale}
            wallColor={wallColor}
          />
        </Suspense>
      );
    } else if (proceduralTexture) {
      return (
        <meshStandardMaterial 
          map={proceduralTexture} 
          roughness={0.8}
          metalness={0.1}
        />
      );
    } else {
      return <meshLambertMaterial color={wallColor} />;
    }
  };

  // Create floor material with PBR support
  const createFloorMaterial = () => {
    if (floorType === 'wood-floor-pbr' && floorPbrConfig && floorPbrConfig.baseColor && floorPbrConfig.type === 'pbr') {
      return (
        <Suspense fallback={<LoadingMaterial color="#D2B48C" />}>
          <PBRMaterial 
            pbrConfig={floorPbrConfig} 
            textureScale={2} // Good scale for floor
            wallColor="#D2B48C"
          />
        </Suspense>
      );
    } else if (floorType === 'wood') {
      return <meshLambertMaterial map={woodTexture} />;
    } else if (floorType === 'wood-panels') {
      return <meshStandardMaterial map={woodPanelTexture} roughness={0.7} metalness={0.0} />;
    } else if (floorType === 'concrete') {
      return <meshStandardMaterial color="#808080" roughness={0.8} />;
    } else if (floorType === 'marble') {
      return <meshPhysicalMaterial color="#f8f8f8" roughness={0.1} metalness={0.1} />;
    } else {
      return <meshLambertMaterial color="#8B4513" />;
    }
  };

  // Create wood floor texture (procedural for now, can be replaced with uploaded texture)
  const woodTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Wood base color
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, 512, 512);
    
    // Wood grain lines
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * 25 + Math.random() * 10);
      ctx.lineTo(512, i * 25 + Math.random() * 10);
      ctx.stroke();
    }
    
    // Wood planks
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 64, 0);
      ctx.lineTo(i * 64, 512);
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(width / 2, depth / 2);
    return texture;
  }, [width, depth, floorType]);

  // Create wood panel floor texture using TextureManager
  const woodPanelTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Base wood color
    ctx.fillStyle = '#D2B48C';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const panelWidth = 120;
    const panelHeight = 800; // Long vertical panels
    
    // Draw vertical wood panels
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    
    for (let x = 0; x < canvas.width; x += panelWidth) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Add wood grain (horizontal lines)
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 80; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * 13 + Math.random() * 8);
      ctx.lineTo(canvas.width, i * 13 + Math.random() * 8);
      ctx.stroke();
    }
    
    // Add wood texture noise
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 2;
      ctx.fillStyle = Math.random() > 0.5 ? '#DEB887' : '#8B7355';
      ctx.fillRect(x, y, size, size);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(width / 3, depth / 3); // Adjust scale for floor
    return texture;
  }, [width, depth]);

  const renderRoom = () => (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -height/2, 0]}>
        <planeGeometry args={[50, 20]} />
        {createFloorMaterial()}
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 5, -depth/2]}>
        <planeGeometry args={[50, 20]} />
        {createWallMaterial()}
      </mesh>


    <mesh position={[0, -3.7, -depth/2+0.1]}>
        <boxGeometry args={[50, 1, 0.1 ]} />
        {/* White plaster wall */}
        <meshLambertMaterial color="#f8f8f8" />
      </mesh>

 
    </group>
  );

  const renderStudio = () => (
    <group>
      {/* Backdrop */}
      <mesh position={[0, 0, -10]} rotation={[0, 0, 0]}>
        <planeGeometry args={[30, 20]} />
        {createWallMaterial()}
      </mesh>

      {/* Floor that curves up to become backdrop */}
      <mesh position={[0, -5, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[15, 15, 30, 32, 1, false, 0, Math.PI]} />
        {createWallMaterial()}
      </mesh>
    </group>
  );

  const renderOutdoor = () => (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshLambertMaterial color="#4CAF50" />
      </mesh>
      
      {/* Sky backdrop */}
      <mesh position={[0, 10, -20]}>
        <planeGeometry args={[100, 50]} />
        <meshLambertMaterial color="#87CEEB" />
      </mesh>
    </group>
  );

  const renderAbstract = () => (
    <group>
      {/* Abstract floating planes */}
      <mesh position={[5, 2, -8]} rotation={[0.2, 0.3, 0.1]}>
        <planeGeometry args={[15, 10]} />
        {createWallMaterial()}
      </mesh>
      
      <mesh position={[-3, -1, -5]} rotation={[-0.1, -0.2, 0.05]}>
        <planeGeometry args={[12, 8]} />
        {createWallMaterial()}
      </mesh>
      
      <mesh position={[0, 5, -12]} rotation={[0.1, 0, -0.1]}>
        <planeGeometry args={[20, 12]} />
        {createWallMaterial()}
      </mesh>
    </group>
  );

  const renderScene = () => {
    switch (sceneType) {
      case 'room':
        return renderRoom();
      case 'studio':
        return renderStudio();
      case 'outdoor':
        return renderOutdoor();
      case 'abstract':
        return renderAbstract();
      default:
        return renderStudio();
    }
  };

  return (
    <group>
      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      
      {/* Scene geometry */}
      {renderScene()}
    </group>
  );
}

// Lighting setup for different scenes
export function SceneLighting({ sceneType }: { sceneType: string }) {
  switch (sceneType) {
    case 'room':
      return (
        <>
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={0.8} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-3, 2, -3]} intensity={0.3} color="#ffffff" />
        </>
      );
    case 'studio':
      return (
        <>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, 10, 5]} intensity={0.5} />
        </>
      );
    case 'outdoor':
      return (
        <>
          <ambientLight intensity={0.3} />
          <directionalLight 
            position={[10, 20, 10]} 
            intensity={1.2} 
            color="#fff8e1"
          />
        </>
      );
    case 'abstract':
      return (
        <>
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 5, 0]} intensity={1} color="#ffffff" />
          <spotLight 
            position={[5, 8, 5]} 
            intensity={0.8} 
            angle={0.3} 
            penumbra={0.1}
            color="#4fc3f7"
          />
        </>
      );
    default:
      return (
        <>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 5]} intensity={0.8} />
        </>
      );
  }
}

// Default export for compatibility
export default SceneEnvironment;

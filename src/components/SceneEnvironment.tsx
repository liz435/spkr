'use client'

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

interface SceneEnvironmentProps {
  sceneType: 'studio' | 'room' | 'outdoor' | 'abstract';
  wallColor?: string;
  floorType?: 'wood' | 'concrete' | 'marble' | 'carpet';
  roomSize?: [number, number, number]; // width, height, depth
}

export function SceneEnvironment({ 
  sceneType = 'room',
  wallColor = '#f5f5f5',
  floorType = 'wood',
  roomSize = [20, 8, 20]
}: SceneEnvironmentProps) {
  const [width, height, depth] = roomSize;

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

  const renderRoom = () => (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -height/2, 0]}>
        <planeGeometry args={[width, depth]} />
        {floorType === 'wood' ? (
          <meshLambertMaterial map={woodTexture} />
        ) : floorType === 'concrete' ? (
          <meshStandardMaterial color="#808080" roughness={0.8} />
        ) : floorType === 'marble' ? (
          <meshPhysicalMaterial color="#f8f8f8" roughness={0.1} metalness={0.1} />
        ) : (
          <meshLambertMaterial color="#8B4513" />
        )}
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 0, -depth/2]}>
        <planeGeometry args={[width, height]} />
        <meshLambertMaterial color={wallColor} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-width/2, 0, 0]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[depth, height]} />
        <meshLambertMaterial color={wallColor} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width/2, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[depth, height]} />
        <meshLambertMaterial color={wallColor} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height/2, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>

      {/* Corner shadows/details */}
      <mesh position={[-width/2 + 0.01, -height/2 + 0.01, -depth/2 + 0.01]}>
        <boxGeometry args={[0.1, height - 0.02, 0.1]} />
        <meshLambertMaterial color="#e0e0e0" />
      </mesh>

      {/* Baseboard */}
      <mesh position={[0, -height/2 + 0.05, -depth/2 + 0.01]}>
        <boxGeometry args={[width - 0.1, 0.1, 0.02]} />
        <meshLambertMaterial color="#e8e8e8" />
      </mesh>
      <mesh position={[-width/2 + 0.01, -height/2 + 0.05, 0]}>
        <boxGeometry args={[0.02, 0.1, depth - 0.1]} />
        <meshLambertMaterial color="#e8e8e8" />
      </mesh>
    </group>
  );

  const renderStudio = () => (
    <group>
      {/* Infinite white floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>
      
      {/* Curved backdrop */}
      <mesh position={[0, 1, -8]}>
        <cylinderGeometry args={[12, 12, 10, 32, 1, false, 0, Math.PI]} />
        <meshLambertMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );

  const renderOutdoor = () => (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshLambertMaterial color="#4a5d23" />
      </mesh>
      
      {/* Sky dome */}
      <mesh>
        <sphereGeometry args={[50, 32, 16]} />
        <meshBasicMaterial color="#87CEEB" side={THREE.BackSide} />
      </mesh>
    </group>
  );

  const renderAbstract = () => (
    <group>
      {/* Abstract geometric platforms */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[8, 8, 0.2, 8]} />
        <meshPhysicalMaterial 
          color="#2a2a2a" 
          roughness={0.1} 
          metalness={0.8}
          transmission={0.1}
        />
      </mesh>
      
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[6, 6, 0.1, 6]} />
        <meshPhysicalMaterial 
          color="#4a4a4a" 
          roughness={0.2} 
          metalness={0.6}
          emissive="#111111"
        />
      </mesh>
    </group>
  );

  switch (sceneType) {
    case 'studio':
      return renderStudio();
    case 'outdoor':
      return renderOutdoor();
    case 'abstract':
      return renderAbstract();
    case 'room':
    default:
      return renderRoom();
  }
}

// Lighting setup for different scenes
export function SceneLighting({ sceneType }: { sceneType: string }) {
  switch (sceneType) {
    case 'room':
      return (
        <>
          {/* Main room lighting */}
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
          {/* Corner fill light */}
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

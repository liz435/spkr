'use client'

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NeonStripLightProps {
  position?: [number, number, number];
  width?: number;
  height?: number;
  color?: string;
  intensity?: number;
  emissiveIntensity?: number;
  animated?: boolean;
}

export function NeonStripLight({
  position = [0, 0, 0],
  width = 4,
  height = 0.2,
  color = '#ff6600', // Orange color
  intensity = 2,
  emissiveIntensity = 1.5,
  animated = true
}: NeonStripLightProps) {
  const stripRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.RectAreaLight>(null);
  
  // Create neon material with emission
  const neonMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: emissiveIntensity,
      roughness: 0.1,
      metalness: 0.0,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
  }, [color, emissiveIntensity]);

  // Create outer glow material
  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
  }, [color]);

  // Animation for flickering effect
  useFrame((state) => {
    if (animated && stripRef.current && lightRef.current) {
      const time = state.clock.elapsedTime;
      const flicker = 0.9 + 0.1 * Math.sin(time * 10) * Math.random();
      
      // Animate emissive intensity
      (stripRef.current.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 
        emissiveIntensity * flicker;
      
      // Animate light intensity
      lightRef.current.intensity = intensity * flicker;
    }
  });

  return (
    <group position={position}>
      {/* Main neon strip */}
      <mesh ref={stripRef}>
        <boxGeometry args={[width, height, 0.05]} />
        <primitive object={neonMaterial} />
      </mesh>

      {/* Outer glow effect */}
      <mesh scale={[1.2, 1.5, 1.2]}>
        <boxGeometry args={[width, height, 0.1]} />
        <primitive object={glowMaterial} />
      </mesh>

      {/* Rect area light for realistic lighting */}
      <rectAreaLight
        ref={lightRef}
        args={[color, intensity, width, height]}
        position={[0, 0, 0.1]}
        rotation={[0, 0, 0]}
      />

      {/* Additional point light for ambient lighting */}
      <pointLight
        color={color}
        intensity={intensity * 0.5}
        distance={10}
        decay={2}
        position={[0, 0, 0.5]}
      />
    </group>
  );
}

export default NeonStripLight;

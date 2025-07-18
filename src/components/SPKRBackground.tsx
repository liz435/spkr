'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Audio-reactive particle system for SPKR background
export function SPKRBackground({ particleCount = 2000 }) {
  const meshRef = useRef<THREE.Points>(null!)
  const [audioLevel, setAudioLevel] = useState(0)
  
  // Generate particle positions in a sphere around the speaker
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      // Create spherical distribution around speaker
      const radius = 15 + Math.random() * 25
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // Speaker-themed colors (彩虹色粒子)
      const t = Math.random()
      // Create rainbow-like color distribution
      if (t < 0.2) {
        // Red-Orange
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.3 + t * 2
        colors[i * 3 + 2] = 0.1
      } else if (t < 0.4) {
        // Yellow-Green
        colors[i * 3] = 1.0 - (t - 0.2) * 2
        colors[i * 3 + 1] = 1.0
        colors[i * 3 + 2] = 0.2
      } else if (t < 0.6) {
        // Green-Cyan
        colors[i * 3] = 0.1
        colors[i * 3 + 1] = 1.0
        colors[i * 3 + 2] = (t - 0.4) * 4
      } else if (t < 0.8) {
        // Cyan-Blue
        colors[i * 3] = 0.1
        colors[i * 3 + 1] = 1.0 - (t - 0.6) * 3
        colors[i * 3 + 2] = 1.0
      } else {
        // Blue-Purple
        colors[i * 3] = (t - 0.8) * 4
        colors[i * 3 + 1] = 0.2
        colors[i * 3 + 2] = 1.0
      }
    }
    
    return [positions, colors]
  }, [particleCount])

  // Simulate audio level changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Create rhythmic audio simulation
      const time = Date.now() * 0.003
      setAudioLevel(
        (Math.sin(time) * 0.5 + 0.5) * 
        (Math.sin(time * 1.7) * 0.3 + 0.7) *
        (Math.sin(time * 0.8) * 0.2 + 0.8)
      )
    }, 50)
    return () => clearInterval(interval)
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y = time * 0.1
      
      // Audio-reactive scaling and movement
      const baseScale = 1 + audioLevel * 0.2
      meshRef.current.scale.setScalar(baseScale)
      
      // Update particle positions for audio-reactive wave effect
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array
      const originalPositions = positions.slice() // Keep original positions
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const x = originalPositions[i3]
        const y = originalPositions[i3 + 1] 
        const z = originalPositions[i3 + 2]
        
        // Audio-reactive wave effect
        const distance = Math.sqrt(x * x + y * y + z * z)
        const wave = Math.sin(distance * 0.05 + time * 3) * audioLevel * 3
        const pulse = Math.sin(time * 5 + distance * 0.1) * audioLevel * 1.5
        
        // Apply wave and pulse effects
        positions[i3] = x + Math.sin(time + distance * 0.05) * wave
        positions[i3 + 1] = y + pulse
        positions[i3 + 2] = z + Math.cos(time + distance * 0.05) * wave
      }
      
      meshRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <Points 
      ref={meshRef} 
      positions={positions} 
      stride={3} 
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#ffaa55"
        size={1.0}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  )
}

// Floating energy orbs around the speaker
export function EnergyOrbs() {
  const orbsRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (orbsRef.current) {
      orbsRef.current.rotation.y = time * 0.15
      
      // Animate individual orbs
      orbsRef.current.children.forEach((orb, index) => {
        const offset = index * Math.PI * 0.5
        orb.position.y = Math.sin(time * 2 + offset) * 2
        orb.scale.setScalar(0.8 + Math.sin(time * 3 + offset) * 0.3)
      })
    }
  })

  return (
    <group ref={orbsRef}>
      {/* Create 4 energy orbs around the speaker */}
      {[0, 1, 2, 3].map((index) => {
        const angle = (index / 4) * Math.PI * 2
        const radius = 12
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        // Different colors for each orb
        const colors = ["#ff6b9d", "#c471ed", "#12d8fa", "#ffd93d"]
        const emissiveColors = ["#ff1461", "#a855f7", "#0ea5e9", "#f59e0b"]
        
        return (
          <mesh key={index} position={[x, 0, z]}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial
              color={colors[index]}
              transparent
              opacity={0.6}
              emissive={emissiveColors[index]}
              emissiveIntensity={1.5}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// Dynamic lighting that responds to audio
export function AudioLighting() {
  const lightRef = useRef<THREE.PointLight>(null!)
  const [intensity, setIntensity] = useState(1)
  
  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() * 0.005
      setIntensity(0.8 + Math.sin(time * 2) * 0.4)
    }, 50)
    return () => clearInterval(interval)
  }, [])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (lightRef.current) {
      lightRef.current.intensity = 30 + intensity * 20
      // Subtle movement
      lightRef.current.position.x = Math.sin(time * 0.5) * 2
      lightRef.current.position.z = Math.cos(time * 0.5) * 2
    }
  })
  
  return (
    <pointLight
      ref={lightRef}
      position={[0, 8, 0]}
      color="#ffaa55"
      intensity={50}
      distance={30}
      decay={2}
    />
  )
}

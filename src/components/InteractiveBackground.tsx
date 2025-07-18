'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial, Sphere, Box, Torus } from '@react-three/drei'
import * as THREE from 'three'

// Audio-reactive particle system
function AudioParticles({ count = 3000 }) {
  const mesh = useRef<THREE.Points>(null!)
  const [audioLevel, setAudioLevel] = useState(0)
  
  // Generate particle positions
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // Create spherical distribution
      const radius = Math.random() * 50 + 10
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // Color gradient from orange to purple
      const t = Math.random()
      colors[i * 3] = 1 - t * 0.3     // Red
      colors[i * 3 + 1] = 0.5 + t * 0.3 // Green
      colors[i * 3 + 2] = t           // Blue
    }
    
    return [positions, colors]
  }, [count])

  // Simulate audio level changes
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioLevel(Math.sin(Date.now() * 0.005) * 0.5 + 0.5)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (mesh.current) {
      // Rotate particles
      mesh.current.rotation.x = time * 0.1
      mesh.current.rotation.y = time * 0.15
      
      // Audio-reactive scaling
      const scale = 1 + audioLevel * 0.3
      mesh.current.scale.setScalar(scale)
      
      // Update particle positions for wave effect
      const positions = mesh.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = positions[i3]
        const y = positions[i3 + 1]
        const z = positions[i3 + 2]
        
        // Wave effect based on audio level
        const distance = Math.sqrt(x * x + y * y + z * z)
        const wave = Math.sin(distance * 0.1 + time * 2) * audioLevel * 2
        
        positions[i3 + 1] = y + wave
      }
      mesh.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <Points ref={mesh} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ff6b35"
        size={0.5}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

// Floating geometric shapes
function FloatingGeometry() {
  const torusRef = useRef<THREE.Mesh>(null!)
  const sphereRef = useRef<THREE.Mesh>(null!)
  const boxRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (torusRef.current) {
      torusRef.current.rotation.x = time * 0.3
      torusRef.current.rotation.y = time * 0.2
      torusRef.current.position.y = Math.sin(time * 0.5) * 2
    }
    
    if (sphereRef.current) {
      sphereRef.current.rotation.y = time * 0.4
      sphereRef.current.position.x = Math.cos(time * 0.3) * 3
      sphereRef.current.position.z = Math.sin(time * 0.3) * 3
    }
    
    if (boxRef.current) {
      boxRef.current.rotation.x = time * 0.2
      boxRef.current.rotation.z = time * 0.1
      boxRef.current.position.x = Math.sin(time * 0.4) * 4
      boxRef.current.position.y = Math.cos(time * 0.6) * 2
    }
  })

  return (
    <group>
      {/* Torus */}
      <Torus ref={torusRef} args={[2, 0.3, 16, 32]} position={[-5, 0, -5]}>
        <meshStandardMaterial
          color="#ff6b35"
          transparent
          opacity={0.3}
          wireframe
        />
      </Torus>
      
      {/* Sphere */}
      <Sphere ref={sphereRef} args={[1, 32, 32]} position={[5, 0, -5]}>
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.2}
          wireframe
        />
      </Sphere>
      
      {/* Box */}
      <Box ref={boxRef} args={[1.5, 1.5, 1.5]} position={[0, 3, -8]}>
        <meshStandardMaterial
          color="#06d6a0"
          transparent
          opacity={0.25}
          wireframe
        />
      </Box>
    </group>
  )
}

// Mouse interaction handler
function MouseInteraction() {
  const { camera, gl } = useThree()
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      })
    }
    
    gl.domElement.addEventListener('mousemove', handleMouseMove)
    return () => gl.domElement.removeEventListener('mousemove', handleMouseMove)
  }, [gl])
  
  useFrame(() => {
    // Subtle camera movement based on mouse position
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.01
    camera.position.y += (mouse.y * 2 - camera.position.y) * 0.01
    camera.lookAt(0, 0, 0)
  })
  
  return null
}

// Pulsing lights
function AudioLights() {
  const lightRef = useRef<THREE.PointLight>(null!)
  const [intensity, setIntensity] = useState(1)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIntensity(0.5 + Math.sin(Date.now() * 0.01) * 0.5)
    }, 50)
    return () => clearInterval(interval)
  }, [])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (lightRef.current) {
      lightRef.current.intensity = intensity * 2
      lightRef.current.position.x = Math.sin(time * 0.5) * 10
      lightRef.current.position.z = Math.cos(time * 0.5) * 10
    }
  })
  
  return (
    <group>
      <ambientLight intensity={0.1} />
      <pointLight
        ref={lightRef}
        position={[0, 10, 0]}
        color="#ff6b35"
        intensity={intensity * 2}
        distance={50}
        decay={2}
      />
      <pointLight
        position={[-10, -10, -10]}
        color="#8b5cf6"
        intensity={0.5}
        distance={30}
        decay={2}
      />
      <pointLight
        position={[10, -10, 10]}
        color="#06d6a0"
        intensity={0.5}
        distance={30}
        decay={2}
      />
    </group>
  )
}

// Main background component
export default function InteractiveBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <fog attach="fog" args={['#000000', 20, 100]} />
        
        <AudioLights />
        <AudioParticles count={2000} />
        <FloatingGeometry />
        <MouseInteraction />
        
        {/* Background gradient sphere */}
        <Sphere args={[80, 64, 64]} position={[0, 0, 0]}>
          <meshBasicMaterial
            color="#0a0a0a"
            side={THREE.BackSide}
            transparent
            opacity={0.8}
          />
        </Sphere>
      </Canvas>
    </div>
  )
}

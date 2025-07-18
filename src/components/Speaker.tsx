'use client'
import React from "react";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls,Environment, Fisheye  } from "@react-three/drei";
import  {FaceBox}  from "@/components/FaceBox";
import { SPKRBackground, EnergyOrbs, AudioLighting } from "@/components/SPKRBackground";
import * as THREE from "three";
import { useGLTF } from '@react-three/drei'

export function Model({ 
  url, 
  scale = [2, 2, 2], 
  position = [0, -1.4, 0], 
  rotation = [0, 0, 0] 
}: { 
  url: string;
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF(url)
  
  // Apply different default positions based on model type
  const defaultPosition = url.includes('woofer') ? [0, 20, 0] : position;
  
  return(
        <primitive
      object={scene}
      scale={scale}                 // 控制整体大小
      position={position || defaultPosition}           // 控制位置
      rotation={rotation}           // 控制旋转
    />
  )
}


// Background plane component to handle deselection
function BackgroundPlane({ onFaceSelect }: { onFaceSelect?: (faceId: string) => void }) {
  return (
    <mesh
      position={[0, 0, -10]}
      scale={[200, 200, 1]}
      onClick={(e) => {
        e.stopPropagation();
        console.log('Background clicked - deselecting face');
        onFaceSelect?.('');
      }}
    >
      <planeGeometry />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

export default function SPKR({ 
  speakerState, 
  onFaceSelect,
  hoveredFace
}: { 
  speakerState: { 
    rotation: number; 
    color: string;
    faceColors?: { [key: string]: string };
  };
  onFaceSelect?: (faceId: string) => void;
  hoveredFace?: string | null;
}) {
  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 45 }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
      style={{ height: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)" }}
    >
      {/* Interactive Background Effects */}
      {/* <SPKRBackground particleCount={1500} /> */}
      <EnergyOrbs />
      
      {/* Colorful fog effect */}
      <fog attach="fog" args={['#ff89b0ff', 20, 100]} />
      
      {/* Lighting */}
      <ambientLight intensity={1.8} color="#fff0f5" />
      <AudioLighting />
      <pointLight position={[10, 10, 10]} intensity={60} color="#ff6b9d" />
      <pointLight position={[-10, -5, -10]} intensity={40} color="#c471ed" />
      <pointLight position={[0, -10, 5]} intensity={50} color="#10dbffff" />
      
      {/* Background plane for deselection */}
      <BackgroundPlane onFaceSelect={onFaceSelect} />
      
      <FaceBox 
        rotation={speakerState.rotation} 
        color={speakerState.color}
        faceColors={speakerState.faceColors}
        onFaceSelect={onFaceSelect}
        hoveredFace={hoveredFace}
      />
      <Model 
        url="/concret.glb"
      />
      <Model 
        url="/woofer1.glb"
        scale={[3, 3, 3]}
        position={[0, 0, 0.35]} // Adjusted position for woofer
      />
      <OrbitControls
      enablePan={false} 
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI / 2-0.4}/>
      {/* <Environment preset="city" background /> */}
    </Canvas>
  );
}

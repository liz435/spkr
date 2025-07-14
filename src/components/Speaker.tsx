'use client'
import React from "react";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls,Environment, Fisheye  } from "@react-three/drei";
import  {FaceBox}  from "@/components/FaceBox";
import * as THREE from "three";
import { useGLTF } from '@react-three/drei'

export function Model({ url }: { url: string;}) {
  const { scene } = useGLTF(url)
  return(
        <primitive
      object={scene}
      scale={[2, 2, 2]}                 // 控制整体大小
      position={[0, -1.4, 0]}           // 控制位置
      rotation={[0, 0, 0]}        // 控制旋转（Y轴旋转180°）
    />
  )
}


export default function SPKR({ speakerState }: { speakerState: { rotation: number; color: string } }) {
  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 45 }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
      style={{ height: "100vh", background: "linear-gradient(to top, #1e3a8a, #1e40af, #1e3a8a, #0f172a)" }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={60} />
      <FaceBox rotation={speakerState.rotation} color={speakerState.color} />
      <Model url="/concret.glb"/>
      <OrbitControls />
      {/* <Environment preset="city" background /> */}
    </Canvas>
  );
}

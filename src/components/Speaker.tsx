'use client'
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls,Environment, Fisheye  } from "@react-three/drei";
import  {FaceBox}  from "@/components/FaceBox";
import * as THREE from "three";
import { useGLTF } from '@react-three/drei'

export function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return(
    <>
        <primitive
      object={scene}
      scale={[5, 5, 5]}           // 控制整体大小
      position={[0, -1.9, 0]}             // 控制位置
      rotation={[0, Math.PI, 0]}        // 控制旋转（Y轴旋转180°）
    />
    
    </>
  )
}


export default function SPKR() {
  return(
    <>
    <Canvas
      camera={{ position: [5, 5, 5], fov: 45 }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
      style={{ height: "100vh", background: "#111" }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={20} />
      <Model url="/concret.glb" />
      <FaceBox />
      <OrbitControls />


      <Environment preset="city" background />
    </Canvas>

    sss
    </>
  );
}

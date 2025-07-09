'use client'
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls,Environment, Fisheye  } from "@react-three/drei";
import  {FaceBox}  from "@/components/AcrylicSpeaker";
import * as THREE from "three";


export default function SPKR() {
  return(
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
                     
      <FaceBox />
      <OrbitControls />


      <Environment preset="city" background />
    </Canvas>
  );
}

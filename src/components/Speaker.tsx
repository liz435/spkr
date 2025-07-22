'use client'
import React from "react";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Fisheye } from "@react-three/drei";
import { FaceBox } from "@/components/FaceBox";
import { SPKRBackground, EnergyOrbs, AudioLighting } from "@/components/SPKRBackground";
import { SceneEnvironment, SceneLighting } from "@/components/SceneEnvironment";
import * as THREE from "three";
import { useGLTF } from '@react-three/drei'

export function Model({ 
  url, 
  scale = [2, 2, 2], 
  position = [0, -1.4, 0], 
  rotation = [0, 0, 0],
  materialType = "physical",
  renderingMode = "realistic"
}: { 
  url: string;
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  materialType?: string;
  renderingMode?: string;
}) {
  const { scene } = useGLTF(url)
  
  // Apply different default positions based on model type
  const defaultPosition = url.includes('woofer') ? [0, 20, 0] : position;
  
  // Apply material and rendering mode to all meshes in the scene
  React.useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Clone the original material to avoid modifying shared materials
        const originalMaterial = child.material as THREE.Material;
        
        if (renderingMode === "wireframe") {
          if (originalMaterial instanceof THREE.MeshStandardMaterial) {
            const wireframeMaterial = originalMaterial.clone();
            wireframeMaterial.wireframe = true;
            wireframeMaterial.transparent = true;
            wireframeMaterial.opacity = 0.7;
            child.material = wireframeMaterial;
          }
        } else if (renderingMode === "normals") {
          child.material = new THREE.MeshNormalMaterial();
        } else {
          // Apply material type
          if (materialType === "toon" && !(originalMaterial instanceof THREE.MeshToonMaterial)) {
            const toonMaterial = new THREE.MeshToonMaterial({
              color: (originalMaterial as any).color || 0xffffff,
              map: (originalMaterial as any).map
            });
            child.material = toonMaterial;
          } else if (materialType === "basic" && !(originalMaterial instanceof THREE.MeshBasicMaterial)) {
            const basicMaterial = new THREE.MeshBasicMaterial({
              color: (originalMaterial as any).color || 0xffffff,
              map: (originalMaterial as any).map
            });
            child.material = basicMaterial;
          }
        }
      }
    });
  }, [scene, materialType, renderingMode]);
  
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
  hoveredFace,
  faceBoxPosition = [-3, 0, 0],
  environmentMap = "city",
  materialType = "physical",
  renderingMode = "realistic",
  toneMappingExposure = 1.0,
  sceneType = "room",
  wallColor = "#f5f5f5",
  floorType = "wood",
  showObjects = { speaker: true, couch: true, woofer: true }
}: { 
  speakerState: { 
    rotation: number; 
    color: string;
    faceColors?: { [key: string]: string };
  };
  onFaceSelect?: (faceId: string) => void;
  hoveredFace?: string | null;
  faceBoxPosition?: [number, number, number];
  environmentMap?: string;
  materialType?: string;
  renderingMode?: string;
  toneMappingExposure?: number;
  sceneType?: string;
  wallColor?: string;
  floorType?: string;
  showObjects?: {
    speaker: boolean;
    couch: boolean;
    woofer: boolean;
  };
}) {
  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 45 }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        
        // Enable shadows for room scene
        if (sceneType === 'room') {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        
        // Set tone mapping based on material type
        if (materialType === "physical") {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
        } else if (materialType === "standard") {
          gl.toneMapping = THREE.LinearToneMapping;
        } else {
          gl.toneMapping = THREE.NoToneMapping;
        }
        
        gl.toneMappingExposure = toneMappingExposure;
        
        // Adjust rendering settings based on mode
        if (renderingMode === "wireframe") {
          gl.setClearColor(0x000000, 1);
        } else if (renderingMode === "normals") {
          gl.setClearColor(0x808080, 1);
        }
      }}
      style={{ 
        height: "100vh", 
        background: sceneType === 'abstract' ? 
          "linear-gradient(135deg, #1a1a1a 0%, #2d1b69 50%, #11998e 100%)" : 
          sceneType === 'outdoor' ?
          "linear-gradient(180deg, #87CEEB 0%, #98FB98 100%)" :
          "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)" 
      }}
    >
      {/* Scene Environment */}
      <SceneEnvironment 
        sceneType={sceneType as any}
        wallColor={wallColor}
        floorType={floorType as any}
        roomSize={[20, 8, 20]}
      />
      
      {/* Scene Lighting */}
      <SceneLighting sceneType={sceneType} />

      {/* Interactive Background Effects (only for abstract scene) */}
      {sceneType === 'abstract' && (
        <>
          <SPKRBackground particleCount={1500} />
          <EnergyOrbs />
        </>
      )}
      
      {/* Environment Mapping (only when not using room scene) */}
      {environmentMap !== "none" && sceneType !== 'room' && sceneType !== 'outdoor' && (
        <Environment preset={environmentMap as any} background={false} />
      )}

      
      {/* Background plane for deselection */}
      <BackgroundPlane />
      
      {/* Objects with visibility control */}
      {showObjects.speaker && (
        <FaceBox 
          rotation={speakerState.rotation} 
          color={speakerState.color}
          faceColors={speakerState.faceColors}
          onFaceSelect={onFaceSelect}
          hoveredFace={hoveredFace}
          position={faceBoxPosition}
          materialType={materialType}
          renderingMode={renderingMode}
        />
      )}
      
      {showObjects.couch && (
        <Model 
          url="/Couch.glb"
          scale={[0.1, 0.1, 0.1]}
          position={[3, -1.1, 0]}
          materialType={materialType}
          renderingMode={renderingMode}
        />
      )}
      
      {showObjects.woofer && (
        <Model 
          url="/woofer1.glb"
          scale={[3, 3, 3]}
          position={[-3, 0, 0.35]} // Adjusted position for woofer
          materialType={materialType}
          renderingMode={renderingMode}
        />
      )}
      <OrbitControls
      enablePan={false} 
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI / 2-0.4}/>
      {/* <Environment preset="city" background /> */}
    </Canvas>
  );
}

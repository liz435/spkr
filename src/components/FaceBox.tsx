import React, { useMemo } from "react";
import * as THREE from "three";
import { CSG } from "three-csg-ts";
import Face from "@/components/Face";
import { useSpring, a } from "@react-spring/three";

function createEdges(geometry: THREE.BufferGeometry) {
  return new THREE.EdgesGeometry(geometry);
}

export function FaceBox({ 
  rotation, 
  color, 
  faceColors, 
  onFaceSelect,
  hoveredFace,
  selectedFace,
  position = [0, 0, 0], // 新增position参数，默认为原点
  materialType = "physical",
  renderingMode = "realistic"
}: { 
  rotation: number; 
  color: string;
  faceColors?: { [key: string]: string };
  onFaceSelect?: (faceId: string) => void;
  hoveredFace?: string | null;
  selectedFace?: string | null;
  position?: [number, number, number];
  materialType?: string;
  renderingMode?: string;
}) {
  const size = 2;
  const thickness = 0.05; // 更薄的板材厚度

  // Smooth color transition using react-spring
  const spring = useSpring({
    color,
    config: { duration: 500 },
  });

  // Simple pass-through function for external face selection (from cards)
  const handleFaceSelect = (faceId: string) => {
    onFaceSelect?.(faceId);
  };

  const frontGeometry = useMemo(() => {
    const boxGeom = new THREE.BoxGeometry(1.9, 1.7, thickness);
    const holeGeom = new THREE.CylinderGeometry(0.35, 0.35, thickness + 0.01, 32);
    holeGeom.rotateX(Math.PI / 2);
    const boxMesh = new THREE.Mesh(boxGeom);
    const holeMesh = new THREE.Mesh(holeGeom);
    const bspResult = CSG.fromMesh(boxMesh).subtract(CSG.fromMesh(holeMesh));
    return CSG.toGeometry(bspResult, new THREE.Matrix4());
  }, []);

  const backGeometry = useMemo(() => {
    const boxGeom = new THREE.BoxGeometry(1.9, 1.7, thickness);
    const holeGeom = new THREE.CylinderGeometry(0.1, 0.1, thickness + 0.01, 32);
    holeGeom.rotateX(Math.PI / 2);
  
    // Move the hole along the X, Y, or Z axis
    holeGeom.translate(0.5, -0.5, 0); // Example: Move the hole 0.5 units along the X-axis
  
    const boxMesh = new THREE.Mesh(boxGeom);
    const holeMesh = new THREE.Mesh(holeGeom);
    const bspResult = CSG.fromMesh(boxMesh).subtract(CSG.fromMesh(holeMesh));
    return CSG.toGeometry(bspResult, new THREE.Matrix4());
  }, []);

  const sideGeometry = useMemo(() => new THREE.BoxGeometry(thickness, size, size), []);
  const topBottomGeometry = useMemo(() => new THREE.BoxGeometry(1.9, thickness, 2), []);

  // Cable geometries - two cables from speaker to bottom
  const cable1Geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.2, 0, 0),     // Start from speaker area
      new THREE.Vector3(0.2, -0.3, 0),  // Bend down
      new THREE.Vector3(0.2, -0.75, 0),  // Along the side
      new THREE.Vector3(0.1, -0.78, -0.4) // To bottom back
    ]);
    return new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
  }, []);

  const cable2Geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2, 0, 0),    // Start from speaker area (other side)
      new THREE.Vector3(-0.1, -0.3, 0), // Bend down
      new THREE.Vector3(-0.2, -0.75, 0), // Along the side
      new THREE.Vector3(-0.2, -0.78, -0.4) // To bottom back
    ]);
    return new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
  }, []);

  // Audio interface geometry - small box at the back
  const audioInterfaceGeometry = useMemo(() => {
    return new THREE.BoxGeometry(0.4, 0.15, 0.08);
  }, []);

  // Audio interface ports (small cylinders)
  const audioPortGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(0.015, 0.015, 0.05, 8);
  }, []);

  const faces = [
    { id: "front", geometry: frontGeometry, position: [0, 0.1, size / 2 - thickness/2] },
    { id: "back", geometry: backGeometry, position: [0, 0.1, -size / 2 + thickness/2] },
    { id: "left", geometry: sideGeometry, position: [-size / 2 + thickness/2, 0, 0] },
    { id: "right", geometry: sideGeometry, position: [size / 2 - thickness/2, 0, 0] },
    { id: "top", geometry: topBottomGeometry, position: [0, size / 2 - thickness/2, 0] },
    { id: "bottom", geometry: topBottomGeometry, position: [0, -size / 2 + thickness/2 +0.2, 0] },
  ];

  return (
    <group rotation={[0, rotation, 0]} position={position}>      
      {faces.map(({ id, geometry, position: facePosition }) => (
        <a.group key={id} position={facePosition as [number, number, number]}>
          <Face
            id={id}
            geometry={geometry}
            position={[0, 0, 0]}
            color={spring.color}
            selectedFace={selectedFace || null}
            onSelect={handleFaceSelect}
            faceColor={faceColors?.[id]}
            hoveredFace={hoveredFace}
            materialType={materialType}
            renderingMode={renderingMode}
          />
        </a.group>
      ))}
      
      {/* Cable 1 */}
      <mesh geometry={cable1Geometry} position={[-0.1, 0.1, 0.75]}>
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.1}
          roughness={0.8}
          emissive="#000000"
        />
      </mesh>
      
      {/* Cable 2 */}
      <mesh geometry={cable2Geometry} position={[0.1, 0.1, 0.75]}>
        <meshStandardMaterial 
          color="#2a2a2a" 
          metalness={0.1}
          roughness={0.8}
          emissive="#000000"
        />
      </mesh>
      
      {/* Audio Interface - positioned at the back */}
      <group position={[0, -0.6, -0.9]}>
        {/* Main interface body */}
        <mesh geometry={audioInterfaceGeometry}>
          <meshStandardMaterial 
            color="#303030" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        
        {/* Audio ports */}
        <mesh geometry={audioPortGeometry} position={[-0.12, 0, 0.05]} rotation={[0, 0, Math.PI/2]}>
          <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh geometry={audioPortGeometry} position={[0, 0, 0.05]} rotation={[0, 0, Math.PI/2]}>
          <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh geometry={audioPortGeometry} position={[0.12, 0, 0.05]} rotation={[0, 0, Math.PI/2]}>
          <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* LED indicator */}
        <mesh position={[0.15, 0.04, 0.045]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshStandardMaterial 
            color="#00ff00" 
            emissive="#004400"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </group>
  );
}
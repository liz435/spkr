import React, { useState, useMemo, useEffect } from "react";
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
  hoveredFace 
}: { 
  rotation: number; 
  color: string;
  faceColors?: { [key: string]: string };
  onFaceSelect?: (faceId: string) => void;
  hoveredFace?: string | null;
}) {
  const [selectedFace, setSelectedFace] = useState<string | null>(null);

  const size = 2;
  const thickness = 0.05; // 更薄的板材厚度

  // Smooth color transition using react-spring
  const spring = useSpring({
    color,
    config: { duration: 500 },
  });

  // Handle external deselection (when clicking outside)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if clicking on sidebar or other UI elements
      if (target.closest('aside') || target.closest('header') || target.closest('nav') || target.closest('button')) {
        return; // Don't deselect if clicking on UI elements
      }
      
      // Check if clicking on the canvas but not on a face
      if (target.tagName === 'CANVAS') {
        // Let the background plane handle canvas clicks
        return;
      }
      
      // If clicking completely outside the 3D area, deselect
      if (!target.closest('main') && selectedFace) {
        setSelectedFace(null);
        onFaceSelect?.('');
        console.log('Face deselected by clicking outside main area');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedFace, onFaceSelect]);

  const handleFaceSelect = (faceId: string) => {
    // If empty string is passed, deselect
    if (faceId === '') {
      setSelectedFace(null);
      onFaceSelect?.('');
      console.log('Face deselected');
      return;
    }
    
    // If the same face is clicked again, deselect it
    if (selectedFace === faceId) {
      setSelectedFace(null);
      onFaceSelect?.('');
      console.log(`Face ${faceId} deselected`);
    } else {
      setSelectedFace(faceId);
      onFaceSelect?.(faceId);
      console.log(`Selected face: ${faceId}`);
    }
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
    <group rotation={[0, rotation, 0]}>
      {/* Invisible bounding box for better click detection */}
      <mesh
        position={[0, 0, 0]}
        scale={[size + 0.2, size + 0.2, size + 0.2]}
        onClick={(e) => {
          e.stopPropagation();
          // Only deselect if clicking on the bounding box but not on a face
          if (selectedFace) {
            setSelectedFace(null);
            onFaceSelect?.('');
            console.log('Deselected by clicking bounding box');
          }
        }}
      >
        <boxGeometry />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {faces.map(({ id, geometry, position }) => (
        <a.group key={id} position={position as [number, number, number]}>
          <Face
            id={id}
            geometry={geometry}
            position={[0, 0, 0]}
            color={spring.color}
            selectedFace={selectedFace}
            onSelect={handleFaceSelect}
            faceColor={faceColors?.[id]}
            hoveredFace={hoveredFace}
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
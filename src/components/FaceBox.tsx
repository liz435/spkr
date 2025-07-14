import React, { useState, useMemo } from "react";
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
  onFaceSelect 
}: { 
  rotation: number; 
  color: string;
  faceColors?: { [key: string]: string };
  onFaceSelect?: (faceId: string) => void;
}) {
  const [selectedFace, setSelectedFace] = useState<string | null>(null);

  const size = 2;
  const thickness = 0.1;

  // Smooth color transition using react-spring
  const spring = useSpring({
    color,
    config: { duration: 500 },
  });

  const handleFaceSelect = (faceId: string) => {
    setSelectedFace(faceId);
    onFaceSelect?.(faceId);
    console.log(`Selected face: ${faceId}`);
  };

  const frontGeometry = useMemo(() => {
    const boxGeom = new THREE.BoxGeometry(1.9, 1.7, thickness);
    const holeGeom = new THREE.CylinderGeometry(0.3, 0.3, thickness + 0.01, 32);
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

  const faces = [
    { id: "front", geometry: frontGeometry, position: [0, 0.05, size / 2 - 0.05] },
    { id: "back", geometry: backGeometry, position: [0, 0.05, -size / 2 + 0.05] },
    { id: "left", geometry: sideGeometry, position: [-size / 2, 0, 0] },
    { id: "right", geometry: sideGeometry, position: [size / 2, 0, 0] },
    { id: "top", geometry: topBottomGeometry, position: [0, size / 2 - 0.05, 0] },
    { id: "bottom", geometry: topBottomGeometry, position: [0, -size / 2 + 0.15, 0] },
  ];

return (
    <group rotation={[0, rotation, 0]}>
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
          />
        </a.group>
      ))}
    </group>
  );

}
import React, { useState, useMemo } from "react";
import * as THREE from "three";
import { CSG } from "three-csg-ts";
import Face from "@/components/AcrylicSpeaker"; // 如果你放在同一目录，改成相对路径

function createEdges(geometry: THREE.BufferGeometry) {
    return new THREE.EdgesGeometry(geometry);
  }
  

export function FaceBox() {
  const [selectedFace, setSelectedFace] = useState<string | null>(null);

  const size = 2;
  const thickness = 0.1;

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
    const boxMesh = new THREE.Mesh(boxGeom);
    const holeMesh = new THREE.Mesh(holeGeom);
    const bspResult = CSG.fromMesh(boxMesh).subtract(CSG.fromMesh(holeMesh));
    return CSG.toGeometry(bspResult, new THREE.Matrix4());
  }, []);

  const sideGeometry = useMemo(() => new THREE.BoxGeometry(thickness, size, size), []);
  const topBottomGeometry = useMemo(() => new THREE.BoxGeometry(1.9, thickness, 2), []);

  const faces = [
    { id: "front", geometry: frontGeometry, position: [0, 0.05, size / 2 - 0.05], color: "red",edges: useMemo(() => createEdges(frontGeometry), [frontGeometry]), },
    { id: "back", geometry: backGeometry, position: [0, 0.05, -size / 2 + 0.05], color: "orange" },
    { id: "left", geometry: sideGeometry, position: [-size / 2, 0, 0], color: "orange" },
    { id: "right", geometry: sideGeometry, position: [size / 2, 0, 0], color: "orange" },
    { id: "top", geometry: topBottomGeometry, position: [0, size / 2 - 0.05, 0], color: "orange" },
    { id: "bottom", geometry: topBottomGeometry, position: [0, -size / 2 + 0.15, 0], color: "orange" },
  ];

  return (
    <group>
      {faces.map(({ id, geometry, position, color }) => (
        <Face
          key={id}
          id={id}
          geometry={geometry}
          position={position as [number, number, number]}
          color={color}
          selectedFace={selectedFace}
          onSelect={setSelectedFace}
        />
      ))}
    </group>
  );
}

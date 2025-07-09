import React, { useState, useMemo, useRef } from "react";
import * as THREE from "three";
import { CSG } from "three-csg-ts";

type FaceProps = {
  id: string;
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  selectedFace: string | null;
  onSelect: (id: string) => void;
};

function Face({
  id,
  geometry,
  position,
  rotation = [0, 0, 0],
  color,
  selectedFace,
  onSelect,
}: FaceProps) {
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      <meshPhysicalMaterial
        color={color}
        transmission={0.8}
        transparent
        opacity={1}
        roughness={0.05}
        metalness={0}
        ior={1.1}
        thickness={0.3}
        clearcoat={0.85}
        clearcoatRoughness={0.05}
      />
      {selectedFace === id && (
        <lineSegments geometry={edges}>
          <lineBasicMaterial color="yellow" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
}

export function FaceBox() {
  const [selectedFace, setSelectedFace] = useState<string | null>(null);

  const size = 2;
  const thickness = 0.1;

  // 带孔前面板几何体
  const frontGeometry = useMemo(() => {
    const boxGeom = new THREE.BoxGeometry(1.9, 1.7, thickness);
    const holeGeom = new THREE.CylinderGeometry(0.3, 0.3, thickness + 0.01, 32);
    holeGeom.rotateX(Math.PI / 2);
    const boxMesh = new THREE.Mesh(boxGeom);
    const holeMesh = new THREE.Mesh(holeGeom);
    const bspBox = CSG.fromMesh(boxMesh);
    const bspHole = CSG.fromMesh(holeMesh);
    const bspResult = bspBox.subtract(bspHole);
    return CSG.toGeometry(bspResult, new THREE.Matrix4());
  }, [thickness]);

  // 带孔后面板几何体
  const backGeometry = useMemo(() => {
    const boxGeom = new THREE.BoxGeometry(1.9, 1.7, thickness);
    const holeGeom = new THREE.CylinderGeometry(0.1, 0.1, thickness + 0.01, 32);
    holeGeom.rotateX(Math.PI / 2);
    const boxMesh = new THREE.Mesh(boxGeom);
    const holeMesh = new THREE.Mesh(holeGeom);
    const bspBox = CSG.fromMesh(boxMesh);
    const bspHole = CSG.fromMesh(holeMesh);
    const bspResult = bspBox.subtract(bspHole);
    return CSG.toGeometry(bspResult, new THREE.Matrix4());
  }, [thickness]);

  // 其它面的几何体直接BoxGeometry
  const sideGeometry = useMemo(() => new THREE.BoxGeometry(thickness, size, size), [thickness, size]);
  const topBottomGeometry = useMemo(() => new THREE.BoxGeometry(1.9, thickness, 2), [thickness]);

  // 配置所有面参数数组
  const faces = [
    {
      id: "front",
      geometry: frontGeometry,
      position: [0, 0.05, size / 2 - 0.05],
      rotation: [0, 0, 0],
      color: "red",
    },
    {
      id: "back",
      geometry: backGeometry,
      position: [0, 0.05, -size / 2 + 0.05],
      rotation: [0, 0, 0],
      color: "orange",
    },
    {
      id: "left",
      geometry: sideGeometry,
      position: [-size / 2, 0, 0],
      rotation: [0, 0, 0],
      color: "orange",
    },
    {
      id: "right",
      geometry: sideGeometry,
      position: [size / 2, 0, 0],
      rotation: [0, 0, 0],
      color: "orange",
    },
    {
      id: "top",
      geometry: topBottomGeometry,
      position: [0, size / 2 - 0.05, 0],
      rotation: [0, 0, 0],
      color: "orange",
    },
    {
      id: "bottom",
      geometry: topBottomGeometry,
      position: [0, -size / 2 + 0.15, 0],
      rotation: [0, 0, 0],
      color: "orange",
    },
  ];

  return (
    <group>
      {faces.map(({ id, geometry, position, rotation, color }) => (
        <Face
          key={id}
          id={id}
          geometry={geometry}
          position={position as [number, number, number]}
          rotation={rotation as [number, number, number]}
          color={color}
          selectedFace={selectedFace}
          onSelect={setSelectedFace}
        />
      ))}
    </group>
  );
}
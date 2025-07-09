import React, { useMemo, useState } from "react";
import * as THREE from "three";

type FaceProps = {
  id: string;
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  selectedFace: string | null;
  onSelect: (id: string) => void;
};

export const Face = React.memo(function Face({
  id,
  geometry,
  position,
  rotation = [0, 0, 0],
  color,
  selectedFace,
  onSelect,
}: FaceProps) {
  const [hovered, setHovered] = useState(false);

  const edges = useMemo(() => new THREE.EdgesGeometry(geometry.clone()), [geometry]);

  const isSelected = selectedFace === id;

  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        if (!isSelected) {
          onSelect(id);
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
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
      {(isSelected || hovered) && (
        <lineSegments geometry={edges}>
          <lineBasicMaterial color="yellow" />
        </lineSegments>
      )}
    </mesh>
  );
});

export default Face;

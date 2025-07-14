import React, { useMemo, useState } from "react";
import * as THREE from "three";
import { a } from "@react-spring/three"; // Import animated components

type FaceProps = {
  id: string;
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  rotation?: [number, number, number];
  color: any; // Accept SpringValue<string> or string
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
      {/* Use a.meshPhysicalMaterial for realistic transparency */}
      <a.meshPhysicalMaterial
        color={color} // Accept SpringValue<string> directly
        transmission={0.9} // Simulate glass-like transparency
        transparent
        opacity={0.8} // Adjust opacity for overlapping effect
        roughness={0.1} // Slight roughness for realism
        metalness={0}
        ior={1.5} // Index of refraction for acrylic
        thickness={0.2} // Simulate thickness of acrylic
        clearcoat={0.9} // Add a clear coat for shine
        clearcoatRoughness={0.05}
        blending={THREE.NormalBlending} // Enable blending for overlapping
      />
      {(isSelected) && (
        <lineSegments geometry={edges}>
          <lineBasicMaterial color="yellow" />
        </lineSegments>
      )}
    </mesh>
  );
});

export default Face;
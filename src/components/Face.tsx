import React, { useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";

type FaceProps = {
  id: string;
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  rotation?: [number, number, number];
  color: any;
  selectedFace: string | null;
  onSelect: (id: string) => void;
  faceColor?: string; // Individual face color
  hoveredFace?: string | null; // External hover state from sidebar
};

export const Face = React.memo(function Face({
  id,
  geometry,
  position,
  rotation = [0, 0, 0],
  color,
  selectedFace,
  onSelect,
  faceColor,
  hoveredFace,
}: FaceProps) {
  const [hovered, setHovered] = useState(false);

  // Create simple outline for face selection highlighting
  const outlineEdges = useMemo(() => {
    // Instead of using complex edge detection, create a simple wireframe outline
    // that represents the face boundary regardless of internal holes
    
    // Get the bounding box of the face geometry
    const bbox = new THREE.Box3().setFromBufferAttribute(
      geometry.attributes.position as THREE.BufferAttribute
    );
    
    const { min, max } = bbox;
    
    // Create a simple rectangular outline based on the bounding box
    const outlinePositions = [
      // Bottom edge
      min.x, min.y, min.z,  max.x, min.y, min.z,
      // Right edge
      max.x, min.y, min.z,  max.x, max.y, max.z,
      // Top edge  
      max.x, max.y, max.z,  min.x, max.y, max.z,
      // Left edge
      min.x, max.y, max.z,  min.x, min.y, min.z
    ];
    
    const outlineGeometry = new THREE.BufferGeometry();
    outlineGeometry.setAttribute(
      'position', 
      new THREE.Float32BufferAttribute(outlinePositions, 3)
    );
    
    return outlineGeometry;
  }, [geometry]);

  const isSelected = selectedFace === id;
  const isHoveredFromSidebar = hoveredFace === id;

  // Clear hover state when face is deselected
  useEffect(() => {
    if (selectedFace === null) {
      setHovered(false);
    }
  }, [selectedFace]);

  // Individual face color animation
  const { faceColorSpring } = useSpring({
    faceColorSpring: faceColor || color,
    config: { duration: 300 }
  });

  // Hover and selection effects - include sidebar hover
  const { scale, opacity } = useSpring({
    scale: isSelected ? 1.05 : (hovered || isHoveredFromSidebar) ? 1.02 : 1,
    opacity: (hovered || isHoveredFromSidebar) ? 0.9 : 0.8,
    config: { tension: 300, friction: 30 }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    console.log(`Face ${id} clicked`);
    onSelect(id);
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    if (!isSelected) {
      setHovered(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'default';
  };

  return (
    <a.group scale={scale}>
      <mesh
        geometry={geometry}
        position={position}
        rotation={rotation}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        // Improve click detection
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
      >
        <a.meshPhysicalMaterial
          color={faceColor ? faceColorSpring : color}
          transmission={1}            // 全透光
          transparent={true}
          opacity={1}                 // 设置为 1 因为 transmission 会控制透明度
          roughness={0.2}             // 更毛玻璃
          metalness={0}
          ior={1.5}                  // 更接近亚克力塑料
          thickness={0.5}             // 更厚折射效果更明显
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.5}
          blending={THREE.NormalBlending}
        />
        {isSelected && (
          <lineSegments geometry={outlineEdges}>
            <lineBasicMaterial color="#00ff00" linewidth={3} />
          </lineSegments>
        )}
        {hovered && !isSelected && (
          <lineSegments geometry={outlineEdges}>
            <lineBasicMaterial color="#ffff00" linewidth={2} opacity={0.7} transparent />
          </lineSegments>
        )}
        {isHoveredFromSidebar && !isSelected && !hovered && (
          <lineSegments geometry={outlineEdges}>
            <lineBasicMaterial color="#00aaff" linewidth={2} opacity={0.8} transparent />
          </lineSegments>
        )}
      </mesh>
    </a.group>
  );
});

export default Face;
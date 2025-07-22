import React, { useMemo } from "react";
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

  // Individual face color animation
  const { faceColorSpring } = useSpring({
    faceColorSpring: faceColor || color,
    config: { duration: 300 }
  });

  // Selection effects - only for external selection (from cards)
  const { scale, opacity } = useSpring({
    scale: isSelected ? 1.05 : isHoveredFromSidebar ? 1.02 : 1,
    opacity: isHoveredFromSidebar ? 0.9 : 0.8,
    config: { tension: 300, friction: 30 }
  });

  return (
    <a.group scale={scale}>
      <mesh
        geometry={geometry}
        position={position}
        rotation={rotation}
        // Remove all click and hover event handlers
      >
        <a.meshPhysicalMaterial
          color={faceColor ? faceColorSpring : color}
          transmission={0.7}          // 降低透射，让颜色更明显
          transparent={true}
          opacity={0.9}               // 稍微降低透明度，让重叠时后面颜色更明显
          roughness={0.2}             
          metalness={0}
          ior={1.2}                   // 稍微提高折射率
          thickness={0.8}             
          clearcoat={1.5}
          clearcoatRoughness={0.1}
          envMapIntensity={1.2}
          side={THREE.DoubleSide}     
          depthWrite={false}          // 不写入深度缓冲区，让重叠面都可见
          depthTest={true}            
          blending={THREE.AdditiveBlending}  // 使用加法混合，让重叠颜色叠加
          emissive={faceColor ? faceColorSpring : color}  // 添加发光效果
          emissiveIntensity={0.1}     // 轻微发光让后面的面更明显
        />
        {isSelected && (
          <lineSegments geometry={outlineEdges}>
            <lineBasicMaterial color="#00ff00" linewidth={3} />
          </lineSegments>
        )}
        {isHoveredFromSidebar && !isSelected && (
          <lineSegments geometry={outlineEdges}>
            <lineBasicMaterial color="#00aaff" linewidth={2} opacity={0.8} transparent />
          </lineSegments>
        )}
      </mesh>
    </a.group>
  );
});

export default Face;
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
  materialType?: string;
  renderingMode?: string;
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
  materialType = "physical",
  renderingMode = "realistic",
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
        {/* Material based on type */}
        {materialType === "physical" && (
          <a.meshPhysicalMaterial
            color={faceColor ? faceColorSpring : color}
            transmission={renderingMode === "wireframe" ? 0 : 0.9}
            transparent={true}
            opacity={renderingMode === "wireframe" ? 0.3 : 0.9}
            roughness={0.2}
            metalness={0}
            ior={1.05}
            thickness={0.1}
            emissiveIntensity={0.1}
            side={THREE.DoubleSide}
            depthWrite={false}
            depthTest={true}
            blending={THREE.SubtractiveBlending}
            attenuationColor={faceColor ? faceColorSpring : color}
            attenuationDistance={0.5}
            iridescence={0.3}
            iridescenceIOR={1.5}
            iridescenceThicknessRange={[100, 300]}
            wireframe={renderingMode === "wireframe"}
          />
        )}
        
        {materialType === "standard" && (
          <a.meshStandardMaterial
            color={faceColor ? faceColorSpring : color}
            transparent={renderingMode !== "wireframe"}
            opacity={renderingMode === "wireframe" ? 1 : 0.8}
            roughness={0.5}
            metalness={0.2}
            side={THREE.DoubleSide}
            wireframe={renderingMode === "wireframe"}
          />
        )}
        
        {materialType === "lambert" && (
          <a.meshLambertMaterial
            color={faceColor ? faceColorSpring : color}
            transparent={renderingMode !== "wireframe"}
            opacity={renderingMode === "wireframe" ? 1 : 0.7}
            side={THREE.DoubleSide}
            wireframe={renderingMode === "wireframe"}
          />
        )}
        
        {materialType === "phong" && (
          <a.meshPhongMaterial
            color={faceColor ? faceColorSpring : color}
            transparent={renderingMode !== "wireframe"}
            opacity={renderingMode === "wireframe" ? 1 : 0.8}
            shininess={100}
            side={THREE.DoubleSide}
            wireframe={renderingMode === "wireframe"}
          />
        )}
        
        {materialType === "toon" && (
          <a.meshToonMaterial
            color={faceColor ? faceColorSpring : color}
            transparent={renderingMode !== "wireframe"}
            opacity={renderingMode === "wireframe" ? 1 : 0.9}
            side={THREE.DoubleSide}
            wireframe={renderingMode === "wireframe"}
          />
        )}
        
        {materialType === "basic" && (
          <a.meshBasicMaterial
            color={faceColor ? faceColorSpring : color}
            transparent={renderingMode !== "wireframe"}
            opacity={renderingMode === "wireframe" ? 1 : 0.6}
            side={THREE.DoubleSide}
            wireframe={renderingMode === "wireframe"}
          />
        )}
        {isSelected && (
          <lineSegments geometry={outlineEdges}>
            <lineBasicMaterial color="#000000ff" linewidth={3} />
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
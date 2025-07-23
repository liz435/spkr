'use client'

import React, { useRef, useMemo } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { 
  EffectComposer, 
  RenderPass, 
  UnrealBloomPass
} from 'three-stdlib';
import * as THREE from 'three';

// Extend Three.js with post-processing passes
extend({ 
  EffectComposer, 
  RenderPass, 
  UnrealBloomPass
});

interface SimplePostProcessingProps {
  enabled?: boolean;
  materialType?: string;
  renderingMode?: string;
  toneMappingExposure?: number;
  bloomEnabled?: boolean;
  bloomStrength?: number;
  bloomRadius?: number;
  bloomThreshold?: number;
}

export function SimplePostProcessing({
  enabled = true,
  materialType = "physical",
  renderingMode = "realistic",
  toneMappingExposure = 1.0,
  bloomEnabled = true,
  bloomStrength = 0.3,
  bloomRadius = 0.4,
  bloomThreshold = 0.85,
}: SimplePostProcessingProps) {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef<EffectComposer | null>(null);

  // Initialize effect composer and passes
  useMemo(() => {
    if (!enabled || renderingMode === "wireframe") {
      composer.current = null;
      return;
    }

    try {
      // Create effect composer
      const effectComposer = new EffectComposer(gl);
      effectComposer.setSize(size.width, size.height);
      effectComposer.setPixelRatio(gl.getPixelRatio());

      // 1. Base render pass
      const renderPass = new RenderPass(scene, camera);
      effectComposer.addPass(renderPass);

      // 2. Bloom effect
      if (bloomEnabled) {
        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(size.width, size.height),
          bloomStrength,
          bloomRadius,
          bloomThreshold
        );
        
        // Adjust bloom based on material type
        if (materialType === "physical") {
          bloomPass.strength = bloomStrength * 0.8;
          bloomPass.threshold = bloomThreshold + 0.1;
        } else if (materialType === "basic" || materialType === "lambert") {
          bloomPass.strength = bloomStrength * 1.5;
          bloomPass.threshold = bloomThreshold - 0.2;
        }
        
        effectComposer.addPass(bloomPass);
      }

      // Make the last pass render to screen
      const passes = effectComposer.passes;
      if (passes.length > 0) {
        // Clear renderToScreen on all passes except the last one
        passes.forEach((pass, index) => {
          pass.renderToScreen = index === passes.length - 1;
        });
      }

      composer.current = effectComposer;
    } catch (error) {
      console.error('Error initializing post-processing:', error);
      composer.current = null;
    }
  }, [
    enabled,
    materialType,
    renderingMode,
    size.width,
    size.height,
    bloomEnabled,
    bloomStrength,
    bloomRadius,
    bloomThreshold
  ]);

  // Render with post-processing
  useFrame((state) => {
    if (!composer.current || !enabled || renderingMode === "wireframe") {
      return;
    }

    try {
      // Disable auto-rendering when post-processing is active
      state.gl.autoClear = false;
      composer.current.render();
    } catch (error) {
      console.warn('Post-processing render error:', error);
    }
  }, 1); // High priority to render last

  return null;
}

export default SimplePostProcessing;

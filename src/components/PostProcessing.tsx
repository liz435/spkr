'use client'

import React, { useRef, useMemo } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, RenderPass, UnrealBloomPass } from 'three-stdlib';
import * as THREE from 'three';

// Extend the EffectComposer components
extend({ EffectComposer, RenderPass, UnrealBloomPass });

interface PostProcessingProps {
  motionBlurEnabled: boolean;
  motionBlurStrength: number;
}

// Custom motion blur implementation using frame blending
export function MotionBlurEffect({ 
  motionBlurEnabled = true, 
  blurStrength = 0.5,
  samples = 4
}: { 
  motionBlurEnabled?: boolean;
  blurStrength?: number;
  samples?: number;
}) {
  const { gl, scene, camera, size } = useThree();
  
  // Store previous frames for temporal blending
  const frameHistory = useRef<THREE.WebGLRenderTarget[]>([]);
  const currentFrameIndex = useRef(0);
  const composer = useRef<EffectComposer | null>(null);
  const prevCameraPosition = useRef(new THREE.Vector3());
  const prevCameraRotation = useRef(new THREE.Euler());
  const cameraVelocity = useRef(0);

  // Initialize effect composer and frame buffers
  useMemo(() => {
    if (!motionBlurEnabled) return;

    // Initialize frame history buffers
    frameHistory.current = [];
    for (let i = 0; i < samples; i++) {
      frameHistory.current.push(new THREE.WebGLRenderTarget(size.width, size.height, {
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
      }));
    }

    // Create effect composer
    const effectComposer = new EffectComposer(gl);
    effectComposer.setSize(size.width, size.height);

    // Add render pass
    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);

    // Custom motion blur shader
    const motionBlurShader = {
      uniforms: {
        'tDiffuse': { value: null },
        'tPrev1': { value: null },
        'tPrev2': { value: null },
        'tPrev3': { value: null },
        'blurStrength': { value: blurStrength },
        'cameraVelocity': { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D tPrev1;
        uniform sampler2D tPrev2;
        uniform sampler2D tPrev3;
        uniform float blurStrength;
        uniform float cameraVelocity;
        varying vec2 vUv;

        void main() {
          vec4 current = texture2D(tDiffuse, vUv);
          
          if (cameraVelocity < 0.01) {
            gl_FragColor = current;
            return;
          }
          
          vec4 prev1 = texture2D(tPrev1, vUv);
          vec4 prev2 = texture2D(tPrev2, vUv);
          vec4 prev3 = texture2D(tPrev3, vUv);
          
          float strength = min(cameraVelocity * blurStrength, 1.0);
          
          vec4 blurred = current * 0.4;
          blurred += prev1 * 0.3 * strength;
          blurred += prev2 * 0.2 * strength;
          blurred += prev3 * 0.1 * strength;
          
          gl_FragColor = mix(current, blurred, strength);
        }
      `
    };

    const motionBlurPass = new (THREE as any).ShaderPass(motionBlurShader);
    motionBlurPass.renderToScreen = true;
    effectComposer.addPass(motionBlurPass);

    composer.current = effectComposer;

    // Store initial camera state
    prevCameraPosition.current.copy(camera.position);
    prevCameraRotation.current.copy(camera.rotation);
  }, [gl, scene, camera, size, motionBlurEnabled, blurStrength, samples]);

  useFrame((state, delta) => {
    if (!motionBlurEnabled || !composer.current) {
      return;
    }

    // Calculate camera velocity
    const currentPos = camera.position.clone();
    const currentRot = camera.rotation.clone();
    
    const posVelocity = currentPos.distanceTo(prevCameraPosition.current);
    const rotVelocity = Math.abs(currentRot.x - prevCameraRotation.current.x) + 
                       Math.abs(currentRot.y - prevCameraRotation.current.y) + 
                       Math.abs(currentRot.z - prevCameraRotation.current.z);
    
    cameraVelocity.current = (posVelocity + rotVelocity) * 10; // Scale for better effect

    // Update previous frame textures
    const passes = composer.current.passes;
    const motionPass = passes[passes.length - 1];
    
    if (motionPass && (motionPass as any).uniforms) {
      const uniforms = (motionPass as any).uniforms;
      uniforms.cameraVelocity.value = cameraVelocity.current;
      
      // Rotate frame history
      if (frameHistory.current.length >= 3) {
        uniforms.tPrev3.value = frameHistory.current[2]?.texture;
        uniforms.tPrev2.value = frameHistory.current[1]?.texture;
        uniforms.tPrev1.value = frameHistory.current[0]?.texture;
      }
    }

    // Render current frame to history buffer
    const currentBuffer = frameHistory.current[currentFrameIndex.current % samples];
    if (currentBuffer) {
      gl.setRenderTarget(currentBuffer);
      gl.render(scene, camera);
      gl.setRenderTarget(null);
      currentFrameIndex.current++;
    }

    // Render with motion blur
    composer.current.render();

    // Store current camera state for next frame
    prevCameraPosition.current.copy(currentPos);
    prevCameraRotation.current.copy(currentRot);
  }, 1);

  return null;
}

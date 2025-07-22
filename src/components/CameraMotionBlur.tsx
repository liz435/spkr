'use client'

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Per-Object Motion Blur based on John Chapman's technique
// https://john-chapman-graphics.blogspot.com/2013/01/per-object-motion-blur.html
export function PerObjectMotionBlur({ 
  enabled = true,
  strength = 1.0,
  maxSamples = 32,
  targetFps = 60
}: {
  enabled?: boolean;
  strength?: number;
  maxSamples?: number;
  targetFps?: number;
}) {
  const { camera, gl, scene, size, clock } = useThree();
  const composerRef = useRef<any>(null);
  
  // Store previous camera matrix for velocity calculation
  const prevCameraMatrix = useRef<THREE.Matrix4>(new THREE.Matrix4());
  const prevProjectionMatrix = useRef<THREE.Matrix4>(new THREE.Matrix4());
  const isFirstFrame = useRef(true);
  const frameTime = useRef(0);
  
  // Velocity buffer render target
  const velocityTarget = useMemo(() => {
    return new THREE.WebGLRenderTarget(size.width, size.height, {
      format: THREE.RGFormat, // Only need RG for 2D velocity
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
      depthBuffer: true
    });
  }, [size]);

  // Velocity shader for rendering velocity buffer
  const velocityShader = useMemo(() => ({
    uniforms: {
      modelViewProjectionMatrix: { value: new THREE.Matrix4() },
      prevModelViewProjectionMatrix: { value: new THREE.Matrix4() }
    },
    vertexShader: `
      uniform mat4 modelViewProjectionMatrix;
      uniform mat4 prevModelViewProjectionMatrix;
      
      varying vec4 vPosition;
      varying vec4 vPrevPosition;
      
      void main() {
        vPosition = modelViewProjectionMatrix * vec4(position, 1.0);
        vPrevPosition = prevModelViewProjectionMatrix * vec4(position, 1.0);
        gl_Position = vPosition;
      }
    `,
    fragmentShader: `
      varying vec4 vPosition;
      varying vec4 vPrevPosition;
      
      void main() {
        // Convert to screen space coordinates
        vec2 a = (vPosition.xy / vPosition.w) * 0.5 + 0.5;
        vec2 b = (vPrevPosition.xy / vPrevPosition.w) * 0.5 + 0.5;
        
        // Calculate velocity in screen space
        vec2 velocity = a - b;
        
        // Apply precision enhancement for low precision formats
        // Using power function to redistribute precision
        velocity = velocity * 0.5 + 0.5; // Scale to [0,1]
        velocity = pow(abs(velocity), vec2(1.0/3.0)) * sign(velocity); // Enhance precision
        
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `
  }), []);

  // Motion blur post-process shader
  const motionBlurShader = useMemo(() => ({
    uniforms: {
      tDiffuse: { value: null },
      tVelocity: { value: null },
      velocityScale: { value: strength },
      maxSamples: { value: maxSamples },
      texelSize: { value: new THREE.Vector2(1.0 / size.width, 1.0 / size.height) }
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
      uniform sampler2D tVelocity;
      uniform float velocityScale;
      uniform float maxSamples;
      uniform vec2 texelSize;
      
      varying vec2 vUv;
      
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        
        // Read velocity from velocity buffer
        vec2 velocity = texture2D(tVelocity, vUv).rg;
        
        // Undo precision enhancement
        velocity = pow(abs(velocity), vec3(3.0)) * sign(velocity);
        velocity = velocity * 2.0 - 1.0; // Scale back to [-1,1]
        
        // Apply velocity scale (framerate compensation)
        velocity *= velocityScale;
        
        // Calculate number of samples based on velocity magnitude
        float speed = length(velocity / texelSize);
        int nSamples = clamp(int(speed), 1, int(maxSamples));
        
        // Early exit for very small velocities
        if (speed < 0.5) {
          gl_FragColor = color;
          return;
        }
        
        // Perform centered sampling for motion blur
        vec4 result = color;
        
        for (int i = 1; i < int(maxSamples); ++i) {
          if (i >= nSamples) break;
          
          // Sample offset centered around current position
          vec2 offset = velocity * (float(i) / float(nSamples - 1) - 0.5);
          
          // Sample with bounds checking
          vec2 sampleUV = vUv + offset;
          if (sampleUV.x >= 0.0 && sampleUV.x <= 1.0 && 
              sampleUV.y >= 0.0 && sampleUV.y <= 1.0) {
            result += texture2D(tDiffuse, sampleUV);
          } else {
            // Use current color for out-of-bounds samples
            result += color;
          }
        }
        
        result /= float(nSamples);
        gl_FragColor = result;
      }
    `
  }), [size, maxSamples]);

  // Setup effect composer
  useEffect(() => {
    if (!enabled) return;

    const setupComposer = async () => {
      try {
        const { EffectComposer, RenderPass, ShaderPass } = await import('three-stdlib');
        
        const composer = new EffectComposer(gl);
        composer.setSize(size.width, size.height);
        
        // Main render pass
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        
        // Motion blur pass
        const motionPass = new ShaderPass(motionBlurShader);
        motionPass.uniforms.tVelocity.value = velocityTarget.texture;
        motionPass.renderToScreen = true;
        composer.addPass(motionPass);
        
        composerRef.current = composer;
        
        console.log('🎬 Per-Object Motion Blur initialized (John Chapman method)');
      } catch (error) {
        console.error('❌ Failed to setup motion blur:', error);
      }
    };

    setupComposer();
    
    return () => {
      if (composerRef.current) {
        composerRef.current.dispose();
      }
    };
  }, [enabled, gl, scene, camera, size, motionBlurShader, velocityTarget]);

  useFrame((state, delta) => {
    if (!enabled || !composerRef.current) return;

    const currentTime = clock.elapsedTime;
    
    // Calculate framerate-based velocity scale
    const currentFps = delta > 0 ? 1 / delta : 60;
    const velocityScale = (currentFps / targetFps) * strength;

    try {
      // Get current camera matrices
      const currentViewMatrix = camera.matrixWorldInverse.clone();
      const currentProjectionMatrix = camera.projectionMatrix.clone();
      const currentMVP = new THREE.Matrix4()
        .multiplyMatrices(currentProjectionMatrix, currentViewMatrix);

      if (!isFirstFrame.current) {
        // 1. Render velocity buffer
        renderVelocityBuffer(currentMVP, prevCameraMatrix.current);
        
        // 2. Update motion blur uniforms
        const passes = composerRef.current.passes;
        if (passes && passes.length > 1) {
          const motionPass = passes[1];
          if (motionPass.uniforms) {
            motionPass.uniforms.velocityScale.value = velocityScale;
            motionPass.uniforms.tVelocity.value = velocityTarget.texture;
          }
        }
        
        // 3. Render with motion blur
        composerRef.current.render();
        
        // Debug output for high motion
        if (velocityScale > 2.0) {
          console.log(`🔥 High velocity detected: ${velocityScale.toFixed(2)}x, FPS: ${currentFps.toFixed(1)}`);
        }
      } else {
        isFirstFrame.current = false;
        console.log('🎬 Per-Object Motion Blur: First frame initialized');
      }
      
      // Store matrices for next frame
      prevCameraMatrix.current.copy(currentMVP);
      prevProjectionMatrix.current.copy(currentProjectionMatrix);
      frameTime.current = currentTime;
      
    } catch (error) {
      console.error('❌ Motion Blur render error:', error);
    }
  });

  // Function to render velocity buffer
  const renderVelocityBuffer = (currentMVP: THREE.Matrix4, prevMVP: THREE.Matrix4) => {
    // Save current render target
    const originalTarget = gl.getRenderTarget();
    
    // Render to velocity buffer
    gl.setRenderTarget(velocityTarget);
    gl.clear();
    
    // Update velocity shader uniforms
    velocityShader.uniforms.modelViewProjectionMatrix.value = currentMVP;
    velocityShader.uniforms.prevModelViewProjectionMatrix.value = prevMVP;
    
    // Render scene with velocity shader (simplified - in real implementation 
    // you'd need to apply this material to all objects)
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        // Store original material
        const originalMaterial = object.material;
        
        // Apply velocity material temporarily
        object.material = new THREE.ShaderMaterial(velocityShader);
        
        // Render object
        gl.render(object, camera);
        
        // Restore original material
        object.material = originalMaterial;
      }
    });
    
    // Restore original render target
    gl.setRenderTarget(originalTarget);
  };

  // Log state changes
  useEffect(() => {
    console.log(`🔄 Per-Object Motion Blur: ${enabled ? 'ENABLED' : 'DISABLED'}, Strength: ${strength}, Target FPS: ${targetFps}`);
  }, [enabled, strength, targetFps]);

  return null; // This component handles rendering internally
}

// Alias for compatibility
export function SimpleMotionBlur(props: any) {
  return <PerObjectMotionBlur {...props} />;
}

// Extreme version with higher defaults
export function ExtremeMotionBlur(props: any) {
  return (
    <PerObjectMotionBlur 
      strength={props.strength * 2}
      maxSamples={64}
      targetFps={30} // Lower target FPS = more blur
      {...props} 
    />
  );
}

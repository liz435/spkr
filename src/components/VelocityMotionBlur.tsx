'use client'

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// John Chapman's Per-Object Motion Blur implementation
// Velocity Buffer based motion blur for scene transitions
export function ExtremeMotionBlur({
  enabled = true,
  intensity = 1.0,
  pattern = 'all',
  sceneTransition = false
}: {
  enabled?: boolean;
  intensity?: number;
  pattern?: 'radial' | 'directional' | 'zoom' | 'all';
  sceneTransition?: boolean;
}) {
  const { camera, gl, scene, size } = useThree();
  const composerRef = useRef<any>(null);
  
  // Velocity buffer for per-object motion blur
  const velocityTarget = useMemo(() => new THREE.WebGLRenderTarget(size.width, size.height, {
    format: THREE.RGFormat,
    type: THREE.FloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter
  }), [size]);
  
  const sceneTarget = useMemo(() => new THREE.WebGLRenderTarget(size.width, size.height), [size]);
  
  // Previous frame matrices for velocity calculation
  const prevViewMatrix = useRef<THREE.Matrix4>(new THREE.Matrix4());
  const prevProjectionMatrix = useRef<THREE.Matrix4>(new THREE.Matrix4());
  const isFirstFrame = useRef(true);
  
  // Scene transition tracking
  const transitionStartTime = useRef(0);
  const transitionDuration = 2000; // 2 seconds

  // Velocity shader for rendering velocity buffer
  const velocityShader = useMemo(() => ({
    uniforms: {
      currentMVP: { value: new THREE.Matrix4() },
      previousMVP: { value: new THREE.Matrix4() },
      texelSize: { value: new THREE.Vector2(1.0 / size.width, 1.0 / size.height) }
    },
    vertexShader: `
      uniform mat4 currentMVP;
      uniform mat4 previousMVP;
      
      varying vec4 vCurrentPos;
      varying vec4 vPreviousPos;
      
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        
        vCurrentPos = currentMVP * worldPos;
        vPreviousPos = previousMVP * worldPos;
        
        gl_Position = vCurrentPos;
      }
    `,
    fragmentShader: `
      uniform vec2 texelSize;
      varying vec4 vCurrentPos;
      varying vec4 vPreviousPos;
      
      void main() {
        // Convert to screen space
        vec2 current = (vCurrentPos.xy / vCurrentPos.w) * 0.5 + 0.5;
        vec2 previous = (vPreviousPos.xy / vPreviousPos.w) * 0.5 + 0.5;
        
        // Calculate screen-space velocity
        vec2 velocity = current - previous;
        
        // Encode velocity with precision enhancement
        velocity = velocity * 0.5 + 0.5; // Map to [0,1]
        
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `
  }), [size]);

  // Extreme motion blur shader with multiple patterns
  const motionBlurShader = useMemo(() => ({
    uniforms: {
      tDiffuse: { value: null },
      tVelocity: { value: null },
      intensity: { value: intensity },
      pattern: { value: pattern === 'radial' ? 0 : pattern === 'directional' ? 1 : pattern === 'zoom' ? 2 : 3 },
      sceneTransition: { value: sceneTransition ? 1.0 : 0.0 },
      time: { value: 0 },
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
      uniform float intensity;
      uniform int pattern;
      uniform float sceneTransition;
      uniform float time;
      uniform vec2 texelSize;
      
      varying vec2 vUv;
      
      #define MAX_SAMPLES 64
      
      // Chromatic aberration for extreme effect
      vec3 chromaticAberration(sampler2D tex, vec2 uv, vec2 direction, float strength) {
        float r = texture2D(tex, uv + direction * strength * 0.003).r;
        float g = texture2D(tex, uv).g;
        float b = texture2D(tex, uv - direction * strength * 0.003).b;
        return vec3(r, g, b);
      }
      
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        
        // Read velocity from buffer
        vec2 velocity = texture2D(tVelocity, vUv).rg;
        velocity = (velocity - 0.5) * 2.0; // Decode from [0,1] to [-1,1]
        
        // Apply extreme intensity
        float finalIntensity = intensity * (1.0 + sceneTransition * 3.0);
        velocity *= finalIntensity;
        
        // Calculate blur direction based on pattern
        vec2 blurDir = velocity;
        vec2 center = vec2(0.5, 0.5);
        
        if (pattern == 0) { // Radial
          blurDir = normalize(vUv - center) * length(velocity) * 0.5;
        } else if (pattern == 1) { // Directional
          blurDir = vec2(velocity.x, 0.0);
        } else if (pattern == 2) { // Zoom
          blurDir = (vUv - center) * length(velocity) * 0.3;
        }
        // pattern == 3: All combined
        
        // Adaptive sampling based on velocity magnitude
        float speed = length(blurDir / texelSize);
        int samples = clamp(int(speed * 2.0), 4, MAX_SAMPLES);
        
        // Early exit for minimal blur
        if (speed < 0.1 && sceneTransition < 0.1) {
          gl_FragColor = color;
          return;
        }
        
        vec4 result = vec4(0.0);
        float totalWeight = 0.0;
        
        // High-quality sampling with weights
        for (int i = 0; i < MAX_SAMPLES; i++) {
          if (i >= samples) break;
          
          float t = float(i) / float(samples - 1) - 0.5;
          vec2 sampleUV = vUv + blurDir * t;
          
          // Bounds check
          if (sampleUV.x >= 0.0 && sampleUV.x <= 1.0 && 
              sampleUV.y >= 0.0 && sampleUV.y <= 1.0) {
            
            float weight = 1.0 - abs(t);
            
            if (finalIntensity > 2.0) {
              // Extreme mode: chromatic aberration
              vec3 chromatic = chromaticAberration(tDiffuse, sampleUV, normalize(blurDir), finalIntensity);
              result += vec4(chromatic, 1.0) * weight;
            } else {
              result += texture2D(tDiffuse, sampleUV) * weight;
            }
            
            totalWeight += weight;
          }
        }
        
        if (totalWeight > 0.0) {
          result /= totalWeight;
        } else {
          result = color;
        }
        
        // Scene transition effect - additional distortion
        if (sceneTransition > 0.5) {
          float distort = sin(time * 10.0 + vUv.x * 20.0) * 0.01 * sceneTransition;
          vec2 distortUV = vUv + vec2(distort, 0.0);
          vec4 distortColor = texture2D(tDiffuse, distortUV);
          result = mix(result, distortColor, 0.3);
        }
        
        gl_FragColor = result;
      }
    `
  }), [intensity, pattern, size]);

  // Setup effect composer with velocity buffer
  useEffect(() => {
    if (!enabled) return;

    const setupComposer = async () => {
      try {
        const { EffectComposer, RenderPass, ShaderPass } = await import('three-stdlib');
        
        const composer = new EffectComposer(gl);
        composer.setSize(size.width, size.height);
        
        // Main scene render
        const renderPass = new RenderPass(scene, camera);
        renderPass.renderToScreen = false;
        composer.addPass(renderPass);
        
        // Motion blur pass
        const motionPass = new ShaderPass(motionBlurShader);
        motionPass.uniforms.tVelocity.value = velocityTarget.texture;
        motionPass.renderToScreen = true;
        composer.addPass(motionPass);
        
        composerRef.current = composer;
        
        console.log('🔥 EXTREME Motion Blur initialized with Velocity Buffer');
      } catch (error) {
        console.error('❌ Failed to setup extreme motion blur:', error);
      }
    };

    setupComposer();
    
    return () => {
      if (composerRef.current) {
        composerRef.current.dispose();
      }
      velocityTarget.dispose();
      sceneTarget.dispose();
    };
  }, [enabled, gl, scene, camera, size, motionBlurShader, velocityTarget, sceneTarget]);

  // Track scene transitions
  useEffect(() => {
    if (sceneTransition) {
      transitionStartTime.current = Date.now();
      console.log('🌪️ EXTREME Motion Blur: Scene transition started!');
    }
  }, [sceneTransition]);

  useFrame((state, delta) => {
    if (!enabled || !composerRef.current) return;

    try {
      const currentTime = state.clock.elapsedTime;
      
      // Calculate current view-projection matrices
      camera.updateMatrixWorld();
      const currentView = camera.matrixWorldInverse.clone();
      const currentProjection = camera.projectionMatrix.clone();
      const currentMVP = new THREE.Matrix4().multiplyMatrices(currentProjection, currentView);
      
      if (!isFirstFrame.current) {
        // Render velocity buffer
        renderVelocityBuffer(currentMVP, prevViewMatrix.current, prevProjectionMatrix.current);
        
        // Calculate transition progress
        const transitionProgress = sceneTransition ? 
          Math.min((Date.now() - transitionStartTime.current) / transitionDuration, 1.0) : 0.0;
        
        // Update motion blur uniforms
        const passes = composerRef.current.passes;
        if (passes && passes.length > 1) {
          const motionPass = passes[1];
          if (motionPass.uniforms) {
            motionPass.uniforms.intensity.value = intensity * (1.0 + transitionProgress * 2.0);
            motionPass.uniforms.sceneTransition.value = sceneTransition ? 1.0 : 0.0;
            motionPass.uniforms.time.value = currentTime;
            motionPass.uniforms.tVelocity.value = velocityTarget.texture;
          }
        }
        
        // Render with extreme motion blur
        composerRef.current.render();
        
        // Debug extreme motion
        if (intensity > 1.5) {
          console.log(`🔥 EXTREME BLUR: ${intensity.toFixed(2)}x, Pattern: ${pattern}, Transition: ${sceneTransition}`);
        }
      } else {
        isFirstFrame.current = false;
      }
      
      // Store matrices for next frame
      prevViewMatrix.current.copy(currentView);
      prevProjectionMatrix.current.copy(currentProjection);
      
    } catch (error) {
      console.error('❌ Extreme Motion Blur error:', error);
    }
  });

  // Render velocity buffer
  const renderVelocityBuffer = (currentMVP: THREE.Matrix4, prevView: THREE.Matrix4, prevProjection: THREE.Matrix4) => {
    const originalTarget = gl.getRenderTarget();
    
    gl.setRenderTarget(velocityTarget);
    gl.clear();
    
    // Update velocity shader uniforms
    velocityShader.uniforms.currentMVP.value = currentMVP;
    velocityShader.uniforms.previousMVP.value = new THREE.Matrix4().multiplyMatrices(prevProjection, prevView);
    
    // Apply velocity material to scene objects
    const velocityMaterial = new THREE.ShaderMaterial(velocityShader);
    
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.visible) {
        const originalMaterial = object.material;
        object.material = velocityMaterial;
        
        // Update object matrices
        object.updateMatrixWorld();
        velocityMaterial.uniforms.currentMVP.value = new THREE.Matrix4()
          .multiplyMatrices(currentMVP, object.matrixWorld);
        velocityMaterial.uniforms.previousMVP.value = new THREE.Matrix4()
          .multiplyMatrices(new THREE.Matrix4().multiplyMatrices(prevProjection, prevView), object.matrixWorld);
        
        gl.render(object, camera);
        object.material = originalMaterial;
      }
    });
    
    gl.setRenderTarget(originalTarget);
  };

  // Log configuration changes
  useEffect(() => {
    console.log(`🔥 EXTREME Motion Blur: ${enabled ? 'ACTIVE' : 'OFF'}, Intensity: ${intensity}x, Pattern: ${pattern.toUpperCase()}`);
  }, [enabled, intensity, pattern]);

  return null;
}

// Export the VelocityMotionBlur component
export { ExtremeMotionBlur as VelocityMotionBlur };

'use client'

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Effects } from '@react-three/drei';
import * as THREE from 'three';

// Extreme motion blur for dramatic scene transitions
export function ExtremeMotionBlur({ 
  enabled = true,
  intensity = 2.0,
  samples = 32,
  sceneTransition = false // Trigger for scene transitions
}: {
  enabled?: boolean;
  intensity?: number;
  samples?: number;
  sceneTransition?: boolean;
}) {
  const { camera } = useThree();
  
  // Track camera movement with extreme sensitivity
  const prevPosition = useRef(new THREE.Vector3());
  const prevRotation = useRef(new THREE.Euler());
  const velocity = useRef(0);
  const transitionBlur = useRef(0);
  const isFirstFrame = useRef(true);

  // Extreme motion blur shader with multiple effects
  const extremeBlurShader = useMemo(() => ({
    uniforms: {
      tDiffuse: { value: null },
      intensity: { value: intensity },
      velocity: { value: 0 },
      transitionBlur: { value: 0 },
      time: { value: 0 },
      samples: { value: samples }
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
      uniform float intensity;
      uniform float velocity;
      uniform float transitionBlur;
      uniform float time;
      uniform float samples;
      varying vec2 vUv;

      // Random function for noise
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        
        // Extreme blur amount - much higher than normal
        float totalBlur = max(velocity * intensity * 2.0, transitionBlur * 5.0);
        
        // Always apply significant blur for dramatic effect
        totalBlur = max(totalBlur, intensity * 0.5);
        
        if (totalBlur < 0.1) {
          gl_FragColor = color;
          return;
        }
        
        vec4 sum = color;
        float actualSamples = min(samples, 64.0);
        
        // Multiple blur patterns combined
        vec2 center = vec2(0.5, 0.5);
        vec2 toCenter = vUv - center;
        float dist = length(toCenter);
        
        // 1. Radial blur (camera rotation)
        for (float i = 1.0; i <= actualSamples * 0.3; i++) {
          float angle = (i / (actualSamples * 0.3)) * 6.28318;
          vec2 offset = vec2(cos(angle), sin(angle)) * totalBlur * 0.1;
          sum += texture2D(tDiffuse, vUv + offset);
        }
        
        // 2. Directional blur (camera movement)
        vec2 direction = normalize(toCenter);
        for (float i = 1.0; i <= actualSamples * 0.3; i++) {
          float factor = (i / (actualSamples * 0.3)) * totalBlur * 0.08;
          sum += texture2D(tDiffuse, vUv + direction * factor);
          sum += texture2D(tDiffuse, vUv - direction * factor);
        }
        
        // 3. Zoom blur (dramatic effect)
        for (float i = 1.0; i <= actualSamples * 0.4; i++) {
          float factor = (i / (actualSamples * 0.4)) * totalBlur * 0.05;
          vec2 zoomOffset = toCenter * factor;
          sum += texture2D(tDiffuse, vUv + zoomOffset);
        }
        
        // Normalize
        sum /= (actualSamples + 1.0);
        
        // Add chromatic aberration for extra dramatic effect
        float chromaticStrength = totalBlur * 0.02;
        vec2 chromaticOffset = toCenter * chromaticStrength;
        
        vec4 r = texture2D(tDiffuse, vUv + chromaticOffset);
        vec4 b = texture2D(tDiffuse, vUv - chromaticOffset);
        vec4 chromatic = vec4(r.r, sum.g, b.b, sum.a);
        
        // Extreme mixing - very noticeable effect
        float mixFactor = min(totalBlur, 0.95);
        vec4 result = mix(color, sum, mixFactor);
        
        // Add chromatic aberration
        result = mix(result, chromatic, min(totalBlur * 0.3, 0.5));
        
        // Add slight desaturation for cinematic effect
        float gray = dot(result.rgb, vec3(0.299, 0.587, 0.114));
        result.rgb = mix(result.rgb, vec3(gray), min(totalBlur * 0.2, 0.3));
        
        gl_FragColor = result;
      }
    `
  }), [intensity, samples]);

  // Handle scene transition trigger
  useEffect(() => {
    if (sceneTransition) {
      // Trigger massive blur for scene transition
      transitionBlur.current = 3.0;
      console.log('🎬 EXTREME: Scene transition blur activated!');
      
      // Fade out the transition blur over time
      const fadeOut = setInterval(() => {
        transitionBlur.current *= 0.9;
        if (transitionBlur.current < 0.1) {
          transitionBlur.current = 0;
          clearInterval(fadeOut);
          console.log('🎬 Scene transition blur complete');
        }
      }, 50);
      
      return () => clearInterval(fadeOut);
    }
  }, [sceneTransition]);

  useFrame((state) => {
    if (!enabled) return;

    // Extremely sensitive camera tracking
    if (!isFirstFrame.current) {
      const currentPos = camera.position.clone();
      const currentRot = camera.rotation.clone();
      
      const posVel = currentPos.distanceTo(prevPosition.current);
      const rotVel = Math.abs(currentRot.x - prevRotation.current.x) + 
                    Math.abs(currentRot.y - prevRotation.current.y) + 
                    Math.abs(currentRot.z - prevRotation.current.z);
      
      // EXTREME sensitivity - much higher multipliers
      velocity.current = Math.max(posVel * 1000, rotVel * 500) * intensity;
      
      // Update shader uniforms
      if (extremeBlurShader.uniforms) {
        extremeBlurShader.uniforms.velocity.value = velocity.current;
        extremeBlurShader.uniforms.transitionBlur.value = transitionBlur.current;
        extremeBlurShader.uniforms.intensity.value = intensity;
        extremeBlurShader.uniforms.time.value = state.clock.elapsedTime;
        extremeBlurShader.uniforms.samples.value = samples;
      }
      
      // Debug output for extreme values
      if (velocity.current > 1.0 || transitionBlur.current > 0.1) {
        console.log(`🔥 EXTREME BLUR - Velocity: ${velocity.current.toFixed(2)}, Transition: ${transitionBlur.current.toFixed(2)}, Total Effect: ${Math.max(velocity.current, transitionBlur.current).toFixed(2)}`);
      }
    } else {
      isFirstFrame.current = false;
    }
    
    prevPosition.current.copy(camera.position);
    prevRotation.current.copy(camera.rotation);
  });

  if (!enabled) return null;

  return (
    <Effects disableGamma>
      <shaderPass
        args={[extremeBlurShader]}
        renderToScreen
      />
    </Effects>
  );
}

// Scene transition controller - triggers extreme blur during scene changes
export function SceneTransitionBlur({
  enabled = true,
  intensity = 3.0,
  currentScene,
  previousScene
}: {
  enabled?: boolean;
  intensity?: number;
  currentScene?: string;
  previousScene?: string;
}) {
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  
  // Detect scene changes
  useEffect(() => {
    if (currentScene !== previousScene && previousScene !== undefined) {
      console.log(`🎬 SCENE TRANSITION: ${previousScene} → ${currentScene}`);
      setIsTransitioning(true);
      
      // Transition duration
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 1000); // 1 second transition
      
      return () => clearTimeout(timer);
    }
  }, [currentScene, previousScene]);
  
  return (
    <ExtremeMotionBlur 
      enabled={enabled}
      intensity={intensity}
      samples={48}
      sceneTransition={isTransitioning}
    />
  );
}

// Keep the original for compatibility
export function SimpleMotionBlur(props: any) {
  return <ExtremeMotionBlur {...props} />;
}

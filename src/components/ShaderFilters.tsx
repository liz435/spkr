'use client'

import React, { useMemo, useRef, useEffect } from 'react';
import { EffectComposer, Bloom, ChromaticAberration, Pixelation } from '@react-three/postprocessing';
import { BlendFunction, KernelSize, Effect } from 'postprocessing';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Custom Motion Blur Effect
class MotionBlurEffect extends Effect {
  private _strength: number;
  private _samples: number;

  constructor({
    strength = 0.5,
    samples = 8
  }: {
    strength?: number;
    samples?: number;
  } = {}) {
    const fragmentShader = `
      uniform float strength;
      uniform int samples;
      uniform vec2 velocity;
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec4 result = vec4(0.0);
        vec2 blurVector = velocity * strength * 0.01;
        
        for (int i = 0; i < 16; i++) {
          if (i >= samples) break;
          
          float t = float(i) / float(samples - 1) - 0.5;
          vec2 offset = blurVector * t;
          result += texture2D(inputBuffer, uv + offset);
        }
        
        outputColor = result / float(samples);
      }
    `;

    super('MotionBlurEffect', fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['strength', new THREE.Uniform(strength)],
        ['samples', new THREE.Uniform(samples)],
        ['velocity', new THREE.Uniform(new THREE.Vector2(1.0, 0.0))]
      ] as any)
    });

    this._strength = strength;
    this._samples = samples;
  }

  updateVelocity(velocity: THREE.Vector2) {
    this.uniforms.get('velocity')!.value.copy(velocity);
  }

  updateStrength(strength: number) {
    this.uniforms.get('strength')!.value = strength;
    this._strength = strength;
  }

  updateSamples(samples: number) {
    this.uniforms.get('samples')!.value = samples;
    this._samples = samples;
  }

  get strength() { return this._strength; }
  get samples() { return this._samples; }
}

// Motion Blur Component with camera tracking
function MotionBlurComponent({
  strength,
  samples,
  enabled
}: {
  strength: number;
  samples: number;
  enabled: boolean;
}) {
  const { camera } = useThree();
  const effectRef = useRef<MotionBlurEffect | null>(null);
  const previousCameraPosition = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector2());

  // Create the effect
  const effect = useMemo(() => {
    const motionBlurEffect = new MotionBlurEffect({ strength, samples });
    effectRef.current = motionBlurEffect;
    return motionBlurEffect;
  }, []);

  // Update effect parameters
  useEffect(() => {
    if (effectRef.current) {
      effectRef.current.updateStrength(strength);
      effectRef.current.updateSamples(samples);
    }
  }, [strength, samples]);

  // Track camera movement for velocity calculation
  useFrame(() => {
    if (!effectRef.current || !enabled) return;

    // Calculate velocity based on camera movement
    const currentPosition = camera.position.clone();
    const deltaPosition = currentPosition.clone().sub(previousCameraPosition.current);
    
    // Convert 3D movement to 2D screen space velocity
    velocity.current.set(deltaPosition.x * 10, deltaPosition.y * 10);
    
    // Update the effect
    effectRef.current.updateVelocity(velocity.current);
    
    // Store current position for next frame
    previousCameraPosition.current.copy(currentPosition);
  });

  if (!enabled) return null;

  return <primitive object={effect} />;
}

// Simple shader-based effects using existing postprocessing components
interface ShaderFiltersProps {
  edgeDetectionEnabled?: boolean;
  edgeThreshold?: number;
  edgeIntensity?: number;
  pixelationEnabled?: boolean;
  pixelSize?: number;
  motionBlurEnabled?: boolean;
  motionBlurStrength?: number;
  motionBlurSamples?: number;
  bloomEnabled?: boolean;
  chromaticAberrationEnabled?: boolean;
}

export function ShaderFilters({
  edgeDetectionEnabled = false,
  edgeThreshold = 0.1,
  edgeIntensity = 1.0,
  pixelationEnabled = false,
  pixelSize = 8,
  motionBlurEnabled = false,
  motionBlurStrength = 0.5,
  motionBlurSamples = 8,
  bloomEnabled = false,
  chromaticAberrationEnabled = false
}: ShaderFiltersProps) {
  // Create array of enabled effects
  const effects = [];

  if (pixelationEnabled) {
    effects.push(<Pixelation key="pixelation" granularity={pixelSize} />);
  }

  // Use real motion blur or fallback to bloom
  if (motionBlurEnabled) {
    effects.push(
      <MotionBlurComponent
        key="motionblur"
        strength={motionBlurStrength}
        samples={motionBlurSamples}
        enabled={motionBlurEnabled}
      />
    );
  } else if (bloomEnabled) {
    effects.push(
      <Bloom 
        key="bloom"
        intensity={0.4}
        kernelSize={KernelSize.LARGE}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.9}
      />
    );
  }

  if (edgeDetectionEnabled || chromaticAberrationEnabled) {
    effects.push(
      <ChromaticAberration
        key="chromatic"
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(edgeIntensity * 0.002, edgeIntensity * 0.002)}
      />
    );
  }

  // Only render EffectComposer if there are effects
  if (effects.length === 0) {
    return null;
  }

  return (
    <EffectComposer>
      {effects}
    </EffectComposer>
  );
}

// Individual filter components using built-in effects
export function EdgeDetectionFilter({
  enabled = true
}: {
  enabled?: boolean;
}) {
  if (!enabled) return null;

  return (
    <EffectComposer>
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.003, 0.003)}
      />
    </EffectComposer>
  );
}

export function PixelationFilter({
  enabled = true,
  pixelSize = 8
}: {
  enabled?: boolean;
  pixelSize?: number;
}) {
  if (!enabled) return null;

  return (
    <EffectComposer>
      <Pixelation granularity={pixelSize} />
    </EffectComposer>
  );
}

export function MotionBlurFilter({
  enabled = true,
  strength = 0.5
}: {
  enabled?: boolean;
  strength?: number;
}) {
  if (!enabled) return null;

  return (
    <EffectComposer>
      <Bloom 
        intensity={strength * 1.5}
        kernelSize={KernelSize.LARGE}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.9}
      />
    </EffectComposer>
  );
}

export default ShaderFilters;

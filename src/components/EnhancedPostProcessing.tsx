'use client'

import React, { useMemo, useRef } from 'react';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

interface EnhancedPostProcessingProps {
  enabled?: boolean;
  // Bloom
  bloomEnabled?: boolean;
  bloomStrength?: number;
  bloomRadius?: number;
  bloomThreshold?: number;
  // Chromatic Aberration
  chromaticAberrationEnabled?: boolean;
  chromaticAberrationIntensity?: number;
  // Vignette
  vignetteEnabled?: boolean;
  vignetteIntensity?: number;
  vignetteDarkness?: number;
  // Color grading
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hue?: number;
}

export function EnhancedPostProcessing({
  enabled = true,
  // Bloom defaults
  bloomEnabled = true,
  bloomStrength = 0.3,
  bloomRadius = 0.4,
  bloomThreshold = 0.8,
  // Chromatic Aberration defaults
  chromaticAberrationEnabled = false,
  chromaticAberrationIntensity = 0.0025,
  // Vignette defaults
  vignetteEnabled = true,
  vignetteIntensity = 0.5,
  vignetteDarkness = 0.5,
  // Color grading defaults
  brightness = 0.0,
  contrast = 0.1,
  saturation = 0.0,
  hue = 0.0,
}: EnhancedPostProcessingProps) {
  
  // Early return to prevent unnecessary renders
  if (!enabled) {
    return null;
  }

  // Memoize all effect parameters to prevent infinite re-renders
  const effectParams = useMemo(() => ({
    // Bloom parameters
    bloom: {
      intensity: Math.max(0, Math.min(3, bloomStrength)),
      radius: Math.max(0.1, Math.min(1, bloomRadius)),
      luminanceThreshold: Math.max(0, Math.min(1, bloomThreshold)),
      luminanceSmoothing: 0.025,
      blendFunction: BlendFunction.SCREEN,
      mipmapBlur: true,
    },
    // Chromatic aberration parameters
    chromaticAberration: {
      offset: new THREE.Vector2(
        chromaticAberrationIntensity * 0.001,
        chromaticAberrationIntensity * 0.001
      ),
    },
    // Vignette parameters  
    vignette: {
      eskil: false,
      offset: vignetteIntensity * 0.5,
      darkness: vignetteDarkness,
    },
    // Color grading parameters
    brightnessContrast: {
      brightness: Math.max(-0.5, Math.min(0.5, brightness)),
      contrast: Math.max(-0.5, Math.min(0.5, contrast)),
    },
    hueSaturation: {
      hue: Math.max(-Math.PI, Math.min(Math.PI, hue)),
      saturation: Math.max(-1, Math.min(1, saturation)),
    },
  }), [
    bloomStrength, bloomRadius, bloomThreshold,
    chromaticAberrationIntensity,
    vignetteIntensity, vignetteDarkness,
    brightness, contrast, saturation, hue
  ]);

  return (
    <EffectComposer>
      {/* Bloom Effect */}
      {/* Always render all effects, control them with parameters */}
      <Bloom
        intensity={bloomEnabled ? effectParams.bloom.intensity : 0}
        radius={effectParams.bloom.radius}
        luminanceThreshold={effectParams.bloom.luminanceThreshold}
        luminanceSmoothing={effectParams.bloom.luminanceSmoothing}
        blendFunction={effectParams.bloom.blendFunction}
        mipmapBlur={effectParams.bloom.mipmapBlur}
      />
      
      <ChromaticAberration
        offset={chromaticAberrationEnabled ? effectParams.chromaticAberration.offset : [0, 0]}
      />
      
      <Vignette
        eskil={effectParams.vignette.eskil}
        offset={effectParams.vignette.offset}
        darkness={vignetteEnabled ? effectParams.vignette.darkness : 0}
      />
    </EffectComposer>
  );
}

export default EnhancedPostProcessing;

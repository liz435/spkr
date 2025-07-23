'use client'

import React, { useMemo } from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface StablePostProcessingProps {
  enabled?: boolean;
  bloomStrength?: number;
}

export function StablePostProcessing({
  enabled = true,
  bloomStrength = 0.3,
}: StablePostProcessingProps) {
  
  // Early return to prevent unnecessary renders
  if (!enabled) {
    return null;
  }

  // Memoize all parameters to prevent infinite re-renders
  const effectParams = useMemo(() => ({
    bloomIntensity: Math.max(0, Math.min(2, bloomStrength)), // Clamp between 0-2
    luminanceThreshold: 0.8,
    luminanceSmoothing: 0.025,
    blendFunction: BlendFunction.SCREEN,
    mipmapBlur: true,
    radius: 0.4,
  }), [bloomStrength]);

  return (
    <EffectComposer>
      <Bloom
        intensity={effectParams.bloomIntensity}
        luminanceThreshold={effectParams.luminanceThreshold}
        luminanceSmoothing={effectParams.luminanceSmoothing}
        blendFunction={effectParams.blendFunction}
        mipmapBlur={effectParams.mipmapBlur}
        radius={effectParams.radius}
      />
    </EffectComposer>
  );
}

export default StablePostProcessing;

'use client'

import React, { useMemo } from 'react';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';

interface ModernPostProcessingProps {
  enabled?: boolean;
  materialType?: string;
  renderingMode?: string;
  toneMappingExposure?: number;
  bloomEnabled?: boolean;
  bloomStrength?: number;
}

export function ModernPostProcessing({
  enabled = true,
  materialType = "physical",
  renderingMode = "realistic",
  toneMappingExposure = 1.0,
  bloomEnabled = true,
  bloomStrength = 0.3,
}: ModernPostProcessingProps) {
  
  // Don't render if disabled or in wireframe mode
  if (!enabled || renderingMode === "wireframe") {
    return null;
  }

  // Memoize bloom parameters to prevent infinite re-renders
  const bloomParams = useMemo(() => {
    const bloomIntensity = materialType === "physical" ? bloomStrength * 0.8 : bloomStrength;
    const bloomLuminanceThreshold = materialType === "physical" ? 0.9 : 0.7;
    const bloomLuminanceSmoothing = 0.025;

    return {
      intensity: bloomIntensity,
      luminanceThreshold: bloomLuminanceThreshold,
      luminanceSmoothing: bloomLuminanceSmoothing,
    };
  }, [materialType, bloomStrength]);

  return (
    <EffectComposer>
      <Bloom
        intensity={bloomParams.intensity}
        luminanceThreshold={bloomParams.luminanceThreshold}
        luminanceSmoothing={bloomParams.luminanceSmoothing}
        blendFunction={BlendFunction.SCREEN}
        mipmapBlur={true}
        radius={0.5}
      />
      
      <ToneMapping
        mode={ToneMappingMode.ACES_FILMIC}
        resolution={256}
        whitePoint={4.0}
        middleGrey={0.6}
        minLuminance={0.01}
        averageLuminance={1.0}
        adaptationRate={1.0}
      />
    </EffectComposer>
  );
}

export default ModernPostProcessing;

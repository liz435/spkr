'use client'

import React, { useRef, useMemo } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { 
  EffectComposer, 
  RenderPass, 
  UnrealBloomPass,
  SSAOPass,
  ShaderPass
} from 'three-stdlib';
import * as THREE from 'three';

// Extend Three.js with post-processing passes
extend({ 
  EffectComposer, 
  RenderPass, 
  UnrealBloomPass,
  SSAOPass,
  ShaderPass
});

// Custom tone mapping and color grading shader
const ColorGradingShader = {
  uniforms: {
    'tDiffuse': { value: null },
    'exposure': { value: 1.0 },
    'contrast': { value: 1.1 },
    'brightness': { value: 0.0 },
    'saturation': { value: 1.2 },
    'gamma': { value: 2.2 },
    'hue': { value: 0.0 },
    'temperature': { value: 0.0 }, // Color temperature adjustment
    'tint': { value: 0.0 },
    'vignette': { value: 0.3 }, // Vignette strength
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,

  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float exposure;
    uniform float contrast;
    uniform float brightness;
    uniform float saturation;
    uniform float gamma;
    uniform float hue;
    uniform float temperature;
    uniform float tint;
    uniform float vignette;
    
    varying vec2 vUv;

    // Color space conversions
    vec3 rgb2hsv(vec3 c) {
      vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
      vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
      vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
      
      float d = q.x - min(q.w, q.y);
      float e = 1.0e-10;
      return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    // ACES tone mapping
    vec3 ACESFilm(vec3 x) {
      float a = 2.51;
      float b = 0.03;
      float c = 2.43;
      float d = 0.59;
      float e = 0.14;
      return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
    }

    // Color temperature adjustment
    vec3 colorTemperature(vec3 color, float temp) {
      // Simplified color temperature (warm/cool adjustment)
      vec3 warm = vec3(1.0, 0.9, 0.7);
      vec3 cool = vec3(0.7, 0.9, 1.0);
      
      vec3 tempColor = temp > 0.0 ? warm : cool;
      return mix(color, color * tempColor, abs(temp));
    }

    void main() {
      vec4 texel = texture2D( tDiffuse, vUv );
      vec3 color = texel.rgb;
      
      // Exposure adjustment
      color *= exposure;
      
      // ACES tone mapping for realistic HDR look
      color = ACESFilm(color);
      
      // Color temperature
      color = colorTemperature(color, temperature);
      
      // Brightness and contrast
      color = color + brightness;
      color = (color - 0.5) * contrast + 0.5;
      
      // Saturation
      float luminance = dot(color, vec3(0.299, 0.587, 0.114));
      color = mix(vec3(luminance), color, saturation);
      
      // Hue shift
      vec3 hsv = rgb2hsv(color);
      hsv.x += hue;
      color = hsv2rgb(hsv);
      
      // Gamma correction
      color = pow(color, vec3(1.0 / gamma));
      
      // Vignette effect
      vec2 center = vUv - 0.5;
      float vignetteEffect = 1.0 - smoothstep(0.3, 0.8, length(center));
      vignetteEffect = mix(1.0, vignetteEffect, vignette);
      color *= vignetteEffect;
      
      gl_FragColor = vec4(color, texel.a);
    }
  `
};

interface RealisticPostProcessingProps {
  enabled?: boolean;
  materialType?: string;
  renderingMode?: string;
  toneMappingExposure?: number;
  // SSAO settings
  ssaoEnabled?: boolean;
  ssaoRadius?: number;
  ssaoIntensity?: number;
  // Bloom settings
  bloomEnabled?: boolean;
  bloomStrength?: number;
  bloomRadius?: number;
  bloomThreshold?: number;
  // Color grading
  contrast?: number;
  saturation?: number;
  temperature?: number;
  vignette?: number;
  // Anti-aliasing
  antialiasingEnabled?: boolean;
}

export function RealisticPostProcessing({
  enabled = true,
  materialType = "physical",
  renderingMode = "realistic",
  toneMappingExposure = 1.0,
  // SSAO
  ssaoEnabled = true,
  ssaoRadius = 0.1,
  ssaoIntensity = 0.5,
  // Bloom
  bloomEnabled = true,
  bloomStrength = 0.3,
  bloomRadius = 0.4,
  bloomThreshold = 0.85,
  // Color grading
  contrast = 1.1,
  saturation = 1.2,
  temperature = 0.05,
  vignette = 0.2,
  // Anti-aliasing
  antialiasingEnabled = true,
}: RealisticPostProcessingProps) {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef<EffectComposer | null>(null);
  const colorGradingPass = useRef<ShaderPass | null>(null);

  // Initialize effect composer and passes
  useMemo(() => {
    if (!enabled || renderingMode === "wireframe") {
      composer.current = null;
      return;
    }

    // Create effect composer
    const effectComposer = new EffectComposer(gl);
    effectComposer.setSize(size.width, size.height);
    effectComposer.setPixelRatio(gl.getPixelRatio());

    // 1. Base render pass
    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);

    // 2. SSAO (Screen Space Ambient Occlusion) - adds realistic shadowing
    if (ssaoEnabled && materialType === "physical") {
      const ssaoPass = new SSAOPass(scene, camera, size.width, size.height);
      ssaoPass.kernelRadius = ssaoRadius;
      ssaoPass.minDistance = 0.005;
      ssaoPass.maxDistance = 0.1;
      
      // Safely adjust SSAO intensity
      try {
        if (ssaoPass && (ssaoPass as any).ssaoMaterial && (ssaoPass as any).ssaoMaterial.uniforms && (ssaoPass as any).ssaoMaterial.uniforms.intensity) {
          const intensityMultiplier = materialType === "physical" ? 1.0 : 0.5;
          (ssaoPass as any).ssaoMaterial.uniforms.intensity.value = ssaoIntensity * intensityMultiplier;
        }
      } catch (error) {
        console.warn('Could not set SSAO intensity:', error);
      }
      
      effectComposer.addPass(ssaoPass);
    }

    // 3. Unreal Bloom - adds realistic glow to bright areas
    if (bloomEnabled) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(size.width, size.height),
        bloomStrength,
        bloomRadius,
        bloomThreshold
      );
      
      // Adjust bloom based on material type
      if (materialType === "physical") {
        bloomPass.strength = bloomStrength * 0.8; // More subtle for physical materials
        bloomPass.threshold = bloomThreshold + 0.1;
      } else if (materialType === "basic" || materialType === "lambert") {
        bloomPass.strength = bloomStrength * 1.5; // More dramatic for simple materials
        bloomPass.threshold = bloomThreshold - 0.2;
      }
      
      effectComposer.addPass(bloomPass);
    }

    // 4. Color grading and tone mapping
    const colorGrading = new ShaderPass(ColorGradingShader);
    
    // Safely set uniforms with error handling
    try {
      if (colorGrading.uniforms) {
        colorGrading.uniforms.exposure.value = toneMappingExposure;
        colorGrading.uniforms.contrast.value = contrast;
        colorGrading.uniforms.saturation.value = saturation;
        colorGrading.uniforms.temperature.value = temperature;
        colorGrading.uniforms.vignette.value = vignette;
        
        // Adjust color grading based on material type
        if (materialType === "physical") {
          colorGrading.uniforms.gamma.value = 2.2; // sRGB gamma for realistic look
          colorGrading.uniforms.saturation.value = saturation * 0.9; // Slightly less saturated
        } else if (materialType === "toon") {
          colorGrading.uniforms.gamma.value = 1.8; // Brighter gamma for cartoon look
          colorGrading.uniforms.saturation.value = saturation * 1.3; // More saturated
          colorGrading.uniforms.contrast.value = contrast * 1.2; // Higher contrast
        }
      }
    } catch (error) {
      console.warn('Could not set color grading uniforms:', error);
    }
    
    effectComposer.addPass(colorGrading);
    colorGradingPass.current = colorGrading;

    // Final pass - make it the last pass
    colorGrading.renderToScreen = true;

    composer.current = effectComposer;
  }, [
    enabled,
    materialType,
    renderingMode,
    size.width,
    size.height,
    ssaoEnabled,
    ssaoRadius,
    ssaoIntensity,
    bloomEnabled,
    bloomStrength,
    bloomRadius,
    bloomThreshold,
    antialiasingEnabled
  ]);

  // Update uniforms on every frame
  useFrame(() => {
    if (!composer.current || !enabled || renderingMode === "wireframe") {
      return;
    }

    // Safely update color grading uniforms
    if (colorGradingPass.current && colorGradingPass.current.uniforms) {
      try {
        colorGradingPass.current.uniforms.exposure.value = toneMappingExposure;
        colorGradingPass.current.uniforms.contrast.value = contrast;
        colorGradingPass.current.uniforms.saturation.value = saturation;
        colorGradingPass.current.uniforms.temperature.value = temperature;
        colorGradingPass.current.uniforms.vignette.value = vignette;
      } catch (error) {
        console.warn('Could not update color grading uniforms:', error);
      }
    }

    // Render with post-processing
    composer.current.render();
  });

  return null;
}

export default RealisticPostProcessing;

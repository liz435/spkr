'use client'

import React, { useMemo, useRef, useEffect } from 'react';
import { EffectComposer, Bloom, ChromaticAberration, Pixelation, Outline } from '@react-three/postprocessing';
import { BlendFunction, KernelSize, Effect, Resizer } from 'postprocessing';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Simple Framebuffer Motion Blur Effect
class FramebufferMotionBlurEffect extends Effect {
  private _strength: number;
  private previousFrame: THREE.WebGLRenderTarget | null = null;
  private tempFrame: THREE.WebGLRenderTarget | null = null;

  constructor({
    strength = 0.75
  }: {
    strength?: number;
  } = {}) {
    const fragmentShader = `
      uniform float strength;
      uniform vec2 cameraVelocity;
      uniform sampler2D previousFrame;
      uniform bool hasPreviousFrame;
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec4 currentFrame = inputColor;
        
        if (hasPreviousFrame) {
          // Calculate offset based on inverted camera movement (your suggestion)
          vec2 offset = -cameraVelocity * 0.012 * strength;
          
          // Sample previous frame with offset
          vec2 offsetUV = uv + offset;
          offsetUV = clamp(offsetUV, 0.0, 1.0);
          
          vec4 previousFrameColor = texture2D(previousFrame, offsetUV);
          
          // Blend current with previous frame using adjustable alpha
          float blendAmount = strength * 0.6;
          outputColor = mix(currentFrame, previousFrameColor, blendAmount);
        } else {
          outputColor = currentFrame;
        }
      }
    `;

    super('FramebufferMotionBlurEffect', fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['strength', new THREE.Uniform(strength)],
        ['cameraVelocity', new THREE.Uniform(new THREE.Vector2(0.0, 0.0))],
        ['previousFrame', new THREE.Uniform(null)],
        ['hasPreviousFrame', new THREE.Uniform(false)]
      ] as any)
    });

    this._strength = strength;
  }

  initialize(renderer: THREE.WebGLRenderer, alpha: boolean, frameBufferType: number) {
    super.initialize(renderer, alpha, frameBufferType);
    
    const size = renderer.getSize(new THREE.Vector2());
    
    // Create render targets for frame copying
    this.previousFrame = new THREE.WebGLRenderTarget(size.width, size.height, {
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter
    });

    this.tempFrame = new THREE.WebGLRenderTarget(size.width, size.height, {
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter
    });
  }

  updateCameraVelocity(velocity: THREE.Vector2) {
    this.uniforms.get('cameraVelocity')!.value.copy(velocity);
  }

  updateStrength(strength: number) {
    this.uniforms.get('strength')!.value = strength;
    this._strength = strength;
  }

  render(renderer: THREE.WebGLRenderer, inputBuffer: THREE.WebGLRenderTarget, outputBuffer: THREE.WebGLRenderTarget) {
    // Copy current input to previous frame for next iteration
    if (this.previousFrame && this.tempFrame) {
      // Copy input to temp
      renderer.setRenderTarget(this.tempFrame);
      renderer.clear();
      
      // Simple blit operation using built-in copy
      const oldAutoClear = renderer.autoClear;
      renderer.autoClear = false;
      
      // Create a simple fullscreen quad to copy the texture
      const material = new THREE.MeshBasicMaterial({ map: inputBuffer.texture });
      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      const scene = new THREE.Scene();
      scene.add(mesh);
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      
      renderer.render(scene, camera);
      renderer.autoClear = oldAutoClear;
      
      // Update uniforms
      this.uniforms.get('previousFrame')!.value = this.previousFrame.texture;
      this.uniforms.get('hasPreviousFrame')!.value = true;
      
      // Swap buffers
      const temp = this.previousFrame;
      this.previousFrame = this.tempFrame;
      this.tempFrame = temp;
    }

    // The Effect base class handles the actual shader rendering
    // We don't need to call super.render() as it's handled automatically
  }

  dispose() {
    super.dispose();
    if (this.previousFrame) {
      this.previousFrame.dispose();
      this.previousFrame = null;
    }
    if (this.tempFrame) {
      this.tempFrame.dispose();
      this.tempFrame = null;
    }
  }

  get strength() { return this._strength; }
}

// 🌊 Wave Distortion Effect
class WaveDistortionEffect extends Effect {
  private _amplitude: number;
  private _frequency: number;
  private _speed: number;

  constructor({
    amplitude = 0.05,
    frequency = 10.0,
    speed = 2.0
  }: {
    amplitude?: number;
    frequency?: number;
    speed?: number;
  } = {}) {
    const fragmentShader = `
      uniform float time;
      uniform float amplitude;
      uniform float frequency;
      uniform float speed;
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 distortedUV = uv;
        
        // Horizontal wave distortion
        distortedUV.x += sin(uv.y * frequency + time * speed) * amplitude;
        
        // Vertical wave distortion  
        distortedUV.y += cos(uv.x * frequency * 0.7 + time * speed * 0.8) * amplitude * 0.5;
        
        // Clamp UV coordinates
        distortedUV = clamp(distortedUV, 0.0, 1.0);
        
        outputColor = texture2D(inputBuffer, distortedUV);
      }
    `;

    super('WaveDistortionEffect', fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['time', new THREE.Uniform(0.0)],
        ['amplitude', new THREE.Uniform(amplitude)],
        ['frequency', new THREE.Uniform(frequency)],
        ['speed', new THREE.Uniform(speed)]
      ] as any)
    });

    this._amplitude = amplitude;
    this._frequency = frequency;
    this._speed = speed;
  }

  updateTime(time: number) {
    this.uniforms.get('time')!.value = time;
  }

  updateAmplitude(amplitude: number) {
    this.uniforms.get('amplitude')!.value = amplitude;
    this._amplitude = amplitude;
  }

  updateFrequency(frequency: number) {
    this.uniforms.get('frequency')!.value = frequency;
    this._frequency = frequency;
  }

  updateSpeed(speed: number) {
    this.uniforms.get('speed')!.value = speed;
    this._speed = speed;
  }

  get amplitude() { return this._amplitude; }
  get frequency() { return this._frequency; }
  get speed() { return this._speed; }
}

// 🔥 Fire/Heat Effect
class FireEffect extends Effect {
  private _intensity: number;
  private _scale: number;

  constructor({
    intensity = 1.0,
    scale = 8.0
  }: {
    intensity?: number;
    scale?: number;
  } = {}) {
    const fragmentShader = `
      uniform float time;
      uniform float intensity;
      uniform float scale;
      
      // Simple noise function
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for(int i = 0; i < 4; i++) {
          value += amplitude * noise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 fireUV = uv;
        fireUV.y -= time * 0.3;
        fireUV *= scale;
        
        float flame = fbm(fireUV);
        flame *= (1.0 - uv.y * 0.8); // Fade out at top
        flame = smoothstep(0.3, 0.8, flame) * intensity;
        
        // Fire colors
        vec3 fireColor1 = vec3(1.0, 0.2, 0.0);  // Red
        vec3 fireColor2 = vec3(1.0, 0.8, 0.0);  // Yellow
        vec3 fireColor3 = vec3(1.0, 1.0, 1.0);  // White hot
        
        vec3 fireColor = mix(fireColor1, fireColor2, flame);
        fireColor = mix(fireColor, fireColor3, flame * flame);
        
        // Blend with original
        outputColor = mix(inputColor, vec4(fireColor, 1.0), flame * 0.5);
      }
    `;

    super('FireEffect', fragmentShader, {
      blendFunction: BlendFunction.SCREEN,
      uniforms: new Map([
        ['time', new THREE.Uniform(0.0)],
        ['intensity', new THREE.Uniform(intensity)],
        ['scale', new THREE.Uniform(scale)]
      ] as any)
    });

    this._intensity = intensity;
    this._scale = scale;
  }

  updateTime(time: number) {
    this.uniforms.get('time')!.value = time;
  }

  updateIntensity(intensity: number) {
    this.uniforms.get('intensity')!.value = intensity;
    this._intensity = intensity;
  }

  updateScale(scale: number) {
    this.uniforms.get('scale')!.value = scale;
    this._scale = scale;
  }

  get intensity() { return this._intensity; }
  get scale() { return this._scale; }
}

// 👾 Glitch Effect
class GlitchEffect extends Effect {
  private _intensity: number;
  private _speed: number;

  constructor({
    intensity = 0.5,
    speed = 10.0
  }: {
    intensity?: number;
    speed?: number;
  } = {}) {
    
    const vertexShader = `
      uniform float time;
      uniform float intensity;
      uniform float speed;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      void mainVertex(inout vec4 position) {
        float timeSpeed = time * speed;
        vec2 screenPos = position.xy;
        
        // Add vertex-level glitch distortion
        float vertexGlitch = random(vec2(floor(screenPos.y * 20.0), floor(timeSpeed * 0.5)));
        if (vertexGlitch > 0.95) {
          position.x += (random(vec2(timeSpeed, screenPos.y)) - 0.5) * intensity * 0.1;
        }
        
        // Occasional dramatic position shifts
        float dramaticShift = random(vec2(floor(timeSpeed * 0.2), 0.0));
        if (dramaticShift > 0.98) {
          position.xy += (vec2(random(vec2(timeSpeed, 1.0)), random(vec2(timeSpeed, 2.0))) - 0.5) * intensity * 0.3;
        }
      }
    `;
    
   const fragmentShader = `
  uniform float time;
  uniform float intensity;
  uniform float speed;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }



  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 distortedUV = uv;
    
    // --- Glitch scanline displacement ---
    float timeSpeed = time * speed;
    float scanlineShift = sin(timeSpeed * 3.0 + uv.y * 50.0) * intensity * 0.02;
    if (random(vec2(floor(uv.y * 100.0), floor(timeSpeed))) > 0.8) {
      distortedUV.x += scanlineShift;
    }

    // --- Blocky vertical shift ---
    float blockY = floor(uv.y * 20.0) / 20.0;
    float blockShift = (random(vec2(blockY, floor(timeSpeed * 2.0))) - 0.5) * intensity * 0.05;
    if (random(vec2(blockY, floor(timeSpeed * 0.5))) > 0.9) {
      distortedUV.x += blockShift;
    }

    // --- Wave distortion (like signal ripple) ---
    distortedUV.x += sin(uv.y * 30.0 + timeSpeed * 8.0) * intensity * 0.003;
    distortedUV.y += cos(uv.x * 15.0 + timeSpeed * 6.0) * intensity * 0.002;

    // --- Color channel offset ---
    vec2 rOffset = vec2(intensity * 0.01, 0.0);
    vec2 gOffset = vec2(0.0);
    vec2 bOffset = vec2(-intensity * 0.01, 0.0);

    float r = texture2D(inputBuffer, distortedUV + rOffset).r;
    float g = texture2D(inputBuffer, distortedUV + gOffset).g;
    float b = texture2D(inputBuffer, distortedUV + bOffset).b;

    outputColor = vec4(r, g, b, 1.0);

    // --- Edge Detection ---
    vec2 texelSize = 1.0 / vec2(1920.0, 1080.0); // Could be made uniform
    
    // Sobel edge detection kernel
    float edge = 0.0;
    
    // Sample surrounding pixels
    vec3 tl = texture2D(inputBuffer, uv + vec2(-texelSize.x, -texelSize.y)).rgb; // top left
    vec3 tm = texture2D(inputBuffer, uv + vec2(0.0, -texelSize.y)).rgb;         // top middle
    vec3 tr = texture2D(inputBuffer, uv + vec2(texelSize.x, -texelSize.y)).rgb;  // top right
    vec3 ml = texture2D(inputBuffer, uv + vec2(-texelSize.x, 0.0)).rgb;         // middle left
    vec3 mr = texture2D(inputBuffer, uv + vec2(texelSize.x, 0.0)).rgb;          // middle right
    vec3 bl = texture2D(inputBuffer, uv + vec2(-texelSize.x, texelSize.y)).rgb;  // bottom left
    vec3 bm = texture2D(inputBuffer, uv + vec2(0.0, texelSize.y)).rgb;          // bottom middle
    vec3 br = texture2D(inputBuffer, uv + vec2(texelSize.x, texelSize.y)).rgb;   // bottom right
    
    // Apply Sobel operator
    vec3 sobelX = tl + 2.0*ml + bl - tr - 2.0*mr - br;
    vec3 sobelY = tl + 2.0*tm + tr - bl - 2.0*bm - br;
    
    // Calculate edge magnitude
    edge = length(sobelX) + length(sobelY);
    edge = smoothstep(0.1, 0.3, edge);
    
    // Apply edge enhancement to glitch effect
    outputColor.rgb = mix(outputColor.rgb, vec3(1.0, 0.0, 1.0), edge * intensity * 0.5);

    // --- Digital noise overlay ---
    float noise = random(uv + timeSpeed * 0.1);
    if (noise > 0.95) {
      outputColor.rgb = mix(outputColor.rgb, vec3(noise), intensity * 0.3);
    }

    // Add flickering digital blocks
    vec2 blockUV = floor(uv * 50.0) / 50.0;
    float blockNoise = random(blockUV + floor(timeSpeed * 10.0));
    if (blockNoise > 0.98) {
      outputColor.rgb = vec3(1.0) - outputColor.rgb;
    }

    // --- Scanline mask (like CRT) ---
    float scanline = 0.95 + 0.05 * sin(uv.y * 800.0);
    outputColor.rgb *= scanline;

    // --- Random color inversion ---
    if (random(vec2(floor(timeSpeed * 3.0), 0.0)) > 0.95) {
      float inversionMask = step(0.5, random(uv + timeSpeed));
      outputColor.rgb = mix(outputColor.rgb, vec3(1.0) - outputColor.rgb, inversionMask * intensity);
    }

    // --- Temporal color corruption ---
    float corruptionTime = floor(timeSpeed * 5.0);
    if (random(vec2(corruptionTime, 0.0)) > 0.9) {
      outputColor.r = outputColor.g;
      outputColor.b = random(uv + corruptionTime);
    }

  }
`;


    super('GlitchEffect', fragmentShader, {
      vertexShader,
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['time', new THREE.Uniform(0.0)],
        ['intensity', new THREE.Uniform(intensity)],
        ['speed', new THREE.Uniform(speed)]
      ] as any)
    });

    this._intensity = intensity;
    this._speed = speed;
  }

  updateTime(time: number) {
    this.uniforms.get('time')!.value = time;
  }

  updateIntensity(intensity: number) {
    this.uniforms.get('intensity')!.value = intensity;
    this._intensity = intensity;
  }

  updateSpeed(speed: number) {
    this.uniforms.get('speed')!.value = speed;
    this._speed = speed;
  }

  get intensity() { return this._intensity; }
  get speed() { return this._speed; }
}

// 💥 Shockwave/Ripple Effect
class ShockwaveEffect extends Effect {
  private _intensity: number;
  private _size: number;
  private _speed: number;

  constructor({
    intensity = 1.0,
    size = 0.1,
    speed = 1.0
  }: {
    intensity?: number;
    size?: number;
    speed?: number;
  } = {}) {
    const fragmentShader = `
      uniform float time;
      uniform float intensity;
      uniform float size;
      uniform float speed;
      uniform vec2 resolution;
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        // 修复时间计算，避免除零错误
        float currentTime = mod(time * speed, 3.14159 * 2.0);
        
        vec3 waveParams = vec3(10.0, 0.8, size);
        
        float ratio = resolution.y / resolution.x;
        
        // 波浪中心点
        vec2 waveCentre = vec2(0.5, 0.5);
        waveCentre.y *= ratio;
        
        vec2 texCoord = uv;
        texCoord.y *= ratio;
        float dist = distance(texCoord, waveCentre);
        
        vec4 color = inputColor;
        
        // 创建脉冲波效果
        float waveRadius = currentTime * 0.3;
        float waveThickness = waveParams.z;
        
        // 只在波浪范围内扭曲像素
        if ((dist <= (waveRadius + waveThickness)) && 
            (dist >= (waveRadius - waveThickness)) &&
            waveRadius > 0.01) {
            
            // 计算像素偏移距离
            float diff = (dist - waveRadius);
            float scaleDiff = (1.0 - pow(abs(diff * waveParams.x), waveParams.y));
            float diffTime = (diff * scaleDiff);
            
            // 扭曲方向
            vec2 diffTexCoord = normalize(texCoord - waveCentre);
            
            // 执行扭曲并随时间减少效果
            float distortionAmount = (diffTime * intensity) / max(waveRadius * dist * 40.0, 0.001);
            vec2 distortedUV = uv + (diffTexCoord * distortionAmount);
            distortedUV = clamp(distortedUV, 0.0, 1.0);
            
            color = texture2D(inputBuffer, distortedUV);
            
            // 颜色增强效果
            float colorBoost = (scaleDiff * intensity) / max(waveRadius * dist * 40.0, 0.001);
            color += color * colorBoost;
        }
        
        outputColor = color;
      }
    `;

    super('ShockwaveEffect', fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['time', new THREE.Uniform(0.0)],
        ['intensity', new THREE.Uniform(intensity)],
        ['size', new THREE.Uniform(size)],
        ['speed', new THREE.Uniform(speed)],
        ['resolution', new THREE.Uniform(new THREE.Vector2(1920, 1080))]
      ] as any)
    });

    this._intensity = intensity;
    this._size = size;
    this._speed = speed;
  }

  updateTime(time: number) {
    this.uniforms.get('time')!.value = time;
  }

  updateIntensity(intensity: number) {
    this.uniforms.get('intensity')!.value = intensity;
    this._intensity = intensity;
  }

  updateSize(size: number) {
    this.uniforms.get('size')!.value = size;
    this._size = size;
  }

  updateSpeed(speed: number) {
    this.uniforms.get('speed')!.value = speed;
    this._speed = speed;
  }

  updateResolution(width: number, height: number) {
    this.uniforms.get('resolution')!.value.set(width, height);
  }

  get intensity() { return this._intensity; }
  get size() { return this._size; }
  get speed() { return this._speed; }
}

// 🌈 Oil Painting Effect
class OilPaintingEffect extends Effect {
  private _brushSize: number;
  private _intensity: number;

  constructor({
    brushSize = 3.0,
    intensity = 1.0
  }: {
    brushSize?: number;
    intensity?: number;
  } = {}) {
    const fragmentShader = `
      uniform float brushSize;
      uniform float intensity;
      uniform vec2 resolution;
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 texelSize = 1.0 / resolution;
        vec4 avgColor = vec4(0.0);
        float samples = 0.0;
        
        // Sample surrounding pixels in a circular pattern
        for(float x = -brushSize; x <= brushSize; x += 1.0) {
          for(float y = -brushSize; y <= brushSize; y += 1.0) {
            float dist = length(vec2(x, y));
            if(dist <= brushSize) {
              vec2 offset = vec2(x, y) * texelSize;
              avgColor += texture2D(inputBuffer, uv + offset);
              samples += 1.0;
            }
          }
        }
        
        avgColor /= samples;
        
        // Apply quantization for oil painting effect
        avgColor.rgb = floor(avgColor.rgb * 8.0) / 8.0;
        
        outputColor = mix(inputColor, avgColor, intensity);
      }
    `;

    super('OilPaintingEffect', fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['brushSize', new THREE.Uniform(brushSize)],
        ['intensity', new THREE.Uniform(intensity)],
        ['resolution', new THREE.Uniform(new THREE.Vector2(1920, 1080))]
      ] as any)
    });

    this._brushSize = brushSize;
    this._intensity = intensity;
  }

  updateBrushSize(brushSize: number) {
    this.uniforms.get('brushSize')!.value = brushSize;
    this._brushSize = brushSize;
  }

  updateIntensity(intensity: number) {
    this.uniforms.get('intensity')!.value = intensity;
    this._intensity = intensity;
  }

  updateResolution(width: number, height: number) {
    this.uniforms.get('resolution')!.value.set(width, height);
  }

  get brushSize() { return this._brushSize; }
  get intensity() { return this._intensity; }
}

// Framebuffer Motion Blur Component
function FramebufferMotionBlurComponent({
  strength,
  enabled
}: {
  strength: number;
  enabled: boolean;
}) {
  const { camera } = useThree();
  const effectRef = useRef<FramebufferMotionBlurEffect | null>(null);
  const previousCameraPosition = useRef(new THREE.Vector3());
  const previousCameraRotation = useRef(new THREE.Euler());

  const effect = useMemo(() => {
    const motionBlurEffect = new FramebufferMotionBlurEffect({ strength });
    effectRef.current = motionBlurEffect;
    return motionBlurEffect;
  }, [strength]); // Make it reactive to strength changes

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current.updateStrength(strength);
    }
  }, [strength]);

  // Track camera movement for velocity calculation
  useFrame(() => {
    if (!effectRef.current || !enabled) return;

    const currentPosition = camera.position.clone();
    const currentRotation = camera.rotation.clone();
    
    const deltaPosition = currentPosition.clone().sub(previousCameraPosition.current);
    const deltaRotation = new THREE.Vector3(
      currentRotation.x - previousCameraRotation.current.x,
      currentRotation.y - previousCameraRotation.current.y,
      currentRotation.z - previousCameraRotation.current.z
    );
    
    // Convert to 2D velocity (invert as you suggested)
    const velocity = new THREE.Vector2(
      deltaPosition.x + deltaRotation.y * 0.3,
      deltaPosition.y - deltaRotation.x * 0.3
    );
    
    // Scale for visibility and apply strength multiplier
    velocity.multiplyScalar(12 * (0.5 + strength * 0.5)); // Make velocity scale with strength
    
    effectRef.current.updateCameraVelocity(velocity);
    
    previousCameraPosition.current.copy(currentPosition);
    previousCameraRotation.current.copy(currentRotation);
  });

  if (!enabled) return null;
  return <primitive object={effect} />;
}

// 🌊 Wave Distortion Component
function WaveDistortionComponent({
  amplitude,
  frequency,
  speed,
  enabled
}: {
  amplitude: number;
  frequency: number;
  speed: number;
  enabled: boolean;
}) {
  const effectRef = useRef<WaveDistortionEffect | null>(null);

  const effect = useMemo(() => {
    const waveEffect = new WaveDistortionEffect({ amplitude, frequency, speed });
    effectRef.current = waveEffect;
    return waveEffect;
  }, [amplitude, frequency, speed]);

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current.updateAmplitude(amplitude);
      effectRef.current.updateFrequency(frequency);
      effectRef.current.updateSpeed(speed);
    }
  }, [amplitude, frequency, speed]);

  useFrame((state) => {
    if (effectRef.current && enabled) {
      effectRef.current.updateTime(state.clock.elapsedTime);
    }
  });

  if (!enabled) return null;
  return <primitive object={effect} />;
}

// 🔥 Fire Effect Component
function FireComponent({
  intensity,
  scale,
  enabled
}: {
  intensity: number;
  scale: number;
  enabled: boolean;
}) {
  const effectRef = useRef<FireEffect | null>(null);

  const effect = useMemo(() => {
    const fireEffect = new FireEffect({ intensity, scale });
    effectRef.current = fireEffect;
    return fireEffect;
  }, [intensity, scale]);

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current.updateIntensity(intensity);
      effectRef.current.updateScale(scale);
    }
  }, [intensity, scale]);

  useFrame((state) => {
    if (effectRef.current && enabled) {
      effectRef.current.updateTime(state.clock.elapsedTime);
    }
  });

  if (!enabled) return null;
  return <primitive object={effect} />;
}

// 👾 Glitch Effect Component
function GlitchComponent({
  intensity,
  speed,
  enabled
}: {
  intensity: number;
  speed: number;
  enabled: boolean;
}) {
  const effectRef = useRef<GlitchEffect | null>(null);

  const effect = useMemo(() => {
    const glitchEffect = new GlitchEffect({ intensity, speed });
    effectRef.current = glitchEffect;
    return glitchEffect;
  }, [intensity, speed]);

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current.updateIntensity(intensity);
      effectRef.current.updateSpeed(speed);
    }
  }, [intensity, speed]);

  useFrame((state) => {
    if (effectRef.current && enabled) {
      effectRef.current.updateTime(state.clock.elapsedTime);
    }
  });

  if (!enabled) return null;
  return <primitive object={effect} />;
}

// 💥 Shockwave Effect Component
function ShockwaveComponent({
  intensity,
  size,
  speed,
  enabled
}: {
  intensity: number;
  size: number;
  speed: number;
  enabled: boolean;
}) {
  const { size: canvasSize } = useThree();
  const effectRef = useRef<ShockwaveEffect | null>(null);

  const effect = useMemo(() => {
    const shockwaveEffect = new ShockwaveEffect({ intensity, size, speed });
    effectRef.current = shockwaveEffect;
    return shockwaveEffect;
  }, [intensity, size, speed]);

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current.updateIntensity(intensity);
      effectRef.current.updateSize(size);
      effectRef.current.updateSpeed(speed);
      effectRef.current.updateResolution(canvasSize.width, canvasSize.height);
    }
  }, [intensity, size, speed, canvasSize.width, canvasSize.height]);

  useFrame((state) => {
    if (effectRef.current && enabled) {
      effectRef.current.updateTime(state.clock.elapsedTime);
    }
  });

  if (!enabled) return null;
  return <primitive object={effect} />;
}

// 🌈 Oil Painting Effect Component
function OilPaintingComponent({
  brushSize,
  intensity,
  enabled
}: {
  brushSize: number;
  intensity: number;
  enabled: boolean;
}) {
  const { size } = useThree();
  const effectRef = useRef<OilPaintingEffect | null>(null);

  const effect = useMemo(() => {
    const oilEffect = new OilPaintingEffect({ brushSize, intensity });
    effectRef.current = oilEffect;
    return oilEffect;
  }, [brushSize, intensity]);

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current.updateBrushSize(brushSize);
      effectRef.current.updateIntensity(intensity);
      effectRef.current.updateResolution(size.width, size.height);
    }
  }, [brushSize, intensity, size.width, size.height]);

  if (!enabled) return null;
  return <primitive object={effect} />;
}

// Main ShaderFilters component
interface ShaderFiltersProps {
  edgeDetectionEnabled?: boolean;
  edgeThreshold?: number;
  edgeIntensity?: number;
  pixelationEnabled?: boolean;
  pixelSize?: number;
  motionBlurEnabled?: boolean;
  motionBlurStrength?: number;
  motionBlurSamples?: number;
  velocityScale?: number;
  bloomEnabled?: boolean;
  chromaticAberrationEnabled?: boolean;
  // New effects
  waveDistortionEnabled?: boolean;
  waveAmplitude?: number;
  waveFrequency?: number;
  waveSpeed?: number;
  fireEnabled?: boolean;
  fireIntensity?: number;
  fireScale?: number;
  glitchEnabled?: boolean;
  glitchIntensity?: number;
  glitchSpeed?: number;
  shockwaveEnabled?: boolean;
  shockwaveIntensity?: number;
  shockwaveSize?: number;
  shockwaveSpeed?: number;
  oilPaintingEnabled?: boolean;
  oilBrushSize?: number;
  oilIntensity?: number;
}

export function ShaderFilters({
  edgeDetectionEnabled = false,
  edgeThreshold = 0.1,
  edgeIntensity = 1.0,
  pixelationEnabled = false,
  pixelSize = 8,
  motionBlurEnabled = false,
  motionBlurStrength = 0.75,
  motionBlurSamples = 16,
  velocityScale = 1.0,
  bloomEnabled = false,
  chromaticAberrationEnabled = false,
  // New effects defaults
  waveDistortionEnabled = false,
  waveAmplitude = 0.05,
  waveFrequency = 10.0,
  waveSpeed = 2.0,
  fireEnabled = false,
  fireIntensity = 1.0,
  fireScale = 8.0,
  glitchEnabled = false,
  glitchIntensity = 5,
  glitchSpeed = 10.0,
  shockwaveEnabled = false,
  shockwaveIntensity = 1.0,
  shockwaveSize = 0.1,
  shockwaveSpeed = 1.0,
  oilPaintingEnabled = false,
  oilBrushSize = 3.0,
  oilIntensity = 1.0
}: ShaderFiltersProps) {
  const effects = [];

  if (pixelationEnabled) {
    effects.push(<Pixelation key="pixelation" granularity={pixelSize} />);
  }

  // Use the framebuffer motion blur
  if (motionBlurEnabled) {
    effects.push(
      <FramebufferMotionBlurComponent
        key="framebufferMotionBlur"
        strength={motionBlurStrength}
        enabled={motionBlurEnabled}
      />
    );
  }

  // Wave Distortion Effect
  if (waveDistortionEnabled) {
    effects.push(
      <WaveDistortionComponent
        key="waveDistortion"
        amplitude={waveAmplitude}
        frequency={waveFrequency}
        speed={waveSpeed}
        enabled={waveDistortionEnabled}
      />
    );
  }

  // Fire Effect
  if (fireEnabled) {
    effects.push(
      <FireComponent
        key="fire"
        intensity={fireIntensity}
        scale={fireScale}
        enabled={fireEnabled}
      />
    );
  }

  // Glitch Effect
  if (glitchEnabled) {
    effects.push(
      <GlitchComponent
        key="glitch"
        intensity={glitchIntensity}
        speed={glitchSpeed}
        enabled={glitchEnabled}
      />
    );
  }

  // Shockwave Effect
  if (shockwaveEnabled) {
    effects.push(
      <ShockwaveComponent
        key="shockwave"
        intensity={shockwaveIntensity}
        size={shockwaveSize}
        speed={shockwaveSpeed}
        enabled={shockwaveEnabled}
      />
    );
  }

  // Oil Painting Effect
  if (oilPaintingEnabled) {
    effects.push(
      <OilPaintingComponent
        key="oilPainting"
        brushSize={oilBrushSize}
        intensity={oilIntensity}
        enabled={oilPaintingEnabled}
      />
    );
  }

  if (bloomEnabled) {
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

  if (chromaticAberrationEnabled) {
    effects.push(
      <ChromaticAberration
        key="chromatic"
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(edgeIntensity * 0.002, edgeIntensity * 0.002)}
      />
    );
  }

  if (effects.length === 0) {
    return null;
  }

  return (
    <EffectComposer>
      {effects}
      
    </EffectComposer>
  );
}

export default ShaderFilters;

import { BaseEffect } from '../BaseEffect';
import { BlendFunction } from 'postprocessing';
import { EFFECT_DEFAULTS } from '../constants';
import * as THREE from 'three';

export interface ShockwaveConfig {
  intensity?: number;
  size?: number;
  speed?: number;
}

export class ShockwaveEffect extends BaseEffect {
  private _intensity: number;
  private _size: number;
  private _speed: number;

  constructor(config: ShockwaveConfig = {}) {
    const { 
      intensity = EFFECT_DEFAULTS.SHOCKWAVE.intensity, 
      size = EFFECT_DEFAULTS.SHOCKWAVE.size, 
      speed = EFFECT_DEFAULTS.SHOCKWAVE.speed 
    } = config;
    
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

    const uniforms = new Map([
      ['time', new THREE.Uniform(0.0)],
      ['intensity', new THREE.Uniform(intensity)],
      ['size', new THREE.Uniform(size)],
      ['speed', new THREE.Uniform(speed)],
      ['resolution', new THREE.Uniform(new THREE.Vector2(1920, 1080))]
    ] as [string, THREE.Uniform<any>][]);

    super('ShockwaveEffect', fragmentShader, {
      name: 'ShockwaveEffect',
      blendFunction: BlendFunction.NORMAL,
      uniforms
    });

    this._intensity = intensity;
    this._size = size;
    this._speed = speed;
  }

  updateIntensity(intensity: number) {
    this.updateUniform('intensity', intensity);
    this._intensity = intensity;
  }

  updateSize(size: number) {
    this.updateUniform('size', size);
    this._size = size;
  }

  updateSpeed(speed: number) {
    this.updateUniform('speed', speed);
    this._speed = speed;
  }

  updateResolution(width: number, height: number) {
    this.updateUniform('resolution', new THREE.Vector2(width, height));
  }

  get intensity() { return this._intensity; }
  get size() { return this._size; }
  get speed() { return this._speed; }
}

import { BaseEffect } from '../BaseEffect';
import { BlendFunction } from 'postprocessing';
import { EFFECT_DEFAULTS, SHADER_CONSTANTS } from '../constants';
import * as THREE from 'three';

export interface OilPaintingConfig {
  brushSize?: number;
  intensity?: number;
}

export class OilPaintingEffect extends BaseEffect {
  private _brushSize: number;
  private _intensity: number;

  constructor(config: OilPaintingConfig = {}) {
    const { 
      brushSize = EFFECT_DEFAULTS.OIL_PAINTING.brushSize, 
      intensity = EFFECT_DEFAULTS.OIL_PAINTING.intensity 
    } = config;
    
    const fragmentShader = `
      uniform float brushSize;
      uniform float intensity;
      uniform vec2 texelSize;
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec3 result = vec3(0.0);
        vec3 weights = vec3(0.0);
        
        // 采样周围像素创建油画效果
        for(float i = -brushSize; i <= brushSize; i++) {
          for(float j = -brushSize; j <= brushSize; j++) {
            vec2 offset = vec2(i, j) * texelSize;
            vec2 sampleUV = uv + offset;
            
            if(sampleUV.x >= 0.0 && sampleUV.x <= 1.0 && sampleUV.y >= 0.0 && sampleUV.y <= 1.0) {
              vec3 sampleColor = texture2D(inputBuffer, sampleUV).rgb;
              
              // 计算权重基于距离和颜色相似性
              float distance = length(vec2(i, j)) / brushSize;
              float colorSimilarity = 1.0 - distance(sampleColor, inputColor.rgb);
              float weight = exp(-distance * distance) * (1.0 + colorSimilarity * intensity);
              
              result += sampleColor * weight;
              weights += vec3(weight);
            }
          }
        }
        
        // 归一化结果
        result = result / max(weights, vec3(0.001));
        
        // 与原始颜色混合
        result = mix(inputColor.rgb, result, intensity * 0.5);
        
        outputColor = vec4(result, inputColor.a);
      }
    `;

    const uniforms = new Map([
      ['brushSize', new THREE.Uniform(brushSize)],
      ['intensity', new THREE.Uniform(intensity)],
      ['texelSize', new THREE.Uniform(new THREE.Vector2(1.0 / 1920, 1.0 / 1080))]
    ] as [string, THREE.Uniform<any>][]);

    super('OilPaintingEffect', fragmentShader, {
      name: 'OilPaintingEffect',
      blendFunction: BlendFunction.NORMAL,
      uniforms
    });

    this._brushSize = brushSize;
    this._intensity = intensity;
  }

  updateBrushSize(brushSize: number) {
    this.updateUniform('brushSize', brushSize);
    this._brushSize = brushSize;
  }

  updateIntensity(intensity: number) {
    this.updateUniform('intensity', intensity);
    this._intensity = intensity;
  }

  updateResolution(width: number, height: number) {
    this.updateUniform('texelSize', new THREE.Vector2(1.0 / width, 1.0 / height));
  }

  get brushSize() { return this._brushSize; }
  get intensity() { return this._intensity; }
}

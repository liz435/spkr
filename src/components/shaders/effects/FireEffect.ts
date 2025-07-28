import { BaseEffect } from '../BaseEffect';
import { BlendFunction } from 'postprocessing';
import { EFFECT_DEFAULTS, SHADER_CONSTANTS } from '../constants';
import * as THREE from 'three';

export interface FireConfig {
  intensity?: number;
  scale?: number;
}

export class FireEffect extends BaseEffect {
  private _intensity: number;
  private _scale: number;

  constructor(config: FireConfig = {}) {
    const { 
      intensity = EFFECT_DEFAULTS.FIRE.intensity, 
      scale = EFFECT_DEFAULTS.FIRE.scale 
    } = config;
    
    const fragmentShader = `
      uniform float time;
      uniform float intensity;
      uniform float scale;
      
      ${SHADER_CONSTANTS.NOISE_FUNCTION}
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 fireUV = uv * scale;
        
        // 创建火焰形状
        float fireHeight = 1.0 - uv.y;
        float fireBase = pow(fireHeight, 1.5);
        
        // 添加噪声和动画
        float movement = time * 0.5;
        float noise1 = noise(fireUV + vec2(movement, movement * 0.8));
        float noise2 = noise(fireUV * 2.0 + vec2(movement * 1.3, movement * 0.6));
        float noise3 = noise(fireUV * 4.0 + vec2(movement * 0.7, movement * 1.1));
        
        float combinedNoise = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);
        
        // 火焰形状
        float flame = fireBase * combinedNoise;
        flame = smoothstep(0.2, 0.8, flame);
        
        // 火焰颜色梯度
        vec3 fireColor = vec3(1.0, 0.3, 0.0); // 红色基调
        fireColor = mix(fireColor, vec3(1.0, 0.8, 0.0), flame * 0.7); // 黄色高光
        fireColor = mix(fireColor, vec3(1.0, 1.0, 1.0), flame * flame * 0.5); // 白色核心
        
        // 与原图像混合
        vec3 result = mix(inputColor.rgb, fireColor, flame * intensity * 0.5);
        
        outputColor = vec4(result, inputColor.a);
      }
    `;

    const uniforms = new Map([
      ['time', new THREE.Uniform(0.0)],
      ['intensity', new THREE.Uniform(intensity)],
      ['scale', new THREE.Uniform(scale)]
    ] as [string, THREE.Uniform<any>][]);

    super('FireEffect', fragmentShader, {
      name: 'FireEffect',
      blendFunction: BlendFunction.SCREEN,
      uniforms
    });

    this._intensity = intensity;
    this._scale = scale;
  }

  updateIntensity(intensity: number) {
    this.updateUniform('intensity', intensity);
    this._intensity = intensity;
  }

  updateScale(scale: number) {
    this.updateUniform('scale', scale);
    this._scale = scale;
  }

  get intensity() { return this._intensity; }
  get scale() { return this._scale; }
}

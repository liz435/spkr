import { BaseEffect } from '../BaseEffect';
import { BlendFunction } from 'postprocessing';
import { EFFECT_DEFAULTS } from '../constants';
import * as THREE from 'three';

export interface WaveDistortionConfig {
  amplitude?: number;
  frequency?: number;
  speed?: number;
}

export class WaveDistortionEffect extends BaseEffect {
  private _amplitude: number;
  private _frequency: number;
  private _speed: number;

  constructor(config: WaveDistortionConfig = {}) {
    const { 
      amplitude = EFFECT_DEFAULTS.WAVE_DISTORTION.amplitude, 
      frequency = EFFECT_DEFAULTS.WAVE_DISTORTION.frequency, 
      speed = EFFECT_DEFAULTS.WAVE_DISTORTION.speed 
    } = config;
    
    const fragmentShader = `
      uniform float time;
      uniform float amplitude;
      uniform float frequency;
      uniform float speed;
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        // 创建波浪扭曲效果
        float wave1 = sin((uv.y + time * speed) * frequency) * amplitude;
        float wave2 = sin((uv.x + time * speed * 0.7) * frequency * 1.3) * amplitude * 0.5;
        
        vec2 distortedUV = uv + vec2(wave1, wave2);
        
        // 边界检查
        distortedUV = clamp(distortedUV, 0.0, 1.0);
        
        vec4 distortedColor = texture2D(inputBuffer, distortedUV);
        
        outputColor = distortedColor;
      }
    `;

    const uniforms = new Map([
      ['time', new THREE.Uniform(0.0)],
      ['amplitude', new THREE.Uniform(amplitude)],
      ['frequency', new THREE.Uniform(frequency)],
      ['speed', new THREE.Uniform(speed)]
    ] as [string, THREE.Uniform<any>][]);

    super('WaveDistortionEffect', fragmentShader, {
      name: 'WaveDistortionEffect',
      blendFunction: BlendFunction.NORMAL,
      uniforms
    });

    this._amplitude = amplitude;
    this._frequency = frequency;
    this._speed = speed;
  }

  updateAmplitude(amplitude: number) {
    this.updateUniform('amplitude', amplitude);
    this._amplitude = amplitude;
  }

  updateFrequency(frequency: number) {
    this.updateUniform('frequency', frequency);
    this._frequency = frequency;
  }

  updateSpeed(speed: number) {
    this.updateUniform('speed', speed);
    this._speed = speed;
  }

  get amplitude() { return this._amplitude; }
  get frequency() { return this._frequency; }
  get speed() { return this._speed; }
}

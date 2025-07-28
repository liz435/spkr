import { Effect } from 'postprocessing';
import * as THREE from 'three';

export interface EffectConfig {
  name: string;
  blendFunction?: any;
  uniforms?: Map<string, THREE.Uniform>;
  vertexShader?: string;
}

export abstract class BaseEffect extends Effect {
  protected _time: number = 0;
  
  constructor(
    name: string,
    fragmentShader: string,
    config: EffectConfig
  ) {
    super(name, fragmentShader, {
      blendFunction: config.blendFunction,
      uniforms: config.uniforms,
      vertexShader: config.vertexShader
    });
  }

  updateTime(time: number) {
    this._time = time;
    const timeUniform = this.uniforms.get('time');
    if (timeUniform) {
      timeUniform.value = time;
    }
  }

  protected createUniform(name: string, value: any): THREE.Uniform {
    return new THREE.Uniform(value);
  }

  protected updateUniform(name: string, value: any): void {
    const uniform = this.uniforms.get(name);
    if (uniform) {
      uniform.value = value;
    }
  }

  get time() { return this._time; }
}

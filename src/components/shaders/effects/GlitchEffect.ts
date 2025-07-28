import { BaseEffect } from '../BaseEffect';
import { BlendFunction } from 'postprocessing';
import { SHADER_CONSTANTS, EFFECT_DEFAULTS } from '../constants';
import * as THREE from 'three';

export interface GlitchConfig {
  intensity?: number;
  speed?: number;
}

export class GlitchEffect extends BaseEffect {
  private _intensity: number;
  private _speed: number;

  constructor(config: GlitchConfig = {}) {
    const { intensity = EFFECT_DEFAULTS.GLITCH.intensity, speed = EFFECT_DEFAULTS.GLITCH.speed } = config;
    
    const vertexShader = `
      uniform float time;
      uniform float intensity;
      uniform float speed;
      
      ${SHADER_CONSTANTS.RANDOM_FUNCTION}
      
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

      ${SHADER_CONSTANTS.RANDOM_FUNCTION}
      ${SHADER_CONSTANTS.SOBEL_EDGE_DETECTION}

      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 distortedUV = uv;
        float timeSpeed = time * speed;
        
        // Scanline displacement
        float scanlineShift = sin(timeSpeed * 3.0 + uv.y * 50.0) * intensity * 0.02;
        if (random(vec2(floor(uv.y * 100.0), floor(timeSpeed))) > 0.8) {
          distortedUV.x += scanlineShift;
        }

        // Blocky vertical shift
        float blockY = floor(uv.y * 20.0) / 20.0;
        float blockShift = (random(vec2(blockY, floor(timeSpeed * 2.0))) - 0.5) * intensity * 0.05;
        if (random(vec2(blockY, floor(timeSpeed * 0.5))) > 0.9) {
          distortedUV.x += blockShift;
        }

        // Wave distortion
        distortedUV.x += sin(uv.y * 30.0 + timeSpeed * 8.0) * intensity * 0.003;
        distortedUV.y += cos(uv.x * 15.0 + timeSpeed * 6.0) * intensity * 0.002;

        // Color channel offset
        vec2 rOffset = vec2(intensity * 0.01, 0.0);
        vec2 gOffset = vec2(0.0);
        vec2 bOffset = vec2(-intensity * 0.01, 0.0);

        float r = texture2D(inputBuffer, distortedUV + rOffset).r;
        float g = texture2D(inputBuffer, distortedUV + gOffset).g;
        float b = texture2D(inputBuffer, distortedUV + bOffset).b;

        outputColor = vec4(r, g, b, 1.0);

        // Edge detection
        vec2 texelSize = 1.0 / vec2(1920.0, 1080.0);
        float edge = sobelEdgeDetection(inputBuffer, uv, texelSize);
        outputColor.rgb = mix(outputColor.rgb, vec3(1.0, 0.0, 1.0), edge * intensity * 0.5);

        // Digital noise overlay
        float noise = random(uv + timeSpeed * 0.1);
        if (noise > 0.95) {
          outputColor.rgb = mix(outputColor.rgb, vec3(noise), intensity * 0.3);
        }

        // Flickering digital blocks
        vec2 blockUV = floor(uv * 50.0) / 50.0;
        float blockNoise = random(blockUV + floor(timeSpeed * 10.0));
        if (blockNoise > 0.98) {
          outputColor.rgb = vec3(1.0) - outputColor.rgb;
        }

        // Scanline mask
        float scanline = 0.95 + 0.05 * sin(uv.y * 800.0);
        outputColor.rgb *= scanline;

        // Random color inversion
        if (random(vec2(floor(timeSpeed * 3.0), 0.0)) > 0.95) {
          float inversionMask = step(0.5, random(uv + timeSpeed));
          outputColor.rgb = mix(outputColor.rgb, vec3(1.0) - outputColor.rgb, inversionMask * intensity);
        }

        // Temporal color corruption
        float corruptionTime = floor(timeSpeed * 5.0);
        if (random(vec2(corruptionTime, 0.0)) > 0.9) {
          outputColor.r = outputColor.g;
          outputColor.b = random(uv + corruptionTime);
        }
      }
    `;

    const uniforms = new Map([
      ['time', new THREE.Uniform(0.0)],
      ['intensity', new THREE.Uniform(intensity)],
      ['speed', new THREE.Uniform(speed)]
    ]);

    super('GlitchEffect', fragmentShader, {
      name: 'GlitchEffect',
      blendFunction: BlendFunction.NORMAL,
      uniforms,
      vertexShader
    });

    this._intensity = intensity;
    this._speed = speed;
  }

  updateIntensity(intensity: number) {
    this.updateUniform('intensity', intensity);
    this._intensity = intensity;
  }

  updateSpeed(speed: number) {
    this.updateUniform('speed', speed);
    this._speed = speed;
  }

  get intensity() { return this._intensity; }
  get speed() { return this._speed; }
}

export const SHADER_CONSTANTS = {
  // Common shader functions
  RANDOM_FUNCTION: `
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
  `,
  
  NOISE_FUNCTION: `
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
  `,
  
  FBM_FUNCTION: `
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
  `,
  
  SOBEL_EDGE_DETECTION: `
    float sobelEdgeDetection(sampler2D tex, vec2 uv, vec2 texelSize) {
      vec3 tl = texture2D(tex, uv + vec2(-texelSize.x, -texelSize.y)).rgb;
      vec3 tm = texture2D(tex, uv + vec2(0.0, -texelSize.y)).rgb;
      vec3 tr = texture2D(tex, uv + vec2(texelSize.x, -texelSize.y)).rgb;
      vec3 ml = texture2D(tex, uv + vec2(-texelSize.x, 0.0)).rgb;
      vec3 mr = texture2D(tex, uv + vec2(texelSize.x, 0.0)).rgb;
      vec3 bl = texture2D(tex, uv + vec2(-texelSize.x, texelSize.y)).rgb;
      vec3 bm = texture2D(tex, uv + vec2(0.0, texelSize.y)).rgb;
      vec3 br = texture2D(tex, uv + vec2(texelSize.x, texelSize.y)).rgb;
      
      vec3 sobelX = tl + 2.0*ml + bl - tr - 2.0*mr - br;
      vec3 sobelY = tl + 2.0*tm + tr - bl - 2.0*bm - br;
      
      return smoothstep(0.1, 0.3, length(sobelX) + length(sobelY));
    }
  `,
  
  // Default resolutions
  DEFAULT_RESOLUTION: new Float32Array([1920, 1080]),
  
  // Common blend modes
  BLEND_MODES: {
    NORMAL: 'BlendFunction.NORMAL',
    SCREEN: 'BlendFunction.SCREEN',
    MULTIPLY: 'BlendFunction.MULTIPLY'
  }
};

export const EFFECT_DEFAULTS = {
  GLITCH: {
    intensity: 0.5,
    speed: 10.0
  },
  SHOCKWAVE: {
    intensity: 1.0,
    size: 0.1,
    speed: 1.0
  },
  WAVE_DISTORTION: {
    amplitude: 0.05,
    frequency: 10.0,
    speed: 2.0
  },
  FIRE: {
    intensity: 1.0,
    scale: 8.0
  },
  OIL_PAINTING: {
    brushSize: 3.0,
    intensity: 1.0
  }
};

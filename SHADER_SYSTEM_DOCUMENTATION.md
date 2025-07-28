# SPKR Shader Effects System - Comprehensive Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Effect Classes](#effect-classes)
4. [Implementation Details](#implementation-details)
5. [Integration Guide](#integration-guide)
6. [Performance Considerations](#performance-considerations)
7. [Troubleshooting](#troubleshooting)
8. [Future Enhancements](#future-enhancements)

---

## Overview

The SPKR Shader Effects System is a comprehensive post-processing pipeline built on top of Three.js and the `postprocessing` library. It provides a collection of visual effects including motion blur, wave distortion, fire effects, glitch effects, shockwave distortions, and artistic filters like oil painting.

### Key Features
- **Real-time Post-processing**: GPU-accelerated effects with minimal performance impact
- **Modular Architecture**: Each effect is self-contained and can be enabled/disabled independently
- **Parameter Control**: Real-time adjustment of effect parameters through UI controls
- **Camera Integration**: Advanced camera motion tracking for effects like motion blur
- **Cross-platform Compatibility**: Works across different devices and browsers

### Technology Stack
- **Three.js**: 3D rendering engine
- **postprocessing**: Post-processing effects library
- **React Three Fiber**: React integration for Three.js
- **TypeScript**: Type-safe development
- **GLSL**: GPU shader programming language

---

## Architecture

### System Components

```
ShaderFilters System
├── Effect Classes (GLSL Shaders)
│   ├── FramebufferMotionBlurEffect
│   ├── WaveDistortionEffect
│   ├── FireEffect
│   ├── GlitchEffect
│   ├── ShockwaveEffect
│   ├── ImprovedShockwaveEffect
│   └── OilPaintingEffect
├── React Components (Wrappers)
│   ├── FramebufferMotionBlurComponent
│   ├── WaveDistortionComponent
│   ├── FireComponent
│   ├── GlitchComponent
│   ├── ShockwaveComponent
│   ├── ImprovedShockwaveComponent
│   └── OilPaintingComponent
├── Main Controller
│   └── ShaderFilters (Orchestrates all effects)
└── UI Controls
    └── ShaderFilterControls (Parameter adjustment interface)
```

### Data Flow

1. **User Input** → UI Controls update state variables
2. **State Changes** → React props passed to ShaderFilters component
3. **Effect Instantiation** → Individual effect components created based on enabled flags
4. **Shader Execution** → GPU executes GLSL shaders for each effect
5. **Composition** → EffectComposer combines all effects into final output

---

## Effect Classes

### 1. FramebufferMotionBlurEffect

**Purpose**: Creates realistic motion blur by blending current and previous frames based on camera movement.

**Key Features**:
- Frame buffering for temporal blending
- Camera velocity tracking
- Adjustable blur strength

**GLSL Shader Logic**:
```glsl
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec4 currentFrame = inputColor;
  
  if (hasPreviousFrame) {
    vec2 offset = -cameraVelocity * 0.012 * strength;
    vec2 offsetUV = uv + offset;
    offsetUV = clamp(offsetUV, 0.0, 1.0);
    
    vec4 previousFrameColor = texture2D(previousFrame, offsetUV);
    float blendAmount = strength * 0.6;
    outputColor = mix(currentFrame, previousFrameColor, blendAmount);
  } else {
    outputColor = currentFrame;
  }
}
```

**Parameters**:
- `strength` (0.0-2.0): Controls blur intensity

**Performance**: Medium - Requires frame buffering and texture sampling

### 2. WaveDistortionEffect

**Purpose**: Creates animated wave-like distortions across the screen.

**Key Features**:
- Sinusoidal wave mathematics
- Configurable frequency and amplitude
- Time-based animation

**GLSL Shader Logic**:
```glsl
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 distortedUV = uv;
  
  // Horizontal wave distortion
  distortedUV.x += sin(uv.y * frequency + time * speed) * amplitude;
  
  // Vertical wave distortion  
  distortedUV.y += cos(uv.x * frequency * 0.7 + time * speed * 0.8) * amplitude * 0.5;
  
  distortedUV = clamp(distortedUV, 0.0, 1.0);
  outputColor = texture2D(inputBuffer, distortedUV);
}
```

**Parameters**:
- `amplitude` (0.0-0.2): Wave displacement strength
- `frequency` (1.0-50.0): Wave frequency/density
- `speed` (0.1-10.0): Animation speed

**Performance**: Low - Simple mathematical operations

### 3. FireEffect

**Purpose**: Simulates fire and heat distortion effects using procedural noise.

**Key Features**:
- Fractal Brownian Motion (FBM) noise
- Fire color gradient mapping
- Vertical flame simulation

**GLSL Shader Logic**:
```glsl
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
  
  vec3 fireColor = mix(vec3(1.0, 0.2, 0.0), vec3(1.0, 0.8, 0.0), flame);
  fireColor = mix(fireColor, vec3(1.0, 1.0, 1.0), flame * flame);
  
  outputColor = mix(inputColor, vec4(fireColor, 1.0), flame * 0.5);
}
```

**Parameters**:
- `intensity` (0.0-3.0): Fire visibility/strength
- `scale` (1.0-20.0): Fire texture scale

**Performance**: Medium - Multiple noise function calls

### 4. GlitchEffect

**Purpose**: Creates digital glitch artifacts including scanlines, color separation, and data corruption effects.

**Key Features**:
- Scanline displacement
- RGB channel separation
- Digital noise overlay
- Edge detection enhancement
- Temporal corruption effects

**GLSL Shader Logic**:
```glsl
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 distortedUV = uv;
  
  // Scanline displacement
  float timeSpeed = time * speed;
  float scanlineShift = sin(timeSpeed * 3.0 + uv.y * 50.0) * intensity * 0.02;
  if (random(vec2(floor(uv.y * 100.0), floor(timeSpeed))) > 0.8) {
    distortedUV.x += scanlineShift;
  }
  
  // Color channel offset
  vec2 rOffset = vec2(intensity * 0.01, 0.0);
  vec2 bOffset = vec2(-intensity * 0.01, 0.0);
  
  float r = texture2D(inputBuffer, distortedUV + rOffset).r;
  float g = texture2D(inputBuffer, distortedUV).g;
  float b = texture2D(inputBuffer, distortedUV + bOffset).b;
  
  outputColor = vec4(r, g, b, 1.0);
  
  // Additional glitch effects...
}
```

**Parameters**:
- `intensity` (0.0-2.0): Overall glitch strength
- `speed` (1.0-50.0): Animation speed

**Performance**: High - Complex calculations and multiple texture samples

### 5. ShockwaveEffect & ImprovedShockwaveEffect

**Purpose**: Creates expanding circular distortion waves emanating from the screen center.

**Key Features**:
- Radial distance calculations
- Time-based wave propagation
- Aspect ratio compensation
- Configurable wave parameters

**GLSL Shader Logic**:
```glsl
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  float ratio = resolution.y / resolution.x;
  
  vec2 waveCentre = vec2(0.5, 0.5);
  waveCentre.y *= ratio;
  vec2 texCoord = uv;
  texCoord.y *= ratio;
  
  float dist = distance(texCoord, waveCentre);
  vec4 color = inputColor;
  
  float currentTime = mod(time * 0.8, 1.5);
  float waveRadius = currentTime;
  float waveThickness = waveWidth;
  
  if (dist <= (waveRadius + waveThickness) &&
      dist >= (waveRadius - waveThickness) &&
      waveRadius > 0.01) {
        
    float diff = (dist - waveRadius);
    float scaleDiff = (1.0 - pow(abs(diff * 10.0), 0.8));
    float diffTime = diff * scaleDiff;
    vec2 diffTexCoord = normalize(texCoord - waveCentre);
    
    float distortionAmount = (diffTime * intensity) / max(waveRadius * dist * 40.0, 0.001);
    vec2 distortedUV = uv + (diffTexCoord * distortionAmount);
    
    color = texture2D(inputBuffer, clamp(distortedUV, 0.0, 1.0));
    
    float colorBoost = (scaleDiff * intensity) / max(waveRadius * dist * 40.0, 0.001);
    color += color * colorBoost;
  }
  
  outputColor = color;
}
```

**Parameters**:
- `intensity` (0.1-5.0): Distortion strength
- `waveWidth` (0.01-0.5): Wave ring thickness
- `waveStrength` (5.0-50.0): Mathematical distortion parameter

**Performance**: Medium - Distance calculations and conditional sampling

### 6. OilPaintingEffect

**Purpose**: Creates an artistic oil painting appearance through pixel averaging and quantization.

**Key Features**:
- Circular pixel sampling
- Color quantization
- Brush size simulation

**GLSL Shader Logic**:
```glsl
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
  avgColor.rgb = floor(avgColor.rgb * 8.0) / 8.0; // Quantization
  
  outputColor = mix(inputColor, avgColor, intensity);
}
```

**Parameters**:
- `brushSize` (1.0-10.0): Sampling radius
- `intensity` (0.0-1.0): Effect blend strength

**Performance**: High - Nested loops with multiple texture samples

---

## Implementation Details

### Effect Class Structure

All effects inherit from the `postprocessing.Effect` base class and follow this pattern:

```typescript
class CustomEffect extends Effect {
  private _parameter: number;
  
  constructor(config: CustomEffectConfig = {}) {
    const fragmentShader = `
      // GLSL shader code
    `;
    
    super('CustomEffect', fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['parameter', new THREE.Uniform(value)]
      ] as any)
    });
    
    this._parameter = value;
  }
  
  updateParameter(value: number) {
    this.uniforms.get('parameter')!.value = value;
    this._parameter = value;
  }
  
  updateTime(time: number) {
    this.uniforms.get('time')!.value = time;
  }
}
```

### React Component Wrapper Pattern

Each effect has a corresponding React component that handles:
- Effect instantiation
- Parameter updates
- Time/frame updates
- Conditional rendering

```typescript
function CustomEffectComponent({ parameter, enabled }: Props) {
  const effectRef = useRef<CustomEffect | null>(null);
  
  const effect = useMemo(() => {
    const customEffect = new CustomEffect({ parameter });
    effectRef.current = customEffect;
    return customEffect;
  }, [parameter]);
  
  useEffect(() => {
    if (effectRef.current) {
      effectRef.current.updateParameter(parameter);
    }
  }, [parameter]);
  
  useFrame((state) => {
    if (effectRef.current && enabled) {
      effectRef.current.updateTime(state.clock.elapsedTime);
    }
  });
  
  if (!enabled) return null;
  return <primitive object={effect} />;
}
```

### Uniform Management

Uniforms are the bridge between JavaScript and GLSL:

- **Scalars**: `new THREE.Uniform(0.5)`
- **Vectors**: `new THREE.Uniform(new THREE.Vector2(1920, 1080))`
- **Textures**: `new THREE.Uniform(texture)`
- **Booleans**: `new THREE.Uniform(true)`

### Time-based Animation

Most effects use time-based animation for continuous motion:

```glsl
float currentTime = mod(time * speed, cycleLength);
```

This creates looping animations with configurable speed and cycle duration.

---

## Integration Guide

### Basic Setup

1. **Import the ShaderFilters component**:
```typescript
import ShaderFilters from '@/components/ShaderFilters';
```

2. **Add to your Three.js scene**:
```tsx
<Canvas>
  <Scene />
  <ShaderFilters
    glitchEnabled={true}
    glitchIntensity={0.5}
    glitchSpeed={10.0}
    // ... other props
  />
</Canvas>
```

3. **Add UI controls** (optional):
```tsx
import ShaderFilterControls from '@/components/ui/ShaderFilterControls';

<ShaderFilterControls
  onGlitchChange={setGlitchEnabled}
  onGlitchIntensityChange={setGlitchIntensity}
  // ... other callbacks
/>
```

### State Management

Use React state to control effect parameters:

```typescript
const [effectEnabled, setEffectEnabled] = useState(false);
const [effectIntensity, setEffectIntensity] = useState(1.0);
const [effectSpeed, setEffectSpeed] = useState(5.0);
```

### Custom Effects

To add a new effect:

1. **Create the Effect class**:
```typescript
class MyCustomEffect extends Effect {
  // Implementation following the pattern above
}
```

2. **Create the React component wrapper**:
```typescript
function MyCustomEffectComponent(props) {
  // Implementation following the pattern above
}
```

3. **Add to ShaderFilters**:
```typescript
if (myCustomEffectEnabled) {
  effects.push(
    <MyCustomEffectComponent
      key="myCustomEffect"
      enabled={myCustomEffectEnabled}
      // ... props
    />
  );
}
```

4. **Update TypeScript interfaces**:
```typescript
interface ShaderFiltersProps {
  // ... existing props
  myCustomEffectEnabled?: boolean;
  myCustomEffectParameter?: number;
}
```

---

## Performance Considerations

### GPU Performance

- **Fragment Shader Complexity**: More complex shaders (like GlitchEffect) have higher GPU load
- **Texture Sampling**: Multiple texture reads per pixel increase memory bandwidth usage
- **Mathematical Operations**: Trigonometric and power functions are computationally expensive

### CPU Performance

- **React Re-renders**: Use `useMemo` and `useCallback` to prevent unnecessary re-renders
- **Uniform Updates**: Only update uniforms when values change
- **Effect Instantiation**: Avoid recreating effects on every render

### Optimization Strategies

1. **Effect Ordering**: Place less expensive effects first in the pipeline
2. **Conditional Rendering**: Disable effects when not visible
3. **LOD System**: Reduce effect quality at distance or on lower-end devices
4. **Resolution Scaling**: Run effects at lower resolution and upscale

### Performance Monitoring

```typescript
// Monitor frame rate
useFrame((state) => {
  console.log('FPS:', 1 / state.clock.getDelta());
});

// GPU timing (WebGL 2.0)
const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
```

### Device-Specific Optimizations

```typescript
// Detect device capabilities
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const hasHighPerformanceGPU = gl.getParameter(gl.MAX_TEXTURE_SIZE) >= 8192;

// Adjust effect quality accordingly
const effectQuality = isMobile ? 'low' : 'high';
```

---

## Troubleshooting

### Common Issues

1. **Effects Not Visible**
   - Check if effect is enabled: `effectEnabled={true}`
   - Verify parameters are within valid ranges
   - Ensure EffectComposer is properly set up

2. **Performance Issues**
   - Disable expensive effects (Glitch, Oil Painting)
   - Reduce effect parameters (brush size, sample counts)
   - Check for unnecessary re-renders

3. **Shader Compilation Errors**
   - Check browser console for GLSL errors
   - Verify uniform declarations match usage
   - Ensure GLSL syntax is correct for target WebGL version

4. **Time-based Animation Not Working**
   - Verify `useFrame` is called for time updates
   - Check if `updateTime` method is implemented
   - Ensure time uniform is declared in shader

### Debugging Techniques

1. **Visual Debugging**:
```glsl
// Output specific values as colors for debugging
outputColor = vec4(someValue, 0.0, 0.0, 1.0); // Red channel shows value
```

2. **Console Logging**:
```typescript
useFrame((state) => {
  console.log('Effect time:', state.clock.elapsedTime);
});
```

3. **Shader Validation**:
```typescript
// Check if shader compiled successfully
if (!effect.shader) {
  console.error('Shader compilation failed');
}
```

### Browser Compatibility

- **WebGL Support**: Check `WebGLRenderingContext` availability
- **Extension Support**: Verify required extensions are available
- **GLSL Version**: Use appropriate GLSL version for target browsers

---

## Future Enhancements

### Planned Features

1. **Advanced Effects**
   - Volumetric lighting
   - Screen-space reflections
   - Temporal anti-aliasing (TAA)
   - Depth of field with bokeh

2. **Performance Improvements**
   - Multi-threaded shader compilation
   - Adaptive quality system
   - GPU profiling integration
   - Memory pool management

3. **User Experience**
   - Effect presets system
   - Real-time parameter curves
   - Visual effect editor
   - Shader hot-reloading

4. **Technical Enhancements**
   - WebGPU support
   - Compute shader integration
   - HDR rendering pipeline
   - Advanced tone mapping

### Architecture Evolution

1. **Modular System**
   - Plugin-based architecture
   - Effect marketplace
   - Dynamic effect loading
   - Version management

2. **Development Tools**
   - Shader debugger
   - Performance profiler
   - Visual shader editor
   - Automated testing

3. **Platform Expansion**
   - Mobile optimization
   - VR/AR support
   - Cloud rendering
   - Real-time collaboration

### Community Contributions

1. **Documentation**
   - Video tutorials
   - Interactive examples
   - Best practices guide
   - Community cookbook

2. **Effect Library**
   - Community-contributed effects
   - Curated effect collections
   - Version control for effects
   - Rating and review system

---

## Conclusion

The SPKR Shader Effects System provides a robust foundation for real-time visual effects in web applications. Its modular architecture, comprehensive effect library, and performance-focused design make it suitable for both simple visual enhancements and complex artistic applications.

The system's strength lies in its balance between power and usability - complex GPU programming is abstracted behind simple React components, while still providing the flexibility for advanced customization.

For future development, the focus should be on expanding the effect library, improving performance, and enhancing the developer experience through better tooling and documentation.

---

**Last Updated**: July 28, 2025  
**Version**: 1.0.0  
**Maintainer**: SPKR Development Team

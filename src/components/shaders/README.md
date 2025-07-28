# Shader Effects Architecture

This document describes the modular shader effects architecture implemented for better maintainability and long-term development.

## Architecture Overview

The shader effects system has been refactored from inline class definitions to a modular architecture with the following structure:

```
src/components/shaders/
├── BaseEffect.ts          # Abstract base class for all shader effects
├── constants.ts           # Shared GLSL functions and default configurations
└── effects/
    ├── index.ts          # Exports all effects and their types
    ├── GlitchEffect.ts   # Modular glitch effect implementation
    ├── ShockwaveEffect.ts # Modular shockwave effect implementation
    ├── FireEffect.ts     # Modular fire effect implementation
    ├── WaveDistortionEffect.ts # Modular wave distortion effect
    └── OilPaintingEffect.ts    # Modular oil painting effect
```

## Key Components

### BaseEffect.ts
Abstract base class that provides common functionality for all shader effects:
- **Time Management**: Centralized time uniform handling
- **Uniform Updates**: Consistent uniform updating patterns
- **Effect Configuration**: Standardized configuration handling
- **Extension Points**: Abstract methods for custom effect behavior

```typescript
export abstract class BaseEffect extends Effect {
  protected constructor(name: string, fragmentShader: string, config: any)
  updateTime(time: number): void
  updateUniform(name: string, value: any): void
}
```

### constants.ts
Centralized location for:
- **GLSL Functions**: Reusable shader functions (noise, random, fbm, sobel edge detection)
- **Default Values**: Consistent default configurations across all effects
- **Shared Constants**: Common values like default resolution, blend modes

```typescript
export const SHADER_CONSTANTS = {
  RANDOM_FUNCTION: string,
  NOISE_FUNCTION: string,
  FBM_FUNCTION: string,
  SOBEL_EDGE_DETECTION: string,
  // ...
}

export const EFFECT_DEFAULTS = {
  GLITCH: { intensity: 0.5, speed: 10.0 },
  SHOCKWAVE: { intensity: 1.0, size: 0.1, speed: 1.0 },
  // ...
}
```

### Individual Effect Classes
Each effect is now a separate module with:
- **Type Definitions**: TypeScript interfaces for configuration
- **Class Implementation**: Extends BaseEffect with specific functionality
- **Parameter Management**: Dedicated methods for updating effect parameters
- **GLSL Integration**: Uses shared constants and functions

## Benefits of Modular Architecture

### 1. **Maintainability**
- **Separation of Concerns**: Each effect is self-contained
- **Easier Debugging**: Issues isolated to specific effect modules
- **Clear Dependencies**: Import/export relationships are explicit

### 2. **Scalability**
- **Easy to Add Effects**: Follow established patterns
- **Consistent API**: All effects share common base functionality
- **Reduced Code Duplication**: Shared utilities in constants.ts

### 3. **Reusability**
- **GLSL Functions**: Shared shader code prevents duplication
- **Configuration Patterns**: Consistent configuration interfaces
- **Component Integration**: Standardized React component wrappers

### 4. **Type Safety**
- **Configuration Types**: TypeScript interfaces for all effect configs
- **Method Signatures**: Consistent parameter types across effects
- **Import/Export Types**: Full type information available

## Usage Examples

### Creating a New Effect

1. **Define Configuration Interface**:
```typescript
export interface MyEffectConfig {
  intensity?: number;
  speed?: number;
}
```

2. **Implement Effect Class**:
```typescript
export class MyEffect extends BaseEffect {
  constructor(config: MyEffectConfig = {}) {
    const { intensity = 1.0, speed = 1.0 } = config;
    
    const fragmentShader = `
      uniform float intensity;
      uniform float speed;
      uniform float time;
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        // Your shader logic here
        outputColor = inputColor;
      }
    `;
    
    const uniforms = new Map([
      ['time', new THREE.Uniform(0.0)],
      ['intensity', new THREE.Uniform(intensity)],
      ['speed', new THREE.Uniform(speed)]
    ] as [string, THREE.Uniform<any>][]);
    
    super('MyEffect', fragmentShader, {
      name: 'MyEffect',
      blendFunction: BlendFunction.NORMAL,
      uniforms
    });
  }
  
  updateIntensity(intensity: number) {
    this.updateUniform('intensity', intensity);
  }
}
```

3. **Add to index.ts**:
```typescript
export { MyEffect } from './MyEffect';
export type { MyEffectConfig } from './MyEffect';
```

### Using Effects in Components

```typescript
import { MyEffect } from './shaders/effects';

function MyEffectComponent({ intensity, speed, enabled }) {
  const effectRef = useRef<MyEffect>();
  
  const effect = useMemo(() => {
    const eff = new MyEffect({ intensity, speed });
    effectRef.current = eff;
    return eff;
  }, []);

  useFrame((state) => {
    if (effectRef.current) {
      effectRef.current.updateTime(state.clock.elapsedTime);
      effectRef.current.updateIntensity(intensity);
    }
  });

  if (!enabled) return null;
  return <primitive object={effect} />;
}
```

## Migration Notes

The original `ShaderFilters.tsx` has been backed up as `ShaderFilters.old.tsx`. The new implementation:

- **Maintains Full Compatibility**: All existing props and functionality preserved
- **Improved Structure**: Cleaner separation between effect logic and React components
- **Better Performance**: Reduced code duplication and more efficient imports
- **Enhanced Maintainability**: Easier to modify individual effects without affecting others

## Future Enhancements

The modular architecture enables several future improvements:

1. **Dynamic Effect Loading**: Load effects on-demand for better performance
2. **Effect Composition**: Combine multiple effects more easily
3. **Shader Hot Reloading**: Development-time shader reloading
4. **Effect Presets**: Predefined combinations of effects with optimized parameters
5. **Performance Profiling**: Per-effect performance monitoring
6. **Custom Effect API**: Plugin system for user-defined effects

## Best Practices

When working with the modular shader architecture:

1. **Use TypeScript Interfaces**: Always define configuration types
2. **Extend BaseEffect**: Don't bypass the base class functionality
3. **Update Constants**: Add shared GLSL functions to constants.ts
4. **Test Individually**: Each effect should work independently
5. **Document Parameters**: Clearly document what each parameter controls
6. **Handle Edge Cases**: Implement proper bounds checking and fallbacks
7. **Optimize Performance**: Use efficient GLSL code and minimal uniforms

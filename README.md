## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/spkr.git
cd spkr
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or  
pnpm install
# or
bun install
```

3. **Start the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

### Directory Overview

```
spkr/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── page.tsx           # Main application entry point
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── globals.css        # Global Tailwind styles
│   │   ├── favicon.ico        # Application icon
│   │   └── shader-demo/       # Shader effects demo page
│   │       └── page.tsx       # Isolated shader testing environment
│   └── components/
│       ├── Speaker.tsx        # 🎵 Main 3D speaker orchestrator
│       ├── Face.tsx          # 🎨 Individual speaker face components
│       ├── FaceBox.tsx       # 📦 Face selection and highlighting
│       ├── ShaderFilters.tsx  # 🌟 Post-processing effects manager
│       ├── TextureManager.tsx # 🖼️ Dynamic texture loading system
│       ├── InteractiveBackground.tsx # 🌌 Dynamic background system
│       ├── SceneEnvironmentNew.tsx   # 🌍 HDR environment manager
│       ├── SPKRBackground.tsx        # 🎭 Custom background effects
│       └── ui/               # 🎛️ User Interface Components
│           ├── DebugPanel.tsx        # 🐛 Development debugging tools
│           ├── FloatingHeader.tsx    # 📱 Main navigation header
│           ├── FloatingCards.tsx     # 💳 Information cards system
│           ├── SideBar.tsx          # 📋 Main control panel
│           ├── SideBarNew.tsx       # 📋 Enhanced control interface
│           ├── Header.tsx           # 🔝 Page header component
│           ├── MaterialControls.tsx  # 🧱 PBR material adjustments
│           ├── ModelControls.tsx     # 🎮 3D model visibility controls
│           ├── PositionControls.tsx  # 📍 Object positioning system
│           ├── RenderingControls.tsx # 🎨 Rendering pipeline settings
│           ├── SceneControls.tsx     # 🎬 Scene management interface
│           ├── SpeakerControls.tsx   # 🔊 Speaker-specific controls
│           ├── FaceSelector.tsx      # 🎯 Face selection interface
│           ├── TextureControls.tsx   # 🖼️ Texture management UI
│           ├── AudioControls.tsx     # 🎵 Audio system interface
│           ├── ShaderFilterControls.tsx # ✨ Shader parameter controls
│           ├── MotionBlurControls.tsx   # 🌀 Motion blur settings
│           └── spotify/             # 🎵 Spotify integration
│               └── Spotify.tsx      # 🎧 Spotify player component
├── public/                    # Static Assets
│   ├── concret.glb           # 🏗️ Concrete structure model
│   ├── Couch_Textured.gltf   # 🛋️ Textured couch model
│   ├── Couch.glb             # 🛋️ Basic couch model
│   ├── woofer1.glb           # 🔊 Woofer speaker model
│   ├── *.svg                 # 🖼️ UI icons and graphics
│   └── texture/              # 🎨 PBR Texture Collections
│       ├── brick/            # 🧱 Brick wall textures
│       │   ├── *_basecolor.jpg    # Albedo maps
│       │   ├── *_normal.jpg       # Normal maps
│       │   ├── *_roughness.jpg    # Roughness maps
│       │   ├── *_ambientOcclusion.jpg # AO maps
│       │   └── *_height.png       # Height/displacement maps
│       ├── plaster/          # 🏠 Plaster wall textures
│       │   ├── *_COLOR.jpg        # Diffuse color maps
│       │   ├── *_NORM.jpg         # Normal maps
│       │   ├── *_ROUGH.jpg        # Roughness maps
│       │   ├── *_OCC.jpg          # Occlusion maps
│       │   └── *_DISP.png         # Displacement maps
│       └── wood_floor/       # 🪵 Wood flooring textures
│           ├── *_basecolor.jpg    # Wood color maps
│           ├── *_normal.jpg       # Wood grain normals
│           ├── *_roughness.jpg    # Surface roughness
│           ├── *_ambientOcclusion.jpg # Shadow details
│           └── *_height.png       # Wood surface height
├── Documentation Files       # 📚 Project Documentation
│   ├── README.md             # 📖 This comprehensive guide
│   ├── SHADER_SYSTEM_DOCUMENTATION.md # 🌟 Shader system deep-dive
│   ├── DEBUGPANEL_USAGE_EXAMPLE.md    # 🐛 Debug tools guide
│   ├── PBR_BRICK_DEMO.md            # 🧱 PBR materials demo
│   ├── PBR_MATERIALS_COMPARISON.md  # 🔬 Material comparison guide
│   ├── POST_PROCESSING_GUIDE.md     # ✨ Post-processing guide
│   ├── POST_PROCESSING_TEST.md      # 🧪 Effect testing guide
│   ├── SHADER_FILTERS_GUIDE.md      # 🎨 Shader filters documentation
│   ├── SHADER_OPTIMIZATION_GUIDE.md # ⚡ Performance optimization
│   ├── TEXTURE_GUIDE.md             # 🖼️ Texture usage guide
│   └── TEXTURE_USAGE_EXAMPLES.md    # 🎨 Texture implementation examples
└── Configuration Files       # ⚙️ Project Configuration
    ├── package.json          # 📦 Dependencies and scripts
    ├── tsconfig.json         # 🔧 TypeScript configuration
    ├── next.config.ts        # ⚡ Next.js configuration
    ├── postcss.config.mjs    # 🎨 PostCSS configuration
    └── next-env.d.ts         # 🔤 Next.js type definitions
```

### Architecture & Manager Systems

#### 🎵 Speaker System Manager (`Speaker.tsx`)
The central orchestrator that manages all speaker-related functionality:

**Responsibilities:**
- **Model Loading**: Dynamically loads and manages 3D speaker models
- **Face Management**: Coordinates individual speaker faces and their states
- **Color System**: Manages face-specific color changes and material updates
- **Audio Integration**: Connects visual elements with audio controls
- **State Synchronization**: Ensures all speaker components stay in sync

**Key Features:**
```typescript
interface SpeakerState {
  rotation: number;           // Speaker rotation angle
  color: string;             // Primary speaker color
  volume: number;            // Audio volume level
  bass: number;              // Bass level control
  treble: number;            // Treble level control
  currentPreset: string;     // Active audio preset
  faceColors: { [key: string]: string }; // Individual face colors
}
```

**Manager Pattern:**
- Uses React state management for real-time updates
- Implements observer pattern for face selection events
- Manages lifecycle of 3D objects and materials

#### 🌟 Shader Effects Manager (`ShaderFilters.tsx`)
Advanced post-processing pipeline that manages visual effects:

**Architecture:**
- **Effect Classes**: Individual GLSL shader implementations
- **Component Wrappers**: React components for each effect
- **Pipeline Manager**: Orchestrates effect composition and ordering
- **Parameter System**: Real-time uniform management

**Effect Management:**
```typescript
interface EffectManager {
  effects: Map<string, Effect>;        // Active effects registry
  parameters: Map<string, number>;     // Effect parameter values
  enabled: Map<string, boolean>;       // Effect enable/disable states
  updateQueue: Array<EffectUpdate>;    // Pending parameter updates
}
```

**Performance Optimization:**
- Conditional effect instantiation (only create when enabled)
- Efficient uniform updates (only when values change)
- Automatic effect cleanup and memory management

#### 🖼️ Texture Manager (`TextureManager.tsx`)
Handles dynamic texture loading and PBR material management:

**Capabilities:**
- **Dynamic Loading**: Lazy-load textures based on material selection
- **Cache Management**: Efficient texture caching and reuse
- **Format Support**: Handles various texture formats (JPG, PNG, HDR)
- **PBR Pipeline**: Manages complete PBR texture sets (albedo, normal, roughness, AO, height)

**Texture Workflow:**
```typescript
interface TextureSet {
  baseColor: THREE.Texture;      // Albedo/diffuse map
  normal: THREE.Texture;         // Normal map for surface detail
  roughness: THREE.Texture;      // Surface roughness control
  metalness: THREE.Texture;      // Metallic properties
  ambientOcclusion: THREE.Texture; // Shadow detail enhancement
  height: THREE.Texture;         // Displacement/parallax mapping
}
```

#### 🌍 Environment Manager (`SceneEnvironmentNew.tsx`)
Controls HDR environments and lighting systems:

**Features:**
- **HDR Loading**: Dynamic HDR environment map loading
- **Lighting Control**: Manages environment lighting intensity
- **Background Management**: Controls environment background visibility
- **Tone Mapping**: Handles exposure and tone mapping settings

#### 🎛️ UI Control System (`ui/` directory)
Modular control interface system with specialized managers:

**Control Hierarchy:**
- **Primary Controls**: `SideBar.tsx` - Main control interface
- **Specialized Panels**: Individual controls for specific systems
- **Debug Interface**: `DebugPanel.tsx` - Development tools
- **Floating Elements**: `FloatingHeader.tsx`, `FloatingCards.tsx`

**State Management Pattern:**
```typescript
// Each control manager follows this pattern:
interface ControlManager<T> {
  state: T;                    // Current control state
  handlers: {                  // Event handlers
    onChange: (value: any) => void;
    onReset: () => void;
    onPreset: (preset: string) => void;
  };
  validation: {                // Input validation
    min: number;
    max: number;
    step: number;
  };
}
```

### Data Flow & System Integration

#### 🔄 Application Data Flow
```
User Input → UI Controls → State Management → Component Updates → 3D Rendering → Post-Processing → Display

1. User Interaction (Mouse, Keyboard, UI Controls)
   ↓
2. Event Handlers (onClick, onChange, onHover)
   ↓  
3. React State Updates (useState, useCallback)
   ↓
4. Component Re-renders (conditional rendering)
   ↓
5. Three.js Object Updates (position, rotation, material)
   ↓
6. Shader Uniform Updates (real-time parameter changes)
   ↓
7. GPU Rendering Pipeline (vertex → fragment → post-processing)
   ↓
8. Final Frame Output (displayed to user)
```

#### 🎯 Component Communication Patterns

**Parent-Child Communication:**
```typescript
// Parent passes down props and callbacks
<SpeakerControls
  speakerState={speakerState}
  onRotationChange={handleRotationChange}
  onColorChange={handleColorChange}
  onVolumeChange={handleVolumeChange}
/>

// Child components emit events upward
const handleFaceClick = (faceId: string) => {
  setSelectedFace(faceId);
  onFaceSelect?.(faceId); // Optional callback to parent
};
```

**State Lifting Pattern:**
- Main application state lives in `page.tsx`
- UI controls receive state and callbacks as props
- 3D components receive state for rendering updates
- Debug panel receives read-only state for monitoring

**Context-Based Systems:**
```typescript
// Three.js context for 3D-related data
const { camera, scene, gl } = useThree();

// Frame-based updates for animations
useFrame((state, delta) => {
  // Update time-based effects
  shaderRef.current?.updateTime(state.clock.elapsedTime);
});
```

#### 🔧 Manager Initialization Sequence

**Application Startup:**
1. **Next.js Bootstrap** → App initialization and routing
2. **React Context Setup** → Three.js Canvas and providers
3. **Asset Loading** → 3D models, textures, and HDR environments
4. **Manager Initialization** → Speaker, Shader, Texture, and Environment managers
5. **UI System Activation** → Control panels and debug interface
6. **Render Loop Start** → Three.js animation loop begins

**Component Lifecycle:**
```typescript
// Typical component lifecycle in SPKR
useEffect(() => {
  // 1. Initialize manager/effect
  const manager = new EffectManager(initialConfig);
  
  // 2. Set up event listeners
  manager.addEventListener('parameterChange', handleParameterChange);
  
  // 3. Start update loop
  const unsubscribe = subscribeToUpdates(manager);
  
  // 4. Cleanup on unmount
  return () => {
    manager.dispose();
    unsubscribe();
  };
}, []);
```

#### � Material & Texture System Integration

**PBR Material Workflow:**
```typescript
interface MaterialSystem {
  // 1. Texture Loading Manager
  textureLoader: {
    loadTexture: (path: string) => Promise<THREE.Texture>;
    loadTextureSet: (basePath: string) => Promise<TextureSet>;
    cacheTexture: (key: string, texture: THREE.Texture) => void;
  };
  
  // 2. Material Factory
  materialFactory: {
    createPBRMaterial: (textureSet: TextureSet) => THREE.MeshStandardMaterial;
    updateMaterialProperties: (material: THREE.Material, props: MaterialProps) => void;
    disposeMaterial: (material: THREE.Material) => void;
  };
  
  // 3. Application Manager
  applyToMesh: (mesh: THREE.Mesh, materialKey: string) => void;
  updateAllMaterials: (globalProps: GlobalMaterialProps) => void;
}
```

**Texture Loading Strategy:**
- **Lazy Loading**: Textures loaded only when needed
- **Progressive Enhancement**: Basic materials first, then enhanced textures
- **Memory Management**: Automatic disposal of unused textures
- **Format Optimization**: Compressed textures for better performance

#### 🌟 Shader Pipeline Architecture

**Effect Composition System:**
```typescript
// Shader effects are composed in a specific order for optimal performance
const effectPipeline = [
  // 1. Geometric Effects (modify UV coordinates)
  WaveDistortionEffect,
  ShockwaveEffect,
  
  // 2. Color/Lighting Effects  
  FireEffect,
  GlitchEffect,
  
  // 3. Post-Processing Effects
  MotionBlurEffect,
  OilPaintingEffect,
  
  // 4. Final Enhancement
  BloomEffect,
  ChromaticAberrationEffect
];
```

**Uniform Management System:**
```typescript
interface UniformManager {
  // Central uniform registry
  uniforms: Map<string, THREE.Uniform>;
  
  // Batch update system for performance
  batchUpdates: (updates: UniformUpdate[]) => void;
  
  // Type-safe uniform updates
  updateUniform<T>(name: string, value: T): void;
  
  // Automatic cleanup
  disposeUniforms(): void;
}
```

#### 🔍 Debug & Development System

**Debug Panel Architecture:**
```typescript
interface DebugSystem {
  // Performance monitoring
  performance: {
    fps: number;
    memoryUsage: number;
    drawCalls: number;
    triangles: number;
  };
  
  // State inspection
  inspector: {
    speakerState: SpeakerState;
    shaderStates: Map<string, ShaderState>;
    materialStates: Map<string, MaterialState>;
  };
  
  // Real-time controls
  controls: {
    toggleWireframe: () => void;
    resetCamera: () => void;
    exportScene: () => void;
    captureFrame: () => void;
  };
}
```

**Development Workflow:**
1. **Hot Reloading**: Instant updates during development
2. **Error Boundaries**: Graceful error handling and recovery
3. **Performance Profiling**: Real-time performance metrics
4. **State Debugging**: Inspect and modify component states
5. **Shader Debugging**: Visual shader output and parameter tweaking

### 🏛️ Manager Design Patterns

#### 🎵 Audio-Visual Synchronization Manager
Coordinates between audio controls and visual feedback:

**Synchronization Features:**
- **Volume Visualization**: Speaker scale responds to volume changes
- **Frequency Response**: Bass/treble controls affect speaker face highlighting
- **Preset Integration**: Audio presets trigger corresponding visual themes
- **Real-time Feedback**: Immediate visual response to audio parameter changes

```typescript
class AudioVisualManager {
  private speakerRef: React.RefObject<SpeakerComponent>;
  private audioState: AudioState;
  
  syncVolumeToScale(volume: number) {
    const scale = 1 + (volume / 100) * 0.2; // 20% max scale increase
    this.speakerRef.current?.updateScale(scale);
  }
  
  syncBassToFaceHighlight(bassLevel: number) {
    const highlightIntensity = bassLevel / 100;
    this.speakerRef.current?.updateFaceHighlight('woofer', highlightIntensity);
  }
}
```

#### 🎨 Theme & Style Manager
Manages consistent theming across all UI components:

**Theme System:**
```typescript
interface ThemeManager {
  // Color palette management
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
  };
  
  // Component styling
  applyTheme: (componentType: string, element: HTMLElement) => void;
  updateGlobalTheme: (newTheme: ThemeConfig) => void;
  
  // Dynamic theme switching
  switchToPreset: (presetName: string) => void;
  createCustomTheme: (baseTheme: string, overrides: Partial<ThemeConfig>) => void;
}
```

#### 🔄 State Synchronization Manager
Ensures consistency between different system states:

**Synchronization Patterns:**
- **State Observers**: Components subscribe to relevant state changes
- **Batch Updates**: Multiple related state changes are batched together
- **Conflict Resolution**: Handles competing state updates gracefully
- **Persistence**: Automatically saves and restores user preferences

```typescript
class StateSyncManager {
  private observers: Map<string, Set<StateObserver>>;
  private pendingUpdates: StateUpdate[];
  
  subscribe(stateKey: string, observer: StateObserver) {
    if (!this.observers.has(stateKey)) {
      this.observers.set(stateKey, new Set());
    }
    this.observers.get(stateKey)!.add(observer);
  }
  
  batchUpdate(updates: StateUpdate[]) {
    this.pendingUpdates.push(...updates);
    requestAnimationFrame(() => this.flushUpdates());
  }
  
  private flushUpdates() {
    const groupedUpdates = this.groupUpdatesByType(this.pendingUpdates);
    groupedUpdates.forEach((updates, type) => {
      this.notifyObservers(type, updates);
    });
    this.pendingUpdates = [];
  }
}
```

#### 🚀 Performance Management System
Monitors and optimizes application performance:

**Performance Features:**
- **Adaptive Quality**: Automatically adjusts settings based on performance
- **Memory Monitoring**: Tracks and manages GPU/CPU memory usage
- **Frame Rate Optimization**: Maintains target FPS through dynamic adjustments
- **Resource Cleanup**: Automatic disposal of unused resources

```typescript
interface PerformanceManager {
  // Monitoring
  metrics: {
    currentFPS: number;
    averageFPS: number;
    memoryUsage: {
      geometries: number;
      textures: number;
      materials: number;
    };
    renderStats: {
      drawCalls: number;
      triangles: number;
      points: number;
    };
  };
  
  // Adaptive optimization
  optimization: {
    enableAdaptiveQuality: boolean;
    targetFPS: number;
    memoryBudget: number;
    qualityPresets: QualityPreset[];
  };
  
  // Manual controls
  controls: {
    adjustQuality: (direction: 'up' | 'down') => void;
    forceGarbageCollection: () => void;
    resetOptimizations: () => void;
  };
}
```

### Basic Navigation
- **Mouse**: Rotate camera around the scene
- **Scroll**: Zoom in/out
- **Click Objects**: Select speaker faces for customization

### Speaker Controls
1. **Face Selection**: Click on speaker faces to select them
2. **Color Customization**: Use the color picker to change face colors
3. **Rotation**: Adjust speaker rotation with the control slider
4. **Audio Settings**: Modify volume, bass, and treble levels

### Shader Effects
1. **Enable Effects**: Toggle individual effects on/off
2. **Adjust Parameters**: Use sliders to modify effect intensity
3. **Real-time Preview**: See effects applied immediately
4. **Performance**: Monitor FPS and adjust quality settings

### Environment Controls
- **Environment Maps**: Switch between different HDR environments
- **Material Types**: Change between Standard, Physical, and Basic materials
- **Rendering Modes**: Toggle between Realistic, Stylized, and Performance modes
- **Tone Mapping**: Adjust exposure and tone mapping settings

## 🛠️ Technical Stack

### Core Technologies
- **[Next.js 15](https://nextjs.org/)**: React framework with App Router
- **[React 19](https://react.dev/)**: UI library
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)**: Utility-first CSS framework

### 3D Graphics
- **[Three.js](https://threejs.org/)**: 3D graphics library
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)**: React renderer for Three.js
- **[@react-three/drei](https://github.com/pmndrs/drei)**: Useful helpers for R3F
- **[@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing)**: Post-processing effects
- **[postprocessing](https://github.com/vanruesc/postprocessing)**: Post-processing library

### Additional Libraries
- **[Lamina](https://github.com/pmndrs/lamina)**: Shader materials
- **[React Spring Three](https://docs.pmnd.rs/react-spring)**: 3D animations
- **[Lucide React](https://lucide.dev/)**: Icon library
- **[three-csg-ts](https://github.com/BdAndroid/three-csg-ts)**: Constructive Solid Geometry

## 📖 Documentation

### Core Documentation
- **[Shader System Documentation](./SHADER_SYSTEM_DOCUMENTATION.md)**: Comprehensive guide to the shader effects system
- **[Debug Panel Usage](./DEBUGPANEL_USAGE_EXAMPLE.md)**: How to use the development tools

### Specialized Guides
- **PBR Materials**: Guidelines for physically based rendering setup
- **Texture Usage**: Best practices for texture management and optimization
- **Post-Processing**: Advanced post-processing techniques and performance optimization
- **Shader Development**: Custom shader creation and integration

## ⚡ Performance

### Optimization Features
- **Adaptive Quality**: Automatic quality adjustment based on device capabilities
- **LOD System**: Level-of-detail for 3D models and effects
- **Efficient Rendering**: Frustum culling and object pooling
- **Memory Management**: Texture compression and garbage collection optimization

### Performance Monitoring
The built-in debug panel provides:
- Real-time FPS monitoring
- GPU memory usage tracking  
- Render call statistics
- Effect performance metrics

### Recommended Settings
- **High-end Desktop**: All effects enabled, high quality
- **Mid-range Desktop**: Selective effects, medium quality
- **Mobile Devices**: Basic effects only, low quality preset

## 🧪 Development

### Development Tools
- **Hot Reloading**: Instant updates during development
- **TypeScript Support**: Full type checking and IntelliSense
- **Debug Panel**: Comprehensive debugging interface
- **Performance Profiling**: Built-in performance monitoring tools

### Adding Custom Effects
See [Shader System Documentation](./SHADER_SYSTEM_DOCUMENTATION.md) for detailed instructions on:
- Creating custom shader effects
- Integrating new post-processing passes
- Managing effect parameters and UI controls

### Code Quality
- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **Component Architecture**: Modular, reusable components
- **Performance Best Practices**: Optimized rendering and state management

### Development Setup
```bash
# Clone your fork
git clone https://github.com/your-username/spkr.git
cd spkr

# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js Community**: For the incredible 3D graphics foundation
- **PMND**: For React Three Fiber and the ecosystem of tools
- **Vercel**: For Next.js and deployment platform
- **Contributors**: Everyone who has contributed to making SPKR better

## 🔗 Links

- **Live Demo**: [https://spkr-demo.vercel.app](https://spkr-demo.vercel.app)
- **Documentation**: [Shader System Docs](./SHADER_SYSTEM_DOCUMENTATION.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/spkr/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/spkr/discussions)

---

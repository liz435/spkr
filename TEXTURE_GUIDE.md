# 🎨 墙面纹理使用指南

## 📍 组件位置

主要组件位置：
- **主页面**: `src/app/page.tsx` - 纹理状态管理
- **FloatingCards**: `src/components/ui/FloatingCards.tsx` - UI控制传递
- **SceneControls**: `src/components/ui/SceneControls.tsx` - 纹理选择UI
- **SceneEnvironment**: `src/components/SceneEnvironment.tsx` - 纹理应用
- **TextureManager**: `src/components/TextureManager.tsx` - 纹理生成和管理

## 🎛️ 如何更换材质

### 方法1: 通过UI控制面板
1. 在3D场景中，右侧会有一个 **Scene Controls** 面板
2. 选择场景类型为 "Room" (🏠)
3. 在 "🎨 Wall Texture" 部分，选择你想要的纹理：
   - **Plaster** (🏠) - 白色石膏纹理
   - **Concrete** (🧱) - 混凝土纹理  
   - **Brick** (🧱) - 砖墙纹理
   - **Wood** (🪵) - 木质面板纹理

### 方法2: 通过代码设置

```tsx
// 在 src/app/page.tsx 中修改默认纹理
const [wallTexture, setWallTexture] = useState("concrete"); // 改变这里

// 或者通过 SPKR 组件直接设置
<SPKR 
  speakerState={speakerState}
  wallTexture="brick" // 直接指定纹理
  sceneType="room"
/>
```

## 🎨 可用纹理选项

### 内置程序纹理
- `"white-plaster"` - 白色石膏墙面（默认）
- `"concrete"` - 灰色混凝土墙面
- `"wood-panels"` - 木质面板纹理

### PBR 物理材质 (Physical Based Rendering)
- `"brick"` - 真实砖墙PBR材质
  - 🗂️ **5个贴图**: Diffuse, Normal, Roughness, AO, Height
  - 📁 **文件位置**: `public/texture/brick/`
  - 🎯 **效果**: 真实的物理光照和表面细节

- `"wood-panels"` - 真实木地板PBR材质 
  - 🗂️ **5个贴图**: Diffuse, Normal, Roughness, AO, Height
  - 📁 **文件位置**: `public/texture/wood_floor/`
  - 🎯 **效果**: 真实的木材纹理和光照响应

### 自定义纹理文件
```tsx
// 使用自定义纹理图片
<SPKR wallTexture="/textures/my-wall.jpg" />
```

## 📁 文件结构

```
src/
├── app/
│   └── page.tsx              # 主页面，纹理状态管理
├── components/
│   ├── SceneEnvironment.tsx  # 场景环境，纹理应用
│   ├── TextureManager.tsx    # 纹理管理和生成
│   └── ui/
│       ├── FloatingCards.tsx # UI布局和参数传递
│       ├── SceneControls.tsx # 场景控制面板（含纹理选择器）
│       └── TextureControls.tsx # 高级纹理控制（可选）
```

## 🔧 技术实现

1. **程序纹理生成**: `TextureManager.tsx` 使用 Canvas API 程序生成纹理
2. **PBR材质加载**: 支持完整的PBR材质管线 (Diffuse + Normal + Roughness + AO + Height)
3. **纹理加载**: 支持外部图片文件加载
4. **材质应用**: `SceneEnvironment.tsx` 将纹理应用到墙面
5. **UI控制**: `SceneControls.tsx` 提供纹理选择界面

## 🗂️ PBR材质文件结构

```
public/texture/
├── brick/
│   ├── Brick_Wall_019_basecolor.jpg     # 砖墙基础颜色
│   ├── Brick_Wall_019_normal.jpg        # 砖墙法线贴图
│   ├── Brick_Wall_019_roughness.jpg     # 砖墙粗糙度贴图
│   ├── Brick_Wall_019_ambientOcclusion.jpg # 砖墙环境遮挡贴图
│   ├── Brick_Wall_019_height.png        # 砖墙高度贴图
│   └── Material_1631.jpg                # 额外材质参考
└── wood_floor/
    ├── Wood_027_basecolor.jpg           # 木地板基础颜色
    ├── Wood_027_normal.jpg              # 木地板法线贴图
    ├── Wood_027_roughness.jpg           # 木地板粗糙度贴图
    ├── Wood_027_ambientOcclusion.jpg    # 木地板环境遮挡贴图
    ├── Wood_027_height.png              # 木地板高度贴图
    └── Material_2080.jpg                # 额外材质参考
```

## 🚀 快速开始

1. 启动开发服务器：`npm run dev`
2. 在浏览器中打开场景
3. 确保场景类型设置为 "Room"
4. 在右侧控制面板中选择不同的墙面纹理
5. 实时查看效果！

## 💡 提示

- 纹理只在 "Room" 场景类型中可见
- 程序纹理不需要外部文件，加载更快
- 自定义纹理文件需放在 `public/textures/` 文件夹中
- 可以通过代码或UI两种方式更改纹理

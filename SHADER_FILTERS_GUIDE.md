# Shader Filters Guide

我已经为你成功添加了三个 shader filter：**Edge Detection (边缘检测)**、**Pixelation (像素化)** 和 **Motion Blur (运动模糊)**。

## 🚀 如何使用

### 1. 访问演示页面
```
http://localhost:3002/shader-demo
```

### 2. 控制面板功能

#### 🖼️ Edge Detection (边缘检测)
- **功能**: 使用色差效果模拟边缘检测，创建艺术风格的轮廓效果
- **控制**: 启用/禁用开关
- **效果**: 突出显示物体边缘，产生类似线描的视觉效果

#### 🟫 Pixelation (像素化)
- **功能**: 将渲染结果转换为像素风格
- **控制**: 
  - 启用/禁用开关
  - 像素大小调节 (2-32)
- **效果**: 创建复古的像素艺术风格

#### 💨 Motion Blur (运动模糊)
- **功能**: 使用 Bloom 效果模拟运动模糊
- **控制**: 
  - 启用/禁用开关
  - 强度调节 (0.1-2.0)
  - 采样数量 (4-16)
- **效果**: 创建动态感和速度感

### 3. 预设效果

#### 🎨 Artistic (艺术风格)
- 启用边缘检测
- 降低阈值以突出更多细节
- 创建手绘风格效果

#### 🕹️ Retro (复古风格)  
- 启用像素化效果
- 设置适中的像素大小
- 重现经典游戏视觉风格

#### 💨 Speed (速度效果)
- 启用运动模糊
- 增强强度和采样
- 模拟高速运动感

#### 🚫 Clear (清除所有)
- 关闭所有滤镜
- 恢复原始渲染

## 🔧 技术实现

### 组件结构
```tsx
// 主滤镜组件
import ShaderFilters from '@/components/ShaderFilters';

// 控制面板
import ShaderFilterControls from '@/components/ui/ShaderFilterControls';

// 使用示例
<ShaderFilters
  edgeDetectionEnabled={edgeDetectionEnabled}
  pixelationEnabled={pixelationEnabled}
  pixelSize={pixelSize}
  motionBlurEnabled={motionBlurEnabled}
/>
```

### 在你的项目中集成

1. **导入组件**:
```tsx
import ShaderFilters from '@/components/ShaderFilters';
```

2. **添加到 Canvas 中**:
```tsx
<Canvas>
  {/* 你的 3D 内容 */}
  <YourScene />
  
  {/* 添加 shader filters */}
  <ShaderFilters
    pixelationEnabled={true}
    pixelSize={12}
    motionBlurEnabled={true}
  />
</Canvas>
```

3. **单独使用滤镜**:
```tsx
import { PixelationFilter, EdgeDetectionFilter, MotionBlurFilter } from '@/components/ShaderFilters';

// 只使用像素化
<PixelationFilter enabled={true} pixelSize={8} />

// 只使用边缘检测  
<EdgeDetectionFilter enabled={true} />

// 只使用运动模糊
<MotionBlurFilter enabled={true} strength={0.8} />
```

## 📋 API 参考

### ShaderFilters Props
```typescript
interface ShaderFiltersProps {
  edgeDetectionEnabled?: boolean;          // 边缘检测开关
  pixelationEnabled?: boolean;             // 像素化开关
  pixelSize?: number;                      // 像素大小 (2-32)
  motionBlurEnabled?: boolean;             // 运动模糊开关
  bloomEnabled?: boolean;                  // 额外的辉光效果
  chromaticAberrationEnabled?: boolean;    // 额外的色差效果
}
```

## 🎯 使用建议

1. **性能优化**: 
   - 不要同时启用所有效果
   - 在移动设备上减少采样数量
   - 根据场景复杂度调整参数

2. **视觉效果搭配**:
   - 边缘检测 + 轻微像素化 = 手绘漫画风格
   - 强运动模糊 + 高对比度 = 速度感
   - 大像素尺寸 = 复古游戏风格

3. **实时调整**:
   - 使用控制面板实时预览效果
   - 保存喜欢的参数组合
   - 可以为不同场景设置不同预设

## 🌟 特色功能

✅ **实时调整**: 所有参数都可以实时调整，立即看到效果  
✅ **预设系统**: 内置多种风格预设，一键应用  
✅ **性能优化**: 基于成熟的 postprocessing 库，性能稳定  
✅ **模块化设计**: 可以单独使用每个滤镜  
✅ **TypeScript 支持**: 完整的类型定义  

现在你可以在 `http://localhost:3002/shader-demo` 体验这些 shader filters！🎉

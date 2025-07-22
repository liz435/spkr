# 🧱 PBR Brick 材质使用演示

## 📦 完整的 PBR 材质集

你的 `public/texture/brick/` 文件夹包含了完整的 PBR 材质资源：

1. **Brick_Wall_019_basecolor.jpg** - 基础颜色 (Diffuse/Albedo)
2. **Brick_Wall_019_normal.jpg** - 法线贴图 (Normal Map) 
3. **Brick_Wall_019_roughness.jpg** - 粗糙度贴图 (Roughness Map)
4. **Brick_Wall_019_ambientOcclusion.jpg** - 环境遮挡 (AO Map)
5. **Brick_Wall_019_height.png** - 高度贴图 (Displacement/Height Map)

## 🎨 材质效果

### ✨ 真实物理光照
- **基础颜色**: 提供砖墙的真实颜色和纹理细节
- **法线贴图**: 创建砖块的3D表面细节，无需额外几何体
- **粗糙度贴图**: 控制不同区域的反射率 (砖块 vs 水泥接缝)
- **环境遮挡**: 增强砖块间的深度和阴影
- **高度贴图**: 创建微妙的表面位移效果

### 🏠 场景集成
```tsx
// 使用 PBR 砖墙材质
<SPKR 
  speakerState={speakerState}
  sceneType="room"
  wallTexture="brick" // 自动加载全部5个贴图
/>
```

## 🔄 切换方式

### 方法1: UI控制面板
1. 右侧控制面板 → "🎨 Wall Texture"
2. 点击 "Brick PBR" 按钮
3. 即时看到真实砖墙效果

### 方法2: 代码设置  
```tsx
const [wallTexture, setWallTexture] = useState("brick");
```

## 🎯 视觉对比

| 特性 | 程序纹理 | PBR材质 |
|------|----------|---------|
| 🎨 颜色细节 | 简单 | 极其丰富 |
| 💡 光照响应 | 基础 | 物理准确 |
| 🔍 表面细节 | 平面 | 3D立体感 |
| ⚡ 渲染性能 | 快 | 中等 |
| 📁 文件大小 | 无 | ~2-5MB |

## 🚀 未来扩展

可以轻松添加更多PBR材质集：
- Wood floor PBR 材质 (已有文件夹)
- Metal surfaces
- Fabric materials
- Stone textures

只需在 `TextureManager.tsx` 中按相同格式添加配置即可！

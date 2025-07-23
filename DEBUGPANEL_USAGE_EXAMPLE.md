// 使用 DebugPanel 的示例代码
// 在你的主组件中（如 Speaker.tsx 或 page.tsx）这样使用：

import React, { useState } from 'react';
import DebugPanel from '@/components/ui/DebugPanel';

export function YourMainComponent() {
  // 所有的状态都集中在这里
  const [motionBlurIntensity, setMotionBlurIntensity] = useState(1);
  const [motionBlurSamples, setMotionBlurSamples] = useState(16);
  const [velocityFactor, setVelocityFactor] = useState(1);
  
  const [faceBoxPosition, setFaceBoxPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [faceBoxRotation, setFaceBoxRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [faceBoxScale, setFaceBoxScale] = useState<[number, number, number]>([1, 1, 1]);
  
  const [materialType, setMaterialType] = useState('physical');
  const [renderingMode, setRenderingMode] = useState('realistic');
  const [toneMappingExposure, setToneMappingExposure] = useState(1);
  
  const [sceneType, setSceneType] = useState('studio');
  const [wallColor, setWallColor] = useState('#ffffff');
  const [floorType, setFloorType] = useState('wood');

  return (
    <>
      {/* 你的主要 3D 内容 */}
      <Canvas>
        {/* ... 你的 3D 场景内容 ... */}
        <YourScene
          motionBlurIntensity={motionBlurIntensity}
          faceBoxPosition={faceBoxPosition}
          materialType={materialType}
          renderingMode={renderingMode}
          sceneType={sceneType}
          wallColor={wallColor}
          floorType={floorType}
          // ... 其他 props
        />
      </Canvas>

      {/* 统一的调试面板 - 替换所有单独的控件 */}
      <DebugPanel
        // Motion Blur
        motionBlurIntensity={motionBlurIntensity}
        onMotionBlurIntensityChange={setMotionBlurIntensity}
        motionBlurSamples={motionBlurSamples}
        onMotionBlurSamplesChange={setMotionBlurSamples}
        velocityFactor={velocityFactor}
        onVelocityFactorChange={setVelocityFactor}
        
        // Face Box Position
        faceBoxPosition={faceBoxPosition}
        onFaceBoxPositionChange={setFaceBoxPosition}
        faceBoxRotation={faceBoxRotation}
        onFaceBoxRotationChange={setFaceBoxRotation}
        faceBoxScale={faceBoxScale}
        onFaceBoxScaleChange={setFaceBoxScale}
        
        // Rendering
        materialType={materialType}
        onMaterialTypeChange={setMaterialType}
        renderingMode={renderingMode}
        onRenderingModeChange={setRenderingMode}
        toneMappingExposure={toneMappingExposure}
        onToneMappingExposureChange={setToneMappingExposure}
        
        // Scene
        sceneType={sceneType}
        onSceneTypeChange={setSceneType}
        wallColor={wallColor}
        onWallColorChange={setWallColor}
        floorType={floorType}
        onFloorTypeChange={setFloorType}
      />
    </>
  );
}

// 现在你可以删除这些单独的组件：
// - MotionBlurControls
// - PositionControls
// - RenderingControls  
// - SceneControls
// 因为它们的功能都整合到 DebugPanel 中了！

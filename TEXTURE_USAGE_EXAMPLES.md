// 使用示例 - 在你的主组件中

// 1. 使用预设纹理
<SPKR 
  speakerState={speakerState}
  wallTexture="brick" // 使用砖墙纹理
  sceneType="room"
/>

// 2. 使用混凝土纹理
<SPKR 
  speakerState={speakerState}
  wallTexture="concrete" // 使用混凝土纹理
  sceneType="room"
/>

// 3. 使用木质面板
<SPKR 
  speakerState={speakerState}
  wallTexture="wood-panels" // 使用木质面板纹理
  sceneType="room"
/>

// 4. 使用自定义纹理文件（需要将文件放在 public/textures/ 文件夹）
<SPKR 
  speakerState={speakerState}
  wallTexture="/textures/my-custom-wall.jpg" // 使用自定义纹理
  sceneType="room"
/>

// 可用的预设纹理：
// - "white-plaster" (默认白色石膏)
// - "concrete" (混凝土)
// - "brick" (砖墙)  
// - "wood-panels" (木质面板)

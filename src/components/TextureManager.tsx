'use client'

import React, { useMemo } from 'react';
import * as THREE from 'three';

// Texture presets - you can add actual texture paths here
export const TEXTURE_PRESETS = {
  // Basic textures (procedural)
  'white-plaster': { 
    type: 'procedural', 
    baseColor: '#f8f8f8',
    roughness: 0.8,
    metalness: 0.0
  },
  'concrete': { 
    type: 'procedural', 
    baseColor: '#a0a0a0',
    roughness: 0.9,
    metalness: 0.1
  },
  'wood-panels': { 
    type: 'pbr',
    baseColor: '/texture/wood_floor/Wood_Floor_012_basecolor.jpg',
    normal: '/texture/wood_floor/Wood_Floor_012_normal.jpg',
    roughness: '/texture/wood_floor/Wood_Floor_012_roughness.jpg',
    ao: '/texture/wood_floor/Wood_Floor_012_ambientOcclusion.jpg',
    height: '/texture/wood_floor/Wood_Floor_012_height.png'
  },
  
  // PBR Material Sets (real textures)
  'wood-floor-pbr': {
    type: 'pbr',
    baseColor: '/texture/wood_floor/Wood_Floor_012_basecolor.jpg',
    normal: '/texture/wood_floor/Wood_Floor_012_normal.jpg',
    roughness: '/texture/wood_floor/Wood_Floor_012_roughness.jpg',
    ao: '/texture/wood_floor/Wood_Floor_012_ambientOcclusion.jpg',
    height: '/texture/wood_floor/Wood_Floor_012_height.png'
  },
  'brick': {
    type: 'pbr',
    baseColor: '/texture/brick/Brick_Wall_019_basecolor.jpg',
    normal: '/texture/brick/Brick_Wall_019_normal.jpg',
    roughness: '/texture/brick/Brick_Wall_019_roughness.jpg',
    ao: '/texture/brick/Brick_Wall_019_ambientOcclusion.jpg',
    height: '/texture/brick/Brick_Wall_019_height.png'
  },
  
  // External texture paths (for backwards compatibility)
  'brick-texture': '/texture/brick/Brick_Wall_019_basecolor.jpg',
  'concrete-texture': '/textures/concrete.jpg',
  'plaster-texture': '/textures/plaster.jpg',
  'wood-texture': '/textures/wood.jpg',
} as const;

export type TexturePreset = keyof typeof TEXTURE_PRESETS;

// Generate procedural textures
export function createProceduralTexture(preset: string): THREE.Texture {
  const config = TEXTURE_PRESETS[preset as TexturePreset];
  
  if (typeof config === 'string') {
    // This is a file path, should be handled by useLoader
    throw new Error('Use useLoader for file-based textures');
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  
  switch (preset) {
    case 'white-plaster':
      return createPlasterTexture(ctx, canvas, config.baseColor);
    
    case 'concrete':
      return createConcreteTexture(ctx, canvas, config.baseColor);
    
    case 'brick':
      return createBrickTexture(ctx, canvas, config.baseColor);
    
    case 'wood-panels':
      return createWoodPanelTexture(ctx, canvas, config.baseColor);
    
    default:
      return createPlasterTexture(ctx, canvas, '#f8f8f8');
  }
}

function createPlasterTexture(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, baseColor: string): THREE.Texture {
  // Base color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add subtle texture noise
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 3;
    ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
    ctx.fillRect(x, y, size, size);
  }
  
  // Add subtle variation bands
  ctx.globalAlpha = 0.05;
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.5, '#000000');
  gradient.addColorStop(1, '#ffffff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createConcreteTexture(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, baseColor: string): THREE.Texture {
  // Base color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add rough concrete texture
  ctx.globalAlpha = 0.2;
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 4;
    const darkness = Math.random() * 0.3;
    ctx.fillStyle = `rgb(${Math.floor(160 * (1 - darkness))}, ${Math.floor(160 * (1 - darkness))}, ${Math.floor(160 * (1 - darkness))})`;
    ctx.fillRect(x, y, size, size);
  }
  
  // Add stains and variation
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = 20 + Math.random() * 60;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(0,0,0,0.3)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createBrickTexture(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, baseColor: string): THREE.Texture {
  // Base color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const brickWidth = 120;
  const brickHeight = 40;
  const mortarWidth = 4;
  
  // Draw mortar lines
  ctx.strokeStyle = '#666666';
  ctx.lineWidth = mortarWidth;
  
  // Horizontal mortar lines
  for (let y = 0; y < canvas.height; y += brickHeight + mortarWidth) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  
  // Vertical mortar lines (staggered)
  for (let row = 0; row < canvas.height / (brickHeight + mortarWidth); row++) {
    const y = row * (brickHeight + mortarWidth);
    const offset = (row % 2) * (brickWidth / 2);
    
    for (let x = offset; x < canvas.width + brickWidth; x += brickWidth + mortarWidth) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + brickHeight + mortarWidth);
      ctx.stroke();
    }
  }
  
  // Add brick texture variation
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 2;
    ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
    ctx.fillRect(x, y, size, size);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createWoodPanelTexture(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, baseColor: string): THREE.Texture {
  // Base color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const panelWidth = 150;
  
  // Draw vertical wood panels
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 2;
  
  for (let x = 0; x < canvas.width; x += panelWidth) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  // Add wood grain
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 20 + Math.random() * 10);
    ctx.lineTo(canvas.width, i * 20 + Math.random() * 10);
    ctx.stroke();
  }
  
  // Add wood texture noise
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 2;
    ctx.fillStyle = Math.random() > 0.5 ? '#DEB887' : '#8B7355';
    ctx.fillRect(x, y, size, size);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Hook for using textures
export function useWallTexture(preset: TexturePreset | string): THREE.Texture | null {
  return useMemo(() => {
    if (!preset) return null;
    
    // Check if it's a procedural texture
    if (preset in TEXTURE_PRESETS) {
      const config = TEXTURE_PRESETS[preset as TexturePreset];
      if (typeof config === 'object' && config.type === 'procedural') {
        return createProceduralTexture(preset);
      }
    }
    
    // For file-based textures and PBR materials, return null and let the component handle loading
    return null;
  }, [preset]);
}

// Hook for using PBR materials
export function usePBRMaterial(preset: TexturePreset | string) {
  return useMemo(() => {
    if (!preset || !(preset in TEXTURE_PRESETS)) return null;
    
    const config = TEXTURE_PRESETS[preset as TexturePreset];
    if (typeof config === 'object' && config.type === 'pbr') {
      return config;
    }
    
    return null;
  }, [preset]);
}

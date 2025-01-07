import type { TextureMap } from './textureAnalysis';

export function createImageData(img: HTMLImageElement): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  // Set canvas size to match image
  canvas.width = img.width;
  canvas.height = img.height;
  
  // Draw image onto canvas
  ctx.drawImage(img, 0, 0);
  
  // Get image data
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// Helper function to calculate normalized gradient magnitude
export function calculateGradient(data: Uint8ClampedArray, width: number, height: number, x: number, y: number): number {
  if (x <= 0 || x >= width - 1 || y <= 0 || y >= height - 1) {
    return 0;
  }

  const idx = (y * width + x) * 4;
  
  // Get grayscale values for surrounding pixels
  const left = (data[idx - 4] + data[idx - 3] + data[idx - 2]) / 3;
  const right = (data[idx + 4] + data[idx + 3] + data[idx + 2]) / 3;
  const top = (data[idx - width * 4] + data[idx - width * 4 + 1] + data[idx - width * 4 + 2]) / 3;
  const bottom = (data[idx + width * 4] + data[idx + width * 4 + 1] + data[idx + width * 4 + 2]) / 3;

  // Calculate gradients in x and y directions
  const dx = right - left;
  const dy = bottom - top;

  // Return magnitude of gradient
  return Math.sqrt(dx * dx + dy * dy);
}

// Helper function to convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

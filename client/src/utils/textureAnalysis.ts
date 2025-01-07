import { createImageData } from './imageProcessing';

export interface TextureFeature {
  type: 'pore' | 'line' | 'spot' | 'roughness';
  severity: number; // 0-100
  location: { x: number; y: number };
  size: number; // in pixels
  confidence: number; // 0-1
}

export interface TextureMap {
  features: TextureFeature[];
  overallTexture: number; // 0-100
  poreSize: number; // average in pixels
  lineDepth: number; // 0-100
  roughnessMap: number[][]; // matrix of roughness values
}

// Detect edges and texture variations in the image
function detectEdges(imageData: ImageData): number[][] {
  const { data, width, height } = imageData;
  const edgeMap: number[][] = Array(height).fill(0).map(() => Array(width).fill(0));

  // Sobel operator for edge detection
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      // Calculate gradients in x and y directions
      const gx = 
        -1 * data[idx - 4] +
        1 * data[idx + 4];
      
      const gy = 
        -1 * data[idx - width * 4] +
        1 * data[idx + width * 4];
      
      edgeMap[y][x] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  return edgeMap;
}

// Analyze local texture patterns
function analyzeLocalTexture(imageData: ImageData, x: number, y: number, radius: number): number {
  const { data, width } = imageData;
  let textureSum = 0;
  let count = 0;

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      
      if (nx >= 0 && nx < width && ny >= 0 && ny < width) {
        const idx = (ny * width + nx) * 4;
        const intensity = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        textureSum += intensity;
        count++;
      }
    }
  }

  return textureSum / count;
}

// Detect and analyze pores in the image
function detectPores(imageData: ImageData, edgeMap: number[][]): TextureFeature[] {
  const { width, height } = imageData;
  const pores: TextureFeature[] = [];
  const threshold = 50; // Adjust based on image characteristics

  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      if (edgeMap[y][x] > threshold) {
        const localTexture = analyzeLocalTexture(imageData, x, y, 2);
        
        if (localTexture < 128) { // Dark spots are potential pores
          pores.push({
            type: 'pore',
            severity: Math.min(100, (255 - localTexture) / 2.55),
            location: { x, y },
            size: Math.ceil(edgeMap[y][x] / 10),
            confidence: Math.min(1, edgeMap[y][x] / 255)
          });
        }
      }
    }
  }

  return pores;
}

// Analyze fine lines and wrinkles
function analyzeFineLines(edgeMap: number[][]): TextureFeature[] {
  const lines: TextureFeature[] = [];
  const { length: height } = edgeMap;
  const width = edgeMap[0].length;
  const minLineLength = 5;

  for (let y = 1; y < height - 1; y++) {
    let lineStart = -1;
    let lineStrength = 0;

    for (let x = 1; x < width - 1; x++) {
      if (edgeMap[y][x] > 30) { // Threshold for line detection
        if (lineStart === -1) {
          lineStart = x;
        }
        lineStrength += edgeMap[y][x];
      } else if (lineStart !== -1) {
        const lineLength = x - lineStart;
        if (lineLength >= minLineLength) {
          lines.push({
            type: 'line',
            severity: Math.min(100, lineStrength / lineLength / 2.55),
            location: { x: lineStart + lineLength / 2, y },
            size: lineLength,
            confidence: Math.min(1, lineStrength / (lineLength * 255))
          });
        }
        lineStart = -1;
        lineStrength = 0;
      }
    }
  }

  return lines;
}

// Calculate overall skin texture metrics
function calculateTextureMetrics(
  imageData: ImageData,
  features: TextureFeature[]
): { overallTexture: number; roughnessMap: number[][] } {
  const { width, height } = imageData;
  const roughnessMap: number[][] = Array(height).fill(0).map(() => Array(width).fill(0));
  let totalRoughness = 0;

  // Calculate local roughness values
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const localTexture = analyzeLocalTexture(imageData, x, y, 3);
      roughnessMap[y][x] = Math.abs(localTexture - 128) / 1.28; // Convert to 0-100 scale
      totalRoughness += roughnessMap[y][x];
    }
  }

  // Factor in detected features
  features.forEach(feature => {
    const { x, y } = feature.location;
    if (x >= 0 && x < width && y >= 0 && y < height) {
      roughnessMap[Math.floor(y)][Math.floor(x)] += feature.severity;
    }
  });

  const overallTexture = Math.min(100, totalRoughness / (width * height) + 
    features.reduce((acc, f) => acc + f.severity * f.confidence, 0) / features.length);

  return { overallTexture, roughnessMap };
}

export async function analyzeTexture(imageUrl: string): Promise<TextureMap> {
  const img = new Image();
  img.src = imageUrl;
  await new Promise(resolve => img.onload = resolve);

  const imageData = createImageData(img);
  const edgeMap = detectEdges(imageData);
  
  // Detect various texture features
  const pores = detectPores(imageData, edgeMap);
  const lines = analyzeFineLines(edgeMap);
  const features = [...pores, ...lines];

  // Calculate overall metrics
  const { overallTexture, roughnessMap } = calculateTextureMetrics(imageData, features);
  
  const poreSize = pores.reduce((acc, p) => acc + p.size, 0) / (pores.length || 1);
  const lineDepth = lines.reduce((acc, l) => acc + l.severity, 0) / (lines.length || 1);

  return {
    features,
    overallTexture,
    poreSize,
    lineDepth,
    roughnessMap
  };
}

import { useEffect, useRef } from 'react';
import type { TextureMap, TextureFeature } from '../utils/textureAnalysis';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TextureAnalysisViewProps {
  textureMap: TextureMap;
  originalImage: string;
}

export default function TextureAnalysisView({ textureMap, originalImage }: TextureAnalysisViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    image.src = originalImage;
    
    image.onload = () => {
      // Set canvas size to match image
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw original image
      ctx.drawImage(image, 0, 0);

      // Apply roughness map overlay
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      textureMap.roughnessMap.forEach((row, y) => {
        row.forEach((roughness, x) => {
          const idx = (y * canvas.width + x) * 4;
          
          // Overlay roughness in red channel with transparency
          data[idx] = Math.min(255, data[idx] + roughness * 2); // Red channel
          data[idx + 3] = 255; // Alpha channel
        });
      });

      ctx.putImageData(imageData, 0, 0);

      // Draw feature markers
      textureMap.features.forEach(feature => {
        drawFeatureMarker(ctx, feature);
      });
    };
  }, [textureMap, originalImage]);

  const drawFeatureMarker = (ctx: CanvasRenderingContext2D, feature: TextureFeature) => {
    const { x, y } = feature.location;
    
    ctx.beginPath();
    ctx.arc(x, y, feature.size / 2, 0, Math.PI * 2);
    ctx.strokeStyle = getFeatureColor(feature);
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const getFeatureColor = (feature: TextureFeature) => {
    switch (feature.type) {
      case 'pore':
        return `rgba(255, 0, 0, ${feature.confidence})`;
      case 'line':
        return `rgba(0, 255, 0, ${feature.confidence})`;
      case 'spot':
        return `rgba(255, 255, 0, ${feature.confidence})`;
      case 'roughness':
        return `rgba(0, 0, 255, ${feature.confidence})`;
      default:
        return 'rgba(255, 255, 255, 0.5)';
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return "text-emerald-500";
    if (value >= 60) return "text-green-500";
    if (value >= 40) return "text-yellow-500";
    if (value >= 20) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Micro-Detail Analysis</CardTitle>
          <CardDescription>
            Advanced texture analysis with AI-powered detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video mb-6">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Overall Texture Score</span>
                <span className={`text-sm font-medium ${getMetricColor(textureMap.overallTexture)}`}>
                  {Math.round(textureMap.overallTexture)}%
                </span>
              </div>
              <Progress value={textureMap.overallTexture} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm font-medium">Average Pore Size</span>
                <p className="text-2xl font-bold">
                  {textureMap.poreSize.toFixed(1)}px
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-medium">Line Depth</span>
                <p className="text-2xl font-bold">
                  {textureMap.lineDepth.toFixed(1)}%
                </p>
              </div>
            </div>

            <TooltipProvider>
              <div className="flex gap-2 flex-wrap">
                {textureMap.features.slice(0, 5).map((feature, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-3 h-3 rounded-full cursor-help border-2`}
                        style={{
                          backgroundColor: getFeatureColor(feature),
                          borderColor: getFeatureColor(feature).replace('rgba', 'rgb').replace(/, [\d.]+\)/, ')')
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium capitalize">{feature.type}</p>
                      <p className="text-sm">Severity: {Math.round(feature.severity)}%</p>
                      <p className="text-sm">Confidence: {Math.round(feature.confidence * 100)}%</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {textureMap.features.length > 5 && (
                  <span className="text-sm text-muted-foreground">
                    +{textureMap.features.length - 5} more
                  </span>
                )}
              </div>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

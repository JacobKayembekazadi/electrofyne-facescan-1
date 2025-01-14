import { useEffect, useRef, useState } from 'react';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs';
import { Camera } from '@mediapipe/camera_utils';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera as CameraIcon, Scan } from 'lucide-react';

interface SkinIssue {
  type: 'dryness' | 'acne' | 'wrinkles' | 'pigmentation';
  severity: number;
  coordinates: { x: number; y: number }[];
}

export default function FaceAnalysisView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [skinIssues, setSkinIssues] = useState<SkinIssue[]>([]);

  useEffect(() => {
    if (!videoRef.current) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      }
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    faceMesh.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await faceMesh.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480
    });

    camera.start();

    return () => {
      camera.stop();
      faceMesh.close();
    };
  }, []);

  const onResults = async (results: any) => {
    const canvasCtx = canvasRef.current?.getContext('2d');
    if (!canvasCtx || !canvasRef.current) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw the video frame
    if (videoRef.current) {
      canvasCtx.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }

    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        // Draw face mesh
        drawFaceMesh(canvasCtx, landmarks);
        
        if (isAnalyzing) {
          // Analyze skin and highlight issues
          analyzeSkinIssues(landmarks);
        }
      }
    }

    canvasCtx.restore();
  };

  const drawFaceMesh = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;

    for (const landmark of landmarks) {
      const x = landmark.x * canvasRef.current!.width;
      const y = landmark.y * canvasRef.current!.height;
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const analyzeSkinIssues = async (landmarks: any[]) => {
    // Simulate skin analysis (replace with actual analysis logic)
    const mockIssues: SkinIssue[] = [
      {
        type: 'dryness',
        severity: 0.7,
        coordinates: [
          { x: landmarks[123].x, y: landmarks[123].y },
          { x: landmarks[352].x, y: landmarks[352].y }
        ]
      },
      {
        type: 'acne',
        severity: 0.5,
        coordinates: [
          { x: landmarks[10].x, y: landmarks[10].y },
          { x: landmarks[338].x, y: landmarks[338].y }
        ]
      }
    ];

    setSkinIssues(mockIssues);
    highlightSkinIssues(mockIssues);
  };

  const highlightSkinIssues = (issues: SkinIssue[]) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;

    issues.forEach(issue => {
      const color = getIssueColor(issue.type);
      ctx.fillStyle = `rgba(${color}, ${issue.severity})`;
      
      issue.coordinates.forEach(coord => {
        const x = coord.x * canvasRef.current!.width;
        const y = coord.y * canvasRef.current!.height;
        
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  };

  const getIssueColor = (type: string): string => {
    switch (type) {
      case 'dryness':
        return '255, 165, 0';
      case 'acne':
        return '255, 0, 0';
      case 'wrinkles':
        return '0, 255, 255';
      case 'pigmentation':
        return '255, 192, 203';
      default:
        return '255, 255, 255';
    }
  };

  return (
    <Card className="p-4">
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-full"
          style={{ display: 'none' }}
        />
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          width={640}
          height={480}
        />
        <div className="absolute bottom-4 right-4 space-x-2">
          <Button
            onClick={() => setIsAnalyzing(true)}
            disabled={isAnalyzing}
            className="bg-primary/90 hover:bg-primary"
          >
            <Scan className="w-4 h-4 mr-2" />
            Analyze Skin
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsAnalyzing(false)}
            className="bg-background/90 hover:bg-background"
          >
            <CameraIcon className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}

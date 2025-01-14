import { useEffect, useRef, useState } from 'react';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs';
import { Camera } from '@mediapipe/camera_utils';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera as CameraIcon, Scan } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SkinIssue {
  type: 'dryness' | 'acne' | 'wrinkles' | 'pigmentation';
  severity: number;
  coordinates: { x: number; y: number }[];
  description: string;
}

interface Props {
  onAnalysisComplete: (data: { skinIssues: SkinIssue[] }) => void;
}

export default function FaceAnalysisView({ onAnalysisComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [skinIssues, setSkinIssues] = useState<SkinIssue[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let camera: Camera | null = null;

    const initializeFaceMesh = async () => {
      try {
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

        camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await faceMesh.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });

        await camera.start();
        setIsInitializing(false);
      } catch (err) {
        console.error('Camera initialization error:', err);
        setError('Failed to initialize camera. Please ensure camera permissions are granted.');
        setIsInitializing(false);
      }
    };

    initializeFaceMesh();

    return () => {
      if (camera) {
        camera.stop();
      }
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

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];

      // Draw face mesh with subtle lines
      drawFaceMesh(canvasCtx, landmarks);

      if (isAnalyzing) {
        // Analyze skin and highlight issues
        await analyzeSkinIssues(landmarks);
      }

      // Draw detected skin issues
      drawSkinIssues(canvasCtx);
    }

    canvasCtx.restore();
  };

  const drawFaceMesh = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 0.5;

    // Draw connecting lines for the face mesh
    for (let i = 0; i < landmarks.length; i++) {
      const x = landmarks[i].x * canvasRef.current!.width;
      const y = landmarks[i].y * canvasRef.current!.height;

      ctx.beginPath();
      ctx.arc(x, y, 1, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const analyzeSkinIssues = async (landmarks: any[]) => {
    // Simulated analysis progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Define regions of interest based on facial landmarks
    const issues: SkinIssue[] = [
      {
        type: 'dryness',
        severity: 0.7,
        coordinates: [
          { 
            x: landmarks[123].x,
            y: landmarks[123].y 
          }
        ],
        description: 'Moderate dryness detected in cheek area'
      },
      {
        type: 'pigmentation',
        severity: 0.5,
        coordinates: [
          { 
            x: landmarks[50].x,
            y: landmarks[50].y 
          }
        ],
        description: 'Slight pigmentation variation detected'
      },
      {
        type: 'wrinkles',
        severity: 0.3,
        coordinates: [
          { 
            x: landmarks[107].x,
            y: landmarks[107].y 
          }
        ],
        description: 'Fine lines detected around eye area'
      }
    ];

    setSkinIssues(issues);
    onAnalysisComplete({ skinIssues: issues });
    setIsAnalyzing(false);
    setProgress(100);
  };

  const drawSkinIssues = (ctx: CanvasRenderingContext2D) => {
    if (!canvasRef.current) return;

    skinIssues.forEach(issue => {
      const color = getIssueColor(issue.type);
      ctx.fillStyle = `rgba(${color}, ${issue.severity})`;
      ctx.strokeStyle = `rgba(${color}, 1)`;
      ctx.lineWidth = 2;

      issue.coordinates.forEach(coord => {
        const x = coord.x * canvasRef.current!.width;
        const y = coord.y * canvasRef.current!.height;

        // Draw marker
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // Draw label
        ctx.font = '14px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(issue.type, x, y - 20);
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

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setProgress(0);
    setSkinIssues([]);
  };

  if (error) {
    return (
      <Card className="p-6 text-center">
        <div className="text-destructive mb-4">⚠️ {error}</div>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Card>
    );
  }

  if (isInitializing) {
    return (
      <Card className="p-6 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p>Initializing camera...</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-full"
          style={{ display: 'none' }}
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-lg"
          width={640}
          height={480}
        />

        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <div className="text-center p-4">
              <div className="animate-pulse mb-4 text-white">Analyzing skin...</div>
              <Progress value={progress} className="w-48" />
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4 space-x-2">
          <Button
            onClick={startAnalysis}
            disabled={isAnalyzing}
            className="bg-primary/90 hover:bg-primary"
          >
            <Scan className="w-4 h-4 mr-2" />
            Analyze Skin
          </Button>
          <Button
            variant="outline"
            onClick={() => setSkinIssues([])}
            disabled={isAnalyzing}
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
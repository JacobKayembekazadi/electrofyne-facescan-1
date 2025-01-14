import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
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
  const [isVideoReady, setIsVideoReady] = useState(false);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const detectorRef = useRef<faceDetection.FaceDetector | null>(null);
  const landmarkModelRef = useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const initializeModels = async () => {
      try {
        console.log('Initializing TensorFlow.js...');
        await tf.setBackend('webgl');
        await tf.ready();
        console.log('TensorFlow.js initialized');

        // Load face detection model
        console.log('Loading face detection model...');
        detectorRef.current = await faceDetection.createDetector(
          faceDetection.SupportedModels.MediaPipeFaceDetector,
          {
            runtime: 'mediapipe',
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_detection',
            modelType: 'full'
          }
        );
        console.log('Face detection model loaded');

        // Load face landmarks model
        console.log('Loading face landmarks model...');
        landmarkModelRef.current = await faceLandmarksDetection.createDetector(
          faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
          {
            runtime: 'mediapipe',
            maxFaces: 1,
            refineLandmarks: true,
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh'
          }
        );
        console.log('Face landmarks model loaded');

        // Initialize face mesh
        console.log('Initializing face mesh...');
        faceMeshRef.current = new FaceMesh({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          }
        });

        faceMeshRef.current.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        // Set up video and camera
        if (videoRef.current) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                width: 640,
                height: 480,
                facingMode: 'user'
              }
            });
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setIsVideoReady(true);

            // Initialize camera
            console.log('Setting up camera...');
            cameraRef.current = new Camera(videoRef.current, {
              onFrame: async () => {
                await processFrame();
              },
              width: 640,
              height: 480
            });

            // Start camera
            await cameraRef.current.start();
            console.log('Camera started');

          } catch (err) {
            console.error('Camera access error:', err);
            setError('Unable to access camera. Please ensure camera permissions are granted.');
            return;
          }
        }

        setIsInitializing(false);
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to initialize face detection. Please refresh the page.');
        setIsInitializing(false);
      }
    };

    initializeModels();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (faceMeshRef.current) {
        faceMeshRef.current.close();
      }
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const processFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !detectorRef.current || !landmarkModelRef.current) return;

    try {
      // Detect face
      const faces = await detectorRef.current.estimateFaces(videoRef.current);

      if (faces.length === 0) return;

      const face = faces[0];

      // Get face landmarks
      const landmarks = await landmarkModelRef.current.estimateFaces(videoRef.current);

      if (landmarks.length === 0) return;

      const faceLandmarks = landmarks[0].keypoints;

      // Draw results
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw video frame
      ctx.drawImage(videoRef.current, 0, 0);

      // Draw face detection box
      if (face.box) {
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(face.box.xMin, face.box.yMin, face.box.width, face.box.height);
      }

      // Draw landmarks
      drawFaceMesh(ctx, faceLandmarks);

      // If analyzing, process skin analysis
      if (isAnalyzing) {
        await analyzeSkin(ctx, faceLandmarks);
      }

      // Draw detected issues
      drawSkinIssues(ctx);

    } catch (error) {
      console.error('Frame processing error:', error);
    }

    // Request next frame
    animationFrameRef.current = requestAnimationFrame(processFrame);
  };

  const analyzeSkin = async (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
    const issues: SkinIssue[] = [];
    const width = canvasRef.current!.width;
    const height = canvasRef.current!.height;

    // Define regions to analyze
    const regions = [
      { name: 'rightCheek', point: landmarks[454], type: 'dryness' },
      { name: 'forehead', point: landmarks[151], type: 'pigmentation' },
      { name: 'rightEye', point: landmarks[33], type: 'wrinkles' }
    ];

    for (const region of regions) {
      const x = region.point.x * width;
      const y = region.point.y * height;

      const imageData = ctx.getImageData(
        x - 15,
        y - 15,
        30,
        30
      );

      const analysis = analyzeRegion(imageData, region.type);

      issues.push({
        type: region.type as any,
        severity: analysis.severity,
        coordinates: [{ x: x / width, y: y / height }],
        description: analysis.description
      });
    }

    setSkinIssues(issues);
    if (progress >= 90) {
      onAnalysisComplete({ skinIssues: issues });
      setIsAnalyzing(false);
    }
  };

  const analyzeRegion = (imageData: ImageData, type: string) => {
    const data = imageData.data;
    let severity = 0;
    let description = '';

    switch (type) {
      case 'dryness':
        const brightness = calculateAverageBrightness(data);
        severity = 1 - (brightness / 255);
        description = 'Analyzing skin hydration';
        break;

      case 'pigmentation':
        severity = calculateColorVariance(data);
        description = 'Detecting pigmentation variations';
        break;

      case 'wrinkles':
        severity = detectEdges(imageData);
        description = 'Analyzing fine lines';
        break;
    }

    return { severity: Math.min(Math.max(severity, 0.3), 0.9), description };
  };

  const calculateAverageBrightness = (data: Uint8ClampedArray) => {
    let total = 0;
    for (let i = 0; i < data.length; i += 4) {
      total += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    return total / (data.length / 4);
  };

  const calculateColorVariance = (data: Uint8ClampedArray) => {
    let variance = 0;
    const avg = calculateAverageBrightness(data);

    for (let i = 0; i < data.length; i += 4) {
      const pixelBrightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      variance += Math.pow(pixelBrightness - avg, 2);
    }

    return Math.min(variance / (data.length / 4) / 1000, 1);
  };

  const detectEdges = (imageData: ImageData) => {
    const data = imageData.data;
    let edges = 0;

    for (let y = 1; y < imageData.height - 1; y++) {
      for (let x = 1; x < imageData.width - 1; x++) {
        const idx = (y * imageData.width + x) * 4;
        const diff = Math.abs(data[idx] - data[idx + 4]);
        if (diff > 30) edges++;
      }
    }

    return edges / (imageData.width * imageData.height);
  };

  const drawFaceMesh = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;

    for (let i = 0; i < landmarks.length; i++) {
      const x = landmarks[i].x * ctx.canvas.width;
      const y = landmarks[i].y * ctx.canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, 1, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }

    // Draw connections between landmarks
    for (const connection of FACEMESH_TESSELATION) {
      const [i, j] = connection;
      const start = landmarks[i];
      const end = landmarks[j];

      if (start && end) {
        ctx.beginPath();
        ctx.moveTo(start.x * ctx.canvas.width, start.y * ctx.canvas.height);
        ctx.lineTo(end.x * ctx.canvas.width, end.y * ctx.canvas.height);
        ctx.stroke();
      }
    }
  };

  const drawSkinIssues = (ctx: CanvasRenderingContext2D) => {
    skinIssues.forEach(issue => {
      issue.coordinates.forEach(coord => {
        const x = coord.x * canvasRef.current!.width;
        const y = coord.y * canvasRef.current!.height;

        // Draw analysis marker
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.strokeStyle = getIssueColor(issue.type);
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw severity indicator
        ctx.beginPath();
        ctx.arc(x, y, 20 * issue.severity, 0, 2 * Math.PI);
        ctx.fillStyle = `${getIssueColor(issue.type)}44`;
        ctx.fill();

        // Draw label
        ctx.font = '14px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(issue.type, x, y - 30);
      });
    });
  };

  const getIssueColor = (type: string): string => {
    switch (type) {
      case 'dryness':
        return '#FFA500';
      case 'pigmentation':
        return '#FF69B4';
      case 'wrinkles':
        return '#00FFFF';
      default:
        return '#FFFFFF';
    }
  };

  const startAnalysis = async () => {
    if (!detectorRef.current || !landmarkModelRef.current) {
      setError('Face detection not initialized. Please refresh the page.');
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setSkinIssues([]);

    // Progress simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);
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

  if (isInitializing || !isVideoReady) {
    return (
      <Card className="p-6 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p>Initializing camera and face detection...</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-full absolute top-0 left-0 pointer-events-none"
          playsInline
          style={{ opacity: 0 }}
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

// Face mesh connections for visualization
const FACEMESH_TESSELATION = [
  [127, 34], [34, 139], [139, 127], [11, 0], [0, 37], [37, 11],
  [10, 109], [109, 67], [67, 10], [338, 297], [297, 332], [332, 338],
  [151, 108], [108, 69], [69, 151], [9, 336], [336, 299], [299, 9],
  [107, 66], [66, 8], [8, 107], [55, 285], [285, 193], [193, 55],
  [157, 144], [144, 153], [153, 157], [158, 145], [145, 154], [154, 158],
  [133, 155], [155, 159], [159, 133], [160, 156], [156, 134], [134, 160],
  [33, 7], [7, 163], [163, 33], [246, 161], [161, 160], [160, 246],
  [159, 158], [158, 157], [157, 173], [173, 133], [133, 155], [155, 159]
];
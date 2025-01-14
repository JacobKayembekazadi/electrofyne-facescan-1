import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';
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
  const cameraRef = useRef<Camera | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const initializeModels = async () => {
      try {
        console.log('Initializing TensorFlow.js...');
        // Initialize TensorFlow.js with WebGL backend
        await tf.setBackend('webgl');
        await tf.ready();
        console.log('TensorFlow.js initialized');

        // Initialize face detector
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

        // Set up video
        if (videoRef.current) {
          videoRef.current.width = 640;
          videoRef.current.height = 480;

          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                width: 640,
                height: 480,
                facingMode: 'user'
              }
            });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setIsVideoReady(true);

            // Initialize camera after video is ready
            console.log('Setting up camera...');
            cameraRef.current = new Camera(videoRef.current, {
              onFrame: async () => {
                if (faceMeshRef.current && videoRef.current) {
                  await faceMeshRef.current.send({ image: videoRef.current });
                }
              },
              width: 640,
              height: 480
            });

            // Start camera
            await cameraRef.current.start();
            console.log('Camera started');

            // Set up face mesh results handler
            faceMeshRef.current.onResults(onResults);
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

    // Cleanup function
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

  const onResults = async (results: any) => {
    const canvasCtx = canvasRef.current?.getContext('2d');
    if (!canvasCtx || !canvasRef.current) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw the video frame first
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
      for (const landmarks of results.multiFaceLandmarks) {
        // Draw face mesh
        drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, { 
          color: 'rgba(255,255,255,0.5)',
          lineWidth: 1 
        });
      }

      if (isAnalyzing) {
        await analyzeSkinRegions(results.multiFaceLandmarks[0]);
      }

      // Draw detected skin issues
      drawSkinIssues(canvasCtx);
    }

    canvasCtx.restore();
  };

  const analyzeSkinRegions = async (landmarks: any) => {
    if (!canvasRef.current || !landmarks) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const issues: SkinIssue[] = [];
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

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
        // Calculate average brightness
        const brightness = calculateAverageBrightness(data);
        severity = 1 - (brightness / 255);
        description = 'Analyzing skin hydration';
        break;

      case 'pigmentation':
        // Calculate color variance
        severity = calculateColorVariance(data);
        description = 'Detecting pigmentation variations';
        break;

      case 'wrinkles':
        // Edge detection for wrinkles
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
    if (!detectorRef.current || !faceMeshRef.current) {
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

// Helper function to draw face mesh
function drawConnectors(ctx: CanvasRenderingContext2D, landmarks: any[], connections: any[], style: any) {
  const canvas = ctx.canvas;
  for (const connection of connections) {
    const [i, j] = connection;
    const kp1 = landmarks[i];
    const kp2 = landmarks[j];

    if (!kp1 || !kp2) continue;

    ctx.beginPath();
    ctx.moveTo(kp1.x * canvas.width, kp1.y * canvas.height);
    ctx.lineTo(kp2.x * canvas.width, kp2.y * canvas.height);
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.lineWidth;
    ctx.stroke();
  }
}

// Face mesh connections
const FACEMESH_TESSELATION = [
  [127, 34], [34, 139], [139, 127], [11, 0], [0, 37], [37, 11],
  [10, 109], [109, 67], [67, 10], [338, 297], [297, 332], [332, 338],
  [141, 175], [175, 151], [151, 141], [140, 176], [176, 152], [152, 140],
  [234, 93], [93, 132], [132, 234], [133, 235], [235, 94], [94, 133],
  [33, 7], [7, 163], [163, 33], [163, 144], [144, 107], [107, 163],
  [263, 110], [110, 337], [337, 263], [263, 337], [337, 300], [300, 263],
  [300, 236], [236, 362], [362, 300], [362, 389], [389, 264], [264, 362],
  [21, 54], [54, 103], [103, 21], [61, 291], [291, 199], [199, 61],
  [78, 95], [95, 88], [88, 78], [78, 88], [88, 95], [95, 78],
  [151, 135], [135, 141], [141, 151], [152, 136], [136, 140], [140, 152],
  [172, 118], [118, 131], [131, 172], [118, 172], [172, 131], [131, 118],
  [264, 389], [389, 373], [373, 264], [373, 264], [264, 373], [373, 264],
  [373, 300], [300, 337], [337, 373], [337, 373], [373, 337], [337, 373],
  [10, 103], [103, 172], [172, 10], [21, 10], [10, 132], [132, 21]
];
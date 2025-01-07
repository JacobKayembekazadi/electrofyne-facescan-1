import { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { Camera } from "@mediapipe/camera_utils";
import { FaceMesh } from "@mediapipe/face_mesh";
import { useToast } from "@/hooks/use-toast";
import { Color } from "three";

interface ARSkinVisualizationProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  analysisResults?: {
    scores: {
      hydration: { value: number };
      texture: { value: number };
      elasticity: { value: number };
      pigmentation: { value: number };
      poreHealth: { value: number };
    };
    annotations?: Array<{
      x: number;
      y: number;
      type: string;
      description: string;
    }>;
  };
}

interface FaceLandmark {
  x: number;
  y: number;
  z: number;
}

function FaceMeshOverlay({ landmarks, scores }: { 
  landmarks: FaceLandmark[]; 
  scores: NonNullable<ARSkinVisualizationProps["analysisResults"]>["scores"]
}) {
  const getColorFromScore = (score: number) => {
    const hue = (score / 100) * 120; // 0 = red, 120 = green
    const color = new Color();
    color.setHSL(hue / 360, 0.7, 0.5);
    return color;
  };

  const positions = new Float32Array(landmarks.flatMap(p => [p.x, p.y, p.z]));
  const avgScore = (
    scores.hydration.value +
    scores.texture.value +
    scores.elasticity.value +
    scores.pigmentation.value +
    scores.poreHealth.value
  ) / 5;

  const color = getColorFromScore(avgScore);
  const colors = new Float32Array(landmarks.flatMap(() => [color.r, color.g, color.b]));

  return (
    <mesh>
      <meshBasicMaterial wireframe transparent opacity={0.5} vertexColors />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={landmarks.length}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={landmarks.length}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
    </mesh>
  );
}

export default function ARSkinVisualization({ videoRef, analysisResults }: ARSkinVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [landmarks, setLandmarks] = useState<FaceLandmark[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !analysisResults) return;

    let faceMesh: FaceMesh | null = null;
    let detector: any = null;

    const initializeFaceMesh = async () => {
      try {
        detector = await faceLandmarksDetection.createDetector(
          faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
          {
            runtime: "mediapipe",
            refineLandmarks: true,
            maxFaces: 1,
          }
        );

        faceMesh = new FaceMesh({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          },
        });

        faceMesh.onResults((results) => {
          if (results.multiFaceLandmarks?.length > 0) {
            setLandmarks(results.multiFaceLandmarks[0] as FaceLandmark[]);
          }
        });

        if (videoRef.current) {
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (faceMesh) {
                await faceMesh.send({ image: videoRef.current! });
              }
            },
            width: 640,
            height: 480,
          });
          camera.start();
        }
      } catch (error) {
        console.error("Error initializing face mesh:", error);
        toast({
          title: "AR Initialization Failed",
          description: "Could not start face tracking. Please try again.",
          variant: "destructive",
        });
      }
    };

    initializeFaceMesh();

    return () => {
      if (faceMesh) {
        faceMesh.close();
      }
    };
  }, [videoRef, toast, analysisResults]);

  if (!analysisResults) return null;

  return (
    <div className="relative w-full aspect-video">
      <Canvas>
        <OrbitControls enablePan={false} enableZoom={false} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {landmarks.length > 0 && analysisResults && (
          <FaceMeshOverlay 
            landmarks={landmarks} 
            scores={analysisResults.scores} 
          />
        )}
      </Canvas>
    </div>
  );
}
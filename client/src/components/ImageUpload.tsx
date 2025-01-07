import { UploadCloud, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import CameraPermissionDialog from "./CameraPermissionDialog";
import { motion, AnimatePresence } from "framer-motion";
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { Camera as MediapipeCamera } from '@mediapipe/camera_utils';
import { FaceMesh } from '@mediapipe/face_mesh';

interface ImageUploadProps {
  onUpload: (file: File) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [permissionState, setPermissionState] = useState<"prompt" | "granted" | "denied">("prompt");
  const [faceDetected, setFaceDetected] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setHasCamera(cameras.length > 0);

        if (navigator.permissions && navigator.permissions.query) {
          navigator.permissions.query({ name: 'camera' as PermissionName })
            .then(result => {
              setPermissionState(result.state as "prompt" | "granted" | "denied");

              result.addEventListener('change', () => {
                setPermissionState(result.state as "prompt" | "granted" | "denied");
              });
            });
        }
      })
      .catch(error => {
        console.error('Error checking camera:', error);
        setHasCamera(false);
      });
  }, []);

  const initFaceDetection = async () => {
    if (!videoRef.current) return;

    await tf.ready();
    const model = await faceLandmarksDetection.createDetector(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
      {
        runtime: 'mediapipe',
        refineLandmarks: true,
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
      }
    );

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

    faceMesh.onResults((results) => {
      setFaceDetected(results.multiFaceLandmarks.length > 0);
    });

    const camera = new MediapipeCamera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await faceMesh.send({ image: videoRef.current });
        }
      },
      width: 1280,
      height: 720
    });

    camera.start();
  };

  const startCamera = async () => {
    try {
      if (permissionState === "denied") {
        setShowPermissionDialog(true);
        return;
      }

      if (permissionState === "prompt") {
        setShowPermissionDialog(true);
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
        await initFaceDetection();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Access Failed",
        description: "Please check your camera permissions and try again.",
        variant: "destructive",
      });
      setPermissionState("denied");
      setShowPermissionDialog(true);
    }
  };

  const requestCameraPermission = async () => {
    setShowPermissionDialog(false);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
        setPermissionState("granted");
        await initFaceDetection();
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setPermissionState("denied");
      toast({
        title: "Permission Denied",
        description: "Camera access is required for skin analysis.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
    setFaceDetected(false);
  };

  const capturePhoto = () => {
    if (!faceDetected) {
      toast({
        title: "No Face Detected",
        description: "Please position your face within the frame.",
        variant: "destructive",
      });
      return;
    }

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            setPreview(URL.createObjectURL(blob));
            onUpload(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onUpload(file);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />

      <canvas ref={canvasRef} className="hidden" />

      <CameraPermissionDialog
        isOpen={showPermissionDialog}
        onClose={() => setShowPermissionDialog(false)}
        onRequestPermission={requestCameraPermission}
        permissionState={permissionState}
      />

      <AnimatePresence mode="wait">
        {!preview && !isCameraActive ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 md:p-8 cursor-pointer hover:border-primary/50 transition-colors">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="flex flex-col items-center"
              >
                <UploadCloud className="w-12 h-12 mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Upload or Take a Photo</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Take a clear photo of your face in good lighting
                </p>
                <div className="flex flex-col w-full gap-3">
                  {hasCamera && (
                    <Button onClick={startCamera} className="w-full flex items-center justify-center gap-2">
                      <Camera className="w-4 h-4" />
                      Take Photo
                    </Button>
                  )}
                  <Button
                    variant={hasCamera ? "outline" : "default"}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    Choose File
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}

        {isCameraActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full"
          >
            <div className="aspect-[3/4] w-full relative overflow-hidden rounded-lg bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none">
                {/* Face detection overlay */}
                <div className="w-48 h-48 border-2 border-primary/50 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              {faceDetected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-4 left-4 bg-green-500/90 text-white px-2 py-1 rounded text-sm"
                >
                  Face Detected
                </motion.div>
              )}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-4 left-4 right-4 flex flex-col gap-2"
              >
                <Button
                  onClick={capturePhoto}
                  className="w-full flex items-center justify-center gap-2"
                  disabled={!faceDetected}
                >
                  <Camera className="w-4 h-4" />
                  Capture
                </Button>
                <Button
                  variant="outline"
                  onClick={stopCamera}
                  className="w-full"
                >
                  Cancel
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative w-full aspect-[3/4] overflow-hidden rounded-lg"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <Button
              variant="outline"
              onClick={() => {
                setPreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="w-full"
            >
              Choose Different Photo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
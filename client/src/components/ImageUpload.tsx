import { UploadCloud, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import CameraPermissionDialog from "./CameraPermissionDialog";
import { motion, AnimatePresence } from "framer-motion";

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
  };

  const capturePhoto = () => {
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
    <div className="text-center">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
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
            className="space-y-6"
          >
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 cursor-pointer hover:border-primary/50 transition-colors">
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
              >
                <UploadCloud className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">Upload or Take a Photo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Take a clear photo of your face in good lighting
              </p>
              <div className="flex justify-center gap-4">
                {hasCamera && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button onClick={startCamera} className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Take Photo
                    </Button>
                  </motion.div>
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant={hasCamera ? "outline" : "default"} 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : null}

        {isCameraActive && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative max-w-xl mx-auto"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-4 left-0 right-0 flex justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={capturePhoto} className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Capture
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" onClick={stopCamera}>
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {preview && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={preview} 
              alt="Preview" 
              className="max-w-sm mx-auto rounded-lg"
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline"
                onClick={() => {
                  setPreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                Choose Different Photo
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
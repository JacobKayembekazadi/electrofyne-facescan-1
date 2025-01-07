import { UploadCloud, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";

interface ImageUploadProps {
  onUpload: (file: File) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Check if device has camera
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setHasCamera(cameras.length > 0);
      })
      .catch(error => {
        console.error('Error checking camera:', error);
        setHasCamera(false);
      });
  }, []);

  const startCamera = async () => {
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
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback to file upload if camera access fails
      setHasCamera(false);
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

      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
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

      {/* Hidden canvas for capturing photos */}
      <canvas ref={canvasRef} className="hidden" />

      {!preview && !isCameraActive ? (
        <div className="space-y-6">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 cursor-pointer hover:border-primary/50 transition-colors">
            <UploadCloud className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Upload or Take a Photo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Take a clear photo of your face in good lighting
            </p>
            <div className="flex justify-center gap-4">
              {hasCamera && (
                <Button onClick={startCamera} className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Take Photo
                </Button>
              )}
              <Button 
                variant={hasCamera ? "outline" : "default"} 
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {isCameraActive && (
        <div className="relative max-w-xl mx-auto">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <Button onClick={capturePhoto} className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Capture
            </Button>
            <Button variant="outline" onClick={stopCamera}>
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {preview && (
        <div className="space-y-4">
          <img 
            src={preview} 
            alt="Preview" 
            className="max-w-sm mx-auto rounded-lg"
          />
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
        </div>
      )}
    </div>
  );
}
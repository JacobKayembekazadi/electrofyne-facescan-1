import { UploadCloud, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

interface ImageUploadProps {
  onUpload: (file: File) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onUpload(file);
  };

  const handleCaptureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.click();
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
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

      {!preview ? (
        <div className="space-y-6">
          <div 
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 cursor-pointer hover:border-primary/50 transition-colors"
          >
            <UploadCloud className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Upload or Take a Photo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Take a clear photo of your face in good lighting
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={handleCaptureClick} className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Take Photo
              </Button>
              <Button variant="outline" onClick={handleUploadClick}>
                Choose File
              </Button>
            </div>
          </div>
        </div>
      ) : (
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
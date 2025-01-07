import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, XCircle, AlertTriangle } from "lucide-react";

interface CameraPermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestPermission: () => void;
  permissionState: "prompt" | "granted" | "denied";
}

export default function CameraPermissionDialog({
  isOpen,
  onClose,
  onRequestPermission,
  permissionState,
}: CameraPermissionDialogProps) {
  const renderContent = () => {
    switch (permissionState) {
      case "denied":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="w-6 h-6" />
                <DialogTitle>Camera Access Denied</DialogTitle>
              </div>
              <DialogDescription className="space-y-4">
                <p>
                  We need camera access to analyze your skin and provide personalized recommendations.
                </p>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="font-medium">How to enable camera access:</p>
                  <ol className="list-decimal list-inside text-sm space-y-1">
                    <li>Click the camera icon in your browser's address bar</li>
                    <li>Select "Allow" for camera access</li>
                    <li>Refresh the page and try again</li>
                  </ol>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={onClose} variant="outline">Close</Button>
            </DialogFooter>
          </>
        );

      case "prompt":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Camera className="w-6 h-6 text-primary" />
                <DialogTitle>Camera Access Required</DialogTitle>
              </div>
              <DialogDescription className="space-y-4">
                <p>
                  We need your permission to use your device's camera for skin analysis.
                  This helps us provide accurate and personalized skincare recommendations.
                </p>
                <div className="bg-primary/10 p-4 rounded-lg space-y-2">
                  <p className="font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Your privacy matters
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Photos are only used for analysis</li>
                    <li>We never store or share your images</li>
                    <li>You can revoke access anytime</li>
                  </ul>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button onClick={onClose} variant="outline">Not Now</Button>
              <Button onClick={onRequestPermission}>Allow Camera Access</Button>
            </DialogFooter>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

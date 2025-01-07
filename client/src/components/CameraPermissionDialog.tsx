import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, XCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 text-destructive"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <XCircle className="w-6 h-6" />
                </motion.div>
                <DialogTitle>Camera Access Denied</DialogTitle>
              </motion.div>
              <DialogDescription className="space-y-4">
                <p>
                  We need camera access to analyze your skin and provide personalized recommendations.
                </p>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-muted p-4 rounded-lg space-y-2"
                >
                  <p className="font-medium">How to enable camera access:</p>
                  <ol className="list-decimal list-inside text-sm space-y-1">
                    <li>Click the camera icon in your browser's address bar</li>
                    <li>Select "Allow" for camera access</li>
                    <li>Refresh the page and try again</li>
                  </ol>
                </motion.div>
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
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, -5, 5, -5, 5, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  <Camera className="w-6 h-6 text-primary" />
                </motion.div>
                <DialogTitle>Let's Get Started!</DialogTitle>
              </motion.div>
              <DialogDescription className="space-y-4">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  To analyze your skin and provide personalized recommendations, 
                  we'll need to use your device's camera.
                </motion.p>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-primary/10 p-4 rounded-lg space-y-2"
                >
                  <p className="font-medium flex items-center gap-2">
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </motion.div>
                    Your privacy matters
                  </p>
                  <motion.ul 
                    className="list-disc list-inside text-sm space-y-1"
                  >
                    {[
                      "Photos are only used for analysis",
                      "We never store or share your images",
                      "You can revoke access anytime"
                    ].map((text, index) => (
                      <motion.li
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + (index * 0.1) }}
                      >
                        {text}
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button onClick={onClose} variant="outline">Not Now</Button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={onRequestPermission}
                  className="gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Allow Camera Access
                </Button>
              </motion.div>
            </DialogFooter>
          </>
        );

      case "granted":
        return (
          <>
            <DialogHeader>
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 text-green-500"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle2 className="w-6 h-6" />
                </motion.div>
                <DialogTitle>Access Granted!</DialogTitle>
              </motion.div>
              <DialogDescription>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Thank you! You can now use your camera for skin analysis.
                </motion.p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={onClose}>Continue</Button>
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
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
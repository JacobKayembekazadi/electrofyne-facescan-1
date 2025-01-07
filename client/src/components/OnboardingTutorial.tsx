import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, MessageCircle, ChartLine, ShoppingBag, X } from "lucide-react";

const TUTORIAL_STEPS = [
  {
    title: "Welcome to Electrofyne AI",
    description: "Your personal AI-powered skincare companion. Let's take a quick tour of the features that will help you achieve your best skin.",
    icon: null,
  },
  {
    title: "AI Skin Analysis",
    description: "Start with a quick skin analysis. Our AI technology will analyze your skin condition and provide personalized recommendations.",
    icon: Camera,
  },
  {
    title: "Smart Chat Assistant",
    description: "Chat with our AI assistant anytime for skincare advice, product recommendations, and help with your routine.",
    icon: MessageCircle,
  },
  {
    title: "Track Your Progress",
    description: "Monitor your skin's improvement over time with detailed analytics and progress tracking.",
    icon: ChartLine,
  },
  {
    title: "Personalized Products",
    description: "Get product recommendations tailored to your skin type and concerns, backed by AI analysis.",
    icon: ShoppingBag,
  },
];

export default function OnboardingTutorial() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  useEffect(() => {
    const tutorialSeen = localStorage.getItem("hasSeenTutorial");
    if (tutorialSeen) {
      setHasSeenTutorial(true);
      setIsVisible(false);
    }
  }, []);

  const completeTutorial = () => {
    localStorage.setItem("hasSeenTutorial", "true");
    setHasSeenTutorial(true);
    setIsVisible(false);
  };

  if (!isVisible || hasSeenTutorial) return null;

  const currentTutorialStep = TUTORIAL_STEPS[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="max-w-lg w-full"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-6">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-1"
                >
                  {currentTutorialStep.icon && (
                    <currentTutorialStep.icon className="w-8 h-8 text-primary mb-4" />
                  )}
                  <h2 className="text-2xl font-bold mb-2">{currentTutorialStep.title}</h2>
                  <p className="text-muted-foreground">{currentTutorialStep.description}</p>
                </motion.div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-destructive/10"
                  onClick={completeTutorial}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <div className="flex justify-between items-center mt-8">
                <div className="flex gap-1">
                  {TUTORIAL_STEPS.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep ? "bg-primary" : "bg-primary/20"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                    >
                      Previous
                    </Button>
                  )}
                  {currentStep < TUTORIAL_STEPS.length - 1 ? (
                    <Button onClick={() => setCurrentStep((prev) => prev + 1)}>
                      Next
                    </Button>
                  ) : (
                    <Button onClick={completeTutorial}>Get Started</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

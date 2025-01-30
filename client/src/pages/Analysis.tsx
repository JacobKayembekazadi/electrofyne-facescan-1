import { useState } from "react";
import { Card } from "@/components/ui/card";
import FaceAnalysisView from "../components/FaceAnalysisView";
import AnalysisResults from "../components/AnalysisResults";
import ProductRecommendations from "../components/ProductRecommendations";
import DailySkinTracker from "../components/DailySkinTracker";
import SocialShare from "../components/SocialShare";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type AnalysisStage = "capture" | "analyzing" | "complete";

export default function Analysis() {
  const [stage, setStage] = useState<AnalysisStage>("capture");
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalysisComplete = async (analysisData: any) => {
    try {
      setStage("analyzing");

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResults = {
        skinTone: "Type III (Medium)",
        primaryConcerns: ["Mild Acne", "Uneven Texture", "Dark Spots"],
        scores: {
          hydration: {
            value: 75,
            label: "Hydration",
            description: "Your skin's moisture retention capacity"
          },
          texture: {
            value: 85,
            label: "Texture",
            description: "Overall smoothness and consistency"
          },
          elasticity: {
            value: 80,
            label: "Elasticity",
            description: "Skin's ability to bounce back"
          },
          pigmentation: {
            value: 70,
            label: "Pigmentation",
            description: "Even distribution of melanin"
          },
          poreHealth: {
            value: 82,
            label: "Pore Health",
            description: "Size and cleanliness of pores"
          }
        },
        detectedIssues: analysisData.skinIssues,
        recommendations: [
          {
            category: "Texture Improvement",
            items: [
              "Use a pore-minimizing toner",
              "Add retinol to reduce fine lines",
              "Gentle exfoliation 2-3 times per week"
            ]
          },
          {
            category: "Hydration",
            items: [
              "Use a hyaluronic acid serum",
              "Apply moisturizer while skin is damp"
            ]
          }
        ]
      };

      setResults(mockResults);
      setStage("complete");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze skin. Please try again.",
        variant: "destructive",
      });
      setStage("capture");
    }
  };

  const handleReset = () => {
    setStage("capture");
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          Skin Analysis
        </h1>

        <div className="grid gap-6 sm:gap-8">
          <Card className="p-4 sm:p-6 shadow-lg">
            {stage === "capture" && (
              <FaceAnalysisView onAnalysisComplete={handleAnalysisComplete} />
            )}

            {stage === "analyzing" && (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-lg">Analyzing your skin...</p>
              </div>
            )}

            {stage === "complete" && results && (
              <div className="space-y-6 sm:space-y-8">
                <div className="flex justify-between items-center">
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="gap-2"
                  >
                    New Analysis
                  </Button>
                  <SocialShare results={results} />
                </div>

                <AnalysisResults results={results} />
                <ProductRecommendations results={results} />
              </div>
            )}
          </Card>

          {stage === "complete" && (
            <div className="animate-fade-in">
              <DailySkinTracker />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Card } from "@/components/ui/card";
import ImageUpload from "../components/ImageUpload";
import AnalysisResults from "../components/AnalysisResults";
import ProductRecommendations from "../components/ProductRecommendations";
import DailySkinTracker from "../components/DailySkinTracker";
import { useToast } from "@/hooks/use-toast";

type AnalysisStage = "upload" | "analyzing" | "complete";

export default function Analysis() {
  const [stage, setStage] = useState<AnalysisStage>("upload");
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    try {
      setStage("analyzing");

      // Mock analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock analysis results matching the expected interface
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
            value: 65,
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
            value: 60,
            label: "Pore Health",
            description: "Size and cleanliness of pores"
          },
          overall: {
            value: 72,
            label: "Overall Health",
            description: "Combined skin health score"
          }
        },
        recommendations: [
          {
            category: "Hydration",
            items: [
              "Use a hyaluronic acid serum",
              "Apply moisturizer while skin is damp"
            ]
          },
          {
            category: "Texture",
            items: [
              "Gentle exfoliation 2-3 times per week",
              "Use products with niacinamide"
            ]
          }
        ],
        imageUrl: URL.createObjectURL(file),
        annotations: [
          {
            x: 35,
            y: 45,
            type: "hydration",
            description: "Slight dryness detected in this area"
          },
          {
            x: 65,
            y: 30,
            type: "texture",
            description: "Minor uneven texture present"
          }
        ]
      };

      setResults(mockResults);
      setStage("complete");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
      setStage("upload");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Skin Analysis</h1>

      <div className="grid gap-8">
        <Card className="p-6">
          {stage === "upload" && (
            <ImageUpload onUpload={handleImageUpload} />
          )}

          {stage === "analyzing" && (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-lg">Analyzing your skin...</p>
            </div>
          )}

          {stage === "complete" && results && (
            <div className="space-y-8">
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
  );
}
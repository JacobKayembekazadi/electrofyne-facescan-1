import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import ImageUpload from "../components/ImageUpload";
import AnalysisResults from "../components/AnalysisResults";
import ProductRecommendations from "../components/ProductRecommendations";
import DailySkinTracker from "../components/DailySkinTracker";
import TextureAnalysisView from "../components/TextureAnalysisView";
import RoutineProgressAnimation from "../components/RoutineProgressAnimation";
import ImageComparisonSlider from "../components/ImageComparisonSlider";
import SkinTypeQuiz from "../components/SkinTypeQuiz";
import { analyzeTexture } from "../utils/textureAnalysis";
import { useToast } from "@/hooks/use-toast";
import RoutineOptimizer from "../components/RoutineOptimizer";

type AnalysisStage = "quiz" | "upload" | "analyzing" | "complete";

interface SkinTypeResult {
  type: string;
  description: string;
  recommendations: string[];
}

export default function Analysis() {
  const [stage, setStage] = useState<AnalysisStage>("quiz");
  const [results, setResults] = useState<any>(null);
  const [textureResults, setTextureResults] = useState<any>(null);
  const [beforeImage, setBeforeImage] = useState<string>("");
  const [skinType, setSkinType] = useState<SkinTypeResult | null>(null);
  const [routineData, setRoutineData] = useState({
    morningSteps: [
      { id: "1", name: "Cleanser", completed: false, timeOfDay: "morning" as const },
      { id: "2", name: "Toner", completed: false, timeOfDay: "morning" as const },
      { id: "3", name: "Serum", completed: false, timeOfDay: "morning" as const },
      { id: "4", name: "Moisturizer", completed: false, timeOfDay: "morning" as const },
      { id: "5", name: "Sunscreen", completed: false, timeOfDay: "morning" as const },
    ],
    eveningSteps: [
      { id: "6", name: "Makeup Remover", completed: false, timeOfDay: "evening" as const },
      { id: "7", name: "Cleanser", completed: false, timeOfDay: "evening" as const },
      { id: "8", name: "Treatment", completed: false, timeOfDay: "evening" as const },
      { id: "9", name: "Night Cream", completed: false, timeOfDay: "evening" as const },
    ],
    streak: 3,
    lastCompletedAt: new Date(),
  });
  const { toast } = useToast();

  const handleQuizComplete = (result: SkinTypeResult) => {
    setSkinType(result);
    setStage("upload");
    toast({
      title: `Your Skin Type: ${result.type}`,
      description: result.description,
    });
  };

  const handleStepComplete = (stepId: string, completed: boolean) => {
    setRoutineData(prev => {
      const updateSteps = (steps: typeof prev.morningSteps) =>
        steps.map(step =>
          step.id === stepId
            ? { ...step, completed, completedAt: completed ? new Date() : undefined }
            : step
        );

      return {
        ...prev,
        morningSteps: updateSteps(prev.morningSteps),
        eveningSteps: updateSteps(prev.eveningSteps),
        lastCompletedAt: new Date(),
      };
    });
  };

  const handleImageUpload = async (file: File) => {
    try {
      setStage("analyzing");
      const imageUrl = URL.createObjectURL(file);
      setBeforeImage(imageUrl);

      const textureMap = await analyzeTexture(imageUrl);
      setTextureResults({ textureMap, originalImage: imageUrl });

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
            value: 100 - textureMap.overallTexture,
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
            value: Math.max(0, 100 - (textureMap.poreSize * 2)),
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
            category: "Texture Improvement",
            items: [
              textureMap.poreSize > 20 ? "Use a pore-minimizing toner" : "Continue with current pore care routine",
              textureMap.lineDepth > 50 ? "Add retinol to reduce fine lines" : "Focus on prevention with antioxidants",
              "Gentle exfoliation 2-3 times per week",
              "Use products with niacinamide"
            ]
          },
          {
            category: "Hydration",
            items: [
              "Use a hyaluronic acid serum",
              "Apply moisturizer while skin is damp"
            ]
          }
        ],
        imageUrl: imageUrl,
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
          {stage === "quiz" && (
            <SkinTypeQuiz onComplete={handleQuizComplete} />
          )}

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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnalysisResults results={results} />
                {beforeImage && (
                  <ImageComparisonSlider
                    beforeImage={beforeImage}
                    afterImage={beforeImage}
                    beforeLabel="Initial Scan"
                    afterLabel="Current"
                  />
                )}
              </div>

              {textureResults && (
                <TextureAnalysisView
                  textureMap={textureResults.textureMap}
                  originalImage={textureResults.originalImage}
                />
              )}

              {skinType && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Your Skin Type: {skinType.type}</h3>
                  <p className="text-muted-foreground mb-4">{skinType.description}</p>
                  <h4 className="font-medium mb-2">Recommended Care Tips:</h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {skinType.recommendations.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </Card>
              )}

              <RoutineOptimizer skinAnalysis={results} />

              <RoutineProgressAnimation
                {...routineData}
                onStepComplete={handleStepComplete}
              />

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
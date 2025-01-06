import { useState } from "react";
import { Card } from "@/components/ui/card";
import ImageUpload from "../components/ImageUpload";
import AnalysisResults from "../components/AnalysisResults";
import ProductRecommendations from "../components/ProductRecommendations";
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
      
      // Mock analysis results
      const mockResults = {
        skinType: "combination",
        concerns: ["mild acne", "uneven texture"],
        hydrationLevel: 65,
        sensitivity: "moderate",
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
    </div>
  );
}

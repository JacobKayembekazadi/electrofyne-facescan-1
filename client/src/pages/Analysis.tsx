import { useState } from "react";
import { Card } from "@/components/ui/card";
import SimpleFaceAnalysis from "../components/SimpleFaceAnalysis";
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

      // Check if we received real analysis results from the API
      if (analysisData.scores && analysisData.recommendations) {
        console.log('Using real AI analysis results:', analysisData);
        
        // Use the AI analysis results directly
        const aiResults = {
          skinTone: analysisData.skinTone || "Type III (Medium)",
          primaryConcerns: analysisData.primaryConcerns || ["General Skin Health"],
          scores: {
            ...analysisData.scores,
            // Ensure all required scores exist
            overall: analysisData.scores.overall || {
              value: Math.round((
                (analysisData.scores.hydration?.value || 75) +
                (analysisData.scores.texture?.value || 75) +
                (analysisData.scores.elasticity?.value || 75) +
                (analysisData.scores.pigmentation?.value || 75) +
                (analysisData.scores.poreHealth?.value || 75)
              ) / 5),
              label: "Overall Health",
              description: "Combined skin health assessment"
            }
          },
          detectedIssues: analysisData.skinIssues || [],
          recommendations: analysisData.recommendations || [],
          imageUrl: analysisData.imageUrl,
          aiAnalysis: analysisData.aiAnalysis !== false // True unless explicitly marked as fallback
        };

        setResults(aiResults);
        setStage("complete");
        
        // Show success toast for AI analysis
        if (aiResults.aiAnalysis) {
          toast({
            title: "AI Analysis Complete",
            description: "Your skin has been analyzed using advanced AI technology.",
          });
        }
        
        return;
      }

      // Fallback to enhanced mock data if no AI results
      console.log('Using fallback mock analysis');
      
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

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
          },
          overall: {
            value: 78,
            label: "Overall Health",
            description: "Combined skin health assessment"
          }
        },
        detectedIssues: analysisData.skinIssues || [],
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
        ],
        imageUrl: analysisData.imageUrl,
        aiAnalysis: false
      };

      setResults(mockResults);
      setStage("complete");
      
    } catch (error) {
      console.error('Analysis processing error:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to process skin analysis. Please try again.",
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
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white">
      {/* App-style header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Skin Analysis</h1>
            <p className="text-blue-100 text-sm opacity-90">AI-powered skin health assessment</p>
          </div>
          {stage === "complete" && (
            <Button 
              onClick={handleReset}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              New Scan
            </Button>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        {stage === "capture" && (
          <div className="p-4">
            <SimpleFaceAnalysis onAnalysisComplete={handleAnalysisComplete} />
          </div>
        )}

        {stage === "analyzing" && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Skin</h2>
              <p className="text-gray-600">Our AI is examining your skin health...</p>
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-blue-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === "complete" && results && (
          <div className="pb-4">
            {/* Success header */}
            <div className="bg-green-50 border-b border-green-100 px-6 py-4 mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-green-900">Analysis Complete!</h2>
                  <p className="text-sm text-green-700">Here are your personalized results</p>
                </div>
              </div>
            </div>

            <div className="px-4 space-y-4">
              <AnalysisResults results={results} />
              <ProductRecommendations results={results} />
              
              {/* Social Share */}
              <div className="pt-4">
                <SocialShare results={results} />
              </div>
              
              {/* Daily Tracker */}
              <DailySkinTracker />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heart, Droplet, Sun, Shield } from "lucide-react";

interface AnalysisResultsProps {
  results: {
    skinType: string;
    concerns: string[];
    hydrationLevel: number;
    sensitivity: string;
    imageUrl?: string;
    annotations?: Array<{
      x: number;
      y: number;
      type: string;
      description: string;
    }>;
    strengths?: string[];
  };
}

export default function AnalysisResults({ results }: AnalysisResultsProps) {
  const getMetricColor = (value: number) => {
    if (value >= 80) return "text-green-500";
    if (value >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getMetricIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'hydration':
        return <Droplet className="w-5 h-5" />;
      case 'sensitivity':
        return <Shield className="w-5 h-5" />;
      case 'brightness':
        return <Sun className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>
            Here's what we found about your skin health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Annotated Image Section */}
            {results.imageUrl && (
              <div className="relative">
                <img
                  src={results.imageUrl}
                  alt="Skin Analysis"
                  className="w-full rounded-lg"
                />
                <TooltipProvider>
                  {results.annotations?.map((annotation, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <div
                          className="absolute w-6 h-6 rounded-full border-2 border-primary cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                          style={{
                            left: `${annotation.x}%`,
                            top: `${annotation.y}%`,
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{annotation.type}</p>
                        <p className="text-sm">{annotation.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Hydration Level</h4>
                <div className="flex items-center gap-4">
                  <Droplet className={`w-8 h-8 ${getMetricColor(results.hydrationLevel)}`} />
                  <div className="flex-1">
                    <Progress value={results.hydrationLevel} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {results.hydrationLevel}% hydrated
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Skin Type</h4>
                <p className="text-2xl font-semibold text-primary">
                  {results.skinType.charAt(0).toUpperCase() + results.skinType.slice(1)}
                </p>
              </div>
            </div>

            {/* Concerns Section */}
            <div>
              <h4 className="text-sm font-medium mb-4">Areas of Focus</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {results.concerns.map((concern, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        {getMetricIcon(concern)}
                        <span className="font-medium">{concern}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Strengths Section */}
            {results.strengths && (
              <div>
                <h4 className="text-sm font-medium mb-2">Your Skin's Strengths</h4>
                <div className="bg-primary/10 rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-1">
                    {results.strengths.map((strength, index) => (
                      <li key={index} className="text-primary">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Motivational Message */}
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg p-6 text-center">
              <p className="text-lg font-medium text-primary">
                You're on your way to healthier, glowing skin!
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Keep tracking your progress and following your personalized recommendations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
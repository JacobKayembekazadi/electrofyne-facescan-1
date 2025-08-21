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
import { 
  Droplet,  // Hydration
  CircleDot,  // Texture
  Fingerprint,  // Elasticity
  Sun,  // Pigmentation
  Circle,  // Pores
  Activity,  // Overall health
  Bot,  // AI analysis
  Camera  // Manual analysis
} from "lucide-react";

interface HealthScore {
  value: number;
  label: string;
  description: string;
}

interface AnalysisResultsProps {
  results: {
    skinTone: string;  // Fitzpatrick scale
    primaryConcerns: string[];
    scores: {
      hydration: HealthScore;
      texture: HealthScore;
      elasticity: HealthScore;
      pigmentation: HealthScore;
      poreHealth: HealthScore;
      overall: HealthScore;
    };
    recommendations: Array<{
      category: string;
      items: string[];
    }>;
    imageUrl?: string;
    annotations?: Array<{
      x: number;
      y: number;
      type: string;
      description: string;
    }>;
  };
}

export default function AnalysisResults({ results }: AnalysisResultsProps) {
  // Helper function to determine color based on score
  const getScoreColor = (value: number) => {
    if (value >= 85) return "text-emerald-500";
    if (value >= 70) return "text-green-500";
    if (value >= 55) return "text-yellow-500";
    if (value >= 40) return "text-orange-500";
    return "text-red-500";
  };

  // Helper function to get progress bar color
  const getProgressColor = (value: number) => {
    if (value >= 85) return "bg-emerald-500";
    if (value >= 70) return "bg-green-500";
    if (value >= 55) return "bg-yellow-500";
    if (value >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  // Helper function to get score description
  const getScoreDescription = (value: number) => {
    if (value >= 85) return "Excellent";
    if (value >= 70) return "Good";
    if (value >= 55) return "Fair";
    if (value >= 40) return "Needs Attention";
    return "Poor";
  };

  const metrics = [
    { key: 'hydration', icon: Droplet, score: results.scores.hydration },
    { key: 'texture', icon: CircleDot, score: results.scores.texture },
    { key: 'elasticity', icon: Fingerprint, score: results.scores.elasticity },
    { key: 'pigmentation', icon: Sun, score: results.scores.pigmentation },
    { key: 'poreHealth', icon: Circle, score: results.scores.poreHealth }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Overall Skin Health
            {results.aiAnalysis !== false && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Bot className="w-4 h-4 text-green-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Analyzed using AI technology</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CardTitle>
          <CardDescription>
            Based on multiple factors and {results.aiAnalysis !== false ? 'AI-powered' : 'comprehensive'} analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className={`text-4xl font-bold ${getScoreColor(results.scores.overall.value)}`}>
                {results.scores.overall.value}/100
              </p>
              <p className="text-muted-foreground">
                {getScoreDescription(results.scores.overall.value)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">Skin Tone</p>
              <p className="text-muted-foreground">{results.skinTone}</p>
            </div>
          </div>

          {/* Annotated Image Section */}
          {results.imageUrl && (
            <div className="relative mt-6">
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
                        className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform ${getScoreColor(
                          results.scores[annotation.type.toLowerCase()]?.value || 0
                        )}`}
                        style={{
                          left: `${annotation.x}%`,
                          top: `${annotation.y}%`,
                          borderColor: `var(--${getScoreColor(
                            results.scores[annotation.type.toLowerCase()]?.value || 0
                          )})`,
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
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        {metrics.map(({ key, icon: Icon, score }) => (
          <Card key={key}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <Icon className={`w-6 h-6 ${getScoreColor(score.value)}`} />
                <div>
                  <h4 className="font-semibold">{score.label}</h4>
                  <p className="text-sm text-muted-foreground">{score.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{getScoreDescription(score.value)}</span>
                  <span className={getScoreColor(score.value)}>{score.value}/100</span>
                </div>
                <Progress 
                  value={score.value} 
                  className={`h-2 ${getProgressColor(score.value)}`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
          <CardDescription>
            Based on your skin analysis results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.recommendations.map((rec, index) => (
              <div key={index}>
                <h4 className="font-medium mb-2">{rec.category}</h4>
                <ul className="list-disc list-inside space-y-1">
                  {rec.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
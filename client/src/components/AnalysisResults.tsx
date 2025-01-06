import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AnalysisResultsProps {
  results: {
    skinType: string;
    concerns: string[];
    hydrationLevel: number;
    sensitivity: string;
  };
}

export default function AnalysisResults({ results }: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>
            Here's what we found about your skin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Skin Type</h4>
              <p className="text-2xl font-semibold text-primary">
                {results.skinType.charAt(0).toUpperCase() + results.skinType.slice(1)}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Hydration Level</h4>
              <Progress value={results.hydrationLevel} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {results.hydrationLevel}% hydrated
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Skin Concerns</h4>
              <div className="flex flex-wrap gap-2">
                {results.concerns.map((concern) => (
                  <span
                    key={concern}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {concern}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Sensitivity Level</h4>
              <p className="text-lg font-medium">
                {results.sensitivity.charAt(0).toUpperCase() + results.sensitivity.slice(1)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

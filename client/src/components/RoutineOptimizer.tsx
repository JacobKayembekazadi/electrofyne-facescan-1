import { useState } from "react";
import { generateOptimizedRoutine, type OptimizedRoutine, type RoutineStep } from "../utils/routineOptimizer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  SunMedium,
  Moon,
  Clock,
  CheckCircle2,
  Info,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RoutineOptimizerProps {
  skinAnalysis: any;
  currentRoutine?: string[];
}

export default function RoutineOptimizer({ skinAnalysis, currentRoutine }: RoutineOptimizerProps) {
  const [routine, setRoutine] = useState<OptimizedRoutine | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateRoutine = async () => {
    setIsLoading(true);
    try {
      const optimizedRoutine = await generateOptimizedRoutine(skinAnalysis, currentRoutine);
      setRoutine(optimizedRoutine);
      toast({
        title: "Routine Generated!",
        description: "Your personalized skincare routine has been created.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate routine. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const RoutineStep = ({ step }: { step: RoutineStep }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-card hover:bg-accent/5 transition-colors">
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
        {step.order}
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{step.product}</h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{step.purpose}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{step.instructions}</p>
        {step.alternativeProducts && (
          <div className="mt-2 text-sm">
            <span className="text-muted-foreground">Alternatives: </span>
            {step.alternativeProducts.join(", ")}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Routine Optimizer</CardTitle>
        <CardDescription>
          Get a personalized skincare routine based on your skin analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!routine ? (
          <div className="text-center py-8">
            <Button
              onClick={handleGenerateRoutine}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  Generating Routine...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Generate Personalized Routine
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Routine Overview */}
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Estimated Duration</p>
                <p className="text-sm text-muted-foreground">
                  Morning: {routine.estimatedDuration.morning} mins | 
                  Evening: {routine.estimatedDuration.evening} mins
                </p>
              </div>
            </div>

            {/* Routine Tabs */}
            <Tabs defaultValue="morning">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="morning" className="gap-2">
                  <SunMedium className="w-4 h-4" />
                  Morning
                </TabsTrigger>
                <TabsTrigger value="evening" className="gap-2">
                  <Moon className="w-4 h-4" />
                  Evening
                </TabsTrigger>
                <TabsTrigger value="weekly" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Weekly
                </TabsTrigger>
              </TabsList>

              <TabsContent value="morning" className="space-y-4 mt-4">
                {routine.morningSteps.map((step, index) => (
                  <RoutineStep key={index} step={step} />
                ))}
              </TabsContent>

              <TabsContent value="evening" className="space-y-4 mt-4">
                {routine.eveningSteps.map((step, index) => (
                  <RoutineStep key={index} step={step} />
                ))}
              </TabsContent>

              <TabsContent value="weekly" className="space-y-4 mt-4">
                {routine.weeklyTreatments.map((step, index) => (
                  <RoutineStep key={index} step={step} />
                ))}
              </TabsContent>
            </Tabs>

            {/* Additional Information */}
            <div className="space-y-4 pt-4 border-t">
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-primary" />
                  Addressing Concerns
                </h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {routine.skinConcerns.map((concern, index) => (
                    <li key={index}>{concern}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-primary" />
                  Important Notes
                </h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {routine.routineNotes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={handleGenerateRoutine}
              disabled={isLoading}
              className="w-full mt-4"
            >
              Regenerate Routine
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

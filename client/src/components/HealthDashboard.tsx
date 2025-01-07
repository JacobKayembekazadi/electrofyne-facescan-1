import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import {
  Droplet,
  Sun,
  Activity,
  Shield,
  Hexagon,
  BarChart,
  RefreshCw,
  Camera,
} from "lucide-react";

interface HealthMetric {
  name: string;
  value: number;
  previousValue: number;
  icon: any;
  description: string;
}

interface HealthDashboardProps {
  userId: number;
}

export default function HealthDashboard({ userId }: HealthDashboardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: healthMetrics } = useQuery<{
    overall: number;
    metrics: HealthMetric[];
  }>({
    queryKey: [`/api/users/${userId}/health-metrics`],
  });

  const updateMetrics = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/users/${userId}/health-metrics/update`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update metrics');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/health-metrics`] });
      toast({
        title: "Success",
        description: "Health metrics have been updated with your latest scan data.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update health metrics. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getScoreColor = (value: number) => {
    if (value >= 85) return "text-emerald-500";
    if (value >= 70) return "text-green-500";
    if (value >= 55) return "text-yellow-500";
    if (value >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getProgressColor = (value: number) => {
    if (value >= 85) return "bg-emerald-500";
    if (value >= 70) return "bg-green-500";
    if (value >= 55) return "bg-yellow-500";
    if (value >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreDescription = (value: number) => {
    if (value >= 85) return "Excellent";
    if (value >= 70) return "Good";
    if (value >= 55) return "Fair";
    if (value >= 40) return "Needs Attention";
    return "Poor";
  };

  const defaultMetrics: HealthMetric[] = [
    {
      name: "Hydration",
      value: 75,
      previousValue: 70,
      icon: Droplet,
      description: "Skin moisture level",
    },
    {
      name: "UV Protection",
      value: 65,
      previousValue: 60,
      icon: Sun,
      description: "Sun damage prevention",
    },
    {
      name: "Skin Barrier",
      value: 80,
      previousValue: 75,
      icon: Shield,
      description: "Protective barrier strength",
    },
    {
      name: "Texture",
      value: 70,
      previousValue: 65,
      icon: Hexagon,
      description: "Surface smoothness",
    },
  ];

  const metrics = healthMetrics?.metrics || defaultMetrics;
  const overallHealth = healthMetrics?.overall || 72;

  return (
    <div className="space-y-6">
      {/* Overall Health Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <CardTitle>Overall Skin Health</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateMetrics.mutate()}
              disabled={updateMetrics.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${updateMetrics.isPending ? 'animate-spin' : ''}`} />
              Update Metrics
            </Button>
          </div>
          <CardDescription>
            Your skin health score based on multiple factors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className={`text-4xl font-bold ${getScoreColor(overallHealth)}`}>
                {overallHealth}/100
              </p>
              <p className="text-muted-foreground">
                {getScoreDescription(overallHealth)}
              </p>
            </div>
            <BarChart className="w-8 h-8 text-primary" />
          </div>
          <Progress
            value={overallHealth}
            className={`h-2 ${getProgressColor(overallHealth)}`}
          />
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const change = metric.value - metric.previousValue;
          const isImprovement = change > 0;

          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${getScoreColor(metric.value)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{metric.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {metric.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getScoreColor(metric.value)}`}>
                      {metric.value}
                    </p>
                    <p className={`text-sm ${isImprovement ? 'text-green-500' : 'text-red-500'}`}>
                      {isImprovement ? '+' : ''}{change}%
                    </p>
                  </div>
                </div>
                <Progress
                  value={metric.value}
                  className={`h-2 ${getProgressColor(metric.value)}`}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Start Analysis Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <p className="text-muted-foreground">
              Want to update your skin health metrics? Start a new analysis scan.
            </p>
            <Link href="/analysis">
              <Button size="lg" className="w-full sm:w-auto">
                <Camera className="mr-2 h-4 w-4" />
                Start New Analysis
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
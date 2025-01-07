import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface ProgressMetric {
  id: number;
  hydrationScore: number;
  textureScore: number;
  brightnessScore: number;
  overallHealth: number;
  createdAt: string;
}

interface ProgressDashboardProps {
  userId: number;
}

export default function ProgressDashboard({ userId }: ProgressDashboardProps) {
  const { data: metrics, isLoading } = useQuery<ProgressMetric[]>({
    queryKey: [`/api/progress/${userId}`],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const formattedData = metrics?.map(metric => ({
    ...metric,
    date: format(new Date(metric.createdAt), 'MMM d'),
  })).reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skin Health Progress</CardTitle>
        <CardDescription>
          Track your skin health improvements over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="hydrationScore" 
                stroke="hsl(var(--primary))" 
                name="Hydration"
              />
              <Line 
                type="monotone" 
                dataKey="textureScore" 
                stroke="hsl(var(--secondary))" 
                name="Texture"
              />
              <Line 
                type="monotone" 
                dataKey="brightnessScore" 
                stroke="hsl(var(--accent))" 
                name="Brightness"
              />
              <Line 
                type="monotone" 
                dataKey="overallHealth" 
                stroke="hsl(var(--foreground))" 
                name="Overall Health"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {formattedData && formattedData[0] && (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Hydration</p>
                    <h3 className="text-2xl font-bold mt-2">{formattedData[0].hydrationScore}%</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Texture</p>
                    <h3 className="text-2xl font-bold mt-2">{formattedData[0].textureScore}%</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Brightness</p>
                    <h3 className="text-2xl font-bold mt-2">{formattedData[0].brightnessScore}%</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Overall Health</p>
                    <h3 className="text-2xl font-bold mt-2">{formattedData[0].overallHealth}%</h3>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Calendar, Target, Medal } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
  id: number;
  title: string;
  description: string;
  duration: number;
  pointsReward: number;
  difficulty: string;
  status: string;
  progress: {
    current: number;
    total: number;
  };
  startDate: string;
  endDate: string;
}

interface ChallengesProps {
  userId: number;
}

export default function Challenges({ userId }: ChallengesProps) {
  const { toast } = useToast();
  const { data: challenges } = useQuery<Challenge[]>({
    queryKey: [`/api/users/${userId}/challenges`],
  });

  const acceptChallengeMutation = useMutation({
    mutationFn: async (templateId: number) => {
      const response = await fetch('/api/challenges/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, templateId }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Challenge Accepted!",
        description: "Good luck on your skincare journey!",
      });
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'text-green-500';
      case 'intermediate':
        return 'text-yellow-500';
      case 'advanced':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Skincare Challenges
        </CardTitle>
        <CardDescription>
          Complete challenges to earn points and improve your skin health
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {challenges?.map((challenge) => (
            <Card key={challenge.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {challenge.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`flex items-center gap-1 ${getDifficultyColor(challenge.difficulty)}`}>
                        <Medal className="w-4 h-4" />
                        {challenge.difficulty}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {challenge.duration} days
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {challenge.pointsReward} points
                      </span>
                    </div>
                  </div>
                  {challenge.status === 'available' ? (
                    <Button
                      onClick={() => acceptChallengeMutation.mutate(challenge.id)}
                      disabled={acceptChallengeMutation.isPending}
                    >
                      Accept Challenge
                    </Button>
                  ) : (
                    <div className="text-right space-y-2">
                      <Progress 
                        value={(challenge.progress.current / challenge.progress.total) * 100}
                        className="w-32"
                      />
                      <p className="text-sm text-muted-foreground">
                        {challenge.progress.current}/{challenge.progress.total} completed
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

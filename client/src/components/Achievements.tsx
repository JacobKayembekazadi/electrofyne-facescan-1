import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge, Trophy, Star, Droplet, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface AchievementsProps {
  userId: number;
}

export default function Achievements({ userId }: AchievementsProps) {
  const { data: user } = useQuery<{
    level: number;
    totalPoints: number;
    achievements: Array<{
      id: number;
      name: string;
      description: string;
      icon: string;
      unlockedAt: string;
    }>;
  }>({
    queryKey: [`/api/users/${userId}/achievements`],
  });

  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case 'trophy':
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 'star':
        return <Star className="w-8 h-8 text-purple-500" />;
      case 'droplet':
        return <Droplet className="w-8 h-8 text-blue-500" />;
      default:
        return <Badge className="w-8 h-8 text-gray-500" />;
    }
  };

  if (!user) return null;

  const pointsToNextLevel = (user.level + 1) * 100;
  const progress = (user.totalPoints % 100) / pointsToNextLevel * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Level {user.level}
          </CardTitle>
          <CardDescription>
            {user.totalPoints} total points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {user.level + 1}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>
            Your skincare journey milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {user.achievements?.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {getAchievementIcon(achievement.icon)}
                    <div>
                      <h4 className="font-semibold">{achievement.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

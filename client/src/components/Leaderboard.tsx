import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Medal, Crown, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface LeaderboardEntry {
  userId: number;
  username: string;
  score: number;
  rank: number;
  currentStreak: number;
}

interface LeaderboardProps {
  userId: number;
}

export default function Leaderboard({ userId }: LeaderboardProps) {
  const { data: leaderboard } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard'],
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Skin Health Leaderboard
        </CardTitle>
        <CardDescription>
          Weekly rankings based on consistency and improvement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard?.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center justify-between p-4 rounded-lg ${
                entry.userId === userId ? 'bg-primary/10' : 'bg-card'
              }`}
            >
              <div className="flex items-center gap-4">
                {getRankIcon(entry.rank)}
                <div>
                  <p className="font-semibold">
                    {entry.username}
                    {entry.userId === userId && " (You)"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{entry.currentStreak} day streak</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{entry.score}</p>
                <p className="text-sm text-muted-foreground">points</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

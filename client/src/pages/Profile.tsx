import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressDashboard from "../components/ProgressDashboard";
import Achievements from "../components/Achievements";
import Leaderboard from "../components/Leaderboard";
import Challenges from "../components/Challenges";
import HealthDashboard from "../components/HealthDashboard";
import SkinProgressTimeline from "../components/SkinProgressTimeline";
import RoutineProgressAnimation from "../components/RoutineProgressAnimation";

// Mock user data
const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  analysisHistory: [
    {
      id: 1,
      date: "2024-03-15",
      concerns: ["Dryness", "Fine Lines"],
      recommendations: ["Hydrating Serum", "Night Cream"],
    },
    {
      id: 2,
      date: "2024-03-01",
      concerns: ["Uneven Texture", "Acne"],
      recommendations: ["Gentle Cleanser", "Spot Treatment"],
    },
  ],
  // Mock routine data
  routineProgress: {
    morningSteps: [
      { id: "cleanse-am", name: "Cleanse", completed: true, timeOfDay: "morning" as const, completedAt: new Date() },
      { id: "tone-am", name: "Tone", completed: false, timeOfDay: "morning" as const },
      { id: "serum-am", name: "Vitamin C Serum", completed: false, timeOfDay: "morning" as const },
      { id: "moisturize-am", name: "Moisturize", completed: false, timeOfDay: "morning" as const },
      { id: "spf", name: "Sunscreen", completed: false, timeOfDay: "morning" as const }
    ],
    eveningSteps: [
      { id: "cleanse-pm", name: "Double Cleanse", completed: true, timeOfDay: "evening" as const, completedAt: new Date() },
      { id: "tone-pm", name: "Tone", completed: true, timeOfDay: "evening" as const, completedAt: new Date() },
      { id: "treat", name: "Treatment", completed: false, timeOfDay: "evening" as const },
      { id: "moisturize-pm", name: "Night Cream", completed: false, timeOfDay: "evening" as const }
    ],
    streak: 5,
    lastCompletedAt: new Date()
  }
};

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-lg">{mockUser.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-lg">{mockUser.email}</p>
              </div>
              <Button className="w-full sm:w-auto">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        <div className="order-1 md:order-none">
          <Leaderboard userId={mockUser.id} />
        </div>
      </div>

      {/* Routine Progress Animation */}
      <div className="rounded-lg overflow-hidden">
        <RoutineProgressAnimation 
          morningSteps={mockUser.routineProgress.morningSteps}
          eveningSteps={mockUser.routineProgress.eveningSteps}
          streak={mockUser.routineProgress.streak}
          lastCompletedAt={mockUser.routineProgress.lastCompletedAt}
        />
      </div>

      {/* Progress Timeline */}
      <div className="rounded-lg overflow-hidden">
        <SkinProgressTimeline userId={mockUser.id} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <HealthDashboard userId={mockUser.id} />
          <Challenges userId={mockUser.id} />
        </div>
        <div className="space-y-8">
          <Achievements userId={mockUser.id} />
          <ProgressDashboard userId={mockUser.id} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysis History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockUser.analysisHistory.map((analysis) => (
              <Card key={analysis.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      <p className="font-medium">Analysis on {analysis.date}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {analysis.concerns.map((concern) => (
                          <span
                            key={concern}
                            className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {concern}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      View Details
                    </Button>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Recommended Products:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {analysis.recommendations.map((product) => (
                        <li key={product} className="break-words">{product}</li>
                      ))}
                    </ul>
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
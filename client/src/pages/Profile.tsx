import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressDashboard from "../components/ProgressDashboard";

// Mock user data
const mockUser = {
  id: 1, // Added ID for progress tracking
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
};

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
            <Button>Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      <ProgressDashboard userId={mockUser.id} />

      <Card>
        <CardHeader>
          <CardTitle>Analysis History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockUser.analysisHistory.map((analysis) => (
              <Card key={analysis.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
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
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Recommended Products:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {analysis.recommendations.map((product) => (
                        <li key={product}>{product}</li>
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  BookOpen,
  Sparkles,
  Shield,
  Sun,
  Droplet,
  Check,
  ArrowRight,
} from "lucide-react";

// Mock education modules data
const EDUCATION_MODULES = [
  {
    id: 1,
    title: "Understanding Your Skin Type",
    description: "Learn about different skin types and how to identify yours",
    icon: Sparkles,
    progress: 80,
    duration: "5 min",
    topics: ["Skin Type Basics", "Identifying Features", "Care Recommendations"],
  },
  {
    id: 2,
    title: "Sun Protection Essentials",
    description: "Master the basics of effective sun protection",
    icon: Sun,
    progress: 60,
    duration: "7 min",
    topics: ["UV Rays", "SPF Guide", "Application Tips"],
  },
  {
    id: 3,
    title: "Hydration Fundamentals",
    description: "Discover the importance of skin hydration",
    icon: Droplet,
    progress: 40,
    duration: "6 min",
    topics: ["Water Balance", "Moisturizing", "Product Selection"],
  },
  {
    id: 4,
    title: "Skin Barrier Health",
    description: "Learn how to maintain a healthy skin barrier",
    icon: Shield,
    progress: 20,
    duration: "8 min",
    topics: ["Barrier Function", "Common Issues", "Protection Tips"],
  },
];

export default function EducationModules() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Skin Health Education</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Enhance your skincare knowledge with our interactive learning modules
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {EDUCATION_MODULES.map((module) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <module.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {module.duration}
                    </div>
                  </div>
                  {module.progress === 100 && (
                    <div className="flex items-center gap-1 text-sm text-green-500">
                      <Check className="w-4 h-4" />
                      Completed
                    </div>
                  )}
                </div>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Topics covered:</p>
                    <ul className="space-y-1">
                      {module.topics.map((topic, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <div className="w-1 h-1 rounded-full bg-primary" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={`/education/${module.id}`}>
                    <Button className="w-full mt-4">
                      {module.progress === 0 ? "Start Learning" : "Continue"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

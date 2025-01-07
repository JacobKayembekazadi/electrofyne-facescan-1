import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sun, Moon, CheckCircle2, Trophy, Sparkles } from "lucide-react";

interface RoutineStep {
  id: string;
  name: string;
  completed: boolean;
  timeOfDay: "morning" | "evening";
  completedAt?: Date;
}

interface RoutineProgressProps {
  morningSteps: RoutineStep[];
  eveningSteps: RoutineStep[];
  streak: number;
  lastCompletedAt?: Date;
}

export default function RoutineProgressAnimation({
  morningSteps,
  eveningSteps,
  streak,
  lastCompletedAt,
}: RoutineProgressProps) {
  const [morningProgress, setMorningProgress] = useState(0);
  const [eveningProgress, setEveningProgress] = useState(0);

  useEffect(() => {
    // Calculate progress percentages
    const calculateProgress = (steps: RoutineStep[]) => 
      (steps.filter(step => step.completed).length / steps.length) * 100;

    // Animate progress updates
    setMorningProgress(calculateProgress(morningSteps));
    setEveningProgress(calculateProgress(eveningSteps));
  }, [morningSteps, eveningSteps]);

  const ProgressSection = ({ 
    title, 
    icon: Icon, 
    steps, 
    progress 
  }: { 
    title: string; 
    icon: any; 
    steps: RoutineStep[]; 
    progress: number; 
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">{title}</h3>
        <span className="ml-auto text-sm text-muted-foreground">
          {steps.filter(s => s.completed).length}/{steps.length} completed
        </span>
      </div>
      
      <div className="relative">
        <Progress value={progress} className="h-2" />
        <motion.div
          className="absolute -right-1 -top-1 text-primary"
          initial={{ scale: 0 }}
          animate={{ scale: progress === 100 ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <CheckCircle2 className="w-4 h-4" />
        </motion.div>
      </div>

      <motion.div 
        className="grid gap-2"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {steps.map((step) => (
          <motion.div
            key={step.id}
            className="flex items-center gap-2 text-sm"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >
            <motion.div
              initial={false}
              animate={{
                scale: step.completed ? [1, 1.2, 1] : 1,
                color: step.completed ? "var(--primary)" : "var(--muted-foreground)"
              }}
              transition={{ duration: 0.2 }}
            >
              <CheckCircle2 className="w-4 h-4" />
            </motion.div>
            <span className={step.completed ? "text-primary font-medium" : "text-muted-foreground"}>
              {step.name}
            </span>
            {step.completed && step.completedAt && (
              <span className="ml-auto text-xs text-muted-foreground">
                {new Date(step.completedAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <Trophy className="w-5 h-5 text-primary" />
          </motion.div>
          Routine Progress
          {streak > 0 && (
            <motion.div
              className="ml-auto flex items-center gap-1 text-sm bg-primary/10 text-primary px-2 py-1 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
            >
              <Sparkles className="w-4 h-4" />
              {streak} Day Streak!
            </motion.div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProgressSection
          title="Morning Routine"
          icon={Sun}
          steps={morningSteps}
          progress={morningProgress}
        />
        <ProgressSection
          title="Evening Routine"
          icon={Moon}
          steps={eveningSteps}
          progress={eveningProgress}
        />
        
        {lastCompletedAt && (
          <motion.div 
            className="text-sm text-muted-foreground text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Last activity: {new Date(lastCompletedAt).toLocaleString()}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

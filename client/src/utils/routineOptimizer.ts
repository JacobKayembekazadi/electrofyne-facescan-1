import { OptimizedRoutine, RoutineStep } from "./routineTypes";


export interface RoutineStep {
  product: string;
  purpose: string;
  time: "morning" | "evening" | "both";
  frequency: "daily" | "weekly" | "biweekly";
  order: number;
  instructions: string;
  alternativeProducts?: string[];
}

export interface OptimizedRoutine {
  morningSteps: RoutineStep[];
  eveningSteps: RoutineStep[];
  weeklyTreatments: RoutineStep[];
  estimatedDuration: {
    morning: number;
    evening: number;
  };
  skinConcerns: string[];
  routineNotes: string[];
}

export async function generateOptimizedRoutine(
  skinAnalysis: any, 
  currentRoutine?: string[]
): Promise<OptimizedRoutine> {
  try {
    const response = await fetch('/api/generate-routine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        skinAnalysis,
        currentRoutine,
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    return data as OptimizedRoutine;
  } catch (error: any) {
    console.error("Error generating routine:", error);
    throw new Error("Failed to generate skincare routine. Please try again.");
  }
}
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    score: {
      oily: number;
      dry: number;
      combination: number;
      sensitive: number;
      normal: number;
    };
  }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "morning",
    question: "How does your skin feel in the morning?",
    options: [
      {
        id: "oily",
        text: "Shiny and greasy all over",
        score: { oily: 2, dry: 0, combination: 1, sensitive: 0, normal: 0 }
      },
      {
        id: "dry",
        text: "Tight and dry",
        score: { oily: 0, dry: 2, combination: 0, sensitive: 1, normal: 0 }
      },
      {
        id: "combination",
        text: "Oily T-zone, dry cheeks",
        score: { oily: 1, dry: 1, combination: 2, sensitive: 0, normal: 0 }
      },
      {
        id: "normal",
        text: "Comfortable and balanced",
        score: { oily: 0, dry: 0, combination: 0, sensitive: 0, normal: 2 }
      }
    ]
  },
  {
    id: "pores",
    question: "How would you describe your pores?",
    options: [
      {
        id: "large",
        text: "Large and visible",
        score: { oily: 2, dry: 0, combination: 1, sensitive: 0, normal: 0 }
      },
      {
        id: "small",
        text: "Small and tight",
        score: { oily: 0, dry: 1, combination: 0, sensitive: 0, normal: 2 }
      },
      {
        id: "mixed",
        text: "Large in T-zone, small elsewhere",
        score: { oily: 1, dry: 0, combination: 2, sensitive: 0, normal: 0 }
      },
      {
        id: "invisible",
        text: "Barely visible",
        score: { oily: 0, dry: 2, combination: 0, sensitive: 1, normal: 1 }
      }
    ]
  },
  {
    id: "sensitivity",
    question: "How does your skin react to new products?",
    options: [
      {
        id: "very-sensitive",
        text: "Often becomes red and irritated",
        score: { oily: 0, dry: 1, combination: 0, sensitive: 2, normal: 0 }
      },
      {
        id: "sometimes",
        text: "Sometimes feels slightly uncomfortable",
        score: { oily: 0, dry: 0, combination: 1, sensitive: 1, normal: 1 }
      },
      {
        id: "rarely",
        text: "Rarely has any reaction",
        score: { oily: 1, dry: 0, combination: 1, sensitive: 0, normal: 2 }
      },
      {
        id: "never",
        text: "Never has any reaction",
        score: { oily: 1, dry: 0, combination: 0, sensitive: 0, normal: 2 }
      }
    ]
  }
];

interface SkinTypeQuizProps {
  onComplete: (result: {
    type: string;
    description: string;
    recommendations: string[];
  }) => void;
  onSkip?: () => void;
}

export default function SkinTypeQuiz({ onComplete, onSkip }: SkinTypeQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    type: string;
    description: string;
    recommendations: string[];
  } | null>(null);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const calculateResult = () => {
    const scores = {
      oily: 0,
      dry: 0,
      combination: 0,
      sensitive: 0,
      normal: 0
    };

    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = quizQuestions.find(q => q.id === questionId);
      const option = question?.options.find(o => o.id === answerId);

      if (option) {
        Object.entries(option.score).forEach(([type, score]) => {
          scores[type as keyof typeof scores] += score;
        });
      }
    });

    const maxScore = Math.max(...Object.values(scores));
    const skinType = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || 'normal';

    const results = {
      oily: {
        type: "Oily",
        description: "Your skin tends to produce excess sebum, leading to shine and enlarged pores.",
        recommendations: [
          "Use oil-free products",
          "Include salicylic acid in your routine",
          "Don't skip moisturizer",
          "Use clay masks weekly"
        ]
      },
      dry: {
        type: "Dry",
        description: "Your skin produces less natural oils, leading to potential tightness and flaking.",
        recommendations: [
          "Use rich, creamy cleansers",
          "Layer hydrating products",
          "Look for products with hyaluronic acid",
          "Consider facial oils"
        ]
      },
      combination: {
        type: "Combination",
        description: "Your skin has both oily and dry areas, typically with an oily T-zone.",
        recommendations: [
          "Use different products for different areas",
          "Balance hydration levels",
          "Consider multi-masking",
          "Use gentle, pH-balanced products"
        ]
      },
      sensitive: {
        type: "Sensitive",
        description: "Your skin is easily irritated and requires extra gentle care.",
        recommendations: [
          "Use fragrance-free products",
          "Patch test new products",
          "Look for soothing ingredients",
          "Avoid harsh exfoliants"
        ]
      },
      normal: {
        type: "Normal",
        description: "Your skin is well-balanced with few concerns.",
        recommendations: [
          "Maintain current balance",
          "Focus on prevention",
          "Use sunscreen daily",
          "Keep skin hydrated"
        ]
      }
    };

    return results[skinType as keyof typeof results];
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const result = calculateResult();
      setQuizResult(result);
      setShowResult(true);
    }
  };

  const handleComplete = () => {
    if (quizResult) {
      onComplete(quizResult);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Skin Type Quiz</CardTitle>
        <CardDescription>
          Answer a few questions to determine your skin type and get personalized recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="mb-8" />

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <h3 className="text-lg font-medium">
                  {quizQuestions[currentQuestion].question}
                </h3>

                <RadioGroup
                  onValueChange={(value) => 
                    handleAnswer(quizQuestions[currentQuestion].id, value)
                  }
                  value={answers[quizQuestions[currentQuestion].id]}
                >
                  <div className="grid gap-4">
                    {quizQuestions[currentQuestion].options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="peer"
                        />
                        <Label
                          htmlFor={option.id}
                          className="flex-grow p-4 border rounded-lg peer-aria-checked:border-primary peer-aria-checked:bg-primary/5 transition-colors cursor-pointer"
                        >
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                <div className="flex justify-between gap-4">
                  <Button
                    variant="outline"
                    onClick={onSkip}
                    className="w-full"
                  >
                    Skip Quiz
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!answers[quizQuestions[currentQuestion].id]}
                    className="w-full"
                  >
                    {currentQuestion === quizQuestions.length - 1 ? "Complete Quiz" : "Next Question"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your Skin Type Results</h3>
              </div>

              {quizResult && (
                <div className="space-y-6 bg-muted/50 rounded-lg p-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Your Skin Type: {quizResult.type}</h4>
                    <p className="text-muted-foreground">{quizResult.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Personalized Recommendations:</h4>
                    <ul className="space-y-2">
                      {quizResult.recommendations.map((rec, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                          <span>{rec}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <Button onClick={handleComplete} className="w-full">
                    Continue to Skin Analysis
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
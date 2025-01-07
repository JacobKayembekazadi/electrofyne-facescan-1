import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Bell, CheckCircle2, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface DailyTrackingData {
  hydrationLevel: "low" | "medium" | "high";
  concerns: string[];
  routine: "completed" | "partial" | "missed";
}

export default function DailySkinTracker() {
  const { toast } = useToast();
  const [isTracked, setIsTracked] = useState(false);

  const form = useForm<DailyTrackingData>({
    defaultValues: {
      hydrationLevel: "medium",
      concerns: [],
      routine: "completed",
    },
  });

  const onSubmit = async (data: DailyTrackingData) => {
    try {
      // TODO: Implement API call to save daily tracking data
      console.log("Saving tracking data:", data);
      
      toast({
        title: "Progress Tracked!",
        description: "Your daily skin health update has been recorded.",
      });
      setIsTracked(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Daily Skin Check</CardTitle>
            <CardDescription>
              {format(new Date(), "EEEE, MMMM do")}
            </CardDescription>
          </div>
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {!isTracked ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="hydrationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How's your skin feeling today?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="low" id="low" />
                          <label htmlFor="low">Dry</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <label htmlFor="medium">Normal</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="high" id="high" />
                          <label htmlFor="high">Well Hydrated</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="routine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Did you complete your skincare routine?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="completed" id="completed" />
                          <label htmlFor="completed">Yes</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="partial" id="partial" />
                          <label htmlFor="partial">Partially</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="missed" id="missed" />
                          <label htmlFor="missed">No</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Track Today's Progress
              </Button>
            </form>
          </Form>
        ) : (
          <div className="text-center py-4">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Today's Progress Tracked!</h3>
            <p className="text-sm text-muted-foreground">
              Come back tomorrow to continue your streak.
            </p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Current Streak: 3 days</span>
            <Button variant="ghost" size="sm" className="gap-2">
              <Bell className="w-4 h-4" />
              Set Reminder
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

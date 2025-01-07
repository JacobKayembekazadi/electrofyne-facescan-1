import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import ImageComparisonSlider from "./ImageComparisonSlider";
import { useQuery } from "@tanstack/react-query";

interface TimelineEntry {
  id: number;
  date: Date;
  imageUrl: string;
  analysis: {
    overall: number;
    hydration: number;
    texture: number;
    pigmentation: number;
  };
}

interface SkinProgressTimelineProps {
  userId: number;
}

export default function SkinProgressTimeline({ userId }: SkinProgressTimelineProps) {
  const [selectedDates, setSelectedDates] = useState<{
    before?: Date;
    after?: Date;
  }>({});

  // Fetch timeline data
  const { data: timelineEntries } = useQuery<TimelineEntry[]>({
    queryKey: [`/api/users/${userId}/skin-timeline`],
  });

  // Find entries for selected dates
  const beforeEntry = timelineEntries?.find(
    (entry) => entry.date.toDateString() === selectedDates.before?.toDateString()
  );
  const afterEntry = timelineEntries?.find(
    (entry) => entry.date.toDateString() === selectedDates.after?.toDateString()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skin Progress Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Date Selection */}
          <div className="flex flex-wrap gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !selectedDates.before && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDates.before ? (
                    format(selectedDates.before, "PPP")
                  ) : (
                    "Select before date"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDates.before}
                  onSelect={(date) =>
                    setSelectedDates((prev) => ({ ...prev, before: date }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !selectedDates.after && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDates.after ? (
                    format(selectedDates.after, "PPP")
                  ) : (
                    "Select after date"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDates.after}
                  onSelect={(date) =>
                    setSelectedDates((prev) => ({ ...prev, after: date }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Comparison View */}
          {beforeEntry && afterEntry && (
            <ImageComparisonSlider
              beforeImage={beforeEntry.imageUrl}
              afterImage={afterEntry.imageUrl}
              beforeLabel={format(beforeEntry.date, "PP")}
              afterLabel={format(afterEntry.date, "PP")}
            />
          )}

          {/* Timeline Entries */}
          <div className="space-y-4">
            {timelineEntries?.map((entry) => (
              <Card
                key={entry.id}
                className={cn(
                  "cursor-pointer transition-colors hover:bg-accent",
                  (selectedDates.before?.toDateString() === entry.date.toDateString() ||
                    selectedDates.after?.toDateString() === entry.date.toDateString()) &&
                    "border-primary"
                )}
                onClick={() => {
                  if (!selectedDates.before) {
                    setSelectedDates({ before: entry.date });
                  } else if (!selectedDates.after) {
                    setSelectedDates((prev) => ({ ...prev, after: entry.date }));
                  } else {
                    setSelectedDates({ before: entry.date });
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{format(entry.date, "PPP")}</p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Overall Score: {entry.analysis.overall}</p>
                        <p>Hydration: {entry.analysis.hydration}</p>
                        <p>Texture: {entry.analysis.texture}</p>
                        <p>Pigmentation: {entry.analysis.pigmentation}</p>
                      </div>
                    </div>
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img
                        src={entry.imageUrl}
                        alt={`Skin analysis from ${format(entry.date, "PP")}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

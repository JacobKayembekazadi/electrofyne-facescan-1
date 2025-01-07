import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function ImageComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After'
}: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (values: number[]) => {
    setSliderPosition(values[0]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          {/* Container for both images */}
          <div ref={containerRef} className="absolute inset-0">
            {/* Before Image (Full width) */}
            <div className="absolute inset-0">
              <img
                src={beforeImage}
                alt="Before"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {beforeLabel}
              </div>
            </div>

            {/* After Image (Clipped) */}
            <motion.div
              className="absolute inset-0"
              style={{
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              }}
            >
              <img
                src={afterImage}
                alt="After"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {afterLabel}
              </div>
            </motion.div>

            {/* Slider Line */}
            <motion.div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
              drag="x"
              dragConstraints={containerRef}
              dragElastic={0}
              dragMomentum={false}
              onDrag={(_, info) => {
                if (containerRef.current) {
                  const containerWidth = containerRef.current.offsetWidth;
                  const newPosition = (info.point.x / containerWidth) * 100;
                  setSliderPosition(Math.max(0, Math.min(100, newPosition)));
                }
              }}
            >
              <div className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg" />
            </motion.div>
          </div>

          {/* Slider Control */}
          <div className="absolute bottom-4 left-4 right-4">
            <Slider
              value={[sliderPosition]}
              onValueChange={handleSliderChange}
              max={100}
              step={0.1}
              className="z-10"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

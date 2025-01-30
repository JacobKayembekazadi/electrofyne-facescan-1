import { Share2, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SkinAnalysisResult {
  skinTone: string;
  scores: {
    [key: string]: {
      value: number;
      label: string;
    };
  };
  primaryConcerns: string[];
}

interface Props {
  results: SkinAnalysisResult;
}

export default function SocialShare({ results }: Props) {
  const anonymizeResults = () => {
    // Remove any personally identifiable information
    const anonymizedData = {
      overallHealth: Object.values(results.scores).reduce((acc, score) => acc + score.value, 0) / 
        Object.keys(results.scores).length,
      insights: Object.entries(results.scores).map(([key, score]) => ({
        category: score.label,
        score: score.value
      })),
      concerns: results.primaryConcerns
    };

    return anonymizedData;
  };

  const shareToTwitter = () => {
    const data = anonymizeResults();
    const text = `Just completed my skin health analysis! 🌟\nOverall Score: ${Math.round(data.overallHealth)}/100\nKey Insights:\n${data.insights.map(i => `- ${i.category}: ${Math.round(i.score)}/100`).join('\n')}\n#SkinHealth #ElectrofyneAI`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareToLinkedIn = () => {
    const data = anonymizeResults();
    const text = `I just completed a comprehensive skin health analysis using Electrofyne AI!\n\nKey Insights:\n- Overall Health Score: ${Math.round(data.overallHealth)}/100\n${data.insights.map(i => `- ${i.category}: ${Math.round(i.score)}/100`).join('\n')}\n\nExcited to share my journey towards better skin health! #SkinHealth #AI #Wellness`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={shareToTwitter} className="cursor-pointer">
          <Twitter className="mr-2 h-4 w-4" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToLinkedIn} className="cursor-pointer">
          <Linkedin className="mr-2 h-4 w-4" />
          Share on LinkedIn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

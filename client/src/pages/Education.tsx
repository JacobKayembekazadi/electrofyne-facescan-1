import { Card, CardContent } from "@/components/ui/card";
import EducationModules from "../components/EducationModules";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function Education() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-4"
          >
            Skincare Education Center
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground mb-6"
          >
            Master the science of skincare with our expert-curated content
          </motion.p>
          <Link href="/analysis">
            <Button size="lg" className="gap-2">
              <BookOpen className="w-5 h-5" />
              Start Learning
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <EducationModules />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

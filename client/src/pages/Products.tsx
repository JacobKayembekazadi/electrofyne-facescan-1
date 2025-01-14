import { Card, CardContent } from "@/components/ui/card";
import ProductRecommendations from "../components/ProductRecommendations";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Products() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-4"
          >
            AI-Recommended Skincare Products
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground mb-6"
          >
            Discover products tailored to your unique skin profile
          </motion.p>
          <Link href="/analysis">
            <Button size="lg" className="gap-2">
              <Sparkles className="w-5 h-5" />
              Get Personalized Recommendations
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <ProductRecommendations results={{ skinType: "All", concerns: [] }} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

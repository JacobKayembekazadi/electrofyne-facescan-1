import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Heart, Star, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen w-full">
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <motion.h1 
            className="text-5xl font-bold gradient-text"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Welcome to Electrofyne
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-Powered Skincare Analysis Platform
          </p>
        </motion.div>

        <motion.div 
          className="grid gap-8"
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
          <Card className="card-glow">
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="w-6 h-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Electrofyne is revolutionizing skincare through cutting-edge AI technology. We believe everyone deserves personalized skincare solutions backed by science and powered by innovation.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: "Personalized Care",
                description: "Our AI analyzes your unique skin characteristics to provide tailored recommendations and tracking."
              },
              {
                icon: Star,
                title: "Advanced Technology",
                description: "Utilizing state-of-the-art computer vision and machine learning for accurate skin analysis."
              },
              {
                icon: Zap,
                title: "Progress Tracking",
                description: "Monitor your skin's improvement over time with our comprehensive tracking tools."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5 }}
              >
                <Card className="card-glow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <feature.icon className="w-5 h-5 text-primary" />
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-2xl">Why Choose Electrofyne?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground">
                Electrofyne combines artificial intelligence with dermatological expertise to provide:
              </p>
              <ul className="grid md:grid-cols-2 gap-4">
                {[
                  "Real-time skin analysis and monitoring",
                  "Personalized skincare routines",
                  "Progress tracking with before/after comparisons",
                  "AI-powered recommendations",
                  "Interactive skin health tracking"
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center gap-3 text-muted-foreground"
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
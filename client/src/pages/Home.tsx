import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ScanLine, Shield, Sparkles, Camera, Users, Award, Star } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Lottie from "lottie-react";
import aiScanAnimation from "../assets/ai-scan-animation.json";
import EducationModules from "../components/EducationModules";
import gsap from "gsap";

export default function Home() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    if (headingRef.current && subheadingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power4.out",
        }
      );

      gsap.fromTo(
        subheadingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: 0.3,
          ease: "power4.out",
        }
      );
    }
  }, []);

  const CtaButton = ({ className }: { className?: string }) => (
    <Link href="/analysis">
      <Button
        size="lg"
        className={cn(
          "min-h-[54px] px-8 w-full sm:w-auto relative overflow-hidden transition-all duration-500",
          "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent",
          "before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
          "hover:scale-105 hover:shadow-lg hover:shadow-primary/20",
          "backdrop-blur-sm",
          className
        )}
      >
        Start Free Analysis
      </Button>
    </Link>
  );

  return (
    <div className="w-full">
      {/* Hero Section with Enhanced Glassmorphism */}
      <section className="relative min-h-screen py-24 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5"
          style={{ opacity }}
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        </motion.div>
        <div className="absolute inset-0 backdrop-blur-xl" />
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center space-y-8 max-w-6xl mx-auto"
          >
            <h1
              ref={headingRef}
              className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60"
            >
              Your Skin, Perfected by AI
            </h1>
            <p
              ref={subheadingRef}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
            >
              Advanced skin analysis for personalized care at your fingertips
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <CtaButton />
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="min-h-[54px] px-8 w-full sm:w-auto hover:bg-primary/5 transition-all duration-300
                    border-primary/20 hover:border-primary/40 backdrop-blur-sm"
                >
                  Learn More About Our AI
                </Button>
              </Link>
            </div>

            {/* Enhanced Trust Signals */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="flex flex-wrap justify-center gap-8 mt-16"
            >
              {[
                { icon: Users, text: "10K+ Happy Users" },
                { icon: Star, text: "98% Satisfaction Rate" },
                { icon: Award, text: "Leading AI Technology" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 backdrop-blur-sm"
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary/80">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced AI Scan Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="max-w-md mx-auto mt-12"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                <Lottie
                  animationData={aiScanAnimation}
                  loop
                  className="w-full h-64"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tailored Solutions Section with Card Hover Effects */}
      <section className="py-16 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Tailored Skincare Solutions</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Every skin type has unique needs. Our AI adapts to yours.
              </p>
              <CtaButton />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Acne-Prone Skin",
                  description: "Advanced analysis to identify triggers and recommend targeted treatments",
                  icon: ScanLine,
                },
                {
                  title: "Anti-Aging Care",
                  description: "Track and improve skin elasticity with personalized routines",
                  icon: Shield,
                },
                {
                  title: "Hydration Balance",
                  description: "Measure and optimize your skin's moisture levels",
                  icon: Sparkles,
                },
                {
                  title: "Sensitive Skin",
                  description: "Gentle recommendations tailored to your skin's needs",
                  icon: Camera,
                },
              ].map((solution, index) => (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="h-full bg-gradient-to-br from-background via-background to-primary/5 hover:shadow-xl transition-all duration-300 border-opacity-50 hover:border-opacity-100">
                    <CardContent className="p-6 flex flex-col">
                      <solution.icon className="w-10 h-10 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{solution.title}</h3>
                      <p className="text-muted-foreground mb-4">{solution.description}</p>
                      <div className="mt-auto">
                        <Link href="/analysis">
                          <Button
                            variant="outline"
                            className="w-full hover:bg-primary/5 transition-colors duration-300"
                          >
                            Analyze Your Skin
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Thousands of Happy Users</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Experience the transformation yourself
            </p>
            <div className="mb-12">
              <CtaButton />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Can we just say... you're glowing and growing!",
                  author: "Sarah M.",
                  role: "Skincare Enthusiast",
                },
                {
                  quote: "Expert results, AI precision, and you at the center of it all.",
                  author: "Dr. James L.",
                  role: "Dermatologist",
                },
                {
                  quote: "Every skin type, every story—Electrofyne is here for you.",
                  author: "Michelle K.",
                  role: "Beauty Blogger",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 inline-block" />
                        ))}
                      </div>
                      <p className="text-lg mb-4 italic">"{testimonial.quote}"</p>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education Modules Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <CtaButton />
            </div>
            <EducationModules />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Transform Your Skincare Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join the future of personalized skincare. Start your analysis today and discover the power of AI-driven beauty.
            </p>
            <CtaButton />
          </div>
        </div>
      </section>
    </div>
  );
}
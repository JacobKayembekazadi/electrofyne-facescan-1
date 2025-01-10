import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ScanLine, Shield, Sparkles, Camera, Users, Award, Star } from "lucide-react";
import { motion } from "framer-motion";
import EducationModules from "../components/EducationModules";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <section className="text-center py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-6">
            Your Skin, Perfected by AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Advanced skin analysis for personalized care at your fingertips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/analysis">
              <Button size="lg" className="min-h-[48px] px-8 w-full sm:w-auto">
                Start Free Skin Analysis
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="min-h-[48px] px-8 w-full sm:w-auto">
                Learn More About Our AI
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">10K+ Happy Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">98% Satisfaction Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Leading AI Technology</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tailored Solutions Section */}
      <section className="py-16 bg-background rounded-3xl mb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tailored Skincare Solutions</h2>
            <p className="text-lg text-muted-foreground">
              Every skin type has unique needs. Our AI adapts to yours.
            </p>
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
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <solution.icon className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{solution.title}</h3>
                    <p className="text-muted-foreground">{solution.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-primary/5 rounded-3xl mb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Join Thousands of Happy Users</h2>
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
      </section>

      {/* Education Modules Section */}
      <section className="py-16 bg-background rounded-3xl mb-16">
        <div className="max-w-5xl mx-auto px-4">
          <EducationModules />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Skincare Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join the future of personalized skincare. Start your analysis today and discover the power of AI-driven beauty.
          </p>
          <Link href="/analysis">
            <Button size="lg" className="min-h-[48px] px-8">
              Get Your Free Analysis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
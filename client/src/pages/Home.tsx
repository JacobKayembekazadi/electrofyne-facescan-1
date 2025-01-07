import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ScanLine, Shield, Sparkles, Camera } from "lucide-react";
import { motion } from "framer-motion";
import EducationModules from "../components/EducationModules";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
          AI-Powered Skin Analysis
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get personalized skincare recommendations powered by advanced AI technology
        </p>
        <Link href="/analysis">
          <Button size="lg" className="text-lg">
            Start Your Analysis
          </Button>
        </Link>
      </section>

      {/* Education Modules Section */}
      <section className="py-16 bg-primary/5 rounded-3xl mb-16">
        <div className="max-w-5xl mx-auto px-4">
          <EducationModules />
        </div>
      </section>

      {/* New Skin Analysis Section */}
      <section className="py-16 bg-primary/5 rounded-3xl mb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Get Your Personalized Skin Analysis
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our advanced AI technology analyzes your skin condition in real-time, providing detailed insights and personalized recommendations for your skincare routine.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Camera className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Quick Scan</h3>
                    <p className="text-muted-foreground">Take or upload a photo for instant analysis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ScanLine className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Detailed Results</h3>
                    <p className="text-muted-foreground">Get comprehensive insights about your skin health</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Smart Recommendations</h3>
                    <p className="text-muted-foreground">Receive tailored product suggestions and care tips</p>
                  </div>
                </div>
              </div>
              <Link href="/analysis">
                <Button size="lg" className="mt-8">
                  Start Free Analysis
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/5 rounded-2xl transform rotate-6"></div>
              <Card className="relative">
                <CardContent className="p-6">
                  {/* Interactive Scan Preview */}
                  <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20"
                    />
                    <img
                      src="/skin-analysis-demo.jpg"
                      alt="Skin Analysis Demo"
                      className="w-full h-full object-cover opacity-90"
                    />
                    {/* Scanning Animation */}
                    <motion.div
                      initial={{ top: "0%" }}
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute left-0 w-full h-1 bg-primary/60 blur-sm"
                    />
                    {/* Scan Points */}
                    {[
                      { x: "30%", y: "30%", delay: 0 },
                      { x: "70%", y: "40%", delay: 0.5 },
                      { x: "45%", y: "60%", delay: 1 },
                      { x: "60%", y: "70%", delay: 1.5 }
                    ].map((point, index) => (
                      <motion.div
                        key={index}
                        className="absolute w-4 h-4"
                        style={{ left: point.x, top: point.y }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                        transition={{
                          duration: 2,
                          delay: point.delay,
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                      >
                        <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                        <div className="absolute inset-1 rounded-full bg-primary" />
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Hydration Level</span>
                      <motion.div 
                        className="w-32 h-2 bg-primary/20 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: "8rem" }}
                        transition={{ duration: 1, delay: 0.5 }}
                      >
                        <motion.div 
                          className="h-full bg-primary"
                          initial={{ width: "0%" }}
                          animate={{ width: "75%" }}
                          transition={{ duration: 1, delay: 1 }}
                        />
                      </motion.div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Texture Analysis</span>
                      <motion.div 
                        className="w-32 h-2 bg-primary/20 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: "8rem" }}
                        transition={{ duration: 1, delay: 0.7 }}
                      >
                        <motion.div 
                          className="h-full bg-primary"
                          initial={{ width: "0%" }}
                          animate={{ width: "80%" }}
                          transition={{ duration: 1, delay: 1.2 }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 py-16">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <ScanLine className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Advanced Analysis</h3>
              <p className="text-muted-foreground">
                Upload a photo and get detailed insights about your skin condition
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Personalized Care</h3>
              <p className="text-muted-foreground">
                Receive tailored product recommendations based on your unique needs
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-muted-foreground">
                Your data is securely handled with enterprise-grade protection
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid md:grid-cols-2 gap-12 py-16 items-center">
        <div>
          <img
            src="https://images.unsplash.com/photo-1591130901921-3f0652bb3915"
            alt="Skincare products"
            className="rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6">Science-Backed Solutions</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Our AI-powered platform combines cutting-edge technology with dermatological expertise to provide you with accurate analysis and effective product recommendations.
          </p>
          <Link href="/analysis">
            <Button>Get Started</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
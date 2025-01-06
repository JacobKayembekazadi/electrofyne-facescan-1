import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ScanLine, Shield, Sparkles } from "lucide-react";

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

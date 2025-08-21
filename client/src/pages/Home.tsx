import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Scan, 
  Sparkles, 
  Camera, 
  TrendingUp, 
  Award, 
  ArrowRight,
  Sun,
  Droplets,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-b from-white to-slate-50">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-8">
        <motion.div 
          className="text-center"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-2xl font-bold mb-2"
          >
            ElectroFyne AI
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-blue-100 opacity-90"
          >
            Your personal skin health companion
          </motion.p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 -mt-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6">
              <Link href="/analysis">
                <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg">
                  <Camera className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Start Skin Analysis</div>
                    <div className="text-xs opacity-90">Get instant AI insights</div>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mb-6">
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="grid grid-cols-3 gap-3"
        >
          <motion.div variants={fadeInUp}>
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-blue-900">94%</div>
                <div className="text-xs text-blue-700">Accuracy</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-4 text-center">
                <Award className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-green-900">15k+</div>
                <div className="text-xs text-green-700">Happy Users</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-4 text-center">
                <Scan className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-purple-900">2s</div>
                <div className="text-xs text-purple-700">Analysis Time</div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Features */}
      <div className="px-4 mb-6">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg font-semibold text-gray-900 mb-4"
        >
          Why Choose ElectroFyne?
        </motion.h2>
        
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          <motion.div variants={fadeInUp}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Hydration Analysis</div>
                    <div className="text-sm text-gray-500">Track your skin's moisture levels</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Sun className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">UV Protection</div>
                    <div className="text-sm text-gray-500">Personalized sun care recommendations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">AI-Powered Insights</div>
                    <div className="text-sm text-gray-500">Advanced machine learning analysis</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Ready to Start?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Begin your personalized skin health journey today
              </p>
              <Link href="/analysis">
                <Button variant="outline" size="sm" className="border-gray-300">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
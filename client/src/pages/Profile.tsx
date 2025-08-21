import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  Camera,
  TrendingUp,
  Award,
  Calendar,
  ChevronRight,
  Edit,
  Star,
  Target,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const [analysisCount] = useState(12);
  const [streakDays] = useState(7);
  const [skinScore] = useState(78);

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

  const menuItems = [
    { icon: Bell, label: "Notifications", subtitle: "Manage alerts & reminders" },
    { icon: Shield, label: "Privacy & Security", subtitle: "Data protection settings" },
    { icon: Camera, label: "Camera Settings", subtitle: "Photo quality & permissions" },
    { icon: HelpCircle, label: "Help & Support", subtitle: "FAQs and contact support" },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white">
      {/* App-style header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Profile</h1>
            <p className="text-blue-100 text-sm opacity-90">Your skin health journey</p>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto pb-4">
        
        {/* User Profile Card */}
        <div className="px-4 -mt-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">Welcome Back!</h3>
                    <p className="text-sm text-gray-500">Skin health enthusiast</p>
                    <div className="flex items-center mt-2">
                      <div className="flex">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                        <Star className="w-4 h-4 text-gray-300" />
                      </div>
                      <span className="text-sm text-gray-500 ml-2">Level 4</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Stats Grid */}
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
                  <Activity className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-blue-900">{analysisCount}</div>
                  <div className="text-xs text-blue-700">Analyses</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-green-900">{streakDays}</div>
                  <div className="text-xs text-green-700">Day Streak</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-purple-900">{skinScore}</div>
                  <div className="text-xs text-purple-700">Skin Score</div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Achievements */}
        <div className="px-4 mb-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h2>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">7-Day Streak!</div>
                    <div className="text-sm text-gray-500">You've analyzed your skin 7 days in a row</div>
                  </div>
                  <div className="text-xs text-gray-400">2 days ago</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Goals */}
        <div className="px-4 mb-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Goals</h2>
            <div className="space-y-3">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Improve Hydration</span>
                    </div>
                    <span className="text-sm text-gray-500">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-900">Daily Analysis</span>
                    </div>
                    <span className="text-sm text-gray-500">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Settings Menu */}
        <div className="px-4 mb-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
            <div className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.label}</div>
                            <div className="text-sm text-gray-500">{item.subtitle}</div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* App Info */}
        <div className="px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">ElectroFyne AI</h3>
                <p className="text-sm text-gray-600 mb-2">Version 1.0.0</p>
                <p className="text-xs text-gray-500">
                  Your trusted companion for skin health
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
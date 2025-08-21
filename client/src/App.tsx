import { Switch, Route } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Navigation from "./components/Navigation";
import BottomNav from "./components/BottomNav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Education from "./pages/Education";
import Analysis from "./pages/Analysis";
import Profile from "./pages/Profile";

function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            The page you are looking for does not exist.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col relative overflow-hidden">
      {/* Mobile app container with safe areas */}
      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full bg-white shadow-xl relative">
        {/* Status bar spacer */}
        <div className="h-safe-top bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto pb-20">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/products" component={Products} />
            <Route path="/education" component={Education} />
            <Route path="/analysis" component={Analysis} />
            <Route path="/profile" component={Profile} />
            <Route component={NotFound} />
          </Switch>
        </main>
        
        {/* Fixed bottom navigation */}
        <BottomNav />
      </div>
      
      {/* Remove desktop navigation and footer for mobile app feel */}
    </div>
  );
}

export default App;
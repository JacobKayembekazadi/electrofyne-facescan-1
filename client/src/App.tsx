import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "./components/Navigation";
import GlobalChat from "./components/GlobalChat";
import OnboardingTutorial from "./components/OnboardingTutorial";
import BottomNav from "./components/BottomNav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import Profile from "./pages/Profile";
import About from "./pages/About";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/analysis" component={Analysis} />
            <Route path="/profile" component={Profile} />
            <Route path="/about" component={About} />
          </Switch>
        </main>
        <Footer />
        <BottomNav />
        <GlobalChat />
        <OnboardingTutorial />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
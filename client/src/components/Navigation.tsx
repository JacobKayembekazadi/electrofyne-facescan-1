import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScanLine, User } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <ScanLine className="h-6 w-6" />
              <span className="font-bold">Electrofyne</span>
            </a>
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link href="/">
              <a className={location === "/" ? "text-primary" : "text-muted-foreground"}>
                Home
              </a>
            </Link>
            <Link href="/analysis">
              <a className={location === "/analysis" ? "text-primary" : "text-muted-foreground"}>
                Analysis
              </a>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/analysis">
            <Button>Start Analysis</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScanLine, User, Menu, X } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/analysis", label: "Analysis" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="link" className="p-0 flex items-center gap-2">
              <ScanLine className="h-5 w-5" />
              <span className="font-bold">Electrofyne</span>
            </Button>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationLinks.map(({ href, label }) => (
              <Link key={href} href={href}>
                <a className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === href ? "text-primary" : "text-muted-foreground"
                }`}>
                  {label}
                </a>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <User className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/analysis" className="hidden sm:block">
            <Button size="sm">Start Analysis</Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                {navigationLinks.map(({ href, label }) => (
                  <Link key={href} href={href}>
                    <a
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        location === href ? "text-primary" : "text-muted-foreground"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {label}
                    </a>
                  </Link>
                ))}
                <Link href="/analysis" className="sm:hidden mt-2">
                  <Button 
                    className="w-full" 
                    onClick={() => setIsOpen(false)}
                  >
                    Start Analysis
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
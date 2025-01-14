import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScanLine, User, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/analysis", label: "Analysis" },
    { href: "/education", label: "Learn" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <motion.div 
        className="container mx-auto px-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex h-14 items-center justify-between">
          <Link href="/">
            <Button variant="link" className="p-0 flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <ScanLine className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:text-primary/80" />
              </motion.div>
              <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Electrofyne
              </span>
            </Button>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.a
                  className={cn(
                    "relative py-1",
                    location === link.href ? "text-primary font-medium" : "text-muted-foreground hover:text-primary transition-colors"
                  )}
                  whileHover={{ y: -1 }}
                >
                  {link.label}
                  {location === link.href && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="navIndicator"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.a>
              </Link>
            ))}
            <div className="flex items-center gap-4 pl-4 border-l border-primary/10">
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/5">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/analysis">
                <Button 
                  size="sm" 
                  className="min-h-[36px] bg-primary/90 hover:bg-primary transition-colors"
                >
                  Start Analysis
                </Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-4 md:hidden">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/5">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/5">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-lg">
                <SheetHeader>
                  <SheetTitle className="text-primary">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  {navigationLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <motion.a 
                        className={`px-4 py-3 rounded-md transition-colors ${
                          location === link.href
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-primary/5"
                        }`}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {link.label}
                      </motion.a>
                    </Link>
                  ))}
                  <Link href="/analysis">
                    <Button className="w-full mt-2 bg-primary/90 hover:bg-primary transition-colors">
                      Start Analysis
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/">
            <Button variant="link" className="p-0 flex items-center gap-2">
              <ScanLine className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="font-bold text-lg">Electrofyne</span>
            </Button>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a className={location === link.href ? "text-primary font-medium" : "text-muted-foreground hover:text-primary transition-colors"}>
                  {link.label}
                </a>
              </Link>
            ))}
            <div className="flex items-center gap-4 pl-4">
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/analysis">
                <Button size="sm" className="min-h-[36px]">Start Analysis</Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-4 md:hidden">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  {navigationLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <a className={`px-4 py-3 rounded-md transition-colors ${
                        location === link.href
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-accent"
                      }`}>
                        {link.label}
                      </a>
                    </Link>
                  ))}
                  <Link href="/analysis">
                    <Button className="w-full mt-2">Start Analysis</Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
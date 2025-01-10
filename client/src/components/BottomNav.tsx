import { Link, useLocation } from "wouter";
import { Home, Scan, BookOpen, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/analysis", icon: Scan, label: "Analyze" },
    { href: "/education", icon: BookOpen, label: "Learn" },
    { href: "/products", icon: ShoppingBag, label: "Products" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <a className="flex flex-col items-center justify-center w-full h-full">
                <Icon className={cn(
                  "w-5 h-5 mb-1",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-xs",
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

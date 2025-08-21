import { Link, useLocation } from "wouter";
import { Home, Scan, BookOpen, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/analysis", icon: Scan, label: "Analyze" },
    { href: "/education", icon: BookOpen, label: "Learn" },
    { href: "/products", icon: ShoppingBag, label: "Shop" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-1 z-50">
      <nav className="flex justify-around items-center h-16 max-w-sm mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div className="flex flex-col items-center justify-center px-3 py-2 min-w-[60px] group">
                <div className="relative mb-1">
                  {isActive && (
                    <div className="absolute inset-0 bg-blue-600 rounded-full px-4 py-2 -m-2" />
                  )}
                  <Icon className={cn(
                    "w-6 h-6 transition-all duration-300 relative z-10",
                    isActive 
                      ? "text-white" 
                      : "text-gray-500 group-hover:text-gray-700 group-active:scale-95"
                  )} />
                </div>
                <span className={cn(
                  "text-[10px] transition-all duration-300 font-medium",
                  isActive 
                    ? "text-blue-600" 
                    : "text-gray-500 group-hover:text-gray-700"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
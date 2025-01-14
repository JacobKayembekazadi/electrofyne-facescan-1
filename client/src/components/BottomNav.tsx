import { Link, useLocation } from "wouter";
import { Home, Scan, BookOpen, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-primary/10 md:hidden">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <motion.a
                className="flex flex-col items-center justify-center w-full h-full group"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="relative"
                  initial={false}
                  animate={isActive ? {
                    scale: 1.1,
                    transition: { type: "spring", stiffness: 300 }
                  } : { scale: 1 }}
                >
                  <Icon className={cn(
                    "w-5 h-5 mb-1 transition-colors duration-200",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary/80"
                  )} />
                  {isActive && (
                    <motion.div
                      className="absolute -inset-2 bg-primary/10 rounded-full -z-10"
                      layoutId="bottomNavIndicator"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.div>
                <span className={cn(
                  "text-xs transition-colors duration-200",
                  isActive ? "text-primary font-medium" : "text-muted-foreground group-hover:text-primary/80"
                )}>
                  {item.label}
                </span>
              </motion.a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
"use client";

import Link from "next/link";
import { Home, Star, Archive, Settings as SettingsIcon, Sparkles } from "lucide-react";
import { ThemeToggleButton } from "./theme-toggle-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/archive", label: "Archive", icon: Archive },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-headline text-xl font-semibold">
          <Sparkles className="h-6 w-6 text-primary" />
          Affirmation Oasis
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
              aria-label={item.label}
            >
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}
          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
}

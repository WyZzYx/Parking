"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Ticket, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "New" },
  { href: "/my-tickets", icon: Ticket, label: "My Tickets" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 lg:relative lg:bg-transparent lg:dark:bg-transparent lg:border-t lg:mt-auto">
      <div className="flex max-w-4xl px-4 mx-auto lg:justify-center lg:gap-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-16 text-sm font-medium transition-colors lg:flex-row lg:w-auto lg:h-auto lg:gap-2 lg:px-4 lg:py-2 lg:rounded-md hover:bg-gray-100 dark:hover:bg-gray-800",
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              <item.icon className="w-6 h-6 mb-1 lg:mb-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

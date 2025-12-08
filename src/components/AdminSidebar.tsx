
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, LayoutDashboard } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 p-4 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
      <div className="flex items-center mb-8">
        <Shield className="w-8 h-8 mr-2 text-primary" />
        <h2 className="text-2xl font-semibold">Admin</h2>
      </div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

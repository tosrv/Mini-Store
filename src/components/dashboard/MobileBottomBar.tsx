"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Package, UsersRound, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils"; 

const items = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/products", icon: Package, label: "Products" },
  { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/dashboard/users", icon: UsersRound, label: "Users" },
];

export function MobileBottomBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-white/90 backdrop-blur h-16 flex justify-around items-center">
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center text-xs transition-colors",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="w-5 h-5 mb-1" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

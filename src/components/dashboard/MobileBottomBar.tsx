"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Package, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";
import { supabase } from "@/lib/supabase/client";

const items = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/products", icon: Package, label: "Products" },
  { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
];

export function MobileBottomBar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    useCartStore.getState().clearCart();
    useUserStore.getState().clearUser();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

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

      <button onClick={logout}>
        <LogOut className="w-5 h-5 text-gray-500 text-center w-full" />
        <span className="text-xs text-gray-500">Logout</span>
      </button>
    </nav>
  );
}

"use client";

import React from "react";
import { Nav } from "./Nav";
import {
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const router = useRouter();

  const logout = async () => {
    useCartStore.getState().clearCart();
    useUserStore.getState().clearUser();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  function toggleSidebar() {
    setIsCollapsed((prev) => !prev);
  }

  return (
    <div
      className={`
        hidden md:block
        relative border-r pb-10 transition-all duration-300
        ${isCollapsed ? "w-20 px-2" : "w-64 px-4"}
      `}
    >
      <div className="absolute right-[-20px] top-7">
        <Button
          variant="secondary"
          className="rounded-full p-2"
          onClick={toggleSidebar}
        >
          <ChevronRight
            className={`transition ${isCollapsed ? "rotate-180" : ""}`}
          />
        </Button>
      </div>

      <div className="flex flex-col justify-between h-full">
        <section className="m-0 p-0">
          <div className="my-5 mx-5">
            {isCollapsed ? (
              <p className="text-center font-bold">
                Y<span className="text-primary">S</span>
              </p>
            ) : (
              <p className="font-bold">
                YELLOW<span className="text-primary">STORE</span>
              </p>
            )}
          </div>

          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
                variant: "default",
              },
              {
                title: "Orders",
                href: "/dashboard/orders",
                icon: ShoppingCart,
                variant: "ghost",
              },
              {
                title: "Products",
                href: "/dashboard/products",
                icon: Package,
                variant: "ghost",
              },
            ]}
          />
        </section>
        {isCollapsed ? (
          <div className="w-full flex items-center justify-center">
            <Button className="rounded-full w-9 h-9" onClick={logout}>
              <LogOut />
            </Button>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <Button className="w-full" onClick={logout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

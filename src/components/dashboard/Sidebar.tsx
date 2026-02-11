"use client";

import React from "react";
import { Nav } from "./Nav";
import {
  ChevronRight,
  House,
  LayoutDashboard,
  Package,
  ShoppingCart,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

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

      <div className="py-5">
        <Link
          className="text-2xl tracking-tight text-gray-900 hover:text-gray-700 transition-colors"
          href="/"
          aria-label="YellowShop Home"
        >
          {isCollapsed ? (
            <p className="text-center font-bold">
              Y<span className="text-primary">S</span>
            </p>
          ) : (
            <p className="font-bold">
              YELLOW<span className="text-primary">STORE</span>
            </p>
          )}
        </Link>
      </div>

      <Nav
        isCollapsed={isCollapsed}
        links={[
          { title: "Home", href: "/", icon: House, variant: "default" },
          {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            variant: "default",
          },
          {
            title: "Users",
            href: "/dashboard/users",
            icon: UsersRound,
            variant: "ghost",
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
    </div>
  );
}

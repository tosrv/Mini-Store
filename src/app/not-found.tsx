"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className=" bg-white flex flex-col items-center justify-center h-screen">
      <div className="relative">
        <img src="/images/404.png" alt="Page not found" />

        <Button asChild className="shadow-none absolute bottom-0 lg:bottom-50 left-1/2 transform -translate-x-1/2">
          <Link href="/">Return to Shop</Link>
        </Button>
      </div>
    </div>
  );
}

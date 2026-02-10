"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "All" },
  { id: "running", name: "Running" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "training", name: "Training" },
  { id: "casual", name: "Casual" },
];

export default function Filter({ activeCategory }: { activeCategory: string }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const category = searchParams.get("category");

  return (
    <div className="flex justify-between mb-8 px-4 lg:px-8 lg:mx-40">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Category</NavigationMenuTrigger>

            <NavigationMenuContent>
              <div className="p-2 w-48 grid gap-1">
                {categories.map((cat) => {
                  const params = new URLSearchParams();

                  if (query) params.set("q", query);
                  if (cat.id !== "all") params.set("category", cat.id);

                  const href =
                    params.toString() === "" ? "/" : `/?${params.toString()}`;

                  const isActive = activeCategory === cat.id;

                  return (
                    <NavigationMenuLink
                      key={cat.id}
                      asChild
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm transition",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted",
                      )}
                    >
                      <Link href={href}>{cat.name}</Link>
                    </NavigationMenuLink>
                  );
                })}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted">
            Sort
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          {[
            { id: "price-asc", label: "Price: Low to High" },
            { id: "price-desc", label: "Price: High to Low" },
          ].map((item) => {
            const params = new URLSearchParams();

            if (query) params.set("q", query);
            if (category) params.set("category", category);
            params.set("sort", item.id);

            return (
              <DropdownMenuItem key={item.id} asChild>
                <Link href={`/?${params.toString()}`}>{item.label}</Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
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

export const categories = [
  { id: "all", name: "All" },
  { id: "sneakers", name: "Sneakers" },
  { id: "running", name: "Running" },
  { id: "casual", name: "Casual" },
  { id: "formal", name: "Formal" },
  { id: "boots", name: "Boots" },
  { id: "sandals", name: "Sandals" },
];

export interface FilterProps {
  activeCategory: string;
};

export default function Filter({
  activeCategory,
}: FilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPath = pathname;

  const query = searchParams.get("q");
  const category = searchParams.get("category");

  return (
    <div className="flex justify-between px-4 grow">
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
                    params.toString() === ""
                      ? currentPath
                      : `${currentPath}?${params.toString()}`;

                  const isActive = activeCategory === cat.id;

                  return (
                    <NavigationMenuLink
                      key={cat.id}
                      asChild
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm transition",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
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
                <Link href={`${currentPath}?${params.toString()}`}>
                  {item.label}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

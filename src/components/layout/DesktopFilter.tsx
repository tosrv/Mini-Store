"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { categories, FilterProps } from "../product/Filter";

export default function DesktopFilter({ activeCategory }: FilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const query = searchParams.get("q");
  const category = searchParams.get("category");

  return (
    <div>
      <h2 className="text-xl">Filter</h2>
      <Accordion type="single" collapsible defaultValue="category">
        <AccordionItem value="category" className="border-none">
          <AccordionTrigger className="hover:no-underline hover:text-yellow-600">
            Category
          </AccordionTrigger>

          <AccordionContent className="flex flex-col gap-1 pt-2">
            {categories.map((cat) => {
              const params = new URLSearchParams();

              if (query) params.set("q", query);
              if (cat.id !== "all") params.set("category", cat.id);

              const href =
                params.toString() === ""
                  ? pathname
                  : `${pathname}?${params.toString()}`;

              const isActive = activeCategory === cat.id;

              return (
                <Link
                  key={cat.id}
                  href={href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  {cat.name}
                </Link>
              );
            })}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sort" className="border-none">
          <AccordionTrigger className="hover:no-underline hover:text-yellow-600">
            Sort
          </AccordionTrigger>

          <AccordionContent className="flex flex-col gap-1 pt-2">
            {[
              { id: "price-asc", label: "Price: Low to High" },
              { id: "price-desc", label: "Price: High to Low" },
            ].map((item) => {
              const params = new URLSearchParams();

              if (query) params.set("q", query);
              if (category) params.set("category", category);
              params.set("sort", item.id);

              return (
                <Link
                  key={item.id}
                  href={`${pathname}?${params.toString()}`}
                  className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  {item.label}
                </Link>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

"use client";

import ProductList from "@/components/home/ProductList";
import Filter from "@/components/product/Filter";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductSkeleton } from "@/components/product/Skeleton";
import { useProductStore } from "@/store/product-store";
import { Card } from "@/components/ui/card";
import DesktopFilter from "@/components/layout/DesktopFilter";

export default function Home() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const sort = searchParams.get("sort") ?? "";

  const products = useProductStore((state) => state.products);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [products.length]);

  const searchProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()),
  );

  const filteredProducts =
    category === "all"
      ? searchProducts
      : searchProducts.filter((product) => product.category === category);

  let finalProducts = [...filteredProducts];

  finalProducts.sort((a, b) => b.stock - a.stock);

  if (sort === "price-asc") {
    finalProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    finalProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="bg-background px-4 py-8 sm:py-12 lg:py-16 lg:px-8 min-h-screen">
      <div className="text-center mx-auto mb-18 space-y-3">
        <h1 className="text-primary text-4xl font-semibold tracking-tight">
          Step Into Style
        </h1>
        <p className="text-foreground max-w-3xl mx-auto">
          Discover our latest collection of premium sneakers — comfort, design,
          and performance in every pair.
        </p>
      </div>

      <div className="space-y-5 lg:flex lg:space-x-5 mx-auto justify-center">
        <div className="lg:hidden">
          <Filter activeCategory={category} />
        </div>
        <Card className="h-fit w-50 sticky top-24 hidden lg:block p-3">
          <DesktopFilter activeCategory={category} />
        </Card>
        <div className="flex-1 max-w-7xl">
          {loading ? (
            <ProductSkeleton />
          ) : (
            <ProductList products={finalProducts} />
          )}
        </div>
      </div>
    </div>
  );
}

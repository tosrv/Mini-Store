"use client";

import { DataTable } from "@/components/dashboard/DataTable";
import PageTitle from "@/components/dashboard/PageTitle";
import { useProductStore } from "@/store/product-store";
import { useSearchParams, useRouter } from "next/navigation";
import Filter from "@/components/product/Filter";
import ProductSearch from "@/components/product/Search";
import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Product } from "@/types/product";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { createProductColumns } from "@/components/columns/ProductColumn";
import { supabase } from "@/lib/supabase/client";

export default function ProductsPage() {
  const products = useProductStore((state) => state.products);
  const deleteProduct = useProductStore((state) => state.removeProduct);

  const params = useSearchParams();
  const router = useRouter();

  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "all";
  const sort = params.get("sort") ?? "";

  const [searchQuery, setSearchQuery] = useState(query);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const submitSearch = () => {
    const p = new URLSearchParams(params.toString());
    searchQuery ? p.set("q", searchQuery) : p.delete("q");
    router.push(`/dashboard/products/?${p.toString()}`);
  };

  const searchProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()),
  );

  const filteredProducts =
    category === "all"
      ? searchProducts
      : searchProducts.filter((p) => p.category === category);

  let finalProducts = [...filteredProducts];

  if (sort === "price-asc") {
    finalProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    finalProducts.sort((a, b) => b.price - a.price);
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setOpenDrawer(true);
  };

  const handleAdd = () => {
    setEditingProduct(null); // ← insert mode
    setOpenDrawer(true);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm("Delete this product?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      console.error(error);
      return;
    }

    if (!product.id) return;

    deleteProduct(product.id);
  };

  const columns = useMemo(
    () => createProductColumns(handleEdit, handleDelete),
    [],
  );

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Products" />

      <div className="flex flex-wrap items-center gap-5">
        <Button onClick={handleAdd}>Add Product</Button>

        <div className="min-w-100">
          <ProductSearch
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={submitSearch}
          />
        </div>

        <Filter activeCategory={category} />
      </div>

      <span className="text-gray-600 text-sm">
        Total {products.length} products
      </span>
      <DataTable columns={columns} data={finalProducts} />

      {/* ✅ SINGLE DRAWER FOR EVERYTHING */}
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer} direction="right">
        <DrawerContent className="h-screen w-full sm:max-w-md ml-auto rounded-none">
          <DrawerHeader>
            <DrawerTitle>
              {editingProduct ? "Edit Product" : "New Product"}
            </DrawerTitle>
          </DrawerHeader>

          <ProductForm
            productToEdit={editingProduct ?? undefined}
            onSuccess={() => setOpenDrawer(false)}
          />
          <DrawerFooter className="flex flex-row gap-5">
            <Button
              onClick={() => setOpenDrawer(false)}
              variant="outline"
              className="shadow-none"
            >
              Cancel
            </Button>
            <Button type="submit" form="product-form">
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

"use client";

import ProductList from "@/components/home/ProductList";
import Filter from "@/components/product/Filter";
import { useSearchParams } from "next/navigation";
import { supabase, useUser } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { ProductSkeleton } from "@/components/product/Skeleton";
import { useCartStore } from "@/store/cart-store";
import { useProductStore } from "@/store/product-store";
import { Card } from "@/components/ui/card";
import DesktopFilter from "@/components/layout/DesktopFilter";

export default function Home() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const sort = searchParams.get("sort") ?? "";

  const { setProducts } = useProductStore();
  const products = useProductStore((state) => state.products);
  const [loading, setLoading] = useState(false);

  const userId = useUser();
  const { setCart } = useCartStore();

  useEffect(() => {
    if (products.length > 0) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data: products, error } = await supabase
          .from("products")
          .select("id, name, description, price, stock, category, image_url");
        if (error) {
          console.error("Error fetching products:", error);
        } else {
          const formattedProducts = products.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            image_url: product.image_url,
          }));

          setProducts(formattedProducts);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [products.length, setProducts]);

  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      try {
        const { data: existingCart, error: cartError } = await supabase
          .from("carts")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();

        if (cartError) throw cartError;
        if (!existingCart) return;

        const cartId = existingCart.id;

        const { data: cartItems, error: cartItemsError } = await supabase
          .from("cart_items")
          .select("product_id, quantity")
          .eq("cart_id", cartId);

        if (cartItemsError) throw cartItemsError;

        if (!cartItems || cartItems.length === 0) {
          setCart([]);
          return;
        }

        const productIds = cartItems.map((item) => item.product_id);
        const { data: products, error: productsError } = await supabase
          .from("products")
          .select("id, name, price, image_url")
          .in("id", productIds);

        if (productsError) throw productsError;

        const cartItemsWithProduct = cartItems.map((item) => {
          const product = products.find((p) => p.id === item.product_id);
          return {
            id: item.product_id,
            quantity: item.quantity,
            name: product?.name || "",
            price: product?.price || 0,
            image: product?.image_url || "",
          };
        });

        setCart(cartItemsWithProduct);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    fetchCart();
  }, [userId, setCart]);

  const searchProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()),
  );

  const filteredProducts =
    category === "all"
      ? searchProducts
      : searchProducts.filter((product) => product.category === category);

  let finalProducts = [...filteredProducts];

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

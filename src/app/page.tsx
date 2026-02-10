"use client";

import ProductList from "@/components/home/ProductList";
import Filter from "@/components/product/Filter";
// import products from "@/data/products.json";
import { useSearchParams } from "next/navigation";
import { supabase, useUser } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { ProductSkeleton } from "@/components/auth/Skeleton";
import { useCartStore } from "@/store/cart-store";

export default function Home() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const sort = searchParams.get("sort") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = useUser();
  const { setCart } = useCartStore();

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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } else {
        setProducts(data ?? []);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [supabase]);

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

      <Filter activeCategory={category} />
      {loading ? <ProductSkeleton /> : <ProductList products={finalProducts} />}
    </div>
  );
}

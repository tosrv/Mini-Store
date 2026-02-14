"use client";

import { useUserStore } from "@/store/user-store";
import { supabase } from "@/lib/supabase/client";
import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { useProductStore } from "@/store/product-store";
import { useOrderStore } from "@/store/order-store";

export default function Initializer() {
  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  const setCart = useCartStore((state) => state.setCart);
  const setOrders = useOrderStore((state) => state.setOrders);

  // Initialize products
  useEffect(() => {
    if (products.length > 0) return;

    const fetchProducts = async () => {
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
      }
    };
    fetchProducts();
  }, [products.length, setProducts]);

  // Subscribe to auth changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        setUser({
          id: session.user.id,
          name: meta.full_name || meta.name || "User",
          email: meta.email || "",
          phone: "",
          address: "",
        });

        const fetchProfile = async () => {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, name, email, phone, address")
            .eq("id", session.user.id)
            .single();

          if (!error && data) {
            setUser(data);
          } else {
            setTimeout(async () => {
              const { data: retryData } = await supabase
                .from("profiles")
                .select("id, name, email, phone, address")
                .eq("id", session.user.id)
                .single();
              if (retryData) setUser(retryData);
            }, 1500);
          }
        };

        fetchProfile();
      } else {
        clearUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, clearUser]);

  // Initialize cart
  useEffect(() => {
    if (!user) return;

    const fetchCart = async () => {
      try {
        const { data: existingCart, error: cartError } = await supabase
          .from("carts")
          .select("id")
          .eq("user_id", user.id)
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
  }, [user, setCart]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select(
            "id, status, total_price, shipping_price, tax_price, created_at, profiles!inner(name), order_items!inner(quantity)",
          );

        if (ordersError) throw ordersError;
        if (!orders || orders.length === 0) {
          setOrders([]);
          return;
        }

        const formattedOrders = orders.map((order: any) => ({
          id: order.id,
          name: order.profiles.name,
          status: order.status,
          price: order.total_price,
          shipping: order.shipping_price,
          tax: order.tax_price,
          created_at: order.created_at,
          quantity: Array.isArray(order.order_items)
            ? order.order_items.reduce(
                (sum: number, item: any) => sum + (item.quantity ?? 0),
                0,
              )
            : 0,
        }));

        setOrders(formattedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, [setOrders]);

  useEffect(() => {
    useProductStore.getState().initRealtime();
  }, []);

  useEffect(() => {
    useOrderStore.getState().initRealtime();
  }, []);

  return null;
}

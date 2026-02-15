import { supabase } from "@/lib/supabase/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";

export interface OrderItem {
  id: string;
  name: string;
  status: string;
  price: number;
  shipping: number;
  tax: number;
  quantity: number;
  created_at: string;
}

interface ProfileRow {
  name: string;
}
type OrderItemRow = { quantity: number };

interface OrderStore {
  orders: OrderItem[];
  setOrders: (orders: OrderItem[]) => void;

  addOrder: (order: OrderItem) => void;
  updateOrder: (orderId: string, status: string) => void;

  initRealtime: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      setOrders: (orders) => set({ orders }),

      addOrder: (order) => set({ orders: [...get().orders, order] }),
      updateOrder: (orderId, status) =>
        set({
          orders: get().orders.map((order) =>
            order.id === orderId ? { ...order, status } : order,
          ),
        }),

      initRealtime: () => {
        const isDashboard = window.location.pathname.startsWith("/dashboard");

        const statusMessages: Record<string, string> = {
          PAID: "New payment received",
          SHIPPED: "Order has been shipped",
          CANCELLED: "Order was cancelled",
        };

        supabase
          .channel("orders_status")
          .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "orders" },
            async (payload) => {
              const {
                id,
                status,
                total_price,
                shipping_price,
                tax_price,
                created_at,
              } = payload.new;

              const orders = get().orders;
              const existingOrder = orders.find((o) => o.id === id);

              if (existingOrder) {
                get().updateOrder(id, status);
              } else {
                const { data } = await supabase
                  .from("orders")
                  .select("profiles!inner(name), order_items!inner(quantity)")
                  .eq("id", id)
                  .single();

                const profile = data?.profiles as ProfileRow | undefined;

                const formattedOrder: OrderItem = {
                  id,
                  name: profile?.name ?? "Unknown",
                  status,
                  price: total_price,
                  shipping: shipping_price,
                  tax: tax_price,
                  quantity: Array.isArray(data?.order_items)
                    ? (data.order_items as OrderItemRow[]).reduce(
                        (sum, item) => sum + (item.quantity ?? 0),
                        0,
                      )
                    : 0,
                  created_at,
                };

                get().addOrder(formattedOrder);
              }

              const msg = statusMessages[status];
              if (msg && isDashboard) {
                toast.success(msg);
              }
            },
          )
          .subscribe();
      },
    }),
    {
      name: "order",
    },
  ),
);

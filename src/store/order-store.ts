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
        supabase
          .channel("status")
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "orders",
            },
            (payload) => {
              const isDashboard =
                window.location.pathname.startsWith("/dashboard");

              if (payload.new.status === "PAID" && isDashboard) {
                toast.success("New payment received");
              }

              const orders = get().orders;
              const existingOrder = orders.find((o) => o.id === payload.new.id);
              if (existingOrder) {
                get().updateOrder(payload.new.id, payload.new.status);
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

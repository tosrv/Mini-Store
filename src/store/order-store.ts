import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OrderItem {
  id: string;
  name: string;
  status: string;
  price: number;
  shipping: number;
  tax: number;
  quantity: number;
}

interface OrderStore {
  orders: OrderItem[];
  setOrders: (orders: OrderItem[]) => void;

  addOrder: (order: OrderItem) => void;
  updateOrder: (orderId: string, status: string) => void;
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
    }),
    {
      name: "order",
    },
  ),
);

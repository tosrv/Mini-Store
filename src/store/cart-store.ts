import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

interface CartStore  {
  cart: CartItem[];

  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;

  totalItems: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      setCart: (items) => set({ cart: items }),

      addToCart: (item) =>
        set((state) => {
          const exist = state.cart.find((i) => i.id === item.id);

          if (exist) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }

          return {
            cart: [...state.cart, { ...item }],
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.id !== String(id)),
        })),

      updateQuantity: (id, qty) =>
        set((state) => ({
          cart: state.cart.map((i) =>
            i.id === String(id) ? { ...i, quantity: qty } : i,
          ),
        })),

      clearCart: () => set({ cart: [] }),

      totalItems: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),

      subtotal: () =>
        get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: "cart", // localStorage key
    },
  ),
);

import { Product } from "@/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductStore {
  products: Product[];
  setProducts: (products: Product[]) => void;

  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateProduct: (product: Product) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],

      setProducts: (products) => set({ products }),

      addProduct: (product) => set({ products: [...get().products, product] }),

      removeProduct: (productId) =>
        set({ products: get().products.filter((p) => p.id !== productId) }),

      updateProduct: (product) =>
        set({
          products: get().products.map((p) =>
            p.id === product.id ? product : p,
          ),
        }),
    }),
    {
      name: "product",
    },
  ),
);

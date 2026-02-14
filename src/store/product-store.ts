import { supabase } from "@/lib/supabase/client";
import { Product } from "@/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductStore {
  products: Product[];
  setProducts: (products: Product[]) => void;

  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateProduct: (product: Product) => void;

  initRealtime: () => void
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

        initRealtime: () => {
          supabase.channel("stock").on("postgres_changes", {
            event: "UPDATE",
            schema: "public",
            table: "products",
          }, (payload) => {
            const products = get().products;

            const exsistingProduct = products.find((p) => p.id === payload.new.id);

            if(exsistingProduct) {
              get().updateProduct({
                ...exsistingProduct,
                stock: payload.new.stock
              });
            }
          }).subscribe();
        }
    }),
    {
      name: "product",
    },
  ),
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Address {
  id: number;
  label: string;
  province_name?: string;
  city_name?: string;
  district_name?: string;
  subdistrict_name?: string;
  zip_code?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: Address | null;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (payload: Partial<User>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      updateUser: (payload: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...payload } : state.user,
        })),

      clearUser: () => set({ user: null }),
    }),
    { name: "user" },
  ),
);

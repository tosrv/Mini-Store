"use client";

import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    useCartStore.getState().clearCart();
    useUserStore.getState().clearUser();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button onClick={logout}>
      Logout
    </Button>
  );
}

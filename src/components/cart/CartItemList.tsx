"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import CartItems from "./CartItems";
import { useCartStore } from "@/store/cart-store";
import { supabase } from "@/lib/supabase/client";
import { useUserStore } from "@/store/user-store";

export default function CartItemList() {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useUserStore((state) => state.user);

  const handleClearCart = async (id: string) => {
    try {
      await supabase.from("carts").delete().eq("user_id", id);
      clearCart();
    } catch (err) {
      console.error("Failed to remove product from cart", err);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Cart Items</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (!user?.id) return;
            handleClearCart(user.id);
          }}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {cart.map((item, index) => (
          <CartItems
            key={`${item.id}-${index}`}
            item={item}
            isLast={index === cart.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}

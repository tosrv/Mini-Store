"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useCart } from "@/context/CartContext";
import { Trash2 } from "lucide-react";
import CartItem from "./CartItem";
import { useCartStore } from "@/store/cart-store";
import { useUser } from "@/lib/supabase/client";
import { supabase } from "@/lib/supabase/client";

export default function CartItemList() {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const userId = useUser();

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
            if (!userId) return;
            handleClearCart(userId);
          }}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {cart.map((item, index) => (
          <CartItem
            key={`${item.id}-${index}`}
            item={item}
            isLast={index === cart.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}

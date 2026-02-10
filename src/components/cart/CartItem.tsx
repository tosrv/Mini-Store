"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// import { useCart } from "@/context/CartContext";
import { useCartStore } from "@/store/cart-store";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { useUser } from "@/lib/supabase/client";

interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
  isLast: boolean;
}

export default function CartItem({ item, isLast }: CartItemProps) {
  // const { removeFromCart, updateQuantity } = useCart();

  const userId = useUser();
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const handleRemove = async (id: number) => {
    try {
      await supabase.from("cart_items").delete().eq("product_id", id);
      removeFromCart(id);
    } catch (err) {
      console.error("Failed to remove product from cart", err);
    }
  };

  const handleQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1 || !userId) return;

    updateQuantity(productId, newQuantity);

    try {
      const { data } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (!data) return;

      await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("cart_id", data.id)
        .eq("product_id", productId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="relative w-[100px] h-[100px]">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="100px"
            className="rounded-lg object-cover bg-muted"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="font-semibold text-foreground line-clamp-2">
                {item.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                ${item.price.toFixed(2)} each
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(item.id)}
              className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center border border-border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="h-8 w-8 rounded-r-none"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="px-4 py-2 min-w-[50px] text-center text-sm font-medium">
                {item.quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantity(item.id, item.quantity + 1)}
                className="h-8 w-8 rounded-l-none"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-foreground">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {!isLast && <Separator className="mt-4" />}
    </div>
  );
}

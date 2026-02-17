"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart-store";
import { CreditCard, Heart, Shield, Truck } from "lucide-react";
import PayDialog from "../order/PayDialog";
import { formatRupiah } from "@/lib/utils";
import { use, useEffect, useState } from "react";
import { useUserStore } from "@/store/user-store";
import { toast } from "react-hot-toast";
import { Button } from "../ui/button";

export default function OrderSummary() {
  const user = useUserStore((state) => state.user);
  const cart = useCartStore((state) => state.cart);
  const [open, setOpen] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const [shippingCost, setShippingCost] = useState<number | undefined>(
    undefined,
  );
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);

  const shipping = subtotal > 1_000_000 ? 0 : shippingCost;
  const tax = subtotal * 0.11;

  const total = subtotal + (shipping ?? 0) + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!user?.address || cart.length === 0 || subtotal > 1_000_000) return;

    setIsLoadingShipping(true);
    fetch("/api/shipping", {
      method: "POST",
      body: JSON.stringify({ destination: user.address.id, itemCount }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setShippingCost(data.shippingCost))
      .catch(console.error)
      .finally(() => setIsLoadingShipping(false));
  }, [itemCount, user]);

  const handleCheckout = () => {
    if (!user?.phone?.trim() || !user?.address?.id) {
      toast.error("Please complete your profile first");
      return;
    }

    setOpen(true);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Subtotal ({itemCount} items)
            </span>
            <span className="font-medium">Rp {formatRupiah(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">
              {isLoadingShipping ? (
                "Calculating..."
              ) : shipping === 0 ? (
                <Badge variant="secondary" className="text-xs">
                  Free
                </Badge>
              ) : (
                `Rp ${formatRupiah(shipping ?? 0)}`
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="font-medium">Rp {formatRupiah(tax)}</span>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold text-primary">
              Rp {formatRupiah(total)}
            </span>
          </div>
        </div>

        {shipping !== undefined && shipping > 0 && (
          <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-4 w-4 text-accent-foreground" />
              <span className="text-sm font-medium text-accent-foreground">
                Free shipping on orders over Rp 1.000.000
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Add Rp {formatRupiah(1_000_000 - subtotal)} more to qualify!
            </p>
          </div>
        )}

        <Button
          onClick={handleCheckout}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <span className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Proceed to Checkout
          </span>
        </Button>

        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Secure SSL checkout</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Truck className="h-4 w-4 text-blue-500" />
            <span>Free returns within 30 days</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-red-500" />
            <span>24/7 customer support</span>
          </div>
        </div>
      </CardContent>

      <PayDialog open={open} setOpen={setOpen} shippingCost={shipping} />
    </Card>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart-store";
import { CreditCard, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useUserStore } from "@/store/user-store";
import { supabase } from "@/lib/supabase/client";
import { useOrderStore } from "@/store/order-store";
import { useRouter } from "next/navigation";

export default function PayDialog() {
  const user = useUserStore((state) => state.user);
  const cart = useCartStore((state) => state.cart);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const router = useRouter();

  const addOrder = useOrderStore((state) => state.addOrder);

  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<any>(null);
  const [selectedBank, setSelectedBank] = useState("bca");
  const [orderId, setOrderId] = useState<string | null>(null);

  const shipping = subtotal > 500_000 ? 0 : 50_000;
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + shipping + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatRupiah = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePay = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: order } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_price: total,
          shipping_price: shipping,
          tax_price: tax,
          status: "PENDING",
          bank: selectedBank,
        })
        .select("id")
        .maybeSingle();

      const orderId = order?.id;
      setOrderId(orderId);

      const products = cart.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const res = await fetch("/api/midtrans/charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          gross_amount: total,
          bank: selectedBank,
          customer: {
            name: user.name,
            email: "name@example.com",
            phone: "08123456789",
            address: "123 Fashion Street, Style City, SC 12345",
          },
          products,
          shipping,
          tax,
        }),
      });
      const data = await res.json();
      console.log("Midtrans Response", data);

      setPayment(data);
      router.push(`/payment/${orderId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!payment || !user) return;

    if (payment) {
      addOrder({
        id: String(orderId),
        name: user.name,
        status: "PENDING",
        price: total,
        shipping,
        tax,
        quantity: itemCount,
      });
    }
  }, [payment]);

  const banks = [
    {
      id: "bca",
      image:
        "https://snap-assets.al-pc-id-b.cdn.gtflabs.io/snap/v4/assets/bca-906e4db60303060666c5a10498c5a749962311037cf45e4f73866e9138dd9805.svg",
    },
    {
      id: "bni",
      image:
        "https://snap-assets.al-pc-id-b.cdn.gtflabs.io/snap/v4/assets/bni-163d98085f5fe9df4068b91d64c50f5e5b347ca2ee306d27954e37b424ec4863.svg",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        asChild
      >
        <Button className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Proceed to Checkout
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl">Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Subtotal ({itemCount} items)
            </span>
            <span className="font-medium">
              Rp{formatRupiah(String(subtotal))}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? (
                <Badge variant="secondary" className="text-xs">
                  Free
                </Badge>
              ) : (
                `Rp${formatRupiah(String(shipping))}`
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="font-medium">Rp{formatRupiah(String(tax))}</span>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold text-primary">
              Rp{formatRupiah(String(total))}
            </span>
          </div>
        </div>

        {shipping > 0 && (
          <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-4 w-4 text-accent-foreground" />
              <span className="text-sm font-medium text-accent-foreground">
                Free shipping on orders over Rp500.000
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Add Rp{formatRupiah(String(500_000 - subtotal))} more to qualify!
            </p>
          </div>
        )}

        <Separator />

        <div className="flex gap-2 my-2">
          {banks.map((bank) => (
            <Button
              key={bank.id}
              variant={selectedBank === bank.id ? "default" : "outline"}
              className="shadow-none"
              onClick={() => setSelectedBank(bank.id)}
            >
              <img
                src={bank.image}
                alt={bank.id.toUpperCase()}
                className="h-5 w-auto"
              />
            </Button>
          ))}
        </div>

        <Button
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

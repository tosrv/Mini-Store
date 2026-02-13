"use client";

import EmptyCart from "@/components/cart/EmptyCart";
import OrderItemList from "@/components/order/OrderItemList";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/store/order-store";
import { useUserStore } from "@/store/user-store";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OrderPage() {
  const user = useUserStore((state) => state.user);
  const orders = useOrderStore((state) => state.orders);

  const userOrders = orders.filter((order) => order.name === user?.name);

  if (userOrders.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order History</h1>
        </div>

        <Button
          variant="ghost"
          asChild
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      <div className="flex justify-center">
        <div className="max-w-7xl space-y-6">
          <OrderItemList />
        </div>
      </div>
    </div>
  );
}

"use client";

import { OrderItem } from "@/store/order-store";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import ItemDetail from "./ItemDetail";
import { Button } from "../ui/button";
import { formatRupiah } from "@/lib/utils";

interface OrderItemProps {
  item: OrderItem;
  isLast: boolean;
}

export default function OrderItems({ item, isLast }: OrderItemProps) {
  const router = useRouter();

  const statusColors: Record<
    "PAID" | "PENDING" | "CANCELLED" | "SHIPPED",
    string
  > = {
    PAID: "bg-green-500 hover:bg-green-500 text-white",
    PENDING: "",
    CANCELLED: "bg-red-500 hover:bg-red-500 text-white",
    SHIPPED: "bg-blue-500 hover:bg-blue-500 text-white",
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-medium">
            {item.quantity} Product • Rp {formatRupiah(item.price)}
          </span>

          <span className="text-xs text-muted-foreground">
            Order ID: {item.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            className={`w-fit ${statusColors[item.status as keyof typeof statusColors]}`}
          >
            {item.status}
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/payment/${item.id}`)}
          >
            View Invoice
          </Button>
        </div>
      </div>
      <div className="pt-2">
        <ItemDetail orderId={item.id} />
      </div>

      {!isLast && <Separator className="mt-6" />}
    </div>
  );
}

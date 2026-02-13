"use client";

import { OrderItem } from "@/store/order-store";
import { Separator } from "@radix-ui/react-separator";

interface OrderItemProps {
  item: OrderItem;
  isLast: boolean;
}

export default function OrderItems({ item, isLast }: OrderItemProps) {
  const formatRupiah = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div>
      <div className="flex items-start gap-4">
        <p>{item.id}</p>
        <p>{item.quantity}</p>
        <p>{item.status}</p>
        <p>{formatRupiah(String(item.price))}</p>
        <p>{item.vaBank}</p>
        <p>{item.vaNumber}</p>
      </div>

      {!isLast && <Separator className="mt-4" />}
    </div>
  );
}

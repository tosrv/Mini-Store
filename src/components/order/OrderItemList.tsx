"use client";

import { useOrderStore } from "@/store/order-store";
import { CardContent } from "../dashboard/card";
import { Card } from "../ui/card";
import { useUserStore } from "@/store/user-store";
import OrderItems from "./OrderItems";

export default function OrderItemList() {
  const user = useUserStore((state) => state.user);
  const orders = useOrderStore((state) => state.orders);

  const userOrders = orders.filter((order) => order.name === user?.name);

  return (
    <Card>
      <CardContent className="space-y-4">
        {userOrders.map((item, index) => (
          <OrderItems
            key={`${item.id}-${index}`}
            item={item}
            isLast={index === userOrders.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}

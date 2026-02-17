"use client";

import { OrderItem, useOrderStore } from "@/store/order-store";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import ItemDetail from "./ItemDetail";
import { formatRupiah } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface OrderItemProps {
  item: OrderItem;
  isLast: boolean;
}

export default function OrderItems({ item, isLast }: OrderItemProps) {
  const router = useRouter();
  const updateOrder = useOrderStore((state) => state.updateOrder);

  const statusColors: Record<
    "PAID" | "PENDING" | "CANCEL" | "CANCELLED" | "SHIPPED",
    string
  > = {
    PAID: "bg-green-500 hover:bg-green-500 text-white",
    PENDING: "",
    CANCEL: "bg-orange-400 hover:bg-orange-400 text-white",
    CANCELLED: "bg-red-500 hover:bg-red-500 text-white",
    SHIPPED: "bg-blue-500 hover:bg-blue-500 text-white",
  };

  const handleCancel = async (id: string) => {
    try {
      await supabase.from("orders").update({ status: "CANCEL" }).eq("id", id);
      updateOrder(id, "CANCEL");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1">
          <div className="font-medium">
            {item.quantity} Product • Rp {formatRupiah(item.price)}
          </div>

          <span className="text-xs text-muted-foreground">
            Order ID: {item.id}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            className={statusColors[item.status as keyof typeof statusColors]}
          >
            {item.status}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Ellipsis className="h-4 w-4 text-gray-500" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/payment/${item.id}`)}
              >
                Payment
              </DropdownMenuItem>

              {item.status === "PENDING" && (
                <DropdownMenuItem onClick={() => handleCancel(item.id)}>
                  Cancel
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="pt-2">
        <ItemDetail orderId={item.id} />
      </div>

      {!isLast && <Separator className="mt-6" />}
    </div>
  );
}

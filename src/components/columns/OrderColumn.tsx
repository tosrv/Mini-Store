"use client";

import { cn, formatRupiah } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { OrderItem } from "@/store/order-store";

export const createOrderColums = (
  oncancel: (id: string) => void,
  onShipped: (id: string) => void,
  onDetails: (id: string) => void,
): ColumnDef<OrderItem>[] => [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return (
        <div className="flex items-center gap-2">
          <button
            className="hover:underline hover:cursor-pointer"
            onClick={() => onDetails(id)}
          >
            {id}
          </button>
        </div>
      );
    },
    meta: {
      className: "w-[1%] whitespace-nowrap",
    },
  },
  {
    accessorKey: "name",
    header: "Costumer Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const id = row.getValue("id") as string;

      return (
        <div className="flex justify-between max-w-30">
          <Badge
            className={cn("font-bold", {
              "bg-primary": status === "PENDING",
              "bg-green-500 hover:bg-green-500 text-white": status === "PAID",
              "bg-red-500 hover:bg-red-500 text-white": status === "CANCELLED",
              "bg-blue-500 hover:bg-blue-500 text-white": status === "SHIPPED",
            })}
          >
            {status}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={`focus:outline-none focus:ring-0 ${status === "SHIPPED" || status === "CANCELLED" ? "hidden" : ""}`}
            >
              <Ellipsis className="h-4 w-4 text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {status === "PENDING" && (
                <DropdownMenuItem onClick={() => oncancel(id)}>
                  Cancel
                </DropdownMenuItem>
              )}
              {status === "PAID" && (
                <DropdownMenuItem onClick={() => onShipped(id)}>
                  Shipped
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <span>Rp {formatRupiah(row.getValue("price") as number)}</span>
    ),
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export const createProductColumns = (
  onEdit: (product: Product) => void,
  onDelete: (product: Product) => void,
): ColumnDef<Product>[] => [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "price", header: "Price" },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.original.stock;
      return (
        <div className="flex justify-between max-w-10">
          <span className={stock <= 10 ? "text-red-500 font-semibold" : ""}>
            {stock}
          </span>
          <span>{stock <= 10 ? "⚠️" : ""}</span>
        </div>
      );
    },
  },
  { accessorKey: "category", header: "Category" },

  {
    id: "actions",
    header: "Actions",
    size: 1,
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex m-0 p-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product)}
            className="shadow-none rounded-full w-0 h-fit"
          >
            <Pencil className="h-4 w-4 text-gray-500" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(product)}
            className="shadow-none rounded-full w-fit h-fit"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      );
    },
    meta: {
      className: "w-[1%] whitespace-nowrap",
    },
  },
];

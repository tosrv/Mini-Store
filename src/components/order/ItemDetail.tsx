"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import { useProductStore } from "@/store/product-store";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/utils";

export default function ItemDetail({ orderId }: { orderId: string }) {
  if (!orderId) return null;
  const [items, setItems] = useState<any[]>([]);
  const products = useProductStore((state) => state.products);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      const { data: webhook } = await supabase
        .from("payment_webhooks")
        .select("payload")
        .eq("order_id", orderId)
        .single();

      if (webhook?.payload) {
        const payload =
          typeof webhook.payload === "string"
            ? JSON.parse(webhook.payload)
            : webhook.payload;

        const data = payload?.item_details;
        setItems(data ?? []);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="items" className="border-none">
        <AccordionTrigger className="hover:no-underline">
          Items
        </AccordionTrigger>

        <AccordionContent>
          <div className="space-y-3">
            {items.map((item) => {
              const product = products.find((p) => p.id === item.id);
              const isRealProduct = !!product;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3">
                    {isRealProduct && (
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-muted">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}
                      </div>
                    )}

                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground">
                        x{item.quantity}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span>
                      Rp {formatRupiah(item.price)}
                    </span>

                    {isRealProduct && (
                      <Button
                        variant="outline"
                        className="shadow-none"
                        onClick={() => router.push(`/product/${item.id}`)}
                        size="sm"
                      >
                        Reorder
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

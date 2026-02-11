"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { ImageDropzone } from "../product/ImageDropzone";
import { supabase } from "@/lib/supabase/client";
import { useProductStore } from "@/store/product-store";
import { Product } from "@/types/product";
import { X } from "lucide-react";

interface FormState {
  name: string;
  price: string;
  stock: string;
  category: string;
  description: string;
  image_url: File | string | null;
}

export function ProductForm({
  productToEdit,
  onSuccess,
}: {
  productToEdit?: Product;
  onSuccess?: () => void;
}) {
  const [form, setForm] = useState<FormState>({
    name: productToEdit?.name ?? "",
    price: productToEdit?.price.toString() ?? "",
    stock: productToEdit?.stock.toString() ?? "",
    category: productToEdit?.category ?? "",
    description: productToEdit?.description ?? "",
    image_url: productToEdit?.image_url ?? null,
  });

  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);

  const inputs = [
    { name: "name", label: "Name", type: "text" },
    { name: "price", label: "Price", type: "number" },
    { name: "stock", label: "Stock", type: "number" },
    { name: "category", label: "Category", type: "text" },
  ] as const;

  const MAX_DESC = 500;

  const formatRupiah = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (
    name: keyof FormState,
    type: "text" | "number",
    value: string,
  ) => {
    let formatted = value;

    if (type === "number") {
      const raw = value.replace(/\D/g, "");
      formatted = name === "price" ? formatRupiah(raw) : raw;
    }

    setForm((prev) => ({ ...prev, [name]: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl: string | null = null;

      if (form.image_url instanceof File) {
        const file = form.image_url;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      } else if (typeof form.image_url === "string") {
        imageUrl = form.image_url;
      }

      const payload = {
        name: form.name,
        price: Number(form.price.replace(/\D/g, "")),
        stock: Number(form.stock),
        category: form.category,
        description: form.description,
        image_url: imageUrl || "",
      };

      if (productToEdit) {
        // UPDATE
        const { data, error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", productToEdit.id)
          .select("*");

        if (error) throw error;
        updateProduct(data[0]);
        onSuccess?.();
      } else {
        // INSERT
        const { data, error } = await supabase
          .from("products")
          .insert(payload)
          .select("*");

        if (error) throw error;
        addProduct(data[0]);
        onSuccess?.();
      }

      setForm({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        image_url: null,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  };

  return (
    <>
      {/* BODY (scrollable) */}
      <div className="flex-1 overflow-y-auto px-4">
        <form id="product-form" className="space-y-4" onSubmit={handleSubmit}>
          {/* IMAGE */}
          <div className="space-y-2">
            <Label htmlFor="image_url">Product Image</Label>

            {typeof form.image_url === "string" ? (
              <div className="relative">
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-full max-h-60 object-contain rounded-md border"
                />

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-4 w-4 h-6"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, image_url: null }))
                  }
                >
                  <X />
                </Button>
              </div>
            ) : (
              <div className="relative">
                <ImageDropzone
                  value={form.image_url instanceof File ? form.image_url : null}
                  onChange={(file) =>
                    setForm((prev) => ({ ...prev, image_url: file }))
                  }
                />

                {/* ✅ Tombol remove hanya kalau ada File */}
                {form.image_url instanceof File && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-4 w-4 h-6"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, image_url: null }))
                    }
                  >
                    <X />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* INPUTS */}
          {inputs.map((input) => (
            <div key={input.name} className="space-y-1">
              <Label htmlFor={input.name}>{input.label}</Label>
              <Input
                id={input.name}
                type="text"
                inputMode={input.type === "number" ? "numeric" : "text"}
                value={form[input.name]}
                onChange={(e) =>
                  handleChange(input.name, input.type, e.target.value)
                }
                className="shadow-none h-12 rounded-full"
              />
            </div>
          ))}

          {/* DESCRIPTION */}
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              maxLength={MAX_DESC}
              className="resize-none overflow-auto shadow-none"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
            <p className="text-xs text-muted-foreground text-right">
              {form.description.length}/{MAX_DESC}
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

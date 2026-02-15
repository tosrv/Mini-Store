"use client";

import Features from "@/components/product/Features";
import ProductBreadcrumb from "@/components/product/ProductBreadcrumb";
import ProductNotFound from "@/components/product/ProductNotFound";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, formatRupiah } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import {
  Check,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useProductStore } from "@/store/product-store";
import { useUserStore } from "@/store/user-store";

export default function DetailProduct() {
  const addToCart = useCartStore((state) => state.addToCart);

  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const products = useProductStore((state) => state.products);
  const product = products.find((p) => String(p.id) === productId);

  if (!product) {
    return <ProductNotFound />;
  }

  const handleAddToCart = async (quantity: number) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setIsAdding(true);

    try {
      await supabase.rpc("add_item_to_cart", {
        p_user_id: user.id,
        p_product_id: product.id,
        p_quantity: quantity,
      });

      addToCart({
        id: String(product.id),
        name: product.name,
        price: product.price,
        image: product.image_url ?? "/images/NoImage.jpg",
        quantity: quantity,
      });

      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (err) {
      console.error("Failed to add to cart via RPC", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    handleAddToCart(quantity);
    setTimeout(() => router.push("/cart"), 500);
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductBreadcrumb />

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <div className="space-y-4">
          <div className="w-full max-w-[500px] mx-auto flex flex-col items-center px-4">
            <div className="rounded-xl shadow-lg overflow-hidden mb-4 w-full">
              <Image
                src={
                  product.image_url ??
                  "/images/NoImage.jpg"
                }
                alt="Selected product"
                width={600}
                height={600}
                priority
                fetchPriority="high"
                className="rounded-xl object-cover w-full h-auto max-h-[500px]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              (4.8) • 127 reviews
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-foreground">
              Rp {formatRupiah(product.price)}
            </span>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-5">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange("decrement")}
                      disabled={quantity <= 1 || product.stock <= 0}
                      className="h-10 w-10 rounded-r-none"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange("increment")}
                      className="h-10 w-10 rounded-l-none"
                      disabled={product.stock <= 0}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="">
                {product.stock > 0 ? (
                  <p className="font-medium text-foreground">
                    Stock: {product.stock}
                  </p>
                ) : (
                  <p className="font-mediumtext-muted-foreground">Stock: 0</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                size="lg"
                className={cn(
                  "flex-1 transition-all duration-300",
                  product.stock === 0
                    ? "bg-red-500 text-white hover:bg-red-500"
                    : justAdded
                      ? "bg-green-600 text-white hover:bg-green-600"
                      : "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
                onClick={() => handleAddToCart(quantity)}
                disabled={isAdding || product.stock === 0}
              >
                {isAdding ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : justAdded ? (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Added to Cart!
                  </div>
                ) : product.stock === 0 ? (
                  "Out of Stock"
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </div>
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleBuyNow}
                className="flex-1"
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  isLiked && "text-destructive",
                )}
              >
                <Heart
                  className={cn("h-4 w-4 mr-2", isLiked && "fill-current")}
                />
                Add to Wishlist
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Features />

      {/* <RelatedProducts product={product} relatedProducts={relatedProducts} /> */}
    </div>
  );
}

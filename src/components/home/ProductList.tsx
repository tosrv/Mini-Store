// import products from "@/data/products.json";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

export default function ProductList({products}: {products: Product[]}) {
  // TODO: Add product from database here

  return (
    <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 max-w-7xl">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No products found
          </h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
}

import { Skeleton } from "../ui/skeleton";

export function ProductSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 max-w-7xl mx-auto">
      {Array.from({ length: 10 }).map((_, idx) => (
        <div key={idx} className="space-y-2">
          <Skeleton className="w-full h-48 rounded-lg" />
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}

export function DetailProductSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="space-y-4">
          <div className="w-full max-w-[500px] mx-auto flex flex-col items-center px-4">
            <div className="rounded-xl shadow-lg overflow-hidden mb-4 w-full">
              <Skeleton className="w-full h-[500px] rounded-xl" />
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="space-y-6">
          {/* Title */}
          <Skeleton className="h-10 w-3/4 rounded-md" />

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-4 h-4 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>

          {/* Price */}
          <Skeleton className="h-8 w-24 rounded-md" />

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-4/6 rounded-md" />
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-16 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-12 w-full sm:w-1/2 rounded-lg" />
            <Skeleton className="h-12 w-full sm:w-1/2 rounded-lg" />
          </div>

          {/* Wishlist & Share */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-32 rounded-lg" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

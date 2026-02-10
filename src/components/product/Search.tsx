"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  className?: string;
}

export default function ProductSearch({
  value,
  onChange,
  onSubmit,
  className = "",
}: Props) {
  return (
    <div className={`flex flex-1 max-w-md ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="relative w-full"
      >
        <input
          type="search"
          placeholder="Search products..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border rounded-full"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </form>
    </div>
  );
}

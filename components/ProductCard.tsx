"use client";

import Image from "next/image";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <div className="relative aspect-square w-full bg-neutral-100 dark:bg-neutral-800">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
          unoptimized
        />
        {!product.inStock && (
          <span className="absolute top-2 left-2 rounded bg-red-600 px-2 py-1 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-neutral-500">{product.category}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
          {"★".repeat(Math.round(product.rating))}
          {"☆".repeat(5 - Math.round(product.rating))}
          <span className="ml-1 text-neutral-500">
            {product.rating.toFixed(1)}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-base font-bold">
            ${product.price.toFixed(2)}
          </span>
          <button
            disabled={!product.inStock}
            onClick={() => addToCart(product)}
            className="rounded bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

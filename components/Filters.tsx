"use client";

import { CATEGORIES } from "@/lib/products";

interface FiltersProps {
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  inStockOnly: boolean;
  onInStockOnlyChange: (value: boolean) => void;
  onReset: () => void;
  maxPrice: number;
}

export default function Filters({
  selectedCategories,
  onToggleCategory,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockOnlyChange,
  onReset,
  maxPrice,
}: FiltersProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Filters</h2>
        <button
          onClick={onReset}
          className="text-xs text-neutral-500 hover:underline"
        >
          Reset
        </button>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase text-neutral-500">
          Category
        </h3>
        <ul className="space-y-2">
          {CATEGORIES.map((category) => (
            <li key={category}>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => onToggleCategory(category)}
                  className="h-4 w-4 rounded border-neutral-400"
                />
                {category}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase text-neutral-500">
          Price Range
        </h3>
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
        <input
          type="range"
          min={0}
          max={maxPrice}
          value={priceRange[1]}
          onChange={(e) =>
            onPriceRangeChange([priceRange[0], Number(e.target.value)])
          }
          className="mt-1 w-full"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockOnlyChange(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-400"
          />
          In stock only
        </label>
      </div>
    </div>
  );
}

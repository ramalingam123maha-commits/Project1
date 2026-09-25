"use client";

import { useMemo, useState } from "react";
import { PRODUCTS } from "@/lib/products";
import { SortOption } from "@/lib/types";
import Filters from "./Filters";
import SortSelect from "./SortSelect";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

const PAGE_SIZE = 12;
const MAX_PRICE = Math.ceil(Math.max(...PRODUCTS.map((p) => p.price)));

export default function ProductCatalog() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    MAX_PRICE,
  ]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, MAX_PRICE]);
    setInStockOnly(false);
    setPage(1);
  };

  const filtered = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category)
      ) {
        return false;
      }
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      if (inStockOnly && !product.inStock) {
        return false;
      }
      return true;
    });
  }, [selectedCategories, priceRange, inStockOnly]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "rating-desc":
        return list.sort((a, b) => b.rating - a.rating);
      case "name-asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <Filters
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            priceRange={priceRange}
            onPriceRangeChange={(range) => {
              setPriceRange(range);
              setPage(1);
            }}
            inStockOnly={inStockOnly}
            onInStockOnlyChange={(value) => {
              setInStockOnly(value);
              setPage(1);
            }}
            onReset={resetFilters}
            maxPrice={MAX_PRICE}
          />
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-neutral-500">
              {sorted.length} product{sorted.length !== 1 && "s"}
            </p>
            <SortSelect
              value={sort}
              onChange={(value) => {
                setSort(value);
                setPage(1);
              }}
            />
          </div>

          {paginated.length === 0 ? (
            <p className="py-16 text-center text-sm text-neutral-500">
              No products match your filters.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {paginated.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}

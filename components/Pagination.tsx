"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="rounded border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-600"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={`rounded border px-3 py-1.5 text-sm dark:border-neutral-600 ${
            p === page
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="rounded border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-600"
      >
        Next
      </button>
    </nav>
  );
}

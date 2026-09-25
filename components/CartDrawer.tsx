"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md transform bg-white shadow-xl transition-transform dark:bg-neutral-900 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4 dark:border-neutral-700">
            <h2 className="text-lg font-semibold">Your Cart</h2>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="rounded p-2 text-xl leading-none hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <p className="text-sm text-neutral-500">Your cart is empty.</p>
            ) : (
              <ul className="space-y-4">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-neutral-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-neutral-500">
                        ${product.price.toFixed(2)}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          className="h-6 w-6 rounded border text-sm dark:border-neutral-600"
                          onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                          }
                          aria-label={`Decrease quantity of ${product.name}`}
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm">
                          {quantity}
                        </span>
                        <button
                          className="h-6 w-6 rounded border text-sm dark:border-neutral-600"
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                          aria-label={`Increase quantity of ${product.name}`}
                        >
                          +
                        </button>
                        <button
                          className="ml-auto text-xs text-red-600 hover:underline"
                          onClick={() => removeFromCart(product.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t p-4 dark:border-neutral-700">
              <div className="mb-3 flex items-center justify-between text-sm font-semibold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <button className="w-full rounded bg-black py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200">
                Checkout
              </button>
              <button
                onClick={clearCart}
                className="mt-2 w-full rounded border py-2 text-sm hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-800"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

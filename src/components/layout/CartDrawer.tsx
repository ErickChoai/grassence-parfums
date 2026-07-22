"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash, ShoppingBagOpen } from "@phosphor-icons/react/dist/ssr";
import { useCartStore, cartSubtotalCents } from "@/lib/cart-store";
import { formatBRL } from "@/lib/format";
import { BottleArt } from "@/components/ui/BottleArt";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = cartSubtotalCents(items);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Sacola de compras"
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-display text-xl">Sua sacola</h2>
              <button
                onClick={close}
                aria-label="Fechar sacola"
                className="cursor-pointer p-1 text-foreground/70 hover:text-foreground"
              >
                <X size={22} weight="light" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBagOpen size={48} weight="thin" className="text-muted-foreground" />
                <p className="text-muted-foreground">Sua sacola está vazia.</p>
                <button
                  onClick={close}
                  className="link-underline text-sm uppercase tracking-[0.1em] text-accent"
                >
                  Continuar explorando
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6 py-4">
                  {items.map((item) => (
                    <li
                      key={item.variantId}
                      className="flex gap-4 border-b border-border py-5 last:border-b-0"
                    >
                      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
                        <BottleArt seed={item.variantId} className="h-full w-full" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                              {item.brand}
                            </p>
                            <p className="font-display text-base leading-tight">{item.productName}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{item.sizeMl}ml</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            aria-label="Remover item"
                            className="cursor-pointer p-1 text-muted-foreground hover:text-destructive"
                          >
                            <Trash size={16} weight="light" />
                          </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1">
                            <button
                              aria-label="Diminuir quantidade"
                              onClick={() => setQuantity(item.variantId, item.quantity - 1)}
                              className="cursor-pointer text-foreground/70 hover:text-foreground"
                            >
                              <Minus size={14} weight="bold" />
                            </button>
                            <span className="w-4 text-center text-sm">{item.quantity}</span>
                            <button
                              aria-label="Aumentar quantidade"
                              onClick={() => setQuantity(item.variantId, item.quantity + 1)}
                              className="cursor-pointer text-foreground/70 hover:text-foreground"
                            >
                              <Plus size={14} weight="bold" />
                            </button>
                          </div>
                          <p className="text-sm font-medium">
                            {formatBRL(item.priceCents * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border px-6 py-6">
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-display text-lg">{formatBRL(subtotal)}</span>
                  </div>
                  <p className="mb-4 text-xs text-muted-foreground">
                    Frete e prazo calculados no checkout.
                  </p>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="flex w-full items-center justify-center bg-primary px-6 py-4 text-sm uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Finalizar compra
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

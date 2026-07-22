"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Minus, Plus, ShoppingBagOpen, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { useCartStore } from "@/lib/cart-store";
import { formatBRL } from "@/lib/format";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { ProductView } from "@/lib/types";

export function PurchasePanel({ product }: { product: ProductView }) {
  const [variantId, setVariantId] = useState(product.variants[1]?.id ?? product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const outOfStock = !variant || variant.stock <= 0;

  function handleAddToCart() {
    if (!variant || outOfStock) return;
    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      brand: product.brand,
      variantId: variant.id,
      sizeMl: variant.sizeMl,
      priceCents: variant.priceCents,
      quantity,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <div>
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground/50">
          Tamanho
        </p>
        <div className="flex gap-3">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setVariantId(v.id)}
              disabled={v.stock <= 0}
              className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
                variantId === v.id
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-primary-foreground/25 text-primary-foreground hover:border-accent"
              }`}
            >
              <span className="block font-medium">{v.sizeMl}ml</span>
              <span className="block text-xs opacity-80">{formatBRL(v.priceCents)}</span>
            </button>
          ))}
        </div>
        {variant && variant.stock > 0 && variant.stock <= 5 && (
          <p className="mt-2 text-xs text-accent">Só restam {variant.stock} unidades neste tamanho.</p>
        )}
        {outOfStock && (
          <p className="mt-2 text-xs text-destructive">Tamanho esgotado no momento.</p>
        )}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex items-center gap-4 rounded-full border border-primary-foreground/25 px-3 py-2">
          <button
            aria-label="Diminuir quantidade"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="cursor-pointer text-primary-foreground/70 hover:text-primary-foreground"
          >
            <Minus size={16} weight="bold" />
          </button>
          <span className="w-5 text-center text-primary-foreground">{quantity}</span>
          <button
            aria-label="Aumentar quantidade"
            onClick={() => setQuantity((q) => q + 1)}
            className="cursor-pointer text-primary-foreground/70 hover:text-primary-foreground"
          >
            <Plus size={16} weight="bold" />
          </button>
        </div>
        <p className="font-display text-2xl text-primary-foreground">
          {variant ? formatBRL(variant.priceCents * quantity) : "R$ 0,00"}
        </p>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={outOfStock}
        className="relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-primary-foreground px-8 py-4 text-sm uppercase tracking-[0.14em] text-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <AnimatePresence mode="wait" initial={false}>
          {justAdded ? (
            <motion.span
              key="added"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2"
            >
              <Check size={18} weight="bold" /> Adicionado à sacola
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2"
            >
              <ShoppingBagOpen size={18} weight="light" /> Adicionar à sacola
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <a
        href={buildWhatsAppLink(
          `Olá! Quero saber mais sobre o perfume ${product.name} (${product.brand}) da Grassence Parfums.`
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-primary-foreground/30 px-8 py-3.5 text-sm uppercase tracking-[0.12em] text-primary-foreground/80 transition-colors hover:border-accent hover:text-accent"
      >
        <WhatsappLogo size={18} weight="light" />
        Quero saber mais no WhatsApp
      </a>
    </div>
  );
}

import Link from "next/link";
import { BottleArt } from "@/components/ui/BottleArt";
import { formatBRL } from "@/lib/format";
import type { ProductView } from "@/lib/types";

const GENDER_LABEL: Record<ProductView["gender"], string> = {
  MASCULINO: "Masculino",
  FEMININO: "Feminino",
  UNISSEX: "Unissex",
};

export function ProductCard({ product }: { product: ProductView; index?: number }) {
  const minPrice = Math.min(...product.variants.map((v) => v.priceCents));

  return (
    <Link
      href={`/loja/${product.slug}`}
      className="group block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface-muted shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow duration-500 group-hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]">
        <BottleArt
          seed={product.slug}
          className="h-full w-full scale-100 p-8 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:-rotate-2"
        />
        <span className="absolute left-3 top-3 rounded-full border border-border-strong/60 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-foreground/80 backdrop-blur-sm">
          {GENDER_LABEL[product.gender]}
        </span>
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-background/95 to-transparent p-4 text-center text-xs uppercase tracking-[0.12em] text-foreground opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
          Ver detalhes
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{product.brand}</p>
        <h3 className="mt-1 font-display text-lg leading-tight text-foreground transition-colors duration-300 group-hover:text-accent">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{product.family}</p>
        <p className="mt-2 text-sm text-accent">A partir de {formatBRL(minPrice)}</p>
      </div>
    </Link>
  );
}

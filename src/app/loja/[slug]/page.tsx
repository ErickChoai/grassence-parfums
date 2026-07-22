import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { getProductBySlug, getRelatedProducts } from "@/lib/products-data";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { SITE_URL, SITE_NAME } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const GENDER_LABEL: Record<string, string> = {
  MASCULINO: "Masculino",
  FEMININO: "Feminino",
  UNISSEX: "Unissex",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Perfume não encontrado" };
  return {
    title: `${product.name} · ${product.brand}`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const gallerySeeds = [product.slug, `${product.slug}-face`, `${product.slug}-detalhe`];

  const minPrice = Math.min(...product.variants.map((v) => v.priceCents));
  const inStock = product.variants.some((v) => v.stock > 0);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Decant de ${product.name}`,
    brand: { "@type": "Brand", name: product.brand },
    category: product.family,
    description: product.description,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BRL",
      lowPrice: (minPrice / 100).toFixed(2),
      highPrice: (Math.max(...product.variants.map((v) => v.priceCents)) / 100).toFixed(2),
      offerCount: product.variants.length,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE_NAME },
      url: `${SITE_URL}/loja/${product.slug}`,
    },
  };

  return (
    <div className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <AmbientBackground variant="subtle" className="opacity-60" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16">
        <nav className="mb-8 hidden items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground sm:flex">
          <Link href="/loja" className="hover:text-foreground">
            Loja
          </Link>
          <CaretRight size={12} />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2 lg:items-start lg:gap-10">
          <Reveal className="lg:sticky lg:top-24">
            <ProductGallery seeds={gallerySeeds} />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative z-20 -mt-12 grain overflow-hidden rounded-3xl bg-primary px-6 pb-9 pt-9 text-primary-foreground shadow-[0_-10px_40px_-18px_rgba(0,0,0,0.4)] sm:-mt-8 sm:px-9 lg:mt-0 lg:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.5)]">
              <p className="text-xs uppercase tracking-[0.16em] text-accent">
                {GENDER_LABEL[product.gender]} · {product.family}
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.14em] text-primary-foreground/55">
                {product.brand}
              </p>
              <h1 className="mt-1 font-display text-4xl sm:text-5xl">{product.name}</h1>
              <p className="mt-5 leading-relaxed text-primary-foreground/75">{product.description}</p>

              <dl className="mt-8 space-y-3 border-y border-primary-foreground/15 py-6 text-sm">
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-primary-foreground/50">Saída</dt>
                  <dd className="text-primary-foreground/90">{product.topNotes}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-primary-foreground/50">Coração</dt>
                  <dd className="text-primary-foreground/90">{product.heartNotes}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-primary-foreground/50">Fundo</dt>
                  <dd className="text-primary-foreground/90">{product.baseNotes}</dd>
                </div>
              </dl>

              <div className="mt-8">
                <PurchasePanel product={product} />
              </div>

              <p className="mt-6 text-xs text-primary-foreground/45">
                Decant fracionado à mão a partir do frasco original, envasado em vidro âmbar com
                atomizador. Não comercializamos frascos completos nem produtos falsificados.
              </p>
            </div>
          </Reveal>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-8 font-display text-2xl">Você também pode gostar</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

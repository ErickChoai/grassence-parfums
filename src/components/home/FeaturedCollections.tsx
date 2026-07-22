import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { getFeaturedProducts } from "@/lib/products-data";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { HoverSpotlight } from "@/components/ui/HoverSpotlight";

export async function FeaturedCollections() {
  // A home é a página mais importante do site: se o banco estiver indisponível,
  // é melhor renderizar o resto dela do que devolver erro na página inteira.
  let products: Awaited<ReturnType<typeof getFeaturedProducts>> = [];
  try {
    products = await getFeaturedProducts(4);
  } catch (error) {
    console.error("Falha ao carregar os destaques da home:", error);
  }
  if (products.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      <HoverSpotlight />
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent">Seleção Grassence</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">Destaques da temporada</h2>
            </div>
            <Link
              href="/loja"
              className="link-underline inline-flex items-center gap-2 text-sm uppercase tracking-[0.1em] text-foreground/80 hover:text-foreground"
            >
              Ver catálogo completo <ArrowRight size={16} weight="light" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.08}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

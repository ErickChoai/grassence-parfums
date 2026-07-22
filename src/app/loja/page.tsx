import type { Metadata } from "next";
import { getAllBrands, getAllFamilies, getFilteredProducts } from "@/lib/products-data";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { WhatsAppCTA } from "@/components/shop/WhatsAppCTA";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import type { Gender } from "@/lib/types";

const GENDER_LABEL: Record<string, string> = {
  MASCULINO: "masculinos",
  FEMININO: "femininos",
  UNISSEX: "unissex e de nicho",
};

export const metadata: Metadata = {
  title: "Loja",
  description: "Explore nosso catálogo de decants de perfumaria fina: masculinos, femininos e unissex.",
};

interface PageProps {
  searchParams: Promise<{
    genero?: string;
    marca?: string;
    familia?: string;
    busca?: string;
    ordenar?: string;
  }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const gender = (params.genero as Gender) || undefined;

  const [products, brands, families] = await Promise.all([
    getFilteredProducts({
      gender,
      brand: params.marca || undefined,
      family: params.familia || undefined,
      search: params.busca || undefined,
      sort: (params.ordenar as never) || "relevancia",
    }),
    getAllBrands(),
    getAllFamilies(),
  ]);

  const contextLabel = params.marca || (gender ? GENDER_LABEL[gender] : null) || (params.familia ?? null);
  const ctaMessage = contextLabel
    ? `Olá! Estava vendo os perfumes ${contextLabel.match(/^[A-Z]/) ? "da marca " + contextLabel : contextLabel} na Grassence Parfums e queria mais informações.`
    : "Olá! Estava vendo o catálogo da Grassence Parfums e queria mais informações.";

  return (
    <div className="relative overflow-hidden">
      <AmbientBackground variant="subtle" className="opacity-70" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Catálogo</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Todos os perfumes</h1>
          <p className="mt-4 text-muted-foreground">
            {products.length} {products.length === 1 ? "perfume disponível" : "perfumes disponíveis"} em
            decants de 2ml, 5ml e 10ml.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <ShopFilters brands={brands} families={families} />

          <div className="lg:col-span-9">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                <p className="font-display text-xl">Nenhum perfume encontrado</p>
                <p className="text-sm text-muted-foreground">
                  Tente ajustar os filtros ou buscar por outro termo.
                </p>
              </div>
            ) : (
              <>
                <ProductGrid products={products} />

                <div className="mt-16">
                  <WhatsAppCTA
                    title="Não achou o perfume que procurava?"
                    text="Fale com a gente pelo WhatsApp. Ajudamos a encontrar o decant ideal."
                    message={ctaMessage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

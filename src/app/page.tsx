import { ShieldCheck, Truck, Drop, Lock } from "@phosphor-icons/react/dist/ssr";
import { Hero } from "@/components/home/Hero";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { BrandStory } from "@/components/home/BrandStory";
import { Newsletter } from "@/components/home/Newsletter";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { HoverSpotlight } from "@/components/ui/HoverSpotlight";

// Renderiza a cada request em vez de pré-renderizar no build. Isso desacopla o
// deploy do banco (o build nunca falha por indisponibilidade) e mantém os
// destaques refletindo estoque e preço atuais.
export const dynamic = "force-dynamic";

const USPS = [
  {
    icon: ShieldCheck,
    title: "Autenticidade garantida",
    text: "Fracionado a partir de frascos originais, com rastreabilidade de lote.",
  },
  {
    icon: Drop,
    title: "A partir de 2ml",
    text: "Experimente antes de investir no frasco cheio.",
  },
  {
    icon: Truck,
    title: "Envio para todo o Brasil",
    text: "Despachamos de Florianópolis com embalagem protegida.",
  },
  {
    icon: Lock,
    title: "Pagamento seguro",
    text: "Checkout protegido via Mercado Pago: Pix, boleto ou cartão.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandMarquee />

      <section className="relative overflow-hidden border-b border-border bg-surface">
        <HoverSpotlight />
        <StaggerGroup className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-12 sm:px-8 md:grid-cols-4">
          {USPS.map((usp) => (
            <StaggerItem
              key={usp.title}
              className="flex flex-col items-start gap-3 rounded-2xl p-4 transition-all duration-500 hover:-translate-y-1 hover:bg-background/70"
            >
              <usp.icon size={24} weight="light" className="text-accent" />
              <p className="text-sm font-medium">{usp.title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{usp.text}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <FeaturedCollections />
      <BrandStory />
      <Newsletter />
    </>
  );
}

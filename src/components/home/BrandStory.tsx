import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { BottleArt } from "@/components/ui/BottleArt";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { HoverSpotlight } from "@/components/ui/HoverSpotlight";
import { ParallaxY } from "@/components/ui/Motion";

export function BrandStory() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-surface">
      <AmbientBackground variant="subtle" />
      <HoverSpotlight />
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Nossa história</p>
          <h2 className="text-balance mt-4 font-display text-3xl sm:text-4xl">
            Uma ilha, um ofício, uma coleção viva.
          </h2>
          <p className="mt-6 leading-relaxed text-foreground/80">
            A Grassence nasceu em Florianópolis com uma ideia simples: perfumaria de
            nicho e de design não deveria custar um frasco inteiro para ser
            descoberta. Selecionamos fragrâncias autênticas, fracionamos à mão em
            pequenos lotes e cuidamos de cada detalhe do envase, do vidro âmbar ao
            lacre, para que a experiência chegue intacta até você.
          </p>
          <p className="mt-4 leading-relaxed text-foreground/80">
            Cada decant é testado antes do envio. Não vendemos réplicas, apenas
            frações de perfumes originais, com rastreabilidade de lote e validade
            informada.
          </p>
          <Link
            href="/sobre"
            className="link-underline mt-8 inline-block text-sm uppercase tracking-[0.12em] text-foreground"
          >
            Conheça o processo completo
          </Link>
        </Reveal>

        <Reveal delay={0.15} className="order-1 lg:order-2">
          <div className="grid grid-cols-2 gap-4">
            <ParallaxY from={36} to={-16}>
              <div className="aspect-[3/4] rounded-2xl bg-surface-muted">
                <BottleArt seed="story-a" className="h-full w-full p-8" />
              </div>
            </ParallaxY>
            <ParallaxY from={-16} to={36}>
              <div className="aspect-[3/4] rounded-2xl bg-surface-muted">
                <BottleArt seed="story-b" className="h-full w-full p-8" />
              </div>
            </ParallaxY>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

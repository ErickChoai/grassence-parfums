import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { BottleArt } from "@/components/ui/BottleArt";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { HoverSpotlight } from "@/components/ui/HoverSpotlight";
import { Floating, ParallaxY } from "@/components/ui/Motion";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a história e o processo da Grassence Parfums, decants de perfumaria fina em Florianópolis.",
};

const STEPS = [
  {
    title: "Curadoria",
    text: "Selecionamos fragrâncias autênticas de design e nicho, priorizando lotes recentes e procedência verificada.",
  },
  {
    title: "Fracionamento",
    text: "Cada decant é envasado à mão, em ambiente controlado, com frascos de vidro âmbar e atomizador de qualidade.",
  },
  {
    title: "Controle de qualidade",
    text: "Testamos a fixação e a projeção de cada lote antes de disponibilizá-lo na loja.",
  },
  {
    title: "Envio cuidadoso",
    text: "Embalagem protegida contra quebras e vazamentos, despachada de Florianópolis para todo o Brasil.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <AmbientBackground />
      <HoverSpotlight />
      <div className="relative z-10 mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Sobre a Grassence</p>
          <h1 className="text-balance mt-4 font-display text-4xl sm:text-5xl">
            Perfumaria fina não deveria caber só em quem pode comprar o frasco inteiro.
          </h1>
          <p className="mt-6 leading-relaxed text-foreground/80">
            A Grassence Parfums nasceu em Florianópolis, Santa Catarina, do desejo de aproximar
            a perfumaria de nicho e de design de quem ama perfume, mas quer experimentar antes de
            investir em um frasco de 100ml. Trabalhamos com decants, pequenas frações de
            perfumes originais, para que você conheça fragrâncias como Baccarat Rouge 540,
            Delina ou Aventus sem comprometer o orçamento em uma única compra.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-16">
          <ParallaxY from={30} to={-30}>
            <div className="aspect-[21/9] overflow-hidden rounded-3xl bg-surface-muted">
              <Floating amplitude={7} duration={8} className="h-full w-full">
                <BottleArt seed="sobre-hero" className="h-full w-full p-16" />
              </Floating>
            </div>
          </ParallaxY>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-2">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="group rounded-2xl border border-transparent p-4 transition-all duration-500 hover:-translate-y-1 hover:border-border hover:bg-surface/60 hover:shadow-[0_18px_40px_-28px_rgba(0,0,0,0.3)]">
                <p className="font-display text-2xl text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-2 font-display text-xl">{step.title}</h2>
                <p className="mt-2 leading-relaxed text-foreground/75">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-20 border-t border-border pt-10">
          <h2 className="font-display text-2xl">Transparência é o nosso perfume favorito</h2>
          <p className="mt-4 leading-relaxed text-foreground/80">
            Não vendemos frascos completos das marcas, nem réplicas ou produtos falsificados.
            Trabalhamos exclusivamente com o fracionamento de perfumes originais, sempre deixando
            claro que a Grassence não é afiliada, patrocinada ou endossada pelas marcas
            mencionadas em nosso catálogo.
          </p>
        </Reveal>
      </div>
    </div>
  );
}

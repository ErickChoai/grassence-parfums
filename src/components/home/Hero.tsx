"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowDown, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { BottleArt } from "@/components/ui/BottleArt";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { Floating, ParallaxY, usePrefersReducedMotion } from "@/components/ui/Motion";

const ease = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

function StaggerWords({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <motion.span key={`${w}-${i}`} variants={word} className="inline-block">
          {w}
          {" "}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <AmbientBackground />
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-2 lg:pt-24">
        <div className="relative z-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="text-xs uppercase tracking-[0.24em] text-accent"
          >
            Florianópolis · Santa Catarina
          </motion.p>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={container}
            className="text-balance mt-5 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
          >
            <StaggerWords text="Perfumaria fina," className="block" />
            <StaggerWords text="em doses de" className="block" />
            <motion.span
              variants={word}
              className="block whitespace-nowrap italic text-accent lg:text-[1.14em]"
            >
              descoberta.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease }}
            className="mt-6 max-w-md text-lg leading-relaxed text-foreground/75"
          >
            Decants selecionados das grandes maisons e casas de nicho, fracionados
            à mão em Florianópolis. Experimente antes de investir no frasco cheio.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/loja"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explorar coleção
              <ArrowRight
                size={16}
                weight="light"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/sobre"
              className="link-underline text-sm uppercase tracking-[0.12em] text-foreground/80 hover:text-foreground"
            >
              Nossa história
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <ParallaxY from={24} to={-24} className="h-full w-full">
            <div className="grain absolute inset-0 rounded-full bg-surface-muted" />
            <Floating amplitude={9} duration={7} className="relative h-full w-full">
              <BottleArt seed="grassence-hero" className="h-full w-full p-16" />
            </Floating>
          </ParallaxY>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="relative z-10 hidden justify-center pb-10 text-muted-foreground sm:flex"
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={20} weight="light" />
        </motion.div>
      </motion.div>
    </section>
  );
}

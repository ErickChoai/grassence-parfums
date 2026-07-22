"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);
  return reduced;
}

interface FloatingProps {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

/** Flutuação vertical contínua e suave (desligada para quem prefere menos movimento). */
export function Floating({ children, className, amplitude = 10, duration = 7 }: FloatingProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      animate={reduced ? undefined : { y: [-amplitude, amplitude, -amplitude] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxYProps {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
}

/** Deslocamento vertical atrelado ao scroll: profundidade sem exagero. */
export function ParallaxY({ children, className, from = 40, to = -40 }: ParallaxYProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

"use client";

import { useRef, type CSSProperties } from "react";

interface HoverSpotlightProps {
  className?: string;
  /** Cor do brilho (usa a variável de acento por padrão). */
  color?: string;
  size?: number;
}

/**
 * Camada de brilho radial que acompanha o cursor dentro da seção-pai.
 * Deve ser colocada dentro de um elemento `position: relative`.
 * Dá uma sensação viva de movimento ao passar o mouse sobre cada seção.
 */
export function HoverSpotlight({
  className,
  color = "color-mix(in srgb, var(--c-accent) 45%, transparent)",
  size = 420,
}: HoverSpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--sy", `${e.clientY - rect.top}px`);
    el.style.opacity = "1";
  }

  function handleLeave() {
    if (ref.current) ref.current.style.opacity = "0";
  }

  const style: CSSProperties = {
    background: `radial-gradient(${size}px circle at var(--sx, 50%) var(--sy, 50%), ${color}, transparent 65%)`,
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`pointer-events-auto absolute inset-0 opacity-0 transition-opacity duration-500 ${className ?? ""}`}
      style={style}
    />
  );
}

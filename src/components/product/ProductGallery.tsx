"use client";

import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { BottleArt } from "@/components/ui/BottleArt";
import { Floating } from "@/components/ui/Motion";

interface ProductGalleryProps {
  seeds: string[];
}

export function ProductGallery({ seeds }: ProductGalleryProps) {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);

  function go(nextIndex: number) {
    if (nextIndex < 0 || nextIndex >= seeds.length || nextIndex === index) return;
    setIndex([nextIndex, nextIndex > index ? 1 : -1]);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -50) go(index + 1);
    else if (info.offset.x > 50) go(index - 1);
  }

  return (
    <div className="relative aspect-square touch-pan-y overflow-hidden rounded-3xl bg-surface-muted">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={seeds[index]}
          custom={direction}
          initial={{ x: direction >= 0 ? "100%" : "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction >= 0 ? "-100%" : "100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          drag={seeds.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 flex cursor-grab items-center justify-center p-12 active:cursor-grabbing md:p-20"
        >
          <Floating amplitude={8} duration={6.5} className="h-full w-full">
            <BottleArt seed={seeds[index]} className="h-full w-full" />
          </Floating>
        </motion.div>
      </AnimatePresence>

      {seeds.length > 1 && (
        <div className="absolute left-5 top-1/2 flex -translate-y-1/2 flex-col gap-2.5">
          {seeds.map((seed, i) => (
            <button
              key={seed}
              onClick={() => go(i)}
              aria-label={`Ver imagem ${i + 1} de ${seeds.length}`}
              aria-current={i === index}
              className={`w-2 cursor-pointer rounded-full transition-all duration-300 ${
                i === index ? "h-6 bg-accent" : "h-2 bg-border-strong hover:bg-accent-soft"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

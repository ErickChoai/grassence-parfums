"use client";

import { useId } from "react";

const PALETTES = [
  { from: "#3a2e1c", to: "#c9a25c", liquid: "#8a6a34" },
  { from: "#2a1518", to: "#8a4a4f", liquid: "#5c2a2f" },
  { from: "#20241c", to: "#6f7a52", liquid: "#454d30" },
  { from: "#171310", to: "#9c9284", liquid: "#4a4438" },
  { from: "#1c1a24", to: "#5c5a7a", liquid: "#38364a" },
  { from: "#241812", to: "#b07a4a", liquid: "#6b4526" },
];

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface BottleArtProps {
  seed: string;
  className?: string;
}

export function BottleArt({ seed, className }: BottleArtProps) {
  const uid = useId().replace(/:/g, "");
  const hash = hashString(seed);
  const shape = hash % 4;
  const palette = PALETTES[hash % PALETTES.length];
  const gradId = `grad-${uid}`;
  const liquidId = `liquid-${uid}`;

  return (
    <svg
      viewBox="0 0 240 320"
      className={className}
      role="img"
      aria-label="Ilustração do frasco de perfume"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.from} />
          <stop offset="100%" stopColor={palette.to} />
        </linearGradient>
        <linearGradient id={liquidId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.liquid} stopOpacity="0.85" />
          <stop offset="100%" stopColor={palette.liquid} stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {shape === 0 && (
        <g>
          <rect x="70" y="40" width="40" height="28" rx="4" fill={`url(#${gradId})`} opacity="0.9" />
          <rect x="60" y="66" width="60" height="16" rx="3" fill={palette.to} opacity="0.5" />
          <rect x="50" y="82" width="140" height="200" rx="18" fill={`url(#${gradId})`} />
          <rect x="62" y="150" width="116" height="110" rx="10" fill={`url(#${liquidId})`} />
          <rect x="70" y="180" width="100" height="1" fill={palette.to} opacity="0.4" />
        </g>
      )}

      {shape === 1 && (
        <g>
          <rect x="100" y="34" width="40" height="14" rx="3" fill={palette.to} opacity="0.7" />
          <path
            d="M75 55 L165 55 L185 130 L185 260 Q185 280 165 280 L75 280 Q55 280 55 260 L55 130 Z"
            fill={`url(#${gradId})`}
          />
          <path
            d="M62 170 L178 170 L178 260 Q178 273 165 273 L75 273 Q62 273 62 260 Z"
            fill={`url(#${liquidId})`}
          />
        </g>
      )}

      {shape === 2 && (
        <g>
          <rect x="105" y="30" width="30" height="24" rx="4" fill={palette.to} opacity="0.7" />
          <ellipse cx="120" cy="180" rx="85" ry="100" fill={`url(#${gradId})`} />
          <path
            d="M35 190 a85 100 0 0 0 170 0 Z"
            fill={`url(#${liquidId})`}
          />
        </g>
      )}

      {shape === 3 && (
        <g>
          <rect x="95" y="26" width="50" height="20" rx="8" fill={palette.to} opacity="0.7" />
          <path
            d="M60 60 L180 60 L195 100 L195 250 Q195 285 160 285 L80 285 Q45 285 45 250 L45 100 Z"
            fill={`url(#${gradId})`}
          />
          <rect x="52" y="160" width="136" height="118" rx="14" fill={`url(#${liquidId})`} />
          <rect x="65" y="70" width="110" height="26" rx="4" fill="none" stroke={palette.to} strokeOpacity="0.5" />
        </g>
      )}
    </svg>
  );
}

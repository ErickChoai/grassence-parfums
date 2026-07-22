const BRANDS = [
  "Dior",
  "Chanel",
  "Creed",
  "Tom Ford",
  "Le Labo",
  "Byredo",
  "Parfums de Marly",
  "Maison Francis Kurkdjian",
  "Amouage",
  "Xerjoff",
  "Yves Saint Laurent",
  "Frederic Malle",
];

export function BrandMarquee() {
  // Conteúdo duplicado para o loop do marquee fechar sem emenda visível
  const items = [...BRANDS, ...BRANDS];

  return (
    <div className="marquee border-y border-border bg-surface py-5" aria-hidden="true">
      <div className="marquee-track">
        {items.map((brand, i) => (
          <span key={`${brand}-${i}`} className="flex items-center">
            <span className="mx-8 font-display text-lg italic text-foreground/60 sm:mx-10 sm:text-xl">
              {brand}
            </span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent/50" />
          </span>
        ))}
      </div>
    </div>
  );
}

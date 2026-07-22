import Link from "next/link";
import {
  InstagramLogo,
  WhatsappLogo,
  EnvelopeSimple,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const columns = [
  {
    title: "Loja",
    links: [
      { label: "Todos os perfumes", href: "/loja" },
      { label: "Masculinos", href: "/loja?genero=MASCULINO" },
      { label: "Femininos", href: "/loja?genero=FEMININO" },
      { label: "Unissex & Nicho", href: "/loja?genero=UNISSEX" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { label: "Sobre a Grassence", href: "/sobre" },
      { label: "Perguntas frequentes", href: "/perguntas-frequentes" },
      { label: "Trocas e devoluções", href: "/politica-de-trocas" },
      { label: "Contato", href: "/contato" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-2xl tracking-[0.08em]">GRASSENCE</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Decants selecionados de perfumaria fina, do design ao nicho,
              fracionados à mão em Florianópolis, Santa Catarina.
            </p>
            <div className="mt-6 flex items-center gap-4 text-muted-foreground">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Grassence Parfums"
                className="transition-colors hover:text-accent"
              >
                <InstagramLogo size={20} weight="light" />
              </a>
              <a
                href={buildWhatsAppLink("Olá! Vim pelo site da Grassence Parfums e gostaria de mais informações.")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp da Grassence Parfums"
                className="transition-colors hover:text-accent"
              >
                <WhatsappLogo size={20} weight="light" />
              </a>
              <a
                href="mailto:contato@grassenceparfums.com.br"
                aria-label="E-mail da Grassence Parfums"
                className="transition-colors hover:text-accent"
              >
                <EnvelopeSimple size={20} weight="light" />
              </a>
            </div>
            <div className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin size={18} weight="light" className="mt-0.5 shrink-0" />
              <span>Florianópolis, Santa Catarina, Brasil</span>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="link-underline text-sm text-foreground/80 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Grassence Parfums. Todos os direitos reservados.</p>
          <p>Decants fracionados a partir de frascos originais. Não somos afiliados às marcas citadas.</p>
        </div>
      </div>
    </footer>
  );
}

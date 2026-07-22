import type { Metadata } from "next";
import { WhatsappLogo, InstagramLogo, EnvelopeSimple, MapPin } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Grassence Parfums em Florianópolis, Santa Catarina.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Fale com a gente</p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">Contato</h1>
        <p className="mt-4 max-w-xl text-foreground/75">
          Dúvidas sobre uma fragrância, seu pedido ou parcerias? Estamos por aqui.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-2">
        <Reveal delay={0.08}>
          <ContactForm />
        </Reveal>

        <Reveal delay={0.14} className="space-y-6">
          <a
            href={buildWhatsAppLink("Olá! Vim pelo site da Grassence Parfums e gostaria de mais informações.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 border border-border p-5 transition-colors hover:border-accent"
          >
            <WhatsappLogo size={22} weight="light" className="mt-0.5 text-accent" />
            <div>
              <p className="font-medium">WhatsApp</p>
              <p className="text-sm text-muted-foreground">Resposta rápida em horário comercial</p>
            </div>
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 border border-border p-5 transition-colors hover:border-accent"
          >
            <InstagramLogo size={22} weight="light" className="mt-0.5 text-accent" />
            <div>
              <p className="font-medium">Instagram</p>
              <p className="text-sm text-muted-foreground">@grassenceparfums</p>
            </div>
          </a>

          <a
            href="mailto:contato@grassenceparfums.com.br"
            className="flex items-start gap-4 border border-border p-5 transition-colors hover:border-accent"
          >
            <EnvelopeSimple size={22} weight="light" className="mt-0.5 text-accent" />
            <div>
              <p className="font-medium">E-mail</p>
              <p className="text-sm text-muted-foreground">contato@grassenceparfums.com.br</p>
            </div>
          </a>

          <div className="flex items-start gap-4 border border-border p-5">
            <MapPin size={22} weight="light" className="mt-0.5 text-accent" />
            <div>
              <p className="font-medium">Localização</p>
              <p className="text-sm text-muted-foreground">Florianópolis, Santa Catarina, Brasil</p>
              <p className="text-sm text-muted-foreground">Loja online, com retirada combinada por WhatsApp.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

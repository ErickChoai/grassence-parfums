import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { buildWhatsAppLink } from "@/lib/whatsapp";

interface WhatsAppCTAProps {
  title: string;
  text: string;
  message: string;
  buttonLabel?: string;
}

export function WhatsAppCTA({ title, text, message, buttonLabel = "Falar no WhatsApp" }: WhatsAppCTAProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-sm border border-border bg-surface px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
      <div>
        <p className="font-display text-xl">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      </div>
      <a
        href={buildWhatsAppLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex shrink-0 items-center justify-center gap-2 bg-primary px-6 py-3.5 text-sm uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-90"
      >
        <WhatsappLogo size={18} weight="light" />
        {buttonLabel}
      </a>
    </div>
  );
}

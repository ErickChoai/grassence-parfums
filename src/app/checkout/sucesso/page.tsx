import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Pedido confirmado",
};

interface PageProps {
  searchParams: Promise<{ pedido?: string; pendente?: string; aviso?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { pedido, pendente, aviso } = await searchParams;

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center sm:py-32">
      <CheckCircle size={56} weight="light" className="text-accent" />
      <h1 className="mt-6 font-display text-3xl sm:text-4xl">
        {pendente ? "Pagamento em análise" : "Pedido recebido!"}
      </h1>
      {pedido && (
        <p className="mt-3 text-sm text-muted-foreground">
          Número do pedido: <span className="font-medium text-foreground">{pedido}</span>
        </p>
      )}
      <p className="mt-4 max-w-md text-foreground/80">
        {pendente
          ? "Seu pagamento está sendo processado pelo Mercado Pago. Assim que for aprovado, enviaremos a confirmação por e-mail e WhatsApp."
          : "Recebemos seu pedido e em breve enviaremos os detalhes de envio para o seu e-mail e WhatsApp."}
      </p>

      {aviso && (
        <div className="mt-6 flex items-start gap-2 rounded-sm border border-accent/40 bg-accent-soft/10 p-4 text-left text-sm text-foreground/80">
          <WarningCircle size={20} weight="light" className="mt-0.5 shrink-0 text-accent" />
          <p>
            O pagamento online via Mercado Pago ainda não está configurado neste ambiente de
            demonstração. Seu pedido foi registrado normalmente no painel administrativo. Configure
            as chaves de API para ativar cobranças reais.
          </p>
        </div>
      )}

      <Link
        href="/loja"
        className="mt-8 bg-primary px-8 py-3.5 text-sm uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-90"
      >
        Continuar explorando
      </Link>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { XCircle } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Pagamento não concluído",
};

interface PageProps {
  searchParams: Promise<{ pedido?: string }>;
}

export default async function CheckoutErrorPage({ searchParams }: PageProps) {
  const { pedido } = await searchParams;

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center sm:py-32">
      <XCircle size={56} weight="light" className="text-destructive" />
      <h1 className="mt-6 font-display text-3xl sm:text-4xl">Pagamento não concluído</h1>
      {pedido && (
        <p className="mt-3 text-sm text-muted-foreground">
          Número do pedido: <span className="font-medium text-foreground">{pedido}</span>
        </p>
      )}
      <p className="mt-4 max-w-md text-foreground/80">
        Algo impediu a conclusão do seu pagamento. Nenhuma cobrança foi feita. Você pode tentar
        novamente ou falar com a gente pelo WhatsApp.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/checkout"
          className="bg-primary px-8 py-3.5 text-sm uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-90"
        >
          Tentar novamente
        </Link>
        <Link href="/contato" className="link-underline text-sm uppercase tracking-[0.1em]">
          Falar com a gente
        </Link>
      </div>
    </div>
  );
}

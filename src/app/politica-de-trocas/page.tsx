import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Trocas e devoluções",
  description: "Política de trocas, devoluções e envio da Grassence Parfums.",
};

export default function ExchangePolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Institucional</p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">Trocas, devoluções e envio</h1>
      </Reveal>

      <Reveal delay={0.08} className="mt-10 space-y-8 leading-relaxed text-foreground/80">
        <section>
          <h2 className="font-display text-xl text-foreground">Produtos fracionados</h2>
          <p className="mt-2">
            Por se tratar de produtos de higiene pessoal fracionados sob demanda, decants
            <strong> não podem ser devolvidos por arrependimento</strong> após o rompimento do
            lacre, conforme praxe do setor. Antes de finalizar a compra, consulte a descrição
            das notas olfativas e, se tiver dúvidas, fale com a gente pelo WhatsApp.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">Avarias no transporte</h2>
          <p className="mt-2">
            Caso seu pedido chegue com o vidro quebrado, vazando ou com item divergente do
            solicitado, entre em contato em até 7 dias corridos após o recebimento, com fotos do
            produto e da embalagem. Faremos a reposição ou o reembolso integral do item afetado.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">Prazos de envio</h2>
          <p className="mt-2">
            Pedidos com pagamento aprovado até às 14h (horário de Brasília) são despachados de
            Florianópolis em até 2 dias úteis. O prazo total de entrega varia conforme a
            transportadora e a região do Brasil, e é informado no momento do checkout.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">Frete</h2>
          <p className="mt-2">
            Aplicamos frete fixo para todo o Brasil, com isenção para pedidos acima do valor
            mínimo indicado no carrinho. O cálculo final é exibido antes da confirmação do
            pagamento.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">Cancelamento antes do envio</h2>
          <p className="mt-2">
            Pedidos ainda não despachados podem ser cancelados mediante solicitação por e-mail ou
            WhatsApp, com reembolso processado pelo mesmo meio de pagamento utilizado na compra.
          </p>
        </section>
      </Reveal>
    </div>
  );
}

import type { Metadata } from "next";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Perguntas frequentes",
  description: "Tire suas dúvidas sobre decants, autenticidade, envio e prazos da Grassence Parfums.",
};

const FAQS = [
  {
    q: "O que é um decant?",
    a: "Decant é uma pequena fração de um perfume original, transferida do frasco de origem para um vidro menor (geralmente 2ml, 5ml ou 10ml). É a forma ideal de experimentar uma fragrância antes de investir no frasco completo.",
  },
  {
    q: "Os perfumes são originais?",
    a: "Sim. Todos os decants são fracionados a partir de frascos 100% originais, adquiridos de distribuidores e lojas autorizadas. Não trabalhamos com réplicas, contratipos ou produtos falsificados.",
  },
  {
    q: "Qual a validade de um decant?",
    a: "Um decant bem armazenado (longe de luz, calor e variação de temperatura) mantém as características originais da fragrância por cerca de 12 a 18 meses. Indicamos guardar o vidro na caixa, em local fresco e escuro.",
  },
  {
    q: "Qual o prazo de envio?",
    a: "Pedidos pagos até às 14h são despachados de Florianópolis em até 2 dias úteis. O prazo de entrega varia conforme a transportadora e a região do Brasil, informado no momento da compra.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "O checkout é processado pelo Mercado Pago, com opções de Pix, boleto bancário e cartão de crédito. Seus dados de pagamento nunca passam pelos nossos servidores.",
  },
  {
    q: "Posso trocar ou devolver um decant?",
    a: "Por se tratar de um produto fracionado e de higiene pessoal, não aceitamos trocas por arrependimento após o envio. Em caso de avarias no transporte ou erro no pedido, entre em contato em até 7 dias e consulte nossa política de trocas para detalhes.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Ajuda</p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">Perguntas frequentes</h1>
      </Reveal>

      <div className="mt-12 divide-y divide-border border-y border-border">
        {FAQS.map((faq, i) => (
          <Reveal key={faq.q} delay={i * 0.05}>
            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-display text-lg [&::-webkit-details-marker]:hidden">
                {faq.q}
                <CaretDown
                  size={18}
                  weight="light"
                  className="shrink-0 transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 leading-relaxed text-foreground/75">{faq.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

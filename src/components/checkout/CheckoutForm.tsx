"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBagOpen, Lock } from "@phosphor-icons/react/dist/ssr";
import { useCartStore, cartSubtotalCents } from "@/lib/cart-store";
import { formatBRL } from "@/lib/format";
import { FLAT_SHIPPING_CENTS, FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/mercadopago";

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const subtotal = cartSubtotalCents(items);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_CENTS;
  const total = subtotal + shipping;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const missingForFreeShipping = useMemo(
    () => Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotal),
    [subtotal]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      customer: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
      },
      shipping: {
        address: String(formData.get("address") ?? ""),
        city: String(formData.get("city") ?? ""),
        state: String(formData.get("state") ?? ""),
        zip: String(formData.get("zip") ?? ""),
      },
      items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível concluir o pedido.");
        setSubmitting(false);
        return;
      }

      clear();

      if (data.initPoint) {
        window.location.href = data.initPoint;
      } else {
        const params = new URLSearchParams({ pedido: data.orderNumber });
        if (data.warning) params.set("aviso", "1");
        router.push(`/checkout/sucesso?${params.toString()}`);
      }
    } catch {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-5 py-32 text-center">
        <ShoppingBagOpen size={48} weight="thin" className="text-muted-foreground" />
        <h1 className="font-display text-2xl">Sua sacola está vazia</h1>
        <p className="text-muted-foreground">Adicione alguns decants antes de finalizar a compra.</p>
        <Link
          href="/loja"
          className="mt-2 bg-primary px-8 py-3.5 text-sm uppercase tracking-[0.12em] text-primary-foreground"
        >
          Explorar coleção
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="font-display text-3xl sm:text-4xl">Finalizar compra</h1>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="space-y-8 lg:col-span-3">
          <fieldset className="space-y-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <legend className="px-2 text-xs font-medium uppercase tracking-[0.16em] text-accent">
              Seus dados
            </legend>
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm">
                Nome completo
              </label>
              <input
                id="name"
                name="name"
                required
                minLength={3}
                className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm">
                  WhatsApp
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="(48) 99118-2698"
                  autoComplete="tel"
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <legend className="px-2 text-xs font-medium uppercase tracking-[0.16em] text-accent">
              Endereço de entrega
            </legend>
            <div>
              <label htmlFor="address" className="mb-1.5 block text-sm">
                Endereço completo
              </label>
              <input
                id="address"
                name="address"
                required
                placeholder="Rua, número, complemento, bairro"
                autoComplete="street-address"
                className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="city" className="mb-1.5 block text-sm">
                  Cidade
                </label>
                <input
                  id="city"
                  name="city"
                  required
                  autoComplete="address-level2"
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="state" className="mb-1.5 block text-sm">
                  Estado
                </label>
                <select
                  id="state"
                  name="state"
                  required
                  defaultValue="SC"
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
                >
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="zip" className="mb-1.5 block text-sm">
                  CEP
                </label>
                <input
                  id="zip"
                  name="zip"
                  required
                  placeholder="00000-000"
                  autoComplete="postal-code"
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </fieldset>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 bg-primary px-8 py-4 text-sm uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Lock size={16} weight="light" />
            {submitting ? "Processando…" : "Pagar com Mercado Pago"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Você será redirecionado ao ambiente seguro do Mercado Pago para concluir o pagamento
            via Pix, boleto ou cartão.
          </p>
        </form>

        <aside className="lg:col-span-2">
          <div className="sticky top-24 border border-border p-6">
            <h2 className="font-display text-lg">Resumo do pedido</h2>
            <ul className="mt-4 space-y-3 border-b border-border pb-4">
              {items.map((item) => (
                <li key={item.variantId} className="flex justify-between text-sm">
                  <span className="text-foreground/80">
                    {item.productName} · {item.sizeMl}ml{" "}
                    <span className="text-muted-foreground">x{item.quantity}</span>
                  </span>
                  <span>{formatBRL(item.priceCents * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatBRL(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Frete</span>
                <span>{shipping === 0 ? "Grátis" : formatBRL(shipping)}</span>
              </div>
              {missingForFreeShipping > 0 && (
                <p className="text-xs text-accent">
                  Faltam {formatBRL(missingForFreeShipping)} para frete grátis.
                </p>
              )}
            </div>
            <div className="mt-4 flex justify-between border-t border-border pt-4 font-display text-xl">
              <span>Total</span>
              <span>{formatBRL(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

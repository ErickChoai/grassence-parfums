import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const metadata: Metadata = {
  title: "Pedidos",
  robots: { index: false, follow: false },
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl">Pedidos ({orders.length})</h1>

      <div className="mt-6 space-y-4">
        {orders.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum pedido registrado ainda.</p>
        )}

        {orders.map((order) => (
          <details key={order.id} className="group border border-border">
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {order.customerName} · {order.customerEmail}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-display text-lg">{formatBRL(order.totalCents)}</p>
                <OrderStatusSelect orderId={order.id} status={order.status} />
              </div>
            </summary>
            <div className="border-t border-border px-5 py-4 text-sm">
              <p className="text-muted-foreground">
                {order.shippingAddress}, {order.shippingCity} - {order.shippingState}, {order.shippingZip}
              </p>
              <p className="mt-1 text-muted-foreground">WhatsApp: {order.customerPhone}</p>
              <ul className="mt-4 space-y-1.5">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.productName} · {item.variantLabel} x{item.quantity}
                    </span>
                    <span>{formatBRL(item.priceCents * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span>Subtotal: {formatBRL(order.subtotalCents)}</span>
                <span>Frete: {order.shippingCents === 0 ? "Grátis" : formatBRL(order.shippingCents)}</span>
                <span>Criado em: {order.createdAt.toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

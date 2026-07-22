import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/format";

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const [productCount, lowStockVariants, pendingOrders, paidOrders, recentOrders] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.variant.findMany({
      where: { stock: { lte: 5 } },
      include: { product: true },
      orderBy: { stock: "asc" },
      take: 8,
    }),
    prisma.order.count({ where: { status: "PENDENTE" } }),
    prisma.order.aggregate({ where: { status: "PAGO" }, _sum: { totalCents: true } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const stats = [
    { label: "Produtos ativos", value: productCount },
    { label: "Pedidos pendentes", value: pendingOrders },
    { label: "Receita confirmada", value: formatBRL(paidOrders._sum.totalCents ?? 0) },
    { label: "Variantes com estoque baixo", value: lowStockVariants.length },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl">Visão geral</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-border p-5">
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-2xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg">Estoque baixo</h2>
            <Link href="/admin/produtos" className="link-underline text-xs uppercase tracking-wide">
              Ver produtos
            </Link>
          </div>
          {lowStockVariants.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma variante com estoque baixo.</p>
          ) : (
            <ul className="divide-y divide-border border border-border">
              {lowStockVariants.map((v) => (
                <li key={v.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span>
                    {v.product.name} · {v.sizeMl}ml
                  </span>
                  <span className="font-medium text-destructive">{v.stock} un.</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg">Últimos pedidos</h2>
            <Link href="/admin/pedidos" className="link-underline text-xs uppercase tracking-wide">
              Ver todos
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum pedido ainda.</p>
          ) : (
            <ul className="divide-y divide-border border border-border">
              {recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{o.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{o.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p>{formatBRL(o.totalCents)}</p>
                    <p className="text-xs uppercase text-muted-foreground">{o.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

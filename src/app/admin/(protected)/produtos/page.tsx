import Link from "next/link";
import type { Metadata } from "next";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/format";

export const metadata: Metadata = {
  title: "Produtos",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ busca?: string }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const { busca } = await searchParams;

  const products = await prisma.product.findMany({
    where: busca
      ? { OR: [{ name: { contains: busca } }, { brand: { contains: busca } }] }
      : undefined,
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl">Produtos ({products.length})</h1>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 bg-primary px-5 py-2.5 text-sm uppercase tracking-wide text-primary-foreground hover:opacity-90"
        >
          <Plus size={16} weight="bold" /> Novo produto
        </Link>
      </div>

      <form className="mt-6" action="/admin/produtos">
        <input
          type="search"
          name="busca"
          defaultValue={busca}
          placeholder="Buscar por nome ou marca..."
          className="w-full max-w-sm border border-border bg-transparent px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
        />
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-3 pr-4">Produto</th>
              <th className="py-3 pr-4">Gênero</th>
              <th className="py-3 pr-4">Preço (2ml)</th>
              <th className="py-3 pr-4">Estoque total</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
              const price2ml = p.variants.find((v) => v.sizeMl === 2)?.priceCents;
              return (
                <tr key={p.id} className="border-b border-border">
                  <td className="py-3 pr-4">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.brand}</p>
                  </td>
                  <td className="py-3 pr-4 text-xs">{p.gender}</td>
                  <td className="py-3 pr-4">{price2ml ? formatBRL(price2ml) : "·"}</td>
                  <td className="py-3 pr-4">
                    <span className={totalStock <= 10 ? "text-destructive" : ""}>{totalStock} un.</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        p.active ? "bg-accent-soft/30 text-accent" : "bg-surface-muted text-muted-foreground"
                      }`}
                    >
                      {p.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/admin/produtos/${p.id}`}
                      className="link-underline text-xs uppercase tracking-wide text-accent"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
}

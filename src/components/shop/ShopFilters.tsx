"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { MagnifyingGlass, SlidersHorizontal, X } from "@phosphor-icons/react/dist/ssr";

const GENDERS = [
  { value: "", label: "Todos" },
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMININO", label: "Feminino" },
  { value: "UNISSEX", label: "Unissex" },
];

const SORT_OPTIONS = [
  { value: "relevancia", label: "Relevância" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "novidades", label: "Novidades" },
];

interface ShopFiltersProps {
  brands: string[];
  families: string[];
}

export function ShopFilters({ brands, families }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get("busca") ?? "");

  const gender = searchParams.get("genero") ?? "";
  const brand = searchParams.get("marca") ?? "";
  const family = searchParams.get("familia") ?? "";
  const sort = searchParams.get("ordenar") ?? "relevancia";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/loja?${params.toString()}`, { scroll: false });
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParam("busca", search);
  }

  const activeCount = [gender, brand, family].filter(Boolean).length;

  const content = (
    <div className="space-y-8">
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar perfume ou marca..."
          className="w-full border border-border bg-transparent px-4 py-3 pr-10 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Buscar"
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-accent"
        >
          <MagnifyingGlass size={18} weight="light" />
        </button>
      </form>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Gênero
        </p>
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <button
              key={g.value}
              onClick={() => updateParam("genero", g.value)}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs uppercase tracking-wide transition-colors ${
                gender === g.value
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-foreground/70 hover:border-accent hover:text-accent"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-3 block text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Marca
        </label>
        <select
          value={brand}
          onChange={(e) => updateParam("marca", e.target.value)}
          className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
        >
          <option value="">Todas as marcas</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-3 block text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Família olfativa
        </label>
        <select
          value={family}
          onChange={(e) => updateParam("familia", e.target.value)}
          className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
        >
          <option value="">Todas as famílias</option>
          {families.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {activeCount > 0 && (
        <button
          onClick={() => router.push("/loja", { scroll: false })}
          className="link-underline text-xs uppercase tracking-[0.12em] text-accent"
        >
          Limpar filtros ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex cursor-pointer items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-wide"
        >
          <SlidersHorizontal size={16} weight="light" />
          Filtros {activeCount > 0 && `(${activeCount})`}
        </button>
        <select
          value={sort}
          onChange={(e) => updateParam("ordenar", e.target.value)}
          className="border border-border bg-transparent px-3 py-2 text-xs uppercase tracking-wide"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <aside className="hidden lg:col-span-3 lg:block">
        <div className="mb-6 flex items-center justify-between">
          <p className="font-display text-lg">Filtrar</p>
          {isPending && <span className="text-xs text-muted-foreground">Atualizando…</span>}
        </div>
        {content}

        <div className="mt-8">
          <label className="mb-3 block text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Ordenar por
          </label>
          <select
            value={sort}
            onChange={(e) => updateParam("ordenar", e.target.value)}
            className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-lg">Filtrar</p>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar filtros"
                className="cursor-pointer p-1"
              >
                <X size={20} weight="light" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}

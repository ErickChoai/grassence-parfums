"use client";

import { useActionState, useState } from "react";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import type { ProductFormState } from "@/lib/actions/products";
import { deleteProduct } from "@/lib/actions/products";

interface VariantFormValue {
  id?: string;
  sizeMl: number;
  priceCents: number;
  stock: number;
}

interface ProductFormProps {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  mode: "create" | "edit";
  productId?: string;
  initial?: {
    name: string;
    brand: string;
    gender: "MASCULINO" | "FEMININO" | "UNISSEX";
    family: string;
    description: string;
    topNotes: string;
    heartNotes: string;
    baseNotes: string;
    featured: boolean;
    active: boolean;
    variants: VariantFormValue[];
  };
}

const DEFAULT_VARIANTS: VariantFormValue[] = [
  { sizeMl: 2, priceCents: 1800, stock: 20 },
  { sizeMl: 5, priceCents: 3500, stock: 12 },
  { sizeMl: 10, priceCents: 6000, stock: 6 },
];

export function ProductForm({ action, mode, productId, initial }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, {} as ProductFormState);
  const [variants, setVariants] = useState<VariantFormValue[]>(initial?.variants ?? DEFAULT_VARIANTS);

  function updateVariant(index: number, patch: Partial<VariantFormValue>) {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  function addVariant() {
    setVariants((prev) => [...prev, { sizeMl: 15, priceCents: 0, stock: 0 }]);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={formAction} className="max-w-3xl space-y-8">
      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm">
            Nome do perfume
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={initial?.name}
            className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="brand" className="mb-1.5 block text-sm">
            Marca
          </label>
          <input
            id="brand"
            name="brand"
            required
            defaultValue={initial?.brand}
            className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="gender" className="mb-1.5 block text-sm">
            Gênero
          </label>
          <select
            id="gender"
            name="gender"
            defaultValue={initial?.gender ?? "UNISSEX"}
            className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
          >
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
            <option value="UNISSEX">Unissex</option>
          </select>
        </div>
        <div>
          <label htmlFor="family" className="mb-1.5 block text-sm">
            Família olfativa
          </label>
          <input
            id="family"
            name="family"
            required
            defaultValue={initial?.family}
            placeholder="Ex: Amadeirado Especiado"
            className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
          />
        </div>
      </fieldset>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={initial?.description}
          className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
        />
      </div>

      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="topNotes" className="mb-1.5 block text-sm">
            Notas de saída
          </label>
          <input
            id="topNotes"
            name="topNotes"
            required
            defaultValue={initial?.topNotes}
            className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="heartNotes" className="mb-1.5 block text-sm">
            Notas de coração
          </label>
          <input
            id="heartNotes"
            name="heartNotes"
            required
            defaultValue={initial?.heartNotes}
            className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="baseNotes" className="mb-1.5 block text-sm">
            Notas de fundo
          </label>
          <input
            id="baseNotes"
            name="baseNotes"
            required
            defaultValue={initial?.baseNotes}
            className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
          />
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={initial?.featured} className="h-4 w-4" />
          Destacar na home
        </label>
        {mode === "edit" && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={initial?.active ?? true} className="h-4 w-4" />
            Ativo na loja
          </label>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Tamanhos, preços e estoque
          </p>
          <button
            type="button"
            onClick={addVariant}
            className="cursor-pointer text-xs uppercase tracking-wide text-accent hover:underline"
          >
            + adicionar tamanho
          </button>
        </div>
        <div className="space-y-3">
          {variants.map((v, i) => (
            <div key={v.id ?? i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
              {v.id && <input type="hidden" name="variant_id" value={v.id} />}
              {!v.id && <input type="hidden" name="variant_id" value="" />}
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">ml</label>
                <input
                  type="number"
                  name="variant_sizeMl"
                  required
                  min={1}
                  value={v.sizeMl}
                  onChange={(e) => updateVariant(i, { sizeMl: Number(e.target.value) })}
                  className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Preço (centavos)</label>
                <input
                  type="number"
                  name="variant_priceCents"
                  required
                  min={0}
                  value={v.priceCents}
                  onChange={(e) => updateVariant(i, { priceCents: Number(e.target.value) })}
                  className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Estoque</label>
                <input
                  type="number"
                  name="variant_stock"
                  required
                  min={0}
                  value={v.stock}
                  onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })}
                  className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => removeVariant(i)}
                aria-label="Remover tamanho"
                className="cursor-pointer p-2 text-muted-foreground hover:text-destructive"
              >
                <Trash size={16} weight="light" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="bg-primary px-6 py-3 text-sm uppercase tracking-[0.12em] text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Salvando…" : mode === "create" ? "Criar produto" : "Salvar alterações"}
        </button>

        {mode === "edit" && productId && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Tem certeza que deseja excluir este produto permanentemente?")) {
                deleteProduct(productId);
              }
            }}
            className="cursor-pointer text-sm text-destructive hover:underline"
          >
            Excluir produto
          </button>
        )}
      </div>
    </form>
  );
}

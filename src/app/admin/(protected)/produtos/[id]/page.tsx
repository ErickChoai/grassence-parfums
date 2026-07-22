import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/lib/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "Editar produto",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: { orderBy: { sizeMl: "asc" } } },
  });

  if (!product) notFound();

  const boundAction = updateProduct.bind(null, product.id);

  return (
    <div>
      <h1 className="font-display text-2xl">Editar produto</h1>
      <p className="mt-1 text-sm text-muted-foreground">{product.slug}</p>
      <div className="mt-6">
        <ProductForm
          action={boundAction}
          mode="edit"
          productId={product.id}
          initial={{
            name: product.name,
            brand: product.brand,
            gender: product.gender,
            family: product.family,
            description: product.description,
            topNotes: product.topNotes,
            heartNotes: product.heartNotes,
            baseNotes: product.baseNotes,
            featured: product.featured,
            active: product.active,
            variants: product.variants.map((v) => ({
              id: v.id,
              sizeMl: v.sizeMl,
              priceCents: v.priceCents,
              stock: v.stock,
            })),
          }}
        />
      </div>
    </div>
  );
}

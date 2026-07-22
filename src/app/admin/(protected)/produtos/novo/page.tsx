import type { Metadata } from "next";
import { createProduct } from "@/lib/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "Novo produto",
  robots: { index: false, follow: false },
};

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-2xl">Novo produto</h1>
      <div className="mt-6">
        <ProductForm action={createProduct} mode="create" />
      </div>
    </div>
  );
}

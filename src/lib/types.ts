export type Gender = "MASCULINO" | "FEMININO" | "UNISSEX";

export interface VariantView {
  id: string;
  sizeMl: number;
  priceCents: number;
  stock: number;
  sku: string;
}

export interface ProductView {
  id: string;
  slug: string;
  name: string;
  brand: string;
  gender: Gender;
  family: string;
  description: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  featured: boolean;
  active: boolean;
  variants: VariantView[];
}

export interface CartItem {
  productId: string;
  productSlug: string;
  productName: string;
  brand: string;
  variantId: string;
  sizeMl: number;
  priceCents: number;
  quantity: number;
}

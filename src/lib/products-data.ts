import { prisma } from "@/lib/prisma";
import type { Gender, ProductView } from "@/lib/types";

function toView(product: {
  id: string;
  slug: string;
  name: string;
  brand: string;
  gender: string;
  family: string;
  description: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  featured: boolean;
  active: boolean;
  variants: { id: string; sizeMl: number; priceCents: number; stock: number; sku: string }[];
}): ProductView {
  return {
    ...product,
    gender: product.gender as Gender,
    variants: [...product.variants].sort((a, b) => a.sizeMl - b.sizeMl),
  };
}

export interface ProductFilters {
  gender?: Gender;
  brand?: string;
  family?: string;
  search?: string;
  sort?: "relevancia" | "menor-preco" | "maior-preco" | "novidades";
}

export async function getFilteredProducts(filters: ProductFilters = {}) {
  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(filters.gender ? { gender: filters.gender } : {}),
      ...(filters.brand ? { brand: filters.brand } : {}),
      ...(filters.family ? { family: { contains: filters.family } } : {}),
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search } },
              { brand: { contains: filters.search } },
              { family: { contains: filters.search } },
            ],
          }
        : {}),
    },
    include: { variants: true },
    orderBy:
      filters.sort === "novidades"
        ? { createdAt: "desc" }
        : { brand: "asc" },
  });

  let mapped = products.map(toView);

  if (filters.sort === "menor-preco") {
    mapped = mapped.sort(
      (a, b) => Math.min(...a.variants.map((v) => v.priceCents)) - Math.min(...b.variants.map((v) => v.priceCents))
    );
  } else if (filters.sort === "maior-preco") {
    mapped = mapped.sort(
      (a, b) => Math.max(...b.variants.map((v) => v.priceCents)) - Math.max(...a.variants.map((v) => v.priceCents))
    );
  }

  return mapped;
}

export async function getFeaturedProducts(limit = 4) {
  const products = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: { variants: true },
    take: limit,
  });
  return products.map(toView);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: true },
  });
  if (!product || !product.active) return null;
  return toView(product);
}

export async function getRelatedProducts(product: ProductView, limit = 4) {
  const related = await prisma.product.findMany({
    where: {
      active: true,
      id: { not: product.id },
      OR: [{ gender: product.gender }, { family: product.family }],
    },
    include: { variants: true },
    take: limit,
  });
  return related.map(toView);
}

export async function getAllBrands() {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { brand: true },
    distinct: ["brand"],
    orderBy: { brand: "asc" },
  });
  return products.map((p) => p.brand);
}

export async function getAllFamilies() {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { family: true },
    distinct: ["family"],
    orderBy: { family: "asc" },
  });
  return products.map((p) => p.family);
}

export async function getAllSlugs() {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true },
  });
  return products.map((p) => p.slug);
}

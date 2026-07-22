"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/dal";
import { slugifyText } from "@/lib/format";

const variantSchema = z.object({
  id: z.string().optional(),
  sizeMl: z.coerce.number().int().positive(),
  priceCents: z.coerce.number().int().nonnegative(),
  stock: z.coerce.number().int().nonnegative(),
});

const productSchema = z.object({
  name: z.string().min(2),
  brand: z.string().min(2),
  gender: z.enum(["MASCULINO", "FEMININO", "UNISSEX"]),
  family: z.string().min(2),
  description: z.string().min(10),
  topNotes: z.string().min(1),
  heartNotes: z.string().min(1),
  baseNotes: z.string().min(1),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  variants: z.array(variantSchema).min(1),
});

export interface ProductFormState {
  error?: string;
}

function parseVariantsFromForm(formData: FormData) {
  const sizes = formData.getAll("variant_sizeMl");
  const prices = formData.getAll("variant_priceCents");
  const stocks = formData.getAll("variant_stock");
  const ids = formData.getAll("variant_id");

  return sizes.map((_, i) => ({
    id: (ids[i] as string) || undefined,
    sizeMl: sizes[i],
    priceCents: prices[i],
    stock: stocks[i],
  }));
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await verifyAdminSession();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    brand: formData.get("brand"),
    gender: formData.get("gender"),
    family: formData.get("family"),
    description: formData.get("description"),
    topNotes: formData.get("topNotes"),
    heartNotes: formData.get("heartNotes"),
    baseNotes: formData.get("baseNotes"),
    featured: formData.get("featured") === "on",
    variants: parseVariantsFromForm(formData),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const data = parsed.data;
  const baseSlug = slugifyText(`${data.brand}-${data.name}`);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const product = await prisma.product.create({
    data: {
      slug,
      name: data.name,
      brand: data.brand,
      gender: data.gender,
      family: data.family,
      description: data.description,
      topNotes: data.topNotes,
      heartNotes: data.heartNotes,
      baseNotes: data.baseNotes,
      featured: Boolean(data.featured),
      variants: {
        create: data.variants.map((v) => ({
          sizeMl: v.sizeMl,
          priceCents: v.priceCents,
          stock: v.stock,
          sku: `${slug}-${v.sizeMl}ML`.toUpperCase(),
        })),
      },
    },
  });

  revalidatePath("/admin/produtos");
  revalidatePath("/loja");
  redirect(`/admin/produtos/${product.id}`);
}

export async function updateProduct(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await verifyAdminSession();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    brand: formData.get("brand"),
    gender: formData.get("gender"),
    family: formData.get("family"),
    description: formData.get("description"),
    topNotes: formData.get("topNotes"),
    heartNotes: formData.get("heartNotes"),
    baseNotes: formData.get("baseNotes"),
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
    variants: parseVariantsFromForm(formData),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const data = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        brand: data.brand,
        gender: data.gender,
        family: data.family,
        description: data.description,
        topNotes: data.topNotes,
        heartNotes: data.heartNotes,
        baseNotes: data.baseNotes,
        featured: Boolean(data.featured),
        active: Boolean(data.active),
      },
    });

    for (const variant of data.variants) {
      if (variant.id) {
        await tx.variant.update({
          where: { id: variant.id },
          data: {
            sizeMl: variant.sizeMl,
            priceCents: variant.priceCents,
            stock: variant.stock,
          },
        });
      } else {
        const product = await tx.product.findUniqueOrThrow({ where: { id: productId } });
        await tx.variant.create({
          data: {
            productId,
            sizeMl: variant.sizeMl,
            priceCents: variant.priceCents,
            stock: variant.stock,
            sku: `${product.slug}-${variant.sizeMl}ML-${Date.now().toString(36)}`.toUpperCase(),
          },
        });
      }
    }
  });

  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/loja");
  return {};
}

export async function deleteProduct(productId: string) {
  await verifyAdminSession();
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/produtos");
  revalidatePath("/loja");
  redirect("/admin/produtos");
}

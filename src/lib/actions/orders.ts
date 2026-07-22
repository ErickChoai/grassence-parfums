"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/dal";

const VALID_STATUSES = ["PENDENTE", "PAGO", "ENVIADO", "ENTREGUE", "CANCELADO"] as const;

export async function updateOrderStatus(orderId: string, status: string) {
  await verifyAdminSession();

  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    throw new Error("Status inválido.");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as (typeof VALID_STATUSES)[number] },
  });

  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
}

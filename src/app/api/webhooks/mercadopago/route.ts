import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { getMercadoPagoClient, isMercadoPagoConfigured } from "@/lib/mercadopago";

export async function POST(request: Request) {
  if (!isMercadoPagoConfigured()) {
    return NextResponse.json({ received: true });
  }

  const url = new URL(request.url);
  let paymentId =
    url.searchParams.get("data.id") ?? url.searchParams.get("id") ?? undefined;
  const topic = url.searchParams.get("type") ?? url.searchParams.get("topic");

  if (!paymentId) {
    try {
      const body = await request.json();
      paymentId = body?.data?.id ?? body?.id;
    } catch {
      // corpo vazio ou não-JSON, ignora
    }
  }

  if (!paymentId || (topic && topic !== "payment")) {
    return NextResponse.json({ received: true });
  }

  try {
    const client = getMercadoPagoClient()!;
    const payment = await new Payment(client).get({ id: paymentId });
    const orderId = payment.external_reference;
    if (!orderId) return NextResponse.json({ received: true });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) return NextResponse.json({ received: true });

    // Evita processar o mesmo pagamento aprovado mais de uma vez
    if (order.mpPaymentId === String(payment.id) && order.status === "PAGO") {
      return NextResponse.json({ received: true });
    }

    const statusMap: Record<string, "PAGO" | "PENDENTE" | "CANCELADO"> = {
      approved: "PAGO",
      pending: "PENDENTE",
      in_process: "PENDENTE",
      rejected: "CANCELADO",
      cancelled: "CANCELADO",
      refunded: "CANCELADO",
    };
    const newStatus = statusMap[payment.status ?? ""] ?? order.status;
    const wasAlreadyPaid = order.status === "PAGO";

    await prisma.order.update({
      where: { id: order.id },
      data: { status: newStatus, mpPaymentId: String(payment.id) },
    });

    if (newStatus === "PAGO" && !wasAlreadyPaid) {
      for (const item of order.items) {
        await prisma.variant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro ao processar webhook do Mercado Pago:", error);
    return NextResponse.json({ received: true });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

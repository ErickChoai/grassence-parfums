import { NextResponse } from "next/server";
import { z } from "zod";
import { Preference } from "mercadopago";
import { prisma } from "@/lib/prisma";
import {
  calculateShippingCents,
  generateOrderNumber,
  getMercadoPagoClient,
  isMercadoPagoConfigured,
} from "@/lib/mercadopago";

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(3, "Informe seu nome completo."),
    email: z.email("Informe um e-mail válido."),
    phone: z.string().min(8, "Informe um telefone válido."),
  }),
  shipping: z.object({
    address: z.string().min(3, "Informe o endereço."),
    city: z.string().min(2, "Informe a cidade."),
    state: z.string().length(2, "Use a sigla do estado (ex: SC)."),
    zip: z.string().min(8, "Informe um CEP válido."),
  }),
  items: z
    .array(
      z.object({
        variantId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "Sua sacola está vazia."),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = checkoutSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const { customer, shipping, items } = parsed.data;

  const variantIds = items.map((i) => i.variantId);
  const variants = await prisma.variant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  });

  if (variants.length !== variantIds.length) {
    return NextResponse.json(
      { error: "Um ou mais itens da sua sacola não existem mais." },
      { status: 400 }
    );
  }

  for (const item of items) {
    const variant = variants.find((v) => v.id === item.variantId);
    if (!variant || variant.stock < item.quantity) {
      return NextResponse.json(
        {
          error: `Estoque insuficiente para ${variant?.product.name ?? "um item"} (${variant?.sizeMl}ml).`,
        },
        { status: 409 }
      );
    }
  }

  const subtotalCents = items.reduce((sum, item) => {
    const variant = variants.find((v) => v.id === item.variantId)!;
    return sum + variant.priceCents * item.quantity;
  }, 0);
  const shippingCents = calculateShippingCents(subtotalCents);
  const totalCents = subtotalCents + shippingCents;
  const orderNumber = generateOrderNumber();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      shippingAddress: shipping.address,
      shippingCity: shipping.city,
      shippingState: shipping.state.toUpperCase(),
      shippingZip: shipping.zip,
      subtotalCents,
      shippingCents,
      totalCents,
      items: {
        create: items.map((item) => {
          const variant = variants.find((v) => v.id === item.variantId)!;
          return {
            productId: variant.productId,
            variantId: variant.id,
            quantity: item.quantity,
            priceCents: variant.priceCents,
            productName: variant.product.name,
            variantLabel: `${variant.sizeMl}ml`,
          };
        }),
      },
    },
  });

  if (!isMercadoPagoConfigured()) {
    return NextResponse.json({
      orderNumber: order.orderNumber,
      initPoint: null,
      warning:
        "Mercado Pago ainda não está configurado neste ambiente (faltam as chaves de API). O pedido foi registrado como pendente. Configure MERCADOPAGO_ACCESS_TOKEN para ativar o pagamento real.",
    });
  }

  try {
    const client = getMercadoPagoClient()!;
    const preference = new Preference(client);

    const mpItems = items.map((item) => {
      const variant = variants.find((v) => v.id === item.variantId)!;
      return {
        id: variant.id,
        title: `${variant.product.name} · ${variant.sizeMl}ml`,
        quantity: item.quantity,
        currency_id: "BRL",
        unit_price: variant.priceCents / 100,
      };
    });

    if (shippingCents > 0) {
      mpItems.push({
        id: "frete",
        title: "Frete",
        quantity: 1,
        currency_id: "BRL",
        unit_price: shippingCents / 100,
      });
    }

    const result = await preference.create({
      body: {
        items: mpItems,
        payer: { name: customer.name, email: customer.email },
        external_reference: order.id,
        back_urls: {
          success: `${siteUrl}/checkout/sucesso?pedido=${order.orderNumber}`,
          failure: `${siteUrl}/checkout/erro?pedido=${order.orderNumber}`,
          pending: `${siteUrl}/checkout/sucesso?pedido=${order.orderNumber}&pendente=1`,
        },
        auto_return: "approved",
        notification_url: `${siteUrl}/api/webhooks/mercadopago`,
        statement_descriptor: "GRASSENCE PARFUMS",
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { mpPreferenceId: result.id, paymentMethod: "mercadopago" },
    });

    return NextResponse.json({
      orderNumber: order.orderNumber,
      initPoint: result.init_point ?? result.sandbox_init_point ?? null,
    });
  } catch (error) {
    console.error("Erro ao criar preferência do Mercado Pago:", error);
    return NextResponse.json(
      {
        orderNumber: order.orderNumber,
        initPoint: null,
        warning:
          "Não foi possível iniciar o pagamento com o Mercado Pago agora. Seu pedido foi registrado e nossa equipe entrará em contato.",
      },
      { status: 200 }
    );
  }
}

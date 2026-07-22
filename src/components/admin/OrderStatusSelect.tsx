"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/lib/actions/orders";

const STATUSES = ["PENDENTE", "PAGO", "ENVIADO", "ENTREGUE", "CANCELADO"];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateOrderStatus(orderId, e.target.value))}
      className="border border-border bg-transparent px-2 py-1.5 text-xs uppercase tracking-wide focus:border-accent focus:outline-none disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

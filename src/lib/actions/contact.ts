"use server";

import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.email("Informe um e-mail válido."),
  message: z.string().min(10, "Escreva uma mensagem com pelo menos 10 caracteres."),
});

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function sendContactMessage(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const result = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!result.success) {
    return { status: "error", message: result.error.issues[0]?.message ?? "Dados inválidos." };
  }

  // TODO: enviar por e-mail (Resend/SendGrid) ou salvar em uma tabela "ContactMessage" no banco
  // antes de ir para produção. Por enquanto, apenas confirmamos o recebimento.
  return {
    status: "success",
    message: "Mensagem enviada! Responderemos em até 1 dia útil.",
  };
}

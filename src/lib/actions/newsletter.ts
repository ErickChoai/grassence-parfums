"use server";

import { z } from "zod";

const schema = z.object({
  email: z.email({ error: "Informe um e-mail válido." }),
});

export interface NewsletterState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function subscribeNewsletter(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const result = schema.safeParse({ email: formData.get("email") });

  if (!result.success) {
    return { status: "error", message: result.error.issues[0]?.message ?? "E-mail inválido." };
  }

  // TODO: integrar com um provedor de e-mail marketing (Mailchimp, Klaviyo, Resend Audiences, etc.)
  // antes de ir para produção. Por enquanto, apenas confirmamos o recebimento.
  return { status: "success", message: "Inscrição confirmada! Em breve você recebe nossas novidades." };
}

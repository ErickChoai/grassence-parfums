"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactState } from "@/lib/actions/contact";

const initialState: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm">
          Nome
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm">
          Mensagem
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
        />
      </div>

      {state.status === "success" && (
        <p role="status" className="text-sm text-accent">
          {state.message}
        </p>
      )}
      {state.status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-primary px-8 py-3.5 text-sm uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Enviando…" : "Enviar mensagem"}
      </button>
    </form>
  );
}

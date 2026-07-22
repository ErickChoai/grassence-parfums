"use client";

import { useActionState } from "react";
import { PaperPlaneTilt, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { subscribeNewsletter, type NewsletterState } from "@/lib/actions/newsletter";
import { Reveal } from "@/components/ui/Reveal";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { HoverSpotlight } from "@/components/ui/HoverSpotlight";

const initialState: NewsletterState = { status: "idle" };

export function Newsletter() {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initialState);

  return (
    <section className="relative overflow-hidden">
      <AmbientBackground />
      <HoverSpotlight />
      <div className="relative z-10 mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-32">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Lista de lançamentos</p>
          <h2 className="text-balance mt-4 font-display text-3xl sm:text-4xl">
            Seja a primeira a experimentar as novas gotas.
          </h2>
          <p className="mt-4 text-foreground/70">
            Enviamos apenas o essencial: chegadas de nicho, edições limitadas e
            convites para provas na loja em Florianópolis.
          </p>

          <form
            action={formAction}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="seu@email.com"
              className="flex-1 rounded-full border border-border-strong bg-surface/70 px-5 py-3.5 text-sm backdrop-blur-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={pending}
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <PaperPlaneTilt size={16} weight="light" />
              {pending ? "Enviando…" : "Inscrever"}
            </button>
          </form>

          {state.status === "success" && (
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-accent">
              <CheckCircle size={16} weight="fill" /> {state.message}
            </p>
          )}
          {state.status === "error" && (
            <p className="mt-4 text-sm text-destructive">{state.message}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

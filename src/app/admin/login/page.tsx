import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Acesso administrativo",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-accent">Painel administrativo</p>
      <h1 className="mt-2 font-display text-3xl">Grassence Parfums</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Acesse para gerenciar produtos, estoque e pedidos.
      </p>
      <LoginForm />
    </div>
  );
}

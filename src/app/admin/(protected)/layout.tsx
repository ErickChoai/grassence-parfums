import Link from "next/link";
import { SquaresFour, Package, ListChecks, SignOut, Storefront } from "@phosphor-icons/react/dist/ssr";
import { verifyAdminSession } from "@/lib/dal";
import { logoutAdmin } from "@/lib/actions/auth";

const NAV = [
  { href: "/admin", label: "Painel", icon: SquaresFour },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ListChecks },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await verifyAdminSession();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-1px)] max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row">
      <aside className="lg:w-56 lg:shrink-0">
        <div className="lg:sticky lg:top-24">
          <p className="font-display text-lg">Painel Grassence</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{session.email as string}</p>

          <nav className="mt-6 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-2 rounded-sm px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                <item.icon size={18} weight="light" />
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 rounded-sm px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              <Storefront size={18} weight="light" />
              Ver loja
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="flex w-full shrink-0 cursor-pointer items-center gap-2 rounded-sm px-3 py-2.5 text-left text-sm text-foreground/80 transition-colors hover:bg-surface-muted hover:text-destructive"
              >
                <SignOut size={18} weight="light" />
                Sair
              </button>
            </form>
          </nav>
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

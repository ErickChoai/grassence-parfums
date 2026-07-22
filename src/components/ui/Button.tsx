import { clsx } from "clsx";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 border border-primary",
  secondary:
    "bg-transparent text-foreground border border-border-strong hover:border-accent hover:text-accent",
  ghost: "bg-transparent text-foreground hover:text-accent",
  outline:
    "bg-transparent border border-accent text-accent hover:bg-accent hover:text-accent-foreground",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs tracking-[0.12em]",
  md: "px-6 py-3 text-sm tracking-[0.12em]",
  lg: "px-8 py-4 text-sm tracking-[0.14em]",
};

const base =
  "inline-flex items-center justify-center gap-2 uppercase font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(base, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link
      href={href}
      className={clsx(base, variantClasses[variant], sizeClasses[size], className)}
    >
      {children}
    </Link>
  );
}

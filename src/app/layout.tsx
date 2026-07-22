import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";

const displayFont = Fraunces({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const bodyFont = Hanken_Grotesk({
  variable: "--font-sans-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Grassence Parfums | Decants de Perfumaria Fina em Florianópolis",
    template: "%s | Grassence Parfums",
  },
  description:
    "Decants selecionados de perfumaria de nicho e design, fracionados à mão em Florianópolis, SC. Experimente grandes perfumes em tamanhos acessíveis.",
  keywords: [
    "decants de perfume",
    "perfumaria de nicho",
    "decant Florianópolis",
    "perfumes importados decant",
  ],
  openGraph: {
    title: "Grassence Parfums | Decants de Perfumaria Fina",
    description:
      "Decants selecionados de perfumaria de nicho e design, fracionados à mão em Florianópolis, SC.",
    locale: "pt_BR",
    type: "website",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Grassence Parfums",
  description:
    "Decants de perfumaria de nicho e design, fracionados à mão em Florianópolis, SC.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Florianópolis",
    addressRegion: "SC",
    addressCountry: "BR",
  },
  areaServed: "BR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${displayFont.variable} ${bodyFont.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}

import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/products-data";
import { SITE_URL } from "@/lib/site";

// Gerado a cada request: mantém o build independente do banco e o sitemap
// sempre alinhado com o catálogo publicado.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/loja`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/sobre`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/perguntas-frequentes`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/politica-de-trocas`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contato`, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Sem os produtos o sitemap fica incompleto, mas ainda é válido. Devolver as
  // rotas fixas é melhor do que responder erro para os buscadores.
  try {
    const slugs = await getAllSlugs();
    const productRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
      url: `${SITE_URL}/loja/${slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error("Falha ao carregar os produtos para o sitemap:", error);
    return staticRoutes;
  }
}

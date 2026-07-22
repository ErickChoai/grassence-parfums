import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type Tier = "CLASSICO" | "PREMIUM" | "RARO";

const TIER_PRICES: Record<Tier, { "2": number; "5": number; "10": number }> = {
  CLASSICO: { "2": 1800, "5": 3500, "10": 6000 },
  PREMIUM: { "2": 3200, "5": 6500, "10": 11000 },
  RARO: { "2": 4500, "5": 9000, "10": 16000 },
};

interface SeedProduct {
  name: string;
  brand: string;
  gender: "MASCULINO" | "FEMININO" | "UNISSEX";
  family: string;
  tier: Tier;
  description: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  featured?: boolean;
}

const products: SeedProduct[] = [
  // Masculinos
  { name: "Sauvage EDP", brand: "Dior", gender: "MASCULINO", tier: "PREMIUM", family: "Amadeirado Aromático", description: "Um frescor mineral sobre uma base amadeirada intensa, assinatura de Bergamota da Calábria e Ambroxan.", topNotes: "Bergamota, Pimenta", heartNotes: "Lavanda, Elemi", baseNotes: "Ambroxan, Cedro", featured: true },
  { name: "Bleu de Chanel EDP", brand: "Chanel", gender: "MASCULINO", tier: "PREMIUM", family: "Amadeirado Aromático", description: "Cítrico e amadeirado com trilhas incensadas, elegância discreta para o dia a dia.", topNotes: "Limão, Hortelã-pimenta", heartNotes: "Gengibre, Noz-moscada", baseNotes: "Incenso, Sândalo, Cedro", featured: true },
  { name: "Eros", brand: "Versace", gender: "MASCULINO", tier: "CLASSICO", family: "Amadeirado Aromático", description: "Vibrante e doce, com menta e baunilha sobre fava tonka.", topNotes: "Hortelã, Maçã Verde", heartNotes: "Gerânio, Canela", baseNotes: "Baunilha, Fava Tonka, Vetiver" },
  { name: "Invictus", brand: "Paco Rabanne", gender: "MASCULINO", tier: "CLASSICO", family: "Aquático Amadeirado", description: "Energético e marinho, com toque de laurel e âmbar-cinza.", topNotes: "Toranja, Mandarina", heartNotes: "Louro, Jasmim", baseNotes: "Âmbar-cinza, Patchouli, Musgo" },
  { name: "Acqua di Giò Profondo", brand: "Armani", gender: "MASCULINO", tier: "PREMIUM", family: "Aquático Aromático", description: "Nota marinha profunda com alecrim e figo, inspirado no mar Mediterrâneo.", topNotes: "Bergamota, Notas Marinhas", heartNotes: "Alecrim, Figo", baseNotes: "Patchouli, Musgo de Carvalho" },
  { name: "1 Million", brand: "Paco Rabanne", gender: "MASCULINO", tier: "CLASSICO", family: "Amadeirado Especiado", description: "Canela e couro sobre um fundo dourado e especiado, marcante e sedutor.", topNotes: "Toranja, Hortelã", heartNotes: "Canela, Rosa", baseNotes: "Couro, Âmbar, Madeiras Brancas" },
  { name: "The One for Men", brand: "Dolce & Gabbana", gender: "MASCULINO", tier: "CLASSICO", family: "Amadeirado Especiado", description: "Especiado e quente, com tabaco e cardamomo em uma base amadeirada macia.", topNotes: "Cardamomo, Coentro", heartNotes: "Gengibre, Tabaco", baseNotes: "Âmbar, Cedro" },
  { name: "Le Male Le Parfum", brand: "Jean Paul Gaultier", gender: "MASCULINO", tier: "PREMIUM", family: "Oriental Amadeirado", description: "Baunilha intensa e lavanda sobre uma base âmbar quente e envolvente.", topNotes: "Lavanda, Cardamomo", heartNotes: "Baunilha, Íris", baseNotes: "Âmbar, Sândalo, Fava Tonka" },
  { name: "Boss Bottled", brand: "Hugo Boss", gender: "MASCULINO", tier: "CLASSICO", family: "Amadeirado Frutado", description: "Maçã e canela sobre madeiras clássicas, versátil para o dia a dia corporativo.", topNotes: "Maçã, Ameixa", heartNotes: "Canela, Gerânio", baseNotes: "Sândalo, Cedro, Vetiver" },
  { name: "Aventus", brand: "Creed", gender: "MASCULINO", tier: "RARO", family: "Frutado Amadeirado Chipre", description: "Abacaxi defumado e bétula sobre uma base de almíscar e carvalho, ícone moderno da perfumaria.", topNotes: "Abacaxi, Bergamota, Groselha Preta", heartNotes: "Bétula, Patchouli, Jasmim", baseNotes: "Âmbar-cinza, Musgo de Carvalho, Vanilla", featured: true },
  { name: "Layton", brand: "Parfums de Marly", gender: "MASCULINO", tier: "RARO", family: "Aromático Almiscarado", description: "Maçã e baunilha sobre lavanda e almíscar, luxuoso e envolvente.", topNotes: "Maçã, Bergamota, Lavanda", heartNotes: "Canela, Violeta, Geranio", baseNotes: "Baunilha, Almíscar, Sândalo" },
  { name: "Herod", brand: "Parfums de Marly", gender: "MASCULINO", tier: "RARO", family: "Amadeirado Especiado", description: "Tabaco e couro em uma composição âmbar densa e sofisticada.", topNotes: "Cominho, Cardamomo", heartNotes: "Tabaco, Canela", baseNotes: "Couro, Âmbar, Baunilha" },
  { name: "Sedley", brand: "Parfums de Marly", gender: "MASCULINO", tier: "RARO", family: "Amadeirado Aromático", description: "Frescor de maçã verde e chá sobre uma base amadeirada suave.", topNotes: "Maçã Verde, Bergamota", heartNotes: "Chá, Gerânio", baseNotes: "Almíscar, Cedro" },
  { name: "Reflection Man", brand: "Amouage", gender: "MASCULINO", tier: "RARO", family: "Aromático Floral", description: "Composição rica e complexa entre flores brancas e especiarias raras.", topNotes: "Bergamota, Coentro", heartNotes: "Jasmim, Lírio-do-vale", baseNotes: "Sândalo, Almíscar" },
  { name: "Interlude Man", brand: "Amouage", gender: "MASCULINO", tier: "RARO", family: "Oriental Especiado", description: "Denso e resinoso, com incenso e pimenta em uma jornada intensa.", topNotes: "Pimenta Rosa, Bergamota", heartNotes: "Incenso, Cravo", baseNotes: "Âmbar, Patchouli, Baunilha" },
  { name: "Wanted by Night", brand: "Azzaro", gender: "MASCULINO", tier: "CLASSICO", family: "Amadeirado Especiado", description: "Café e caramelo sobre madeiras escuras, moderno e viciante.", topNotes: "Café, Cardamomo", heartNotes: "Caramelo, Baunilha", baseNotes: "Patchouli, Cedro" },
  { name: "Phantom", brand: "Paco Rabanne", gender: "MASCULINO", tier: "CLASSICO", family: "Aromático Amadeirado", description: "Hortelã e lavanda sobre uma base amadeirada limpa e futurista.", topNotes: "Hortelã, Maçã", heartNotes: "Lavanda, Ambroxan", baseNotes: "Havana, Vetiver" },
  { name: "Gentleman Society", brand: "Givenchy", gender: "MASCULINO", tier: "PREMIUM", family: "Amadeirado Aromático", description: "Rum e especiarias sobre uma base amadeirada elegante e contemporânea.", topNotes: "Rum, Pera", heartNotes: "Noz-moscada, Íris", baseNotes: "Fava Tonka, Sândalo" },
  { name: "Stronger With You", brand: "Emporio Armani", gender: "MASCULINO", tier: "CLASSICO", family: "Amadeirado Especiado", description: "Cardamomo e pimenta rosa sobre castanha e baunilha, quente e sedutor.", topNotes: "Cardamomo, Pimenta Rosa", heartNotes: "Castanha, Sálvia", baseNotes: "Baunilha, Âmbar" },
  { name: "Y EDP", brand: "Yves Saint Laurent", gender: "MASCULINO", tier: "CLASSICO", family: "Aromático Amadeirado", description: "Frescor de maçã e gengibre sobre uma base amadeirada de sálvia e incenso.", topNotes: "Maçã, Bergamota", heartNotes: "Gengibre, Sálvia", baseNotes: "Incenso, Cedro" },

  // Femininos
  { name: "Good Girl", brand: "Carolina Herrera", gender: "FEMININO", tier: "CLASSICO", family: "Oriental Floral", description: "Contraste entre amêndoa doce e café, com jasmim e tuberosa no coração.", topNotes: "Amêndoa, Café", heartNotes: "Jasmim Sambac, Tuberosa", baseNotes: "Fava Tonka, Cacau", featured: true },
  { name: "Black Opium", brand: "Yves Saint Laurent", gender: "FEMININO", tier: "CLASSICO", family: "Oriental Baunilhado", description: "Café preto e baunilha em um oriental viciante e moderno.", topNotes: "Pera, Pimenta Rosa", heartNotes: "Café, Jasmim", baseNotes: "Baunilha, Patchouli", featured: true },
  { name: "La Vie Est Belle", brand: "Lancôme", gender: "FEMININO", tier: "CLASSICO", family: "Floral Frutado Gourmand", description: "Íris e praliné em uma composição doce, otimista e envolvente.", topNotes: "Groselha Preta, Pera", heartNotes: "Íris, Jasmim, Flor de Laranjeira", baseNotes: "Praliné, Baunilha, Patchouli" },
  { name: "Coco Mademoiselle", brand: "Chanel", gender: "FEMININO", tier: "PREMIUM", family: "Oriental Floral", description: "Elegância chipre com laranja e rosa sobre uma base âmbar sofisticada.", topNotes: "Laranja, Bergamota", heartNotes: "Rosa, Jasmim, Litchi", baseNotes: "Pátchuli, Âmbar, Baunilha" },
  { name: "Miss Dior EDP", brand: "Dior", gender: "FEMININO", tier: "PREMIUM", family: "Floral Chipre", description: "Rosa e amêndoa amarga em um chipre floral moderno e romântico.", topNotes: "Mandarina, Amêndoa Amarga", heartNotes: "Rosa Centifólia, Peônia", baseNotes: "Patchouli, Almíscar Branco" },
  { name: "Flowerbomb", brand: "Viktor & Rolf", gender: "FEMININO", tier: "PREMIUM", family: "Floral Oriental", description: "Explosão floral com jasmim e orquídea sobre patchouli adocicado.", topNotes: "Chá Verde, Bergamota", heartNotes: "Jasmim, Orquídea, Rosa", baseNotes: "Patchouli, Baunilha" },
  { name: "Light Blue", brand: "Dolce & Gabbana", gender: "FEMININO", tier: "CLASSICO", family: "Floral Cítrico", description: "Maçã granny smith e cedro siciliano, fresco e luminoso para o verão.", topNotes: "Maçã, Limão Siciliano", heartNotes: "Bambu, Jasmim", baseNotes: "Cedro, Âmbar" },
  { name: "Alien EDP", brand: "Mugler", gender: "FEMININO", tier: "CLASSICO", family: "Floral Amadeirado", description: "Jasmim sambac e madeira de cashmeran, misterioso e magnético.", topNotes: "Jasmim Sambac", heartNotes: "Flor de Laranjeira", baseNotes: "Cashmeran, Âmbar" },
  { name: "Idôle", brand: "Lancôme", gender: "FEMININO", tier: "CLASSICO", family: "Floral Almiscarado", description: "Rosa fresca e almíscar limpo, moderno e minimalista.", topNotes: "Pera, Bergamota", heartNotes: "Rosa, Jasmim", baseNotes: "Almíscar Branco, Cedro" },
  { name: "Olympéa", brand: "Paco Rabanne", gender: "FEMININO", tier: "CLASSICO", family: "Floral Âmbar", description: "Baunilha salgada e flor de laranjeira sobre um âmbar quente.", topNotes: "Flor de Laranjeira, Jasmim", heartNotes: "Baunilha Salgada", baseNotes: "Âmbar, Sal, Sândalo" },
  { name: "Mon Paris", brand: "Yves Saint Laurent", gender: "FEMININO", tier: "CLASSICO", family: "Floral Frutado", description: "Framboesa e pera doces sobre um coração floral romântico.", topNotes: "Framboesa, Pera, Bergamota", heartNotes: "Peônia, Jasmim", baseNotes: "Patchouli, Âmbar, Baunilha" },
  { name: "Libre EDP", brand: "Yves Saint Laurent", gender: "FEMININO", tier: "PREMIUM", family: "Floral Amadeirado", description: "Lavanda francesa e flor de laranjeira sobre madeiras e baunilha de Madagascar.", topNotes: "Mandarina, Cassis", heartNotes: "Lavanda, Flor de Laranjeira", baseNotes: "Baunilha, Almíscar Amadeirado" },
  { name: "Very Good Girl", brand: "Carolina Herrera", gender: "FEMININO", tier: "PREMIUM", family: "Oriental Floral", description: "Versão intensificada de Good Girl, com jasmim mais denso e fundo amadeirado.", topNotes: "Amêndoa, Bergamota", heartNotes: "Jasmim, Tuberosa", baseNotes: "Fava Tonka, Sândalo" },
  { name: "212 VIP Black", brand: "Carolina Herrera", gender: "FEMININO", tier: "CLASSICO", family: "Oriental Especiado", description: "Café e especiarias sobre uma base doce e sedutora para a noite.", topNotes: "Café, Especiarias", heartNotes: "Rum, Baunilha", baseNotes: "Fava Tonka, Âmbar" },
  { name: "Scandal", brand: "Jean Paul Gaultier", gender: "FEMININO", tier: "CLASSICO", family: "Floral Gourmand", description: "Mel e maracujá sobre gardênia, doce e ousado.", topNotes: "Maracujá, Laranja Sanguínea", heartNotes: "Gardênia, Mel", baseNotes: "Patchouli, Caramelo" },
  { name: "Chance Eau Tendre", brand: "Chanel", gender: "FEMININO", tier: "PREMIUM", family: "Floral Frutado", description: "Toranja e quivi sobre um coração floral delicado e jasmim branco.", topNotes: "Toranja, Quivi", heartNotes: "Jasmim, Peônia", baseNotes: "Almíscar Branco, Âmbar" },
  { name: "J'adore EDP", brand: "Dior", gender: "FEMININO", tier: "PREMIUM", family: "Floral Frutado", description: "Buquê luminoso de ylang-ylang, rosa e jasmim em uma composição atemporal.", topNotes: "Bergamota, Pera Melão", heartNotes: "Ylang-Ylang, Rosa, Jasmim", baseNotes: "Almíscar, Baunilha" },
  { name: "Alien Goddess", brand: "Mugler", gender: "FEMININO", tier: "PREMIUM", family: "Floral Amadeirado", description: "Baunilha de Madagascar e jasmim de Grasse sobre madeiras luminosas.", topNotes: "Bergamota", heartNotes: "Jasmim de Grasse", baseNotes: "Baunilha, Cashmeran" },
  { name: "My Way", brand: "Giorgio Armani", gender: "FEMININO", tier: "CLASSICO", family: "Floral Branco", description: "Flor de laranjeira e jasmim sobre baunilha e sândalo, luminoso e sereno.", topNotes: "Bergamota, Flor de Laranjeira", heartNotes: "Tuberosa, Jasmim", baseNotes: "Baunilha, Sândalo, Cedro" },

  // Unissex / Nicho
  { name: "Baccarat Rouge 540", brand: "Maison Francis Kurkdjian", gender: "UNISSEX", tier: "RARO", family: "Âmbar Floral", description: "Açafrão e jasmim sobre âmbar-cinza e madeiras cristalinas, um ícone de nicho contemporâneo.", topNotes: "Açafrão, Jasmim", heartNotes: "Âmbar-cinza, Flor de Laranjeira", baseNotes: "Cedro, Almíscar Branco", featured: true },
  { name: "Grand Soir", brand: "Maison Francis Kurkdjian", gender: "UNISSEX", tier: "RARO", family: "Âmbar Baunilhado", description: "Âmbar denso e resinoso, quente e sofisticado para as noites frias.", topNotes: "Resinas", heartNotes: "Âmbar, Baunilha", baseNotes: "Benjoim, Fava Tonka" },
  { name: "Aqua Universalis", brand: "Maison Francis Kurkdjian", gender: "UNISSEX", tier: "PREMIUM", family: "Cítrico Almiscarado", description: "Cítrico limpo e almiscarado, versátil e fresco para qualquer ocasião.", topNotes: "Bergamota, Limão", heartNotes: "Jasmim, Almíscar", baseNotes: "Sândalo, Almíscar Branco" },
  { name: "Delina", brand: "Parfums de Marly", gender: "FEMININO", tier: "RARO", family: "Floral Frutado", description: "Lichia e ruibarbo sobre pétalas de rosa turca, romântico e luminoso.", topNotes: "Ruibarbo, Lichia", heartNotes: "Rosa Turca, Peônia", baseNotes: "Almíscar, Cedro", featured: true },
  { name: "Kirke", brand: "Tiziana Terenzi", gender: "FEMININO", tier: "RARO", family: "Floral Frutado", description: "Framboesa e pêssego sobre um coração floral denso e sensual.", topNotes: "Framboesa, Pêssego", heartNotes: "Jasmim, Tuberosa", baseNotes: "Baunilha, Âmbar" },
  { name: "Oud Wood", brand: "Tom Ford", gender: "UNISSEX", tier: "RARO", family: "Amadeirado Especiado", description: "Oud raro e sândalo defumado com toque de cardamomo, denso e envolvente.", topNotes: "Cardamomo, Pimenta", heartNotes: "Oud, Sândalo", baseNotes: "Âmbar, Baunilha" },
  { name: "Tobacco Vanille", brand: "Tom Ford", gender: "UNISSEX", tier: "RARO", family: "Oriental Especiado", description: "Tabaco doce e baunilha densa, quente como uma tarde de inverno.", topNotes: "Tabaco, Especiarias", heartNotes: "Baunilha, Cacau", baseNotes: "Fava Tonco, Madeiras Secas" },
  { name: "Santal 33", brand: "Le Labo", gender: "UNISSEX", tier: "RARO", family: "Amadeirado", description: "Sândalo cremoso com couro e especiarias, assinatura minimalista de Nova York.", topNotes: "Cardamomo, Íris", heartNotes: "Sândalo, Couro", baseNotes: "Cedro, Âmbar" },
  { name: "Another 13", brand: "Le Labo", gender: "UNISSEX", tier: "RARO", family: "Almiscarado Amadeirado", description: "Almíscar de ambreína sobre uma base amadeirada abstrata e moderna.", topNotes: "Ambreína", heartNotes: "Almíscar", baseNotes: "Madeiras Brancas" },
  { name: "Rose 31", brand: "Le Labo", gender: "UNISSEX", tier: "RARO", family: "Floral Especiado", description: "Rosa especiada com cominho, longe do floral tradicional, ousado e moderno.", topNotes: "Cominho, Cardamomo", heartNotes: "Rosa", baseNotes: "Vetiver, Almíscar" },
  { name: "Gypsy Water", brand: "Byredo", gender: "UNISSEX", tier: "PREMIUM", family: "Amadeirado Cítrico", description: "Bergamota e pinho sobre baunilha e âmbar, livre como uma viagem cigana.", topNotes: "Bergamota, Limão, Pimenta", heartNotes: "Pinho, Incenso", baseNotes: "Baunilha, Âmbar, Sândalo" },
  { name: "Bal d'Afrique", brand: "Byredo", gender: "UNISSEX", tier: "PREMIUM", family: "Floral Cítrico", description: "Capim-limão e violeta sobre um fundo almiscarado e quente.", topNotes: "Bergamota, Capim-limão", heartNotes: "Violeta, Jasmim", baseNotes: "Almíscar, Vetiver" },
  { name: "Molecule 01", brand: "Escentric Molecules", gender: "UNISSEX", tier: "PREMIUM", family: "Almiscarado Amadeirado", description: "Iso E Super puro, uma nota amadeirada aveludada que reage com a pele de cada pessoa.", topNotes: "Iso E Super", heartNotes: "Almíscar aveludado", baseNotes: "Âmbar Amadeirado" },
  { name: "Erba Pura", brand: "Xerjoff", gender: "UNISSEX", tier: "RARO", family: "Cítrico Frutado", description: "Bergamota e frutas vermelhas sobre baunilha e almíscar, vibrante e doce.", topNotes: "Bergamota, Groselha", heartNotes: "Frutas Vermelhas", baseNotes: "Baunilha, Almíscar" },
  { name: "Portrait of a Lady", brand: "Frederic Malle", gender: "FEMININO", tier: "RARO", family: "Chipre Floral", description: "Rosa turca e patchouli intenso em uma composição densa e opulenta.", topNotes: "Framboesa, Cravo", heartNotes: "Rosa Turca, Incenso", baseNotes: "Patchouli, Baunilha" },
  { name: "Angels' Share", brand: "By Kilian", gender: "UNISSEX", tier: "RARO", family: "Oriental Amadeirado", description: "Conhaque e canela sobre carvalho envelhecido, quente como uma adega.", topNotes: "Conhaque, Canela", heartNotes: "Carvalho, Fava Tonka", baseNotes: "Sândalo, Âmbar" },
];

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Limpando dados existentes...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();

  console.log(`Semeando ${products.length} produtos...`);
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const prices = TIER_PRICES[p.tier];
    const slugBase = slugify(`${p.brand}-${p.name}`);

    await prisma.product.create({
      data: {
        slug: slugBase,
        name: p.name,
        brand: p.brand,
        gender: p.gender,
        family: p.family,
        description: p.description,
        topNotes: p.topNotes,
        heartNotes: p.heartNotes,
        baseNotes: p.baseNotes,
        featured: Boolean(p.featured),
        variants: {
          create: [
            { sizeMl: 2, priceCents: prices["2"], stock: 20 + ((i * 3) % 15), sku: `${slugBase}-2ML`.toUpperCase() },
            { sizeMl: 5, priceCents: prices["5"], stock: 12 + ((i * 5) % 12), sku: `${slugBase}-5ML`.toUpperCase() },
            { sizeMl: 10, priceCents: prices["10"], stock: 6 + ((i * 2) % 8), sku: `${slugBase}-10ML`.toUpperCase() },
          ],
        },
      },
    });
  }

  const email = process.env.ADMIN_EMAIL ?? "contato@grassenceparfums.com.br";
  const name = process.env.ADMIN_NAME ?? "Grassence Admin";
  const password = process.env.ADMIN_PASSWORD ?? "troque-esta-senha";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name },
  });

  console.log(`Usuário admin pronto: ${email}`);
  console.log("Seed concluído.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

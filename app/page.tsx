import React from 'react';
import { db, products } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import ShowcaseClient from '@/components/ShowcaseClient';
import Image from 'next/image';
import { ShieldCheck, Heart } from 'lucide-react';

// Revalidação a cada 60 segundos por padrão (ISR)
export const revalidate = 60;

async function getProducts() {
  try {
    // Tenta buscar os produtos ativos do banco de dados Neon
    const result = await db
      .select()
      .from(products)
      .where(eq(products.active, true))
      .orderBy(desc(products.createdAt));
    
    return result;
  } catch (error) {
    console.error("⚠️ Falha ao conectar ao NeonDB. Utilizando produtos mock de demonstração:", error);
    
    // Lista de produtos fictícios premium de demonstração
    return [
      {
        id: 1,
        title: "Fone de Ouvido Bluetooth Anker Soundcore Life Q30 Hybrid Active Noise Cancelling",
        url: "https://www.amazon.com.br",
        category: "Eletrônicos",
        origin: "amazon",
        imageUrl: "https://m.media-amazon.com/images/I/61Kpx9F8gEL._AC_SL1500_.jpg",
        price: "349.00",
        description: "Cancelamento de ruído ativo híbrido personalizável, bateria gigante de até 40 horas e som Hi-Res certificado.",
        active: true,
        createdAt: new Date(),
      },
      {
        id: 2,
        title: "Mini Processador de Alimentos USB Recarregável 3 Lâminas Inox",
        url: "https://shopee.com.br",
        category: "Casa",
        origin: "shopee",
        imageUrl: null, // Scraper Open Graph vai rodar no cliente
        price: "24.90",
        description: "Praticidade absoluta. Triture alho, cebola e temperos num clique. Recarregável e sem fio.",
        active: true,
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        id: 3,
        title: "Teclado Mecânico Gamer Redragon Fizz K617 RGB Compacto 60%",
        url: "https://www.mercadolivre.com.br",
        category: "Eletrônicos",
        origin: "mercadolivre",
        imageUrl: null, // Forçará o fallback premium por categoria
        price: "199.90",
        description: "Layout compacto de 61 teclas, switches vermelhos lineares e silenciosos, iluminação RGB vibrante.",
        active: true,
        createdAt: new Date(Date.now() - 7200000),
      },
      {
        id: 4,
        title: "Garrafa Térmica Kouda 500ml Aço Inox com Isolamento a Vácuo",
        url: "https://www.amazon.com.br",
        category: "Casa",
        origin: "amazon",
        imageUrl: null,
        price: "109.90",
        description: "Mantém a sua bebida gelada por até 24 horas e quente por 12 horas. Livre de BPA e anti-vazamento.",
        active: true,
        createdAt: new Date(Date.now() - 10800000),
      },
      {
        id: 5,
        title: "Camiseta Oversized Masculina Algodão Egípcio Streetwear Premium",
        url: "https://shopee.com.br",
        category: "Moda",
        origin: "shopee",
        imageUrl: null,
        price: "59.90",
        description: "Modelagem larga streetwear moderna, malha encorpada de alta qualidade. Conforto e caimento premium.",
        active: true,
        createdAt: new Date(Date.now() - 14400000),
      },
      {
        id: 6,
        title: "Mouse Gamer Sem Fio Logitech G305 Lightspeed 12.000 DPI",
        url: "https://www.amazon.com.br",
        category: "Eletrônicos",
        origin: "amazon",
        imageUrl: "https://m.media-amazon.com/images/I/51yV+94nC9L._AC_SL1500_.jpg",
        price: "229.00",
        description: "Sensor HERO de última geração com eficiência energética impressionante. Conexão sem atrasos Lightspeed.",
        active: true,
        createdAt: new Date(Date.now() - 18000000),
      }
    ];
  }
}

export default async function Home() {
  const allProducts = await getProducts();

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Mesh Light Effect - Glows */}
      <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[150px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse-slow-delay pointer-events-none" />

      {/* Header / Navegação */}
      <header className="relative w-full max-w-5xl mx-auto px-4 pt-8 pb-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-transform duration-500 group-hover:rotate-12">
            <Image src="/VitrineHub.png" alt="VitrineHub" width={24} height={24} className="w-6 h-6" />
          </div>
          <span className="text-lg md:text-xl font-black uppercase tracking-widest bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Vitrine<span className="text-emerald-400">Hub</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Links Verificados & Seguros</span>
          <span className="sm:hidden">Seguro</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative flex-grow flex flex-col pt-12 md:pt-16">
        <div className="w-full max-w-3xl mx-auto text-center px-4 mb-10 flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white mb-4">
            Achados Imperdíveis em{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Um Só Lugar
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-medium max-w-xl leading-relaxed">
            Navegue pelos melhores produtos e cupons da Shopee, Amazon e Mercado Livre. Centralizado, atualizado instantaneamente e livre de anúncios irritantes.
          </p>
        </div>

        {/* Vitrine / Filtros + Grid de Produtos */}
        <ShowcaseClient initialProducts={allProducts} />
      </main>

      {/* Footer */}
      <footer className="relative w-full max-w-5xl mx-auto px-4 py-8 mt-auto border-t border-white/5 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-semibold uppercase tracking-wider">
        <div>
          &copy; {new Date().getFullYear()} VitrineHub. Todos os direitos reservados.
        </div>
        <a
          href="https://ruankaylo.netlify.app/?utm_source=vitrinehub&utm_medium=footer&utm_campaign=discovery"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> by Ruan.
          </span>
        </a>
      </footer>
    </div>
  );
}

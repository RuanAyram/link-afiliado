'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink, Tag, Package, ShoppingBag, Star, Zap } from 'lucide-react';
import OriginBadge from './OriginBadge';
import { Product } from '@/lib/db';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [image, setImage] = useState<string | null>(product.imageUrl);
  const [loading, setLoading] = useState<boolean>(!product.imageUrl);
  const [ogFetched, setOgFetched] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Efeito para buscar imagem via Open Graph se não houver no banco de dados
  useEffect(() => {
    if (product.imageUrl) {
      setImage(product.imageUrl);
      setLoading(false);
      return;
    }

    if (ogFetched) return;

    let isMounted = true;
    async function fetchOgImage() {
      try {
        setLoading(true);
        const res = await fetch(`/api/og?url=${encodeURIComponent(product.url)}`);
        if (!res.ok) throw new Error('Falha no scraping');
        const data = await res.json();
        
        if (isMounted) {
          if (data.image) {
            setImage(data.image);
          }
          setOgFetched(true);
        }
      } catch (err) {
        console.error('Erro ao carregar imagem via OG:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchOgImage();

    return () => {
      isMounted = false;
    };
  }, [product.url, product.imageUrl, ogFetched]);

  // Formata preço em Real (BRL)
  const formattedPrice = product.price
    ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(Number(product.price))
    : null;

  // Determina ícone baseado na categoria
  const getCategoryIcon = () => {
    const category = product.category?.toLowerCase() || '';
    if (category.includes('eletr') || category.includes('tech') || category.includes('celular')) {
      return <Zap className="w-8 h-8 text-cyan-400" />;
    }
    if (category.includes('vest') || category.includes('moda') || category.includes('roupa')) {
      return <ShoppingBag className="w-8 h-8 text-rose-400" />;
    }
    if (category.includes('casa') || category.includes('cozinha') || category.includes('decor')) {
      return <Package className="w-8 h-8 text-amber-400" />;
    }
    return <Tag className="w-8 h-8 text-emerald-400" />;
  };

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col h-full bg-slate-900/60 border border-white/5 hover:border-emerald-500/30 rounded-3xl overflow-hidden backdrop-blur-md transition-all duration-500 group focus:outline-none hover:shadow-[0_15px_40px_-15px_rgba(16,185,129,0.15)] focus:shadow-[0_15px_40px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-1.5"
    >
      {/* Contorno com brilho em degradê no hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 pointer-events-none transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Container de Imagem */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950/80 border-b border-white/5">
        {loading ? (
          // Skeleton Loader de alta qualidade
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 animate-pulse">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Carregando visual...</span>
            </div>
          </div>
        ) : image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized={true} // Evita reprocessamento na Vercel para URLs externas aleatórias
            onError={() => {
              console.log('Falha ao carregar imagem externa do produto, mudando para fallback');
              setImage(null);
            }}
          />
        ) : (
          // Imagem de Fallback Premium com degradê
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-[inset_0_4px_12px_rgba(255,255,255,0.03)] mb-2 group-hover:scale-110 transition-transform duration-500">
              {getCategoryIcon()}
            </div>
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-wider text-center">
              {product.category || 'VitrineHub'}
            </span>
          </div>
        )}

        {/* Badge da Origem fixada no canto superior esquerdo */}
        <div className="absolute top-3 left-3 z-10">
          <OriginBadge origin={product.origin} />
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="flex flex-col flex-grow p-5">
        {/* Categoria do Produto */}
        {product.category && (
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {product.category}
          </span>
        )}

        {/* Título do Produto */}
        <h3 className="text-sm md:text-base font-bold text-slate-100 line-clamp-2 leading-relaxed mb-2.5 flex-grow group-hover:text-emerald-400 transition-colors duration-300">
          {product.title}
        </h3>

        {/* Descrição Opcional */}
        {product.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-normal">
            {product.description}
          </p>
        )}

        {/* Rodapé do Card: Preço e Ação */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div>
            {formattedPrice ? (
              <span className="text-lg font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {formattedPrice}
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-400/80 uppercase tracking-wider">
                Ver Preço
              </span>
            )}
          </div>

          {/* Botão de Ação */}
          <div className="p-2 rounded-xl bg-white/5 group-hover:bg-emerald-500 group-hover:text-slate-950 text-emerald-400 border border-white/10 group-hover:border-transparent transition-all duration-300 shadow-md">
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </div>
    </a>
  );
}

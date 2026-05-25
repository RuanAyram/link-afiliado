'use client';

import React, { useState, useMemo } from 'react';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import ProductCard from './ProductCard';
import { Product } from '@/lib/db';
import { RefreshCw, Filter, Sparkles } from 'lucide-react';

interface ShowcaseClientProps {
  initialProducts: Product[];
}

export default function ShowcaseClient({ initialProducts }: ShowcaseClientProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('todos');

  // Extrai categorias únicas dinamicamente do banco de dados (ignorando vazias)
  const categories = useMemo(() => {
    const list = initialProducts
      .map((p) => p.category?.trim())
      .filter((c): c is string => !!c);
    return Array.from(new Set(list));
  }, [initialProducts]);

  // Extrai origens únicas dinamicamente do banco de dados
  const origins = useMemo(() => {
    const list = initialProducts
      .map((p) => p.origin?.trim().toLowerCase())
      .filter((o): o is string => !!o);
    return Array.from(new Set(list));
  }, [initialProducts]);

  // Filtra produtos com base em busca, categoria e origem
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Filtro de Categoria
      if (
        selectedCategory !== 'todos' &&
        product.category?.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      // 2. Filtro de Origem (Shopee, Amazon, etc.)
      if (
        selectedOrigin !== 'todos' &&
        product.origin?.toLowerCase() !== selectedOrigin.toLowerCase()
      ) {
        return false;
      }

      // 3. Filtro de Busca
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query) || false;
        const matchesCat = product.category?.toLowerCase().includes(query) || false;
        
        return matchesTitle || matchesDesc || matchesCat;
      }

      return true;
    });
  }, [initialProducts, selectedCategory, selectedOrigin, searchQuery]);

  // Limpa todos os filtros
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('todos');
    setSelectedOrigin('todos');
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Seção de Busca e Origem */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full max-w-5xl mx-auto px-4">
        {/* Barra de Pesquisa */}
        <div className="w-full md:w-auto flex-1">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Filtro de Origem / Plataformas */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto py-1 justify-start md:justify-end">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3 h-3" />
            <span>Loja:</span>
          </div>

          <button
            onClick={() => setSelectedOrigin('todos')}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all duration-300 whitespace-nowrap focus:outline-none ${
              selectedOrigin === 'todos'
                ? 'bg-white/10 text-white border-white/20'
                : 'bg-transparent text-slate-500 hover:text-slate-300 border-transparent hover:bg-white/5'
            }`}
          >
            Todas
          </button>

          {origins.map((origin) => {
            const isSelected = selectedOrigin === origin;
            let displayLabel = origin.charAt(0).toUpperCase() + origin.slice(1);
            if (origin === 'mercadolivre') displayLabel = 'M. Livre';

            return (
              <button
                key={origin}
                onClick={() => setSelectedOrigin(origin)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all duration-300 whitespace-nowrap focus:outline-none ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                    : 'bg-transparent text-slate-500 hover:text-slate-300 border-transparent hover:bg-white/5'
                }`}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Seção de Categorias */}
      <div className="w-full max-w-5xl mx-auto border-y border-white/5 py-4">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Contador de Resultados */}
      <div className="w-full max-w-5xl mx-auto px-4 flex justify-between items-center text-xs text-slate-500 font-semibold uppercase tracking-wider">
        <div className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Mostrando {filteredProducts.length} achados</span>
        </div>
        {(searchQuery || selectedCategory !== 'todos' || selectedOrigin !== 'todos') && (
          <button
            onClick={handleResetFilters}
            className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 focus:outline-none"
          >
            <RefreshCw className="w-3 h-3" />
            Limpar filtros
          </button>
        )}
      </div>

      {/* Grid de Produtos */}
      <div className="w-full max-w-5xl mx-auto px-4 pb-20">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          // Estado de Nenhum Produto Encontrado
          <div className="flex flex-col items-center justify-center py-20 px-6 rounded-3xl border border-dashed border-white/10 bg-slate-900/20 max-w-md mx-auto text-center backdrop-blur-sm">
            <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-4">
              <Filter className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">
              Nenhum achado por aqui
            </h3>
            <p className="text-sm text-slate-500 mb-6 max-w-xs leading-relaxed">
              Tente alterar os termos da busca ou os filtros de categoria e loja para encontrar o que procura.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl transition-all duration-300 focus:outline-none shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 scale-100 hover:scale-[1.02]"
            >
              Resetar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

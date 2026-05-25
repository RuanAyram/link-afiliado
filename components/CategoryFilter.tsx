import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 flex items-center justify-start md:justify-center gap-2.5 px-4 md:px-0">
      <button
        onClick={() => onSelectCategory('todos')}
        className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border transition-all duration-300 whitespace-nowrap focus:outline-none ${
          selectedCategory === 'todos'
            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 border-transparent shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.03]'
            : 'bg-slate-900/40 hover:bg-slate-900/80 text-slate-400 hover:text-slate-200 border-white/5 hover:border-white/10'
        }`}
      >
        Todos
      </button>

      {categories.map((category) => {
        if (!category) return null;
        const isSelected = selectedCategory.toLowerCase() === category.toLowerCase();
        
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border transition-all duration-300 whitespace-nowrap focus:outline-none ${
              isSelected
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 border-transparent shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.03]'
                : 'bg-slate-900/40 hover:bg-slate-900/80 text-slate-400 hover:text-slate-200 border-white/5 hover:border-white/10'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md mx-auto group">
      {/* Glow Effect Background */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-500" />
      
      <div className="relative flex items-center bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 group-focus-within:border-emerald-500/50">
        <div className="pl-4 text-slate-400 group-focus-within:text-emerald-400 transition-colors duration-300">
          <Search className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar produtos incríveis..."
          className="w-full bg-transparent py-4 px-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-medium"
        />

        {value && (
          <button
            onClick={() => onChange('')}
            className="pr-4 text-slate-400 hover:text-rose-400 transition-colors duration-300 focus:outline-none"
            aria-label="Limpar busca"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

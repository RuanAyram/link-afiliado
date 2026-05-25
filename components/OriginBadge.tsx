import React from 'react';
import { ShoppingBag, Star, Zap } from 'lucide-react';

interface OriginBadgeProps {
  origin: string | null;
}

export default function OriginBadge({ origin }: OriginBadgeProps) {
  const normalizedOrigin = origin?.toLowerCase().trim() || 'outros';

  let config = {
    label: 'VitrineHub',
    gradient: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30',
    dotColor: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
    icon: <Zap className="w-3.5 h-3.5" />,
  };

  switch (normalizedOrigin) {
    case 'shopee':
      config = {
        label: 'Shopee',
        gradient: 'from-orange-500/20 to-rose-500/20 text-orange-300 border-orange-500/30',
        dotColor: 'bg-orange-400 shadow-[0_0_8px_#f97316]',
        icon: <ShoppingBag className="w-3.5 h-3.5" />,
      };
      break;
    case 'amazon':
      config = {
        label: 'Amazon',
        gradient: 'from-amber-500/20 to-yellow-600/20 text-amber-300 border-amber-500/30',
        dotColor: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
        icon: <Star className="w-3.5 h-3.5" />,
      };
      break;
    case 'mercadolivre':
    case 'mercado livre':
      config = {
        label: 'Mercado Livre',
        gradient: 'from-yellow-400/20 to-blue-500/10 text-yellow-200 border-yellow-400/30',
        dotColor: 'bg-yellow-400 shadow-[0_0_8px_#facc15]',
        icon: <Zap className="w-3.5 h-3.5" />,
      };
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border backdrop-blur-sm transition-all duration-300 ${config.gradient}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}

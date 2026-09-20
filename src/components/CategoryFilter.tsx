import React from 'react';
import { motion } from 'motion/react';
import { Droplets, Sparkles, Sun, Leaf, ShieldCheck, Sparkle } from 'lucide-react';
import { CategoryId, CategoryOption } from '../types';

interface CategoryFilterProps {
  categories: CategoryOption[];
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  productCounts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  productCounts,
}) => {
  const getIcon = (iconName: string) => {
    const className = "w-5 h-5";
    switch (iconName) {
      case 'Droplets':
        return <Droplets className={className} />;
      case 'Sun':
        return <Sun className={className} />;
      case 'Leaf':
        return <Leaf className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Sparkle':
        return <Sparkle className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <section className="my-6">
      {/* Marcas - nuevo módulo superior Lumina */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#102A43]/70 mb-3 px-1">Explorar por Marca</h2>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { id: 'CeraVe', label: 'CeraVe' },
            { id: 'La Roche-Posay', label: 'La Roche' },
            { id: 'The Ordinary', label: 'Ordinary' },
            { id: 'SKIN1004', label: 'SKIN1004' },
          ].map((brand) => (
            <button
              key={brand.id}
              onClick={() => {
                const el = document.getElementById('catalog');
                el?.scrollIntoView({ behavior: 'smooth' });
                // filtra por marca via evento
                window.dispatchEvent(new CustomEvent('filterByBrand', { detail: brand.id }));
              }}
              className="shrink-0 w-16 h-16 rounded-full bg-white border border-[#102A43]/10 flex items-center justify-center hover:border-[#dbeafe] hover:bg-[#dbeafe]/30 shadow-xs transition-colors"
            >
              <span className="text-[10px] font-bold text-[#102A43] text-center leading-tight">{brand.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#102A43]/70">
          Explorar por Necesidad
        </h2>
        <span className="text-xs text-neutral-400">
          {productCounts[selectedCategory] || 0} {productCounts[selectedCategory] === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      {/* Horizontal scrollable category icons inspired by reference image */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              whileTap={{ scale: 0.94 }}
              className={`flex flex-col items-center gap-1.5 shrink-0 px-3.5 py-3 rounded-2xl transition-all duration-200 min-w-[76px] cursor-pointer ${
                isSelected
                  ? 'bg-[#102A43] text-white shadow-md shadow-[#102A43]/15'
                  : 'bg-white/80 hover:bg-white text-neutral-600 border border-[#102A43]/10 hover:border-[#102A43]/30'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-white/15 text-white'
                    : 'bg-[#dbeafe] text-[#102A43]'
                }`}
              >
                {getIcon(cat.icon)}
              </div>
              <span className="text-xs font-medium whitespace-nowrap">
                {cat.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

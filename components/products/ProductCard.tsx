'use client';

import { Product } from '@/types';
import { ShoppingBag, CheckCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isPurchased: boolean;
  onSelect: (product: Product) => void;
  isSelected: boolean;
}

export default function ProductCard({ product, isPurchased, onSelect, isSelected }: ProductCardProps) {
  return (
    <div
      onClick={() => !isPurchased && onSelect(product)}
      className={`
        relative flex-shrink-0 w-80 bg-slate-800 rounded-lg overflow-hidden 
        border-2 transition-all cursor-pointer
        ${isSelected ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' : 'border-slate-700'}
        ${isPurchased ? 'opacity-60 cursor-not-allowed' : 'hover:border-yellow-500 hover:shadow-lg'}
      `}
    >
      {/* Imagen del producto */}
      <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
        <ShoppingBag className="text-yellow-500" size={64} strokeWidth={1.5} />
      </div>

      {/* Información del producto */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{product.nombre}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.descripcion}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-yellow-500">
            S/ {product.precio.toFixed(2)}
          </span>
          
          {isPurchased && (
            <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-medium border border-green-500 flex items-center gap-1">
              <CheckCircle size={14} />
              Comprado
            </span>
          )}
        </div>
      </div>

      {isPurchased && (
        <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-lg flex items-center gap-2">
            <CheckCircle size={20} />
            Ya lo compraste
          </div>
        </div>
      )}
    </div>
  );
}

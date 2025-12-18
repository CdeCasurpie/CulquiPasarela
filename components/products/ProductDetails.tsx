'use client';

import { Product } from '@/types';
import { ShoppingBag, CheckCircle, CreditCard, Clock } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
  isPurchased: boolean;
  onPurchase: (product: Product) => void;
  loading?: boolean;
}

export default function ProductDetails({ product, isPurchased, onPurchase, loading }: ProductDetailsProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
      <div className="flex items-start gap-6">
        {/* Imagen grande */}
        <div className="flex-shrink-0 w-48 h-48 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
          <ShoppingBag className="text-yellow-500" size={80} strokeWidth={1.5} />
        </div>

        {/* Información */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white mb-3">{product.nombre}</h2>
          <p className="text-slate-300 text-lg mb-6">{product.descripcion}</p>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl font-bold text-yellow-500">
              S/ {product.precio.toFixed(2)}
            </div>
            {isPurchased && (
              <span className="bg-green-500/20 text-green-500 px-4 py-2 rounded-full text-sm font-medium border border-green-500 flex items-center gap-2">
                <CheckCircle size={18} />
                Ya compraste este producto
              </span>
            )}
          </div>

          {/* Botón de compra */}
          {!isPurchased && (
            <button
              onClick={() => onPurchase(product)}
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-4 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center gap-3"
            >
              {loading ? (
                <>
                  <Clock className="animate-spin" size={24} />
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard size={24} />
                  Pagar con Culqi
                </>
              )}
            </button>
          )}

          {isPurchased && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-6 py-3 rounded-lg inline-flex items-center gap-2">
              <CheckCircle size={20} />
              Este producto ya está en tu biblioteca
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

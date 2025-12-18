'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
  purchasedProductIds: string[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
}

export default function ProductCarousel({
  products,
  purchasedProductIds,
  selectedProduct,
  onSelectProduct
}: ProductCarouselProps) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isPurchased={purchasedProductIds.includes(product.id)}
            onSelect={onSelectProduct}
            isSelected={selectedProduct?.id === product.id}
          />
        ))}
      </div>
    </div>
  );
}

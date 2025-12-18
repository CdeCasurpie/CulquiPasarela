'use client';

import { useState, useEffect } from 'react';
import { Product, PurchasedProduct } from '@/types';
import productsService from '@/services/products.service';

export function useProducts(userId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [purchasedProducts, setPurchasedProducts] = useState<PurchasedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [userId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const allProducts = await productsService.getProducts();
      setProducts(allProducts);

      if (userId) {
        const purchased = await productsService.getPurchasedProducts(userId);
        setPurchasedProducts(purchased);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const isPurchased = (productId: string): boolean => {
    return purchasedProducts.some(p => p.id === productId);
  };

  const refreshProducts = () => {
    loadProducts();
  };

  return {
    products,
    purchasedProducts,
    loading,
    error,
    isPurchased,
    refreshProducts
  };
}

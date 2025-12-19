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
    if (userId) {
      loadProducts();
    }
  }, [userId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [allProducts, purchased] = await Promise.all([
        productsService.getProducts(),
        productsService.getPurchasedProducts(),
      ]);
      
      setProducts(allProducts);
      setPurchasedProducts(purchased);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos';
      setError(errorMessage);
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const isPurchased = (productId: string): boolean => {
    return products.find(p => p.id === productId)?.purchased || false;
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

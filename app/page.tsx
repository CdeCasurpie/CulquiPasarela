'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import Header from '@/components/layout/Header';
import ProductCarousel from '@/components/products/ProductCarousel';
import ProductDetails from '@/components/products/ProductDetails';
import culqiService from '@/services/culqi.service';
import productsService from '@/services/products.service';
import { ShoppingBag, CheckCircle } from 'lucide-react';

export default function Home() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { products, purchasedProducts, loading: productsLoading, isPurchased, refreshProducts } = useProducts(user?.id);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Manejar selección de producto
  const handleSelectProduct = (product: Product) => {
    if (!isPurchased(product.id)) {
      setSelectedProduct(product);
    }
  };

  // Manejar proceso de pago
  const handlePurchase = async (product: Product) => {
    if (!user) return;

    try {
      setPaymentLoading(true);

      // Abrir Culqi Checkout (MOCK)
      const token = await culqiService.openCheckout(
        product.precio,
        product.nombre,
        user.email
      );

      // Simular llamada a Edge Function
      // En producción: await supabase.functions.invoke('create_payment', { ... })
      await productsService.createPayment(user.id, product.id, token.id);

      // Éxito
      alert('Pago exitoso! El producto ha sido agregado a tu biblioteca.');
      
      // Refrescar productos
      refreshProducts();
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error en el pago:', error);
      alert('Error: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setPaymentLoading(false);
    }
  };

  // Pantalla de carga inicial
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  // Pantalla de autenticación
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        {showRegister ? (
          <RegisterForm
            onSuccess={() => window.location.reload()}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <LoginForm
            onSuccess={() => window.location.reload()}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    );
  }

  // Dashboard principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Sección de productos */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="text-yellow-500" size={32} />
            <h2 className="text-3xl font-bold text-white">
              Productos Disponibles
            </h2>
          </div>
          
          {productsLoading ? (
            <div className="text-white text-center py-12">Cargando productos...</div>
          ) : products.length === 0 ? (
            <div className="text-slate-400 text-center py-12">No hay productos disponibles</div>
          ) : (
            <ProductCarousel
              products={products}
              purchasedProductIds={purchasedProducts.map(p => p.id)}
              selectedProduct={selectedProduct}
              onSelectProduct={handleSelectProduct}
            />
          )}
        </section>

        {/* Detalle del producto seleccionado */}
        {selectedProduct && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="text-yellow-500" size={32} />
              <h2 className="text-3xl font-bold text-white">
                Detalle del Producto
              </h2>
            </div>
            <ProductDetails
              product={selectedProduct}
              isPurchased={isPurchased(selectedProduct.id)}
              onPurchase={handlePurchase}
              loading={paymentLoading}
            />
          </section>
        )}

        {/* Productos comprados */}
        {purchasedProducts.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="text-green-500" size={32} />
              <h2 className="text-3xl font-bold text-white">
                Tus Productos Comprados
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-slate-800 rounded-lg p-6 border border-green-500/50"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg mb-3">
                    <ShoppingBag className="text-yellow-500" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{product.nombre}</h3>
                  <p className="text-slate-400 text-sm mb-3">{product.descripcion}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-500 font-bold">S/ {product.precio.toFixed(2)}</span>
                    <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-medium border border-green-500 flex items-center gap-1">
                      <CheckCircle size={14} />
                      Comprado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

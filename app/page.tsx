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
import { ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react';

export default function Home() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { products, purchasedProducts, loading: productsLoading, isPurchased, refreshProducts, error: productsError } = useProducts(user?.id);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentCancelled, setPaymentCancelled] = useState(false);

  // Manejar selección de producto
  const handleSelectProduct = (product: Product) => {
    if (!isPurchased(product.id)) {
      setSelectedProduct(product);
      setPaymentError(null);
      setPaymentSuccess(false);
    }
  };

  // Manejar proceso de pago REAL
  const handlePurchase = async (product: Product) => {
    if (!user) return;

    try {
      setPaymentLoading(true);
      setPaymentError(null);
      setPaymentSuccess(false);
      setPaymentCancelled(false);

      // 1. Abrir Culqi Checkout REAL y obtener token
      const token = await culqiService.openCheckout(
        product.precio,
        product.nombre,
        user.email
      );

      // 2. Enviar token a Edge Function para procesar el pago
      await productsService.createPayment(product.id, token.id);

      // 3. Éxito - Actualizar INMEDIATAMENTE
      setPaymentSuccess(true);
      
      // 4. Refrescar productos INMEDIATAMENTE para mostrar el nuevo estado
      await refreshProducts();
      
      // 5. Limpiar estados después de 2 segundos
      setTimeout(() => {
        setSelectedProduct(null);
        setPaymentSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error en el pago:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido en el pago';
      
      // Detectar si fue cancelación
      if (errorMessage === 'CHECKOUT_CANCELLED') {
        setPaymentCancelled(true);
        // Ocultar mensaje después de 2 segundos
        setTimeout(() => {
          setPaymentCancelled(false);
        }, 2000);
      } else {
        setPaymentError(errorMessage);
      }
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
        {/* Mensaje de éxito */}
        {paymentSuccess && (
          <div className="mb-6 bg-green-500/10 border border-green-500 text-green-500 px-6 py-4 rounded-lg flex items-center gap-3">
            <CheckCircle size={24} />
            <div>
              <p className="font-bold">Pago exitoso</p>
              <p className="text-sm">El producto ha sido agregado a tu biblioteca</p>
            </div>
          </div>
        )}

        {/* Error general de productos */}
        {productsError && (
          <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg flex items-center gap-3">
            <AlertCircle size={24} />
            <div>
              <p className="font-bold">Error</p>
              <p className="text-sm">{productsError}</p>
            </div>
          </div>
        )}

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

            {/* Error de pago */}
            {paymentError && (
              <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg flex items-center gap-3">
                <AlertCircle size={24} />
                <div>
                  <p className="font-bold">Error en el pago</p>
                  <p className="text-sm">{paymentError}</p>
                </div>
              </div>
            )}

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

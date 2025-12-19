import { Product, PurchasedProduct, Payment } from '@/types';
import { supabase } from '@/lib/supabase/client';

class ProductsService {
  private static instance: ProductsService;

  private constructor() {}

  static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService();
    }
    return ProductsService.instance;
  }

  // Obtener URL base de las funciones
  private getFunctionUrl(functionName: string): string {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    return `${supabaseUrl}/functions/v1/${functionName}`;
  }

  // Obtener todos los productos (llamada a Edge Function)
  async getProducts(): Promise<Product[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Debes iniciar sesión para ver los productos');
      }

      const response = await fetch(this.getFunctionUrl('get-products'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data) {
        return [];
      }

      // Mapear los datos de Supabase a nuestro tipo Product
      return data.map((item: any) => ({
        id: item.id,
        nombre: item.name,
        precio: item.price_cents / 100, // Convertir centavos a soles
        descripcion: item.description,
        activo: item.active,
        imagen_url: item.image_url,
        purchased: item.purchased || false,
      }));
    } catch (err) {
      console.error('Error completo en getProducts:', err);
      throw err;
    }
  }

  // Obtener producto por ID
  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find(p => p.id === id) || null;
  }

  // Obtener productos comprados por el usuario (llamada a Edge Function)
  async getPurchasedProducts(): Promise<PurchasedProduct[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Debes iniciar sesión');
      }

      const response = await fetch(this.getFunctionUrl('get-purchased-products'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        return [];
      }

      // Mapear los datos de Supabase a nuestro tipo PurchasedProduct
      return data.map((item: any) => ({
        id: item.demo_pay_products.id,
        nombre: item.demo_pay_products.name,
        precio: item.demo_pay_products.price_cents / 100,
        descripcion: item.demo_pay_products.description,
        activo: true,
        imagen_url: null,
        payment_id: item.id,
        purchased_at: item.created_at,
      }));
    } catch (err) {
      console.error('Error completo en getPurchasedProducts:', err);
      throw err;
    }
  }

  // Verificar si el usuario ya compró un producto
  async hasUserPurchased(productId: string): Promise<boolean> {
    const products = await this.getProducts();
    const product = products.find(p => p.id === productId);
    return product?.purchased || false;
  }

  // Crear pago (llamada a Edge Function create-payment)
  async createPayment(productId: string, culqiToken: string): Promise<Payment> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Debes iniciar sesión para realizar un pago');
      }

      const response = await fetch(this.getFunctionUrl('create-payment'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          culqi_token: culqiToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || !data.success) {
        throw new Error(data?.error || 'El pago no se pudo procesar');
      }

      // Obtener información del producto para construir el objeto Payment
      const product = await this.getProductById(productId);
      
      return {
        id: data.charge_id,
        user_id: session.user.id,
        product_id: productId,
        monto: product?.precio || 0,
        estado: 'success',
        culqi_charge_id: data.charge_id,
        created_at: new Date().toISOString(),
      };
    } catch (err) {
      console.error('Error completo en createPayment:', err);
      throw err;
    }
  }
}

export default ProductsService.getInstance();

import { Product, PurchasedProduct, Payment } from '@/types';

// Mock de productos
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    nombre: 'Curso de React Avanzado',
    precio: 99.99,
    descripcion: 'Aprende React desde cero hasta nivel avanzado con proyectos reales',
    activo: true,
    imagen_url: '/products/react.jpg'
  },
  {
    id: '2',
    nombre: 'Masterclass de TypeScript',
    precio: 79.99,
    descripcion: 'Domina TypeScript y lleva tus habilidades al siguiente nivel',
    activo: true,
    imagen_url: '/products/typescript.jpg'
  },
  {
    id: '3',
    nombre: 'Next.js Pro',
    precio: 129.99,
    descripcion: 'Construye aplicaciones full-stack con Next.js 14',
    activo: true,
    imagen_url: '/products/nextjs.jpg'
  },
  {
    id: '4',
    nombre: 'Supabase desde Cero',
    precio: 89.99,
    descripcion: 'Backend as a Service: autenticación, base de datos y más',
    activo: true,
    imagen_url: '/products/supabase.jpg'
  },
  {
    id: '5',
    nombre: 'Tailwind CSS Expert',
    precio: 59.99,
    descripcion: 'Diseña interfaces modernas con Tailwind CSS',
    activo: true,
    imagen_url: '/products/tailwind.jpg'
  }
];

// Mock de pagos realizados
const MOCK_PAYMENTS: Payment[] = [];

class ProductsService {
  private static instance: ProductsService;

  private constructor() {}

  static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService();
    }
    return ProductsService.instance;
  }

  // Obtener todos los productos
  async getProducts(): Promise<Product[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PRODUCTS.filter(p => p.activo);
  }

  // Obtener producto por ID
  async getProductById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_PRODUCTS.find(p => p.id === id) || null;
  }

  // Obtener productos comprados por el usuario
  async getPurchasedProducts(userId: string): Promise<PurchasedProduct[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userPayments = MOCK_PAYMENTS.filter(
      p => p.user_id === userId && p.estado === 'success'
    );

    const purchasedProducts: PurchasedProduct[] = [];
    
    for (const payment of userPayments) {
      const product = MOCK_PRODUCTS.find(p => p.id === payment.product_id);
      if (product) {
        purchasedProducts.push({
          ...product,
          payment_id: payment.id,
          purchased_at: payment.created_at
        });
      }
    }

    return purchasedProducts;
  }

  // Verificar si el usuario ya compró un producto
  async hasUserPurchased(userId: string, productId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return MOCK_PAYMENTS.some(
      p => p.user_id === userId && 
           p.product_id === productId && 
           p.estado === 'success'
    );
  }

  // Simular creación de pago (mock)
  async createPayment(userId: string, productId: string, token: string): Promise<Payment> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const product = await this.getProductById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    // Verificar si ya compró
    const alreadyPurchased = await this.hasUserPurchased(userId, productId);
    if (alreadyPurchased) {
      throw new Error('Ya compraste este producto');
    }

    // Simular pago exitoso
    const payment: Payment = {
      id: `payment_${Date.now()}`,
      user_id: userId,
      product_id: productId,
      monto: product.precio,
      estado: 'success',
      culqi_charge_id: `charge_mock_${Date.now()}`,
      created_at: new Date().toISOString()
    };

    MOCK_PAYMENTS.push(payment);

    return payment;
  }
}

export default ProductsService.getInstance();

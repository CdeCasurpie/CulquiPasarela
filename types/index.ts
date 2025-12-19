// Usuario autenticado
export interface User {
  id: string;
  email: string;
  created_at?: string;
}

// Sesión de usuario
export interface Session {
  user: User;
  access_token: string;
}

// Producto disponible para compra
export interface Product {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  activo: boolean;
  imagen_url?: string;
  purchased?: boolean; // Indica si el usuario ya compró este producto
}

// Pago realizado
export interface Payment {
  id: string;
  user_id: string;
  product_id: string;
  monto: number;
  estado: 'pending' | 'success' | 'failed';
  culqi_charge_id?: string;
  created_at: string;
}

// Producto comprado por el usuario
export interface PurchasedProduct extends Product {
  payment_id: string;
  purchased_at: string;
}

// Token de Culqi (respuesta del Checkout)
export interface CulqiToken {
  id: string;
  object: string;
  email: string;
  card_number: string;
  creation_date: number;
}

// Respuesta de Edge Function
export interface EdgeFunctionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

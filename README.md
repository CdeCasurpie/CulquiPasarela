# 💳 CulqiPay - Pasarela de Pagos Segura

Aplicación web completa de pagos construida con **Next.js**, **Supabase** y **Culqi**.

## Características

- Autenticación completa con Supabase Auth
- Carrusel de productos horizontal
- Sistema de pagos real con Culqi
- Gestión de productos comprados
- Arquitectura de seguridad profesional
- Edge Functions para toda la lógica de negocio
- 100% TypeScript
- Diseño moderno (Plomo azulado + Amarillo)

## Arquitectura

### Frontend (Next.js)
- **App Router** con TypeScript
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **Hooks personalizados** para lógica de negocio
- **Componentes reutilizables**
- **Supabase Client** para autenticación y llamadas a Edge Functions

### Backend (Supabase - CONECTADO)
- **Supabase Auth**: Autenticación de usuarios real
- **PostgreSQL**: Base de datos con tablas `demo_pay_products` y `demo_pay_purchases`
- **Edge Functions**: 
  - `get-products`: Obtiene productos y verifica compras del usuario
  - `get-purchased-products`: Lista de productos comprados
  - `create-payment`: Procesa pagos con Culqi (usa SECRET_KEY segura)

### Pasarela (Culqi - CONECTADA)
- **Culqi Checkout v4**: Modal de pago oficial
- **Tokenización**: Segura, sin guardar datos de tarjetas
- **Integración sandbox**: Lista para pruebas

## Estructura del Proyecto

```
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página principal (REAL)
│   └── globals.css         # Estilos globales
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx   # Login con Supabase Auth
│   │   └── RegisterForm.tsx # Registro con Supabase Auth
│   ├── layout/
│   │   └── Header.tsx
│   └── products/
│       ├── ProductCard.tsx
│       ├── ProductCarousel.tsx
│       └── ProductDetails.tsx
├── hooks/
│   ├── useAuth.ts          # Hook de autenticación REAL
│   └── useProducts.ts      # Hook de productos REAL
├── services/
│   ├── auth.service.ts     # Servicio de autenticación (Supabase)
│   ├── culqi.service.ts    # Servicio de Culqi (REAL)
│   └── products.service.ts # Servicio de productos (Edge Functions)
├── types/
│   └── index.ts            # Tipos TypeScript
├── lib/
│   └── supabase/
│       └── client.ts       # Cliente de Supabase configurado
└── .env.local              # Variables de entorno
```

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (ver sección siguiente)

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar producción
npm start
```

## Configuración

### 1. Variables de Entorno

Crea `.env.local` con tus credenciales REALES:

```env
# Supabase (OBLIGATORIO)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-real

# Culqi (OBLIGATORIO - solo llave pública)
NEXT_PUBLIC_CULQI_PUBLIC_KEY=pk_test_tu_llave_publica_real

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Base de Datos Supabase

Las tablas ya deben estar creadas:

**Tabla: demo_pay_products**
```sql
create table demo_pay_products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price_cents integer not null,
  currency text default 'PEN',
  active boolean default true,
  image_url text,
  created_at timestamp with time zone default now()
);
```

**Tabla: demo_pay_purchases**
```sql
create table demo_pay_purchases (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  product_id uuid references demo_pay_products(id) not null,
  amount_cents integer not null,
  currency text default 'PEN',
  status text not null,
  culqi_charge_id text,
  culqi_status text,
  created_at timestamp with time zone default now()
);
```

### 3. Edge Functions Supabase

Debes tener desplegadas estas funciones:

- `get-products`: Lista productos activos y marca cuáles ya compró el usuario
- `get-purchased-products`: Lista productos que el usuario compró
- `create-payment`: Procesa el pago con Culqi usando la SECRET_KEY

### 4. Culqi

Configuración en Supabase Edge Functions:

```bash
# Variables secretas en Supabase
CULQI_SECRET_KEY=sk_test_tu_secret_key
```

## Diseño

- **Fondo**: Plomo oscuro azulado (#1e293b, #0f172a)
- **Primario**: Amarillo (#eab308)
- **Texto**: Blanco (#ffffff)
- **Acentos**: Verde para comprados, amarillo para acciones

## Seguridad

### Implementado:
- Autenticación con Supabase Auth
- Todas las consultas pasan por Edge Functions
- Secret keys solo en servidor (Edge Functions)
- Validación de pagos duplicados
- Row Level Security (RLS) en tablas
- Tokens de Culqi nunca se guardan
- El frontend NUNCA decide precios ni cobra directamente

## Flujo de Pago

1. Usuario selecciona producto
2. Click en "Pagar con Culqi"
3. Se abre Culqi Checkout v4 (oficial)
4. Usuario ingresa datos de tarjeta
5. Culqi devuelve token temporal
6. Frontend envía token a Edge Function `create-payment`
7. Edge Function:
   - Valida sesión
   - Obtiene precio real del producto
   - Verifica que no esté comprado
   - Usa CULQI_SECRET_KEY para crear cargo
   - Guarda resultado en BD
8. Frontend recibe confirmación y actualiza UI

## Estado Actual

El proyecto está **100% funcional con datos reales**:

- Supabase Auth funcionando
- Edge Functions desplegadas y conectadas
- Culqi Checkout integrado (sandbox)
- Productos desde base de datos real
- Pagos procesados por Edge Functions

**Para probar:**
1. Regístrate o inicia sesión
2. Selecciona un producto
3. Haz clic en "Pagar con Culqi"
4. Usa tarjeta de prueba de Culqi
5. El pago se procesa y el producto se marca como comprado

**Tarjetas de prueba Culqi:**
- Número: 4111 1111 1111 1111
- CVV: 123
- Fecha: cualquier fecha futura
- Email: cualquier email

## Próximos Pasos

1. Agregar más productos en la base de datos
2. Implementar webhooks de Culqi
3. Panel de administración
4. Envío de emails de confirmación
5. Deploy a producción

## Tecnologías

- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos
- **Supabase** - Backend (Auth + DB + Functions)
- **Culqi v4** - Pasarela de pagos

## Notas Importantes

- Nunca expongas la SECRET_KEY de Culqi en el frontend
- Todas las operaciones críticas deben pasar por Edge Functions
- Los precios siempre se validan en el servidor
- El frontend solo muestra información, nunca decide lógica de negocio

## Licencia

MIT

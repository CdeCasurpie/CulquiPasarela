# 💳 CulqiPay - Pasarela de Pagos Segura

Aplicación web completa de pagos construida con **Next.js**, **Supabase** y **Culqi**.

## Características

- Autenticación completa (Login/Register)
- Carrusel de productos horizontal
- Sistema de pagos con Culqi
- Gestión de productos comprados
- Arquitectura de seguridad profesional
- 100% TypeScript
- Diseño moderno (Plomo azulado + Amarillo)

## Arquitectura

### Frontend (Next.js)
- **App Router** con TypeScript
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **Hooks personalizados** para lógica de negocio
- **Componentes reutilizables**

### Backend (Supabase - Por configurar)
- **Supabase Auth**: Autenticación de usuarios
- **PostgreSQL**: Base de datos
- **Edge Functions**: Lógica de negocio segura

### Pasarela (Culqi - Por configurar)
- **Culqi Checkout**: Modal de pago seguro
- **Tokenización**: Sin guardar datos de tarjetas

## Estructura del Proyecto

```
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página principal
│   └── globals.css         # Estilos globales
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── layout/
│   │   └── Header.tsx
│   └── products/
│       ├── ProductCard.tsx
│       ├── ProductCarousel.tsx
│       └── ProductDetails.tsx
├── hooks/
│   ├── useAuth.ts          # Hook de autenticación
│   └── useProducts.ts      # Hook de productos
├── services/
│   ├── auth.service.ts     # Servicio de autenticación (MOCK)
│   ├── culqi.service.ts    # Servicio de Culqi (MOCK)
│   └── products.service.ts # Servicio de productos (MOCK)
├── types/
│   └── index.ts            # Tipos TypeScript
├── lib/
│   ├── supabase/           # Configuración Supabase (próximamente)
│   └── culqi/              # Configuración Culqi (próximamente)
└── .env.local              # Variables de entorno
```

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar producción
npm start
```

## Configuración

### 1. Variables de Entorno

Copia `.env.example` a `.env.local` y configura:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Culqi (SOLO llave pública)
NEXT_PUBLIC_CULQI_PUBLIC_KEY=pk_test_tu_llave_publica

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Base de Datos Supabase

Crea estas tablas en Supabase:

**Tabla: productos**
```sql
create table productos (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  precio decimal(10,2) not null,
  descripcion text,
  activo boolean default true,
  imagen_url text,
  created_at timestamp with time zone default now()
);
```

**Tabla: pagos**
```sql
create table pagos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  product_id uuid references productos(id) not null,
  monto decimal(10,2) not null,
  estado text not null check (estado in ('pending', 'success', 'failed')),
  culqi_charge_id text,
  created_at timestamp with time zone default now()
);
```

### 3. Edge Functions Supabase

Crear las siguientes Edge Functions:

- `get_products`: Obtener lista de productos
- `get_purchased_products`: Obtener productos comprados del usuario
- `create_payment`: Procesar pago con Culqi

### 4. Culqi

1. Crear cuenta en [Culqi](https://culqi.com/)
2. Obtener llaves de prueba
3. Configurar webhook (opcional)

## Diseño

- **Fondo**: Plomo oscuro azulado (#1e293b, #0f172a)
- **Primario**: Amarillo (#eab308)
- **Texto**: Blanco (#ffffff)
- **Acentos**: Verde para comprados, amarillo para acciones

## Seguridad

### Implementada:
- Autenticación por sesión
- Validación de formularios
- Tipos TypeScript estrictos
- Separación frontend/backend

### Por implementar (cuando conectes Supabase):
- Edge Functions para toda lógica de negocio
- Row Level Security (RLS) en tablas
- Validación de pagos en servidor
- Secret keys solo en Edge Functions

## Estado Actual (MOCK)

El proyecto está completamente funcional con **datos mock**:

- Login/Register funcional
- Productos mockeados
- Flujo de pago simulado
- Gestión de compras en localStorage

**Credenciales de prueba:**
- Email: `demo@culqi.com`
- Password: `demo123`

## Próximos Pasos

1. Frontend completado (este paso)
2. Configurar Supabase Auth
3. Crear tablas en Supabase
4. Implementar Edge Functions
5. Configurar Culqi real
6. Reemplazar services mock por llamadas a Supabase
7. Deploy a producción

## Tecnologías

- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos
- **Supabase** - Backend (Auth + DB + Functions)
- **Culqi** - Pasarela de pagos

## Notas de Desarrollo

- Los servicios actuales son **mock** y funcionan con localStorage
- Cuando conectes Supabase, reemplaza los servicios por llamadas reales
- La llave secreta de Culqi **NUNCA** debe estar en el frontend
- Todos los pagos deben procesarse en Edge Functions

## Contribuir

Este es un proyecto educativo para demostrar arquitectura segura de pagos.

## Licencia

MIT

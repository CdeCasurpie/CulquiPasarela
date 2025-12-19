<div align="center">

# 💳 CulqiPay

### Plataforma de Pagos Segura con Culqi & Supabase

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Culqi](https://img.shields.io/badge/Culqi-Payments-00A19B?style=for-the-badge)](https://culqi.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Una aplicación web moderna de comercio electrónico con autenticación segura, gestión de productos y procesamiento de pagos en tiempo real.**

[Demo en Vivo](https://cdecasurpie.github.io/CulquiPasarela) · [Reportar Bug](https://github.com/CdeCasurpie/CulquiPasarela/issues) · [Solicitar Feature](https://github.com/CdeCasurpie/CulquiPasarela/issues)

<img src="https://img.shields.io/github/license/CdeCasurpie/CulquiPasarela?style=flat-square" alt="License" />
<img src="https://img.shields.io/github/last-commit/CdeCasurpie/CulquiPasarela?style=flat-square" alt="Last Commit" />
<img src="https://img.shields.io/github/stars/CdeCasurpie/CulquiPasarela?style=flat-square" alt="Stars" />

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Características de Seguridad](#-características-de-seguridad)
- [Instalación](#-instalación-y-configuración)
- [Deployment](#-deployment-en-github-pages)
- [Testing](#-testing-con-culqi-sandbox)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## Descripción

CulqiPay es una plataforma full-stack que demuestra la implementación correcta de una arquitectura de pagos segura. La aplicación separa completamente la lógica de frontend del procesamiento crítico de pagos, garantizando que todas las operaciones sensibles se ejecuten en el servidor mediante Edge Functions.

### Características Principales

- **Autenticación Completa** - Sistema de login/registro con Supabase Auth
- **Catálogo de Productos** - Carrusel interactivo y responsive
- **Pagos Seguros** - Integración con Culqi Checkout v4
- **Diseño Moderno** - UI profesional con Tailwind CSS
- **Arquitectura Segura** - Separación frontend/backend correcta

---

## Stack Tecnológico

### Frontend
- **Next.js 15** - Framework React con App Router para aplicaciones web modernas
- **TypeScript** - Tipado estático para mayor seguridad y mantenibilidad
- **Tailwind CSS** - Framework de utilidades CSS para diseño responsive
- **Lucide React** - Biblioteca de iconos modular y ligera
- **Supabase Client** - SDK JavaScript para autenticación y comunicación con Edge Functions

### Backend
- **Supabase** - Backend-as-a-Service completo
  - **Supabase Auth** - Sistema de autenticación con manejo de sesiones
  - **PostgreSQL** - Base de datos relacional con Row Level Security (RLS)
  - **Edge Functions** - Funciones serverless en Deno para lógica de negocio
- **Culqi API v2** - Pasarela de pagos para Latinoamérica

## Arquitectura

### Principios de Diseño

1. **Separación de responsabilidades**: El frontend solo maneja UI/UX, la lógica de negocio vive en Edge Functions
2. **Seguridad por diseño**: Las claves secretas y validaciones críticas nunca están en el cliente
3. **Arquitectura stateless**: Cada petición es independiente y autenticada mediante tokens JWT
4. **Principio de privilegio mínimo**: El frontend usa llaves públicas, el backend usa llaves secretas


### Flujo de Compra (Crítico)

```
1. Usuario selecciona producto
2. Frontend abre Culqi Checkout (llave pública)
3. Usuario ingresa datos de tarjeta
4. Culqi genera token temporal (NO cargo)
5. Frontend envía token a Edge Function
6. Edge Function:
   - Valida autenticación del usuario
   - Obtiene precio real desde DB
   - Verifica que no esté comprado previamente
   - Usa llave secreta de Culqi para crear cargo
   - Guarda transacción en DB
7. Retorna resultado al frontend
8. Frontend actualiza UI con estado de compra
```

### Estructura de Base de Datos

**Tabla: `demo_pay_products`**
```sql
- id (UUID, PK)
- name (text)
- description (text)
- price_cents (integer)     # Precio en centavos para evitar problemas de punto flotante
- currency (text)           # Moneda (PEN, USD, etc.)
- active (boolean)          # Control de visibilidad
- image_url (text)
- created_at (timestamp)
```

**Tabla: `demo_pay_purchases`**
```sql
- id (UUID, PK)
- user_id (UUID, FK → auth.users)
- product_id (UUID, FK → demo_pay_products)
- amount_cents (integer)
- currency (text)
- status (text)             # paid, failed, pending
- culqi_charge_id (text)    # ID de transacción en Culqi
- culqi_status (text)       # Estado detallado de Culqi
- created_at (timestamp)
```

### Edge Functions

**`get-products`**
- **Input**: Token de autenticación en header
- **Proceso**: 
  - Valida usuario autenticado
  - Obtiene productos activos
  - Cruza con compras del usuario
  - Agrega campo `purchased` a cada producto
- **Output**: Array de productos con estado de compra

**`get-purchased-products`**
- **Input**: Token de autenticación
- **Proceso**:
  - Valida usuario
  - Busca compras exitosas del usuario
  - Join con tabla de productos
- **Output**: Array de productos comprados con detalles

**`create-payment`**
- **Input**: `{ product_id, culqi_token }`
- **Proceso**:
  1. Valida autenticación
  2. Obtiene producto y precio real de DB
  3. Verifica compra duplicada
  4. Llama a Culqi API con SECRET_KEY
  5. Guarda resultado en DB
- **Output**: `{ success, charge_id }`

## Instalación y Configuración

### Requisitos Previos
- Node.js >= 20.9.0
- Cuenta en Supabase
- Cuenta en Culqi (modo sandbox)

### 1. Clonar el repositorio
```bash
git clone https://github.com/CdeCasurpie/CulquiPasarela.git
cd CulquiPasarela
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_CULQI_PUBLIC_KEY=pk_test_tu-llave-publica
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar Supabase

#### Crear las tablas
Ejecuta estos comandos SQL en el SQL Editor de Supabase:

```sql
-- Tabla de productos
CREATE TABLE demo_pay_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'PEN',
  active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de compras
CREATE TABLE demo_pay_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  product_id UUID REFERENCES demo_pay_products(id) NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'PEN',
  status TEXT NOT NULL,
  culqi_charge_id TEXT,
  culqi_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar productos de ejemplo
INSERT INTO demo_pay_products (name, description, price_cents, currency, active) VALUES
('Curso de React Avanzado', 'Aprende React desde cero hasta nivel avanzado', 9999, 'PEN', true),
('Masterclass de TypeScript', 'Domina TypeScript y lleva tus habilidades al siguiente nivel', 7999, 'PEN', true),
('Next.js Pro', 'Construye aplicaciones full-stack con Next.js 14', 12999, 'PEN', true),
('Supabase desde Cero', 'Backend as a Service: autenticación, base de datos y más', 8999, 'PEN', true),
('Tailwind CSS Expert', 'Diseña interfaces modernas con Tailwind CSS', 5999, 'PEN', true);
```

#### Desplegar Edge Functions
Las Edge Functions deben estar en tu proyecto de Supabase. Usa Supabase CLI:

```bash
supabase functions deploy get-products
supabase functions deploy get-purchased-products
supabase functions deploy create-payment
```

#### Configurar secretos en Supabase
```bash
supabase secrets set CULQI_SECRET_KEY=sk_test_tu-secret-key
```

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Deployment en GitHub Pages

### Configuración Automática (Recomendado)

1. **Configurar Secrets en GitHub**:
   - Ve a Settings → Secrets and variables → Actions
   - Agrega:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_CULQI_PUBLIC_KEY`

2. **Habilitar GitHub Pages**:
   - Settings → Pages → Source: **GitHub Actions**

3. **Push al repositorio**:
   ```bash
   git push origin main
   ```

GitHub Actions automáticamente construirá y desplegará tu aplicación.

### Build Manual
```bash
npm run build
```

Esto genera la carpeta `out/` con archivos estáticos listos para cualquier hosting.

## Testing con Culqi Sandbox

### Tarjetas de prueba
- **Visa exitosa**: `4111 1111 1111 1111`
- **CVV**: `123`
- **Fecha**: Cualquier fecha futura (ej: `12/28`)
- **Email**: Cualquier email válido

### Flujo de prueba completo
1. Regístrate con un email de prueba
2. Selecciona un producto del carrusel
3. Click en "Pagar con Culqi"
4. Ingresa los datos de la tarjeta de prueba
5. Confirma el pago
6. El producto aparecerá en "Tus Productos Comprados"

## Licencia

MIT License - ver archivo LICENSE para más detalles.

## Autor

**CdeCasurpie**
- GitHub: [@CdeCasurpie](https://github.com/CdeCasurpie)

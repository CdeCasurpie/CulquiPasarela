# Guía de Deployment a GitHub Pages

## Opción 1: Deploy Automático con GitHub Actions (RECOMENDADO)

### Paso 1: Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Click en **Settings** → **Secrets and variables** → **Actions**
3. Agrega estos secrets (click en "New repository secret"):

```
NEXT_PUBLIC_SUPABASE_URL = https://gomrzsczollkujrrcuvy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvbXJ6c2N6b2xsa3VqcnJjdXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwOTkwODIsImV4cCI6MjA4MTY3NTA4Mn0.2T_G77EUSfPu8wqOTlPMdYjaFWXijx9cT1L8HQVRV68
NEXT_PUBLIC_CULQI_PUBLIC_KEY = pk_test_Yx8L0B2Yg1kAVG6g
```

### Paso 2: Habilitar GitHub Pages

1. Ve a **Settings** → **Pages**
2. En **Source**, selecciona **GitHub Actions**

### Paso 3: Push al repositorio

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

¡Listo! GitHub Actions automáticamente:
- Hará build de la app
- La desplegará en GitHub Pages
- Estará disponible en: `https://tu-usuario.github.io/CulquiPasarela`

---

## Opción 2: Deploy Manual

### Paso 1: Build

```bash
npm run build
```

Esto genera la carpeta `out/` con todos los archivos estáticos.

### Paso 2: Deploy manual

```bash
# Instalar gh-pages (solo primera vez)
npm install -D gh-pages

# Deploy
npx gh-pages -d out
```

---

## Verificar que funciona

1. Abre `https://tu-usuario.github.io/CulquiPasarela`
2. Deberías ver la página de login
3. Registra un usuario o usa las credenciales de prueba
4. Los productos se cargan desde Supabase
5. Los pagos se procesan con Culqi

---

## Troubleshooting

### Error 404 al navegar
- Asegúrate de que el `basePath` en `next.config.ts` coincida con el nombre del repo

### Variables de entorno no funcionan
- Verifica que los secrets estén configurados correctamente en GitHub
- Deben empezar con `NEXT_PUBLIC_` para ser accesibles en el cliente

### Culqi no carga
- Verifica que la llave pública sea correcta
- Revisa la consola del navegador para ver errores específicos

### Edge Functions fallan
- Verifica que las funciones estén desplegadas en Supabase
- Revisa que la URL de Supabase sea correcta

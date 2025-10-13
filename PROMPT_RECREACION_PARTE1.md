# 🏥 Sistema H - Prompt de Recreación (Parte 1/3)

## 📋 DESCRIPCIÓN GENERAL

Sistema completo de gestión de equipos médicos hospitalarios con:
- **Backend**: API REST con Node.js + Express + SQLite + Sequelize
- **Frontend**: Next.js 15 + React 19 + TypeScript + TailwindCSS
- **Animaciones**: Framer Motion + GSAP (estilo Apple)
- **Arquitectura**: Limpia, modular, escalable

---

## 🎯 ESTRUCTURA DEL PROYECTO

```
Hospital/
├── HospitalApi/          # Backend
│   ├── src/
│   │   ├── config/       # DB, Swagger
│   │   ├── models/       # 13 modelos Sequelize
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── routes/       # API REST
│   │   └── server.js
│   ├── database/
│   ├── tests/
│   └── package.json
│
├── frontend/             # Frontend
│   ├── src/
│   │   ├── app/          # Pages (App Router)
│   │   ├── components/
│   │   │   ├── animations/  # ScrollReveal, SplitText
│   │   │   ├── layout/      # Sidebar, NavBar
│   │   │   ├── ui/          # Button, Input, Modal, Card
│   │   │   ├── forms/       # Formularios
│   │   │   └── equipos/     # EquipmentCard
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── store/
│   │   └── types/
│   └── package.json
│
└── START.bat
```

---

## 🔧 STACK TECNOLÓGICO

### Backend
- Node.js 16+ + Express 4.18.2
- SQLite 3 + Sequelize 6.35.2
- Swagger (swagger-jsdoc + swagger-ui-express)
- Helmet + CORS + Morgan
- express-validator 7.0.1
- Jest 29.7.0 + Supertest

### Frontend
- Next.js 15.5.4 (App Router + Turbopack)
- React 19.1.0 + TypeScript 5
- TailwindCSS 4.1.14
- **Animaciones**: Framer Motion 12.23.24 + GSAP 3.13.0 + @gsap/react 2.1.2
- Zustand 5.0.8 (estado global)
- SWR 2.3.6 + Axios 1.12.2 (data fetching)
- React Hook Form 7.64.0 + Zod 4.1.12
- Lucide React 0.545.0 + Heroicons 2.2.0
- @headlessui/react 2.2.9
- React Hot Toast 2.6.0
- Recharts 3.2.1

---

## 🗄️ MODELO DE DATOS (13 TABLAS)

### 1. Clientes
```sql
id, nombre, rfc, direccion, ciudad, estado, codigo_postal, 
telefono, email, contacto_principal, activo, created_at, updated_at
```

### 2. Contratos
```sql
id, cliente_id, numero_contrato, tipo_servicio, fecha_inicio, 
fecha_fin, valor_contrato, estado, notas, created_at, updated_at
```

### 3. Modalidades
```sql
id, nombre, descripcion, codigo, created_at, updated_at
```

### 4. Fabricantes
```sql
id, nombre, pais, sitio_web, telefono_soporte, 
email_soporte, created_at, updated_at
```

### 5. Equipos
```sql
id, cliente_id, modalidad_id, fabricante_id, contrato_id, 
modelo, numero_serie, ubicacion, fecha_instalacion, 
fecha_fabricacion, estado, ultima_calibracion, 
proxima_calibracion, notas, created_at, updated_at
```

### 6. Técnicos
```sql
id, nombre, especialidad, certificaciones, telefono, 
email, activo, created_at, updated_at
```

### 7. Órdenes de Trabajo
```sql
id, equipo_id, cliente_id, contrato_id, numero_orden, 
tipo_servicio, prioridad, estado, fecha_apertura, 
fecha_cierre, descripcion_problema, diagnostico, 
solucion, costo_total, created_at, updated_at
```

### 8. Eventos de Orden
```sql
id, orden_id, tipo_evento, descripcion, fecha_evento, 
usuario, created_at
```

### 9. Intervenciones
```sql
id, orden_id, tecnico_id, fecha_inicio, fecha_fin, 
horas_trabajadas, descripcion_trabajo, observaciones, 
created_at, updated_at
```

### 10. Mantenimientos PM
```sql
id, equipo_id, tecnico_id, fecha_programada, fecha_realizada, 
estado, checklist, observaciones, created_at, updated_at
```

### 11. Calibraciones QC
```sql
id, equipo_id, tecnico_id, fecha, resultado, parametros_medidos, 
valores_obtenidos, certificado_numero, observaciones, 
created_at, updated_at
```

### 12. Partes
```sql
id, nombre, numero_parte, descripcion, fabricante, 
precio_unitario, stock_actual, stock_minimo, 
ubicacion_almacen, created_at, updated_at
```

### 13. Partes Usadas
```sql
id, intervencion_id, parte_id, cantidad, precio_unitario, 
created_at
```

---

## 🎨 SISTEMA DE DISEÑO (ESTILO APPLE)

### Paleta de Colores
```css
--background: #FFFFFF;
--surface: #F5F5F7;
--text-primary: #1D1D1F;
--text-secondary: #6E6E73;
--text-tertiary: #86868B;
--accent-primary: #0071E3;
--accent-hover: #0077ED;
--success: #34C759;
--warning: #FF9500;
--error: #FF3B30;
--shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 4px 12px rgba(0,0,0,0.08);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
```

### Tipografía
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
-webkit-font-smoothing: antialiased;
```

### Border Radius
- Pequeño: `0.75rem` (12px)
- Mediano: `1rem` (16px)
- Grande: `1.5rem` (24px)

---

## 🎭 SISTEMA DE ANIMACIONES

### 1. Framer Motion - Variantes Base

```tsx
// Fade In
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Slide Up
const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] }
};

// Scale In
const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: "easeOut" }
};

// Stagger Children
const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
};
```

### 2. GSAP - ScrollReveal Component

```tsx
// Anima texto palabra por palabra al hacer scroll
// - Split text por palabras
// - Opacidad: 0.1 → 1
// - Blur: 4px → 0px
// - Rotación: 3deg → 0deg
// - ScrollTrigger con scrub
```

### 3. GSAP - SplitText Component

```tsx
// Divide texto en chars/words/lines
// - Animación letra por letra
// - Delay escalonado (stagger)
// - Desde abajo: y: 40 → 0
// - Fade in: opacity: 0 → 1
// - Trigger al entrar en viewport
```

### 4. Sidebar Animaciones

```tsx
// Hover en texto - letra por letra
<motion.span
  animate={{
    scale: isHovered ? 1.15 : 1,
    y: isHovered ? -2 : 0,
  }}
  transition={{
    type: "spring",
    stiffness: 400,
    damping: 17,
    delay: index * 0.02,
  }}
/>

// Iconos animados
<motion.div
  whileHover={{ scale: 1.1, rotate: 5 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
/>

// Active indicator
<motion.div
  layoutId="activeTab"
  transition={{ type: "spring", stiffness: 500, damping: 30 }}
/>
```

### 5. Cards Hover

```tsx
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
/>
```

### 6. Backdrop Blur

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: isHovered ? 1 : 0 }}
  transition={{ duration: 0.3 }}
  className="fixed inset-0 bg-black/20 backdrop-blur-sm"
/>
```

---

## 📦 PACKAGE.JSON

### Backend (HospitalApi/package.json)
```json
{
  "name": "sistema-h-api",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "init-db": "node src/config/init-database.js",
    "test": "jest --runInBand"
  },
  "dependencies": {
    "express": "^4.18.2",
    "sequelize": "^6.35.2",
    "sqlite3": "^5.1.6",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

### Frontend (frontend/package.json)
```json
{
  "name": "frontend",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start"
  },
  "dependencies": {
    "@gsap/react": "^2.1.2",
    "@headlessui/react": "^2.2.9",
    "@heroicons/react": "^2.2.0",
    "@hookform/resolvers": "^5.2.2",
    "axios": "^1.12.2",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "framer-motion": "^12.23.24",
    "gsap": "^3.13.0",
    "lucide-react": "^0.545.0",
    "next": "15.5.4",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-hook-form": "^7.64.0",
    "react-hot-toast": "^2.6.0",
    "recharts": "^3.2.1",
    "swr": "^2.3.6",
    "tailwind-merge": "^3.3.1",
    "zod": "^4.1.12",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.14",
    "@types/node": "^20",
    "@types/react": "^19",
    "tailwindcss": "^4.1.14",
    "typescript": "^5"
  }
}
```

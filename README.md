# 🏥 Sistema de Gestión Hospitalaria

Sistema web para la gestión de equipos médicos, órdenes de trabajo, clientes y técnicos.

## 🚀 Tecnologías

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL + API REST)
- **Autenticación**: Supabase Auth
- **Animaciones**: Framer Motion

---

## 📋 Requisitos Previos

- Node.js 18+ instalado
- npm o yarn
- Cuenta de Supabase (gratis)

---

## 🔧 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/TU_USUARIO/SistemaH.git
cd SistemaH
```

### 2. Instalar Dependencias del Frontend

```bash
cd frontend
npm install
```

### 3. Configurar Variables de Entorno

#### Opción A: Usar el Script Automático (Recomendado) ⚡

El proyecto incluye scripts para configurar automáticamente las credenciales de Supabase:

**En Windows (PowerShell):**
```bash
cd frontend
.\setup-env.ps1
```

**En Mac/Linux:**
```bash
cd frontend
chmod +x setup-env.sh
./setup-env.sh
```

Esto creará automáticamente el archivo `.env.local` con las credenciales del proyecto.

#### Opción B: Configuración Manual

Si prefieres crear el archivo manualmente:

1. Crea un archivo `.env.local` en la carpeta `frontend`:

```bash
# En Windows (PowerShell)
New-Item -Path ".env.local" -ItemType File

# En Mac/Linux
touch .env.local
```

2. Abre `.env.local` y pega las credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://imratsgicognfygvbwcq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltcmF0c2dpY29nbmZ5Z3Zid2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODUzMDcsImV4cCI6MjA3NTk2MTMwN30.oCd_20OrZ_C2R8Xaw4bejYL6HO6ZLhh8OhPl-0fq9so
```

#### Opción C: Crear tu Propio Supabase (Para Desarrollo Independiente)

1. **Crea una cuenta en Supabase**: https://supabase.com
2. **Crea un nuevo proyecto**
3. **Importa el schema de la base de datos**:
   - Ve a `SQL Editor` en Supabase
   - Copia y ejecuta el script SQL de `database/schema.sql` (si existe)
   - O importa las tablas manualmente desde `database/tables/`

4. **Obtén tus credenciales**:
   - Ve a `Settings` → `API`
   - Copia `Project URL` y `anon/public key`

5. **Crea `.env.local`** en la carpeta `frontend`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 4. Ejecutar el Proyecto

```bash
# Asegúrate de estar en la carpeta frontend
cd frontend

# Inicia el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en: **http://localhost:3001**

---

## 📊 Estructura de la Base de Datos

El sistema utiliza las siguientes tablas principales:

- `cliente` - Hospitales y clínicas
- `equipo` - Equipos médicos
- `fabricante` - Fabricantes de equipos
- `modalidad` - Modalidades de equipos (CT, MRI, etc.)
- `tecnico` - Técnicos de servicio
- `orden_trabajo` - Órdenes de servicio
- `intervencion` - Intervenciones realizadas
- `partes_usadas` - Partes utilizadas en reparaciones

---

## 🗂️ Estructura del Proyecto

```
SistemaH/
├── frontend/                 # Aplicación Next.js
│   ├── src/
│   │   ├── app/             # Páginas y rutas
│   │   ├── components/      # Componentes reutilizables
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilidades y configuración
│   │   ├── services/        # Servicios de API
│   │   ├── store/           # Estado global
│   │   └── types/           # Tipos de TypeScript
│   ├── public/              # Archivos estáticos
│   ├── .env.local           # Variables de entorno (NO se sube a Git)
│   ├── .env.example         # Plantilla de variables de entorno
│   └── package.json
│
├── HospitalApi/             # API Backend (opcional, no se usa actualmente)
│   └── ...
│
└── README.md                # Este archivo
```

---

## 🔐 Seguridad

### Variables de Entorno

**NUNCA subas el archivo `.env.local` a Git.** Este archivo contiene credenciales sensibles.

El archivo `.gitignore` ya está configurado para ignorar:
- `.env.local`
- `.env*.local`
- Todos los archivos `.env*` excepto `.env.example`

### Row Level Security (RLS)

Si vas a producción, **habilita RLS en Supabase**:

1. Ve a `Authentication` → `Policies`
2. Habilita RLS para cada tabla
3. Crea políticas de acceso según tus necesidades

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye la aplicación
npm start            # Inicia servidor de producción

# Linting
npm run lint         # Ejecuta ESLint
```

---

## 🐛 Solución de Problemas

### Error: "Faltan las variables de entorno de Supabase"

**Causa**: No existe el archivo `.env.local` o está vacío.

**Solución**:
1. Verifica que `.env.local` existe en la carpeta `frontend`
2. Verifica que contiene las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Reinicia el servidor de desarrollo

### Error: "Failed to fetch" o errores de conexión

**Causa**: Las credenciales de Supabase son incorrectas.

**Solución**:
1. Verifica que la URL y API Key son correctas
2. Ve a Supabase → Settings → API y copia nuevamente las credenciales
3. Asegúrate de usar la `anon/public` key, NO la `service_role` key

### La aplicación se ve sin estilos

**Causa**: TailwindCSS no se compiló correctamente.

**Solución**:
```bash
# Elimina la carpeta .next
rm -rf .next

# Reinstala dependencias
npm install

# Inicia de nuevo
npm run dev
```

---

## 👥 Colaboradores

Para contribuir al proyecto:

1. Haz fork del repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Haz commit de tus cambios: `git commit -m 'Add: nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📝 Notas Importantes

### Sobre el API Backend (`HospitalApi`)

El proyecto incluye una carpeta `HospitalApi` con un API backend en Node.js/Express, pero **actualmente NO se está usando**. 

El frontend se conecta **directamente a Supabase**, que proporciona:
- API REST auto-generada
- Base de datos PostgreSQL
- Autenticación
- Realtime subscriptions

Si deseas usar el API backend personalizado en lugar de Supabase, necesitarás:
1. Configurar la base de datos MySQL
2. Actualizar los servicios del frontend para usar `fetch` o `axios`
3. Cambiar las URLs de `supabase.from()` a `fetch('http://localhost:3000/api/v1/...')`

---

## 📄 Licencia

Este proyecto es privado y de uso interno.

---

## 📞 Contacto

Para dudas o problemas, contacta al administrador del proyecto.

---

## 🎯 Roadmap

### Completado ✅
- CRUD de equipos, clientes, órdenes
- Gestión de catálogos (fabricantes, modalidades, técnicos)
- Dashboard con estadísticas
- Integración con Supabase

### Pendiente ⏳
- Refresco automático en tiempo real (órdenes)
- Autenticación de usuarios
- Roles y permisos
- Reportes en PDF
- Notificaciones
- Historial de cambios

---

**¡Listo para empezar! 🚀**

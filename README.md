# 🏥 Sistema H - Sistema de Gestión de Equipos Médicos

Sistema completo de gestión de equipos médicos con backend API REST y frontend moderno.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Solución de Problemas](#solución-de-problemas)

## ✨ Características

### Backend
- ✅ API REST completa con 13 entidades
- ✅ Base de datos SQLite con Sequelize ORM
- ✅ Documentación Swagger automática
- ✅ Validación de datos con express-validator
- ✅ CORS configurado para desarrollo
- ✅ Manejo robusto de errores
- ✅ Logging con Morgan

### Frontend
- ✅ Next.js 15 + React 19
- ✅ TypeScript para type-safety
- ✅ TailwindCSS 4 para estilos
- ✅ Animaciones con Framer Motion y GSAP
- ✅ Estado global con Zustand
- ✅ Formularios con React Hook Form + Zod
- ✅ Componentes UI reutilizables
- ✅ Dashboard con estadísticas en tiempo real

## 🛠 Tecnologías

### Backend
- Node.js 16+
- Express.js 4
- Sequelize 6 (ORM)
- SQLite 3
- Swagger UI Express
- Helmet (seguridad)
- Morgan (logging)
- CORS

### Frontend
- Next.js 15.5.4
- React 19.1.0
- TypeScript 5
- TailwindCSS 4
- Framer Motion 12
- GSAP 3
- Zustand 5
- Axios 1.12
- React Hook Form 7
- Zod 4

## 📦 Requisitos Previos

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd Hospital
```

### 2. Instalar dependencias del Backend

```bash
cd HospitalApi
npm install
```

### 3. Configurar variables de entorno del Backend

```bash
cp .env.example .env
# Editar .env según sea necesario
```

### 4. Inicializar la base de datos

```bash
npm run init-db
```

### 5. Instalar dependencias del Frontend

```bash
cd ../frontend
npm install
```

### 6. Configurar variables de entorno del Frontend

```bash
# Crear archivo .env.local basado en env.example.txt
cp env.example.txt .env.local
```

## 🎯 Uso

### Opción 1: Inicio Rápido (Windows)

```bash
# Desde la raíz del proyecto
START.bat
```

Este script iniciará automáticamente:
1. Backend API en `http://localhost:3000`
2. Frontend en `http://localhost:3001`

### Opción 2: Inicio Manual

#### Terminal 1 - Backend
```bash
cd HospitalApi
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Acceder a la aplicación

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **Documentación Swagger:** http://localhost:3000/api-docs
- **Health Check:** http://localhost:3000/health

## 📁 Estructura del Proyecto

```
Hospital/
├── HospitalApi/              # Backend API
│   ├── src/
│   │   ├── config/          # Configuraciones (DB, Swagger)
│   │   ├── controllers/     # Controladores de negocio
│   │   ├── models/          # Modelos de Sequelize
│   │   ├── routes/          # Definición de rutas
│   │   ├── utils/           # Utilidades
│   │   └── server.js        # Punto de entrada
│   ├── database/            # Base de datos SQLite
│   ├── scripts/             # Scripts de utilidad
│   └── package.json
│
├── frontend/                 # Frontend Next.js
│   ├── src/
│   │   ├── app/            # Páginas (App Router)
│   │   ├── components/     # Componentes React
│   │   ├── hooks/          # Custom Hooks
│   │   ├── lib/            # Librerías y utilidades
│   │   ├── services/       # Servicios de API
│   │   ├── store/          # Estado global (Zustand)
│   │   └── types/          # Tipos TypeScript
│   └── package.json
│
├── START.bat                # Script de inicio rápido
└── README.md               # Este archivo
```

## 🔌 API Endpoints

### Dashboard
- `GET /api/v1/dashboard/estadisticas` - Estadísticas generales
- `GET /api/v1/dashboard/actividad-reciente` - Actividad reciente
- `GET /api/v1/dashboard/resumen` - Resumen completo

### Equipos
- `GET /api/v1/equipos` - Listar equipos
- `GET /api/v1/equipos/:id` - Obtener equipo
- `POST /api/v1/equipos` - Crear equipo
- `PUT /api/v1/equipos/:id` - Actualizar equipo
- `DELETE /api/v1/equipos/:id` - Eliminar equipo

### Clientes
- `GET /api/v1/clientes` - Listar clientes
- `GET /api/v1/clientes/:id` - Obtener cliente
- `POST /api/v1/clientes` - Crear cliente
- `PUT /api/v1/clientes/:id` - Actualizar cliente
- `DELETE /api/v1/clientes/:id` - Eliminar cliente

### Órdenes de Trabajo
- `GET /api/v1/ordenes` - Listar órdenes
- `GET /api/v1/ordenes/:id` - Obtener orden
- `POST /api/v1/ordenes` - Crear orden
- `PUT /api/v1/ordenes/:id` - Actualizar orden
- `DELETE /api/v1/ordenes/:id` - Eliminar orden

### Catálogos
- `GET /api/v1/modalidades` - Modalidades de equipos
- `GET /api/v1/fabricantes` - Fabricantes
- `GET /api/v1/tecnicos` - Técnicos

Ver documentación completa en: http://localhost:3000/api-docs

## 🐛 Solución de Problemas

### El backend no inicia

1. Verificar que Node.js esté instalado: `node --version`
2. Verificar que las dependencias estén instaladas: `npm install`
3. Verificar que la base de datos esté inicializada: `npm run init-db`
4. Revisar el archivo `.env`

### El frontend no se conecta al backend

1. Verificar que el backend esté corriendo en el puerto 3000
2. Verificar la variable `NEXT_PUBLIC_API_URL` en `.env.local`
3. Verificar CORS en el backend

### Error de base de datos

```bash
cd HospitalApi
npm run init-db
```

### Puerto ya en uso

Si el puerto 3000 o 3001 ya está en uso:

**Backend:**
```bash
# En .env
PORT=3002
```

**Frontend:**
```bash
npm run dev -- -p 3003
```

### Limpiar y reinstalar

```bash
# Backend
cd HospitalApi
rm -rf node_modules package-lock.json
npm install

# Frontend
cd ../frontend
rm -rf node_modules package-lock.json .next
npm install
```

## 📝 Scripts Disponibles

### Backend
- `npm start` - Iniciar en producción
- `npm run dev` - Iniciar en desarrollo con nodemon
- `npm run init-db` - Inicializar base de datos
- `npm test` - Ejecutar tests
- `npm run generate-postman` - Generar colección Postman

### Frontend
- `npm run dev` - Iniciar en desarrollo
- `npm run build` - Construir para producción
- `npm start` - Iniciar en producción
- `npm run lint` - Ejecutar linter

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles

## 👥 Autores

Sistema H Team

## 🙏 Agradecimientos

- Next.js team
- React team
- Sequelize team
- TailwindCSS team

---

**Nota:** Este es un proyecto en desarrollo. Para producción, asegúrate de:
- Cambiar las claves secretas
- Configurar HTTPS
- Implementar autenticación
- Configurar rate limiting
- Usar una base de datos más robusta (PostgreSQL, MySQL)
- Implementar backups automáticos

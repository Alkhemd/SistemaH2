const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Validar variables de entorno
const { validateEnv } = require('./utils/validateEnv');
validateEnv();

// Importar configuraciones
const sequelize = require('./config/database');
const { swaggerUi, specs } = require('./config/swagger');
const apiRoutes = require('./routes/api');

// Importar modelos para establecer relaciones
require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad - Configuración compatible con desarrollo
app.use(helmet({
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Deshabilitado en desarrollo
}));

// Middleware de CORS - Configuración permisiva para desarrollo
app.use(cors({
  origin: '*', // Permitir todos los orígenes en desarrollo
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400
}));

// Middleware de logging
app.use(morgan('combined'));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Sistema H API - Documentación'
}));

// Rutas principales
app.use('/api/v1', apiRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de Sistema H',
    version: '1.0.0',
    description: 'API REST para gestión de equipos médicos',
    documentation: '/api-docs',
    endpoints: {
      api: '/api/v1',
      docs: '/api-docs'
    },
    health: '/health'
  });
});

// Ruta de health check
app.get('/health', async (req, res) => {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'Connected',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message
    });
  }
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: {
      api: '/api/v1',
      documentation: '/api-docs',
      health: '/health'
    }
  });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  
  // Error de validación de Sequelize
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: error.errors.map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }))
    });
  }
  
  // Error de clave foránea
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Error de integridad referencial',
      error: 'El registro tiene dependencias que impiden la operación'
    });
  }
  
  // Error de clave única
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Error de duplicación',
      error: 'Ya existe un registro con estos datos únicos'
    });
  }
  
  // Error de conexión a base de datos
  if (error.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      success: false,
      message: 'Error de conexión a la base de datos',
      error: 'Servicio temporalmente no disponible'
    });
  }
  
  // Error de sintaxis JSON
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'JSON malformado',
      error: 'Revise la sintaxis del JSON enviado'
    });
  }
  
  // Error genérico del servidor
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno',
    timestamp: new Date().toISOString()
  });
});

// Función para inicializar el servidor
async function startServer() {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente');
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
      console.log(`📚 Documentación disponible en http://localhost:${PORT}/api-docs`);
      console.log(`🔍 Health check en http://localhost:${PORT}/health`);
      console.log(`🌍 API base URL: http://localhost:${PORT}/api/v1`);
      console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error al inicializar el servidor:', error);
    process.exit(1);
  }
}

// Manejo graceful de cierre del servidor
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  try {
    await sequelize.close();
    console.log('✅ Conexión a la base de datos cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cerrar la conexión:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor por SIGTERM...');
  try {
    await sequelize.close();
    console.log('✅ Conexión a la base de datos cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cerrar la conexión:', error);
    process.exit(1);
  }
});

// Inicializar el servidor solo si no está en modo test
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
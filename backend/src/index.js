require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Import routes
const equiposRoutes = require('./routes/equipos');
const clientesRoutes = require('./routes/clientes');
const ordenesRoutes = require('./routes/ordenes');
const tecnicosRoutes = require('./routes/tecnicos');
const modalidadesRoutes = require('./routes/modalidades');
const fabricantesRoutes = require('./routes/fabricantes');
const dashboardRoutes = require('./routes/dashboard');
const actividadesRoutes = require('./routes/actividades');
const centroOperacionesRoutes = require('./routes/centroOperaciones');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Request logging in development
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// API Routes
app.use('/api/equipos', equiposRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/tecnicos', tecnicosRoutes);
app.use('/api/modalidades', modalidadesRoutes);
app.use('/api/fabricantes', fabricantesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/centro-operaciones', centroOperacionesRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend API running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

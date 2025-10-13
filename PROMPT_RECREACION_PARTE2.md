# 🏥 Sistema H - Prompt de Recreación (Parte 2/3)

## 🏗️ ARQUITECTURA BACKEND

### Patrón: MVC + Repository

### 1. BaseController (src/controllers/BaseController.js)

```javascript
class BaseController {
  constructor(model) {
    this.model = model;
  }

  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await this.model.findAndCountAll({
        limit,
        offset,
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getById(req, res) {
    try {
      const item = await this.model.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Registro no encontrado'
        });
      }
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async create(req, res) {
    try {
      const item = await this.model.create(req.body);
      res.status(201).json({
        success: true,
        data: item,
        message: 'Registro creado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const item = await this.model.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Registro no encontrado'
        });
      }
      await item.update(req.body);
      res.json({
        success: true,
        data: item,
        message: 'Registro actualizado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const item = await this.model.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Registro no encontrado'
        });
      }
      await item.destroy();
      res.json({
        success: true,
        message: 'Registro eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = BaseController;
```

### 2. Modelo Sequelize Ejemplo (src/models/Equipo.js)

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Equipo = sequelize.define('Equipo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Clientes',
      key: 'id'
    }
  },
  modalidad_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Modalidades',
      key: 'id'
    }
  },
  fabricante_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Fabricantes',
      key: 'id'
    }
  },
  modelo: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 200]
    }
  },
  numero_serie: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  ubicacion: {
    type: DataTypes.STRING(200)
  },
  estado: {
    type: DataTypes.STRING(50),
    defaultValue: 'operativo',
    validate: {
      isIn: [['operativo', 'mantenimiento', 'fuera-servicio']]
    }
  },
  fecha_instalacion: {
    type: DataTypes.DATEONLY
  },
  ultima_calibracion: {
    type: DataTypes.DATEONLY
  },
  proxima_calibracion: {
    type: DataTypes.DATEONLY
  },
  notas: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'Equipos',
  timestamps: true,
  underscored: true
});

module.exports = Equipo;
```

### 3. Relaciones (src/models/index.js)

```javascript
const Cliente = require('./Cliente');
const Equipo = require('./Equipo');
const Modalidad = require('./Modalidad');
const Fabricante = require('./Fabricante');
const OrdenTrabajo = require('./OrdenTrabajo');
const Tecnico = require('./Tecnico');

// Cliente -> Equipos (1:N)
Cliente.hasMany(Equipo, { foreignKey: 'cliente_id', as: 'equipos' });
Equipo.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

// Modalidad -> Equipos (1:N)
Modalidad.hasMany(Equipo, { foreignKey: 'modalidad_id', as: 'equipos' });
Equipo.belongsTo(Modalidad, { foreignKey: 'modalidad_id', as: 'modalidad' });

// Fabricante -> Equipos (1:N)
Fabricante.hasMany(Equipo, { foreignKey: 'fabricante_id', as: 'equipos' });
Equipo.belongsTo(Fabricante, { foreignKey: 'fabricante_id', as: 'fabricante' });

// Equipo -> Órdenes (1:N)
Equipo.hasMany(OrdenTrabajo, { foreignKey: 'equipo_id', as: 'ordenes_trabajo' });
OrdenTrabajo.belongsTo(Equipo, { foreignKey: 'equipo_id', as: 'equipo' });

module.exports = {
  Cliente,
  Equipo,
  Modalidad,
  Fabricante,
  OrdenTrabajo,
  Tecnico
};
```

### 4. Rutas API (src/routes/api.js)

```javascript
const express = require('express');
const router = express.Router();
const EquipoController = require('../controllers/EquipoController');

// CRUD estándar
router.get('/equipos', EquipoController.getAll.bind(EquipoController));
router.get('/equipos/:id', EquipoController.getById.bind(EquipoController));
router.post('/equipos', EquipoController.create.bind(EquipoController));
router.put('/equipos/:id', EquipoController.update.bind(EquipoController));
router.delete('/equipos/:id', EquipoController.delete.bind(EquipoController));

// Rutas especiales
router.get('/equipos/estado/:estado', EquipoController.getByEstado.bind(EquipoController));
router.get('/equipos/serial/:serial', EquipoController.getBySerial.bind(EquipoController));

module.exports = router;
```

### 5. Server.js (src/server.js)

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const sequelize = require('./config/database');
const { swaggerUi, specs } = require('./config/swagger');
const apiRoutes = require('./routes/api');
require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({ crossOriginOpenerPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas
app.use('/api/v1', apiRoutes);

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Sistema H API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'OK', database: 'Connected' });
  } catch (error) {
    res.status(503).json({ status: 'ERROR', database: 'Disconnected' });
  }
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: error.message
  });
});

// Start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server: http://localhost:${PORT}`);
      console.log(`📚 Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
```

---

## 🎨 ARQUITECTURA FRONTEND

### 1. Componentes UI Base

#### Button.tsx
```tsx
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick, 
  disabled,
  className = ''
}: ButtonProps) => {
  const baseClass = 'inline-flex items-center justify-center rounded-xl font-medium transition-all';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg',
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </motion.button>
  );
};
```

#### Input.tsx
```tsx
interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
}

export const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  icon, 
  error,
  className = ''
}: InputProps) => {
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-3 ${icon ? 'pl-10' : ''} 
          border border-gray-300 rounded-xl
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200
          ${error ? 'border-red-500' : ''}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
```

#### Modal.tsx
```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={`bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden`}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
```

#### Card.tsx
```tsx
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
}

export const Card = ({ children, hover = false, className = '' }: CardProps) => {
  const Component = hover ? motion.div : 'div';
  
  const hoverProps = hover ? {
    whileHover: { y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm transition-all ${className}`}
      {...hoverProps}
    >
      {children}
    </Component>
  );
};
```

### 2. Estado Global (Zustand)

```typescript
// store/useStore.ts
import { create } from 'zustand';

interface StoreState {
  modalOpen: boolean;
  sidebarOpen: boolean;
  isLoading: boolean;
  
  setModal: (open: boolean) => void;
  setSidebar: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  modalOpen: false,
  sidebarOpen: true,
  isLoading: false,
  
  setModal: (open) => set({ modalOpen: open }),
  setSidebar: (open) => set({ sidebarOpen: open }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
```

### 3. Data Fetching (SWR + Axios)

```typescript
// hooks/useApi.ts
import useSWR from 'swr';
import { api } from '@/lib/api';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function useEquipments() {
  const { data, error, mutate } = useSWR('/api/v1/equipos', fetcher);

  const createEquipment = async (data: any) => {
    await api.post('/equipos', data);
    mutate();
  };

  const updateEquipment = async (id: string, data: any) => {
    await api.put(`/equipos/${id}`, data);
    mutate();
  };

  const deleteEquipment = async (id: string) => {
    await api.delete(`/equipos/${id}`);
    mutate();
  };

  return {
    equipments: data?.data || [],
    isLoading: !error && !data,
    isError: error,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    mutate
  };
}
```

### 4. Formularios (React Hook Form + Zod)

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const equipmentSchema = z.object({
  modelo: z.string().min(3, 'Mínimo 3 caracteres'),
  numeroSerie: z.string().min(5, 'Mínimo 5 caracteres'),
  fabricante_id: z.number().positive('Selecciona un fabricante'),
  modalidad_id: z.number().positive('Selecciona una modalidad'),
  cliente_id: z.number().positive('Selecciona un cliente'),
  ubicacion: z.string().optional(),
  estado: z.enum(['operativo', 'mantenimiento', 'fuera-servicio']),
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

export function EquipmentForm({ onSubmit }: { onSubmit: (data: EquipmentFormData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Modelo
        </label>
        <input
          {...register('modelo')}
          className="w-full px-4 py-2 border rounded-xl"
        />
        {errors.modelo && (
          <p className="mt-1 text-sm text-red-600">{errors.modelo.message}</p>
        )}
      </div>
      {/* Más campos... */}
      <button type="submit" className="btn-primary">
        Guardar
      </button>
    </form>
  );
}
```

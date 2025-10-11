import { z } from 'zod';

// Validaciones base
const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Schema para equipos
export const equipmentSchema = z.object({
  modelo: z.string()
    .min(1, 'El modelo es requerido')
    .min(3, 'El modelo debe tener al menos 3 caracteres')
    .max(100, 'El modelo no puede exceder 100 caracteres'),
  
  numeroSerie: z.string()
    .min(1, 'El número de serie es requerido')
    .min(3, 'El número de serie debe tener al menos 3 caracteres')
    .max(50, 'El número de serie no puede exceder 50 caracteres')
    .regex(/^[A-Z0-9\-]+$/, 'El número de serie solo puede contener letras mayúsculas, números y guiones'),
  
  fabricante: z.string()
    .min(1, 'El fabricante es requerido')
    .min(2, 'El fabricante debe tener al menos 2 caracteres')
    .max(100, 'El fabricante no puede exceder 100 caracteres'),
  
  modalidad: z.string()
    .min(1, 'La modalidad es requerida'),
  
  cliente: z.string()
    .min(1, 'El cliente es requerido')
    .min(3, 'El cliente debe tener al menos 3 caracteres')
    .max(200, 'El cliente no puede exceder 200 caracteres'),
  
  estado: z.enum(['operativo', 'mantenimiento', 'fuera-servicio'], {
    message: 'Estado debe ser: operativo, mantenimiento o fuera-servicio'
  }),
  
  ubicacion: z.string()
    .min(1, 'La ubicación es requerida')
    .min(3, 'La ubicación debe tener al menos 3 caracteres')
    .max(200, 'La ubicación no puede exceder 200 caracteres'),
  
  fechaInstalacion: z.string()
    .min(1, 'La fecha de instalación es requerida')
    .refine((date) => {
      const parsedDate = new Date(date);
      const now = new Date();
      return parsedDate <= now;
    }, 'La fecha de instalación no puede ser futura'),
  
  ultimaCalibacion: z.string()
    .min(1, 'La fecha de última calibración es requerida')
    .refine((date) => {
      const parsedDate = new Date(date);
      const now = new Date();
      return parsedDate <= now;
    }, 'La fecha de última calibración no puede ser futura'),
  
  proximaCalibacion: z.string()
    .min(1, 'La fecha de próxima calibración es requerida')
    .refine((date) => {
      const parsedDate = new Date(date);
      const now = new Date();
      return parsedDate > now;
    }, 'La fecha de próxima calibración debe ser futura'),
}).refine((data) => {
  const instalacion = new Date(data.fechaInstalacion);
  const ultimaCalibacion = new Date(data.ultimaCalibacion);
  return ultimaCalibacion >= instalacion;
}, {
  message: 'La última calibración debe ser posterior a la instalación',
  path: ['ultimaCalibacion']
}).refine((data) => {
  const ultimaCalibacion = new Date(data.ultimaCalibacion);
  const proximaCalibacion = new Date(data.proximaCalibacion);
  return proximaCalibacion > ultimaCalibacion;
}, {
  message: 'La próxima calibración debe ser posterior a la última',
  path: ['proximaCalibacion']
});

// Schema para clientes
export const clientSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  
  tipo: z.enum(['publico', 'privado'], {
    message: 'Tipo de cliente inválido'
  }),
  
  ciudad: z.string()
    .min(1, 'La ciudad es requerida')
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no puede exceder 100 caracteres'),
  
  estado: z.string()
    .min(1, 'El estado es requerido')
    .min(2, 'El estado debe tener al menos 2 caracteres')
    .max(100, 'El estado no puede exceder 100 caracteres'),
  
  contacto: z.object({
    telefono: z.string()
      .min(1, 'El teléfono es requerido')
      .regex(phoneRegex, 'Formato de teléfono inválido'),
    
    email: z.string()
      .min(1, 'El email es requerido')
      .regex(emailRegex, 'Formato de email inválido')
      .max(255, 'El email no puede exceder 255 caracteres'),
    
    responsable: z.string()
      .min(1, 'El responsable es requerido')
      .min(3, 'El responsable debe tener al menos 3 caracteres')
      .max(200, 'El responsable no puede exceder 200 caracteres'),
  }),
  
  estado_cliente: z.enum(['activo', 'inactivo'], {
    message: 'Estado de cliente inválido'
  }),
});

// Schema para órdenes
export const orderSchema = z.object({
  equipo: z.object({
    modelo: z.string().min(1, 'El modelo del equipo es requerido'),
    numeroSerie: z.string().min(1, 'El número de serie es requerido'),
    fabricante: z.string().min(1, 'El fabricante es requerido'),
  }),
  
  cliente: z.string()
    .min(1, 'El cliente es requerido')
    .min(3, 'El cliente debe tener al menos 3 caracteres'),
  
  prioridad: z.enum(['critica', 'alta', 'normal'], {
    message: 'Prioridad inválida'
  }),
  
  estado: z.enum(['abierta', 'proceso', 'cerrada'], {
    message: 'Estado de orden inválido'
  }),
  
  tipo: z.enum(['correctivo', 'preventivo', 'calibracion'], {
    message: 'Tipo de orden inválido'
  }),
  
  titulo: z.string()
    .min(1, 'El título es requerido')
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres'),
  
  descripcion: z.string()
    .min(1, 'La descripción es requerida')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),
  
  fechaVencimiento: z.string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsedDate = new Date(date);
      const now = new Date();
      return parsedDate > now;
    }, 'La fecha de vencimiento debe ser futura'),
  
  tecnico: z.string()
    .optional()
    .refine((tecnico) => {
      if (!tecnico) return true;
      return tecnico.length >= 3;
    }, 'El técnico debe tener al menos 3 caracteres'),
  
  tiempoEstimado: z.string()
    .min(1, 'El tiempo estimado es requerido')
    .regex(/^\d+\s?(horas?|días?|semanas?)$/i, 'Formato de tiempo inválido (ej: "2 horas", "1 día")'),
});

// Schema para login/auth
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  
  password: z.string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  email: z.string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  
  password: z.string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  confirmPassword: z.string()
    .min(1, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Tipos TypeScript derivados
export type EquipmentFormData = z.infer<typeof equipmentSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// Funciones de validación helper
export const validateField = <T>(schema: z.ZodSchema<T>, data: any): { isValid: boolean; errors: string[] } => {
  try {
    schema.parse(data);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.issues.map((err: any) => err.message)
      };
    }
    return { isValid: false, errors: ['Error de validación desconocido'] };
  }
};

export const getFieldError = (errors: any, fieldName: string): string | undefined => {
  return errors?.[fieldName]?.message;
};

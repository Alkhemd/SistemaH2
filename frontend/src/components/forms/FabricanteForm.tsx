'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Fabricante } from '@/lib/api';

// Esquema de validación para Fabricante
const fabricanteSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es requerido')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  pais: z.string()
    .max(100, 'El país no puede exceder 100 caracteres')
    .optional(),
  soporte_tel: z.string()
    .regex(/^[\+]?[0-9\s\-\(\)]*$/, 'Formato de teléfono inválido')
    .optional(),
  web: z.string()
    .url('Debe ser una URL válida')
    .or(z.literal(''))
    .optional(),
});

type FabricanteFormData = z.infer<typeof fabricanteSchema>;

interface FabricanteFormProps {
  fabricante?: Fabricante;
  onSubmit: (data: FabricanteFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const FabricanteForm: React.FC<FabricanteFormProps> = ({
  fabricante,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FabricanteFormData>({
    resolver: zodResolver(fabricanteSchema),
    defaultValues: fabricante ? {
      nombre: fabricante.nombre,
      pais: fabricante.pais || '',
      soporte_tel: fabricante.soporte_tel || '',
      web: fabricante.web || ''
    } : {
      nombre: '',
      pais: '',
      soporte_tel: '',
      web: ''
    }
  });

  const onFormSubmit = async (data: FabricanteFormData) => {
    try {
      await onSubmit(data);
      if (!fabricante) {
        reset();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="form-container"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 p-6">
        {/* Información General */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {fabricante ? 'Editar Fabricante' : 'Nuevo Fabricante'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="form-label">
                Nombre del Fabricante *
              </label>
              <input
                {...register('nombre')}
                type="text"
                className={`input-field ${errors.nombre ? 'border-red-500' : ''}`}
                placeholder="General Electric, Siemens, Philips..."
              />
              {errors.nombre && (
                <p className="form-error">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                País
              </label>
              <input
                {...register('pais')}
                type="text"
                className={`input-field ${errors.pais ? 'border-red-500' : ''}`}
                placeholder="Estados Unidos, Alemania..."
              />
              {errors.pais && (
                <p className="form-error">{errors.pais.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                Teléfono de Soporte
              </label>
              <input
                {...register('soporte_tel')}
                type="tel"
                className={`input-field ${errors.soporte_tel ? 'border-red-500' : ''}`}
                placeholder="+1-800-123-4567"
              />
              {errors.soporte_tel && (
                <p className="form-error">{errors.soporte_tel.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="form-label">
                Sitio Web
              </label>
              <input
                {...register('web')}
                type="url"
                className={`input-field ${errors.web ? 'border-red-500' : ''}`}
                placeholder="https://www.fabricante.com"
              />
              {errors.web && (
                <p className="form-error">{errors.web.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting || isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? 'Guardando...' : (fabricante ? 'Actualizar' : 'Crear')}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
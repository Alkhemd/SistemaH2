'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Modalidad } from '@/lib/api';

// Esquema de validación para Modalidad
const modalidadSchema = z.object({
  codigo: z.string()
    .min(1, 'El código es requerido')
    .max(10, 'El código no puede exceder 10 caracteres')
    .regex(/^[A-Z0-9]+$/, 'El código solo puede contener letras mayúsculas y números'),
  descripcion: z.string()
    .max(255, 'La descripción no puede exceder 255 caracteres')
    .optional(),
});

type ModalidadFormData = z.infer<typeof modalidadSchema>;

interface ModalidadFormProps {
  modalidad?: Modalidad;
  onSubmit: (data: ModalidadFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ModalidadForm: React.FC<ModalidadFormProps> = ({
  modalidad,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ModalidadFormData>({
    resolver: zodResolver(modalidadSchema),
    defaultValues: modalidad ? {
      codigo: modalidad.codigo,
      descripcion: modalidad.descripcion || ''
    } : {
      codigo: '',
      descripcion: ''
    }
  });

  const onFormSubmit = async (data: ModalidadFormData) => {
    try {
      await onSubmit(data);
      if (!modalidad) {
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
            {modalidad ? 'Editar Modalidad' : 'Nueva Modalidad'}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="form-label">
                Código *
              </label>
              <input
                {...register('codigo')}
                type="text"
                className={`input-field ${errors.codigo ? 'border-red-500' : ''}`}
                placeholder="CT, MR, US, XR..."
                maxLength={10}
              />
              {errors.codigo && (
                <p className="form-error">{errors.codigo.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Código único que identifica la modalidad (ej: CT para Tomografía)
              </p>
            </div>

            <div>
              <label className="form-label">
                Descripción
              </label>
              <textarea
                {...register('descripcion')}
                className={`input-field resize-none ${errors.descripcion ? 'border-red-500' : ''}`}
                placeholder="Descripción detallada de la modalidad..."
                rows={3}
                maxLength={255}
              />
              {errors.descripcion && (
                <p className="form-error">{errors.descripcion.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Descripción completa de la modalidad (opcional)
              </p>
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
            variant="secondary"
            disabled={isSubmitting || isLoading}
            className="!text-gray-900"
            style={{ color: '#1a1a1a' }}
          >
            {isSubmitting || isLoading ? 'Guardando...' : (modalidad ? 'Actualizar' : 'Crear')}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
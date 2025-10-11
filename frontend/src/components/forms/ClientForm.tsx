'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, ClientFormData } from '@/lib/validations';
import { Client } from '@/lib/api';
import { ClientUI } from '@/types/equipment';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface ClientFormProps {
  client?: Client | ClientUI;
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client ? {
      nombre: client.nombre,
      tipo: (client as any).tipo as 'publico' | 'privado',
      ciudad: (client as any).ciudad || '',
      estado: (client as any).estado || '',
      contacto: typeof (client as any).contacto === 'object' ? {
        telefono: (client as any).contacto.telefono || '',
        email: (client as any).contacto.email || '',
        responsable: (client as any).contacto.responsable || ''
      } : {
        telefono: (client as any).telefono || '',
        email: (client as any).email || '',
        responsable: typeof (client as any).contacto === 'string' ? (client as any).contacto : ''
      },
      estado_cliente: (client as any).estado_cliente || 'activo'
    } : {
      nombre: '',
      tipo: 'publico' as const,
      ciudad: '',
      estado: '',
      contacto: {
        telefono: '',
        email: '',
        responsable: ''
      },
      estado_cliente: 'activo' as const
    }
  });

  const onFormSubmit = async (data: ClientFormData) => {
    try {
      await onSubmit(data);
      if (!client) {
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
      <form onSubmit={handleSubmit(onFormSubmit as any)} className="space-y-6 p-6">
        {/* Información General */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información General
          </h3>
          <div className="grid grid-cols-1 md-grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                Nombre del Cliente *
              </label>
              <input
                {...register('nombre')}
                type="text"
                className={`input-field ${errors.nombre ? 'border-red-500' : ''}`}
                placeholder="Hospital General de México..."
              />
              {errors.nombre && (
                <p className="form-error">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                Tipo *
              </label>
              <select
                {...register('tipo')}
                className={`input-field ${errors.tipo ? 'border-red-500' : ''}`}
              >
                <option value="publico">Público</option>
                <option value="privado">Privado</option>
              </select>
              {errors.tipo && (
                <p className="form-error">{errors.tipo.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ubicación
          </h3>
          <div className="grid grid-cols-1 md-grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                Ciudad *
              </label>
              <input
                {...register('ciudad')}
                type="text"
                className={`input-field ${errors.ciudad ? 'border-red-500' : ''}`}
                placeholder="Ciudad de México"
              />
              {errors.ciudad && (
                <p className="form-error">{errors.ciudad.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                Estado *
              </label>
              <input
                {...register('estado')}
                type="text"
                className={`input-field ${errors.estado ? 'border-red-500' : ''}`}
                placeholder="CDMX"
              />
              {errors.estado && (
                <p className="form-error">{errors.estado.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información de Contacto
          </h3>
          <div className="space-y-4">
            <div>
              <label className="form-label">
                Responsable *
              </label>
              <input
                {...register('contacto.responsable')}
                type="text"
                className={`input-field ${errors.contacto?.responsable ? 'border-red-500' : ''}`}
                placeholder="Dr. Juan Carlos Mendoza"
              />
              {errors.contacto?.responsable && (
                <p className="form-error">{errors.contacto.responsable.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md-grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Teléfono *
                </label>
                <input
                  {...register('contacto.telefono')}
                  type="tel"
                  className={`input-field ${errors.contacto?.telefono ? 'border-red-500' : ''}`}
                  placeholder="+52 55 1234 5678"
                />
                {errors.contacto?.telefono && (
                  <p className="form-error">{errors.contacto.telefono.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  Email *
                </label>
                <input
                  {...register('contacto.email')}
                  type="email"
                  className={`input-field ${errors.contacto?.email ? 'border-red-500' : ''}`}
                  placeholder="contacto@hospital.com"
                />
                {errors.contacto?.email && (
                  <p className="form-error">{errors.contacto.email.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Estado del Cliente */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estado
          </h3>
          <div>
            <label className="form-label">
              Estado del Cliente *
            </label>
            <select
              {...register('estado_cliente')}
              className={`input-field ${errors.estado_cliente ? 'border-red-500' : ''}`}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            {errors.estado_cliente && (
              <p className="form-error">{errors.estado_cliente.message}</p>
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
            {isSubmitting || isLoading ? 'Guardando...' : (client ? 'Actualizar Cliente' : 'Crear Cliente')}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

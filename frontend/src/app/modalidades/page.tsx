'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { ModalidadForm } from '@/components/forms/ModalidadForm';
import { modalidadesService } from '@/services/modalidadesService';
import { showToast } from '@/components/ui/Toast';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon
} from '@heroicons/react/24/outline';

export default function ModalidadesPage() {
  const [modalidades, setModalidades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedModalidad, setSelectedModalidad] = useState<any>(null);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');

  // Fetch paginado
  const fetchModalidades = useCallback(async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const { data, pagination: pag } = await modalidadesService.getPaginated(page, 10, search);
      setModalidades(data || []);
      setPagination(pag);
    } catch (error) {
      console.error('Error fetching modalidades:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchModalidades(searchTerm ? 1 : currentPage, searchTerm);
      if (searchTerm && currentPage !== 1) {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, currentPage, fetchModalidades]);

  const handleOpenModal = (type: 'create' | 'edit', modalidad?: any) => {
    setModalType(type);
    setSelectedModalidad(modalidad || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedModalidad(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (modalType === 'create') {
        await modalidadesService.create({
          codigo: data.codigo,
          descripcion: data.descripcion
        });
      } else if (selectedModalidad) {
        await modalidadesService.update(parseInt(selectedModalidad.modalidad_id || selectedModalidad.id), {
          codigo: data.codigo,
          descripcion: data.descripcion
        });
      }
      handleCloseModal();
      fetchModalidades(currentPage, searchTerm);
    } catch (error) {
      console.error('Error al guardar modalidad:', error);
    }
  };

  const handleDelete = async (modalidad: any) => {
    if (window.confirm(`¿Está seguro de que desea eliminar la modalidad "${modalidad.codigo}"?`)) {
      try {
        await modalidadesService.delete(parseInt(modalidad.modalidad_id || modalidad.id));
        fetchModalidades(currentPage, searchTerm);
      } catch (error) {
        console.error('Error al eliminar modalidad:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold neuro-text-primary mb-2">
          Modalidades
        </h1>
        <p className="text-lg neuro-text-secondary mb-4">
          Gestión de modalidades de equipos médicos
        </p>
        <button
          onClick={() => handleOpenModal('create')}
          className="neuro-button-white"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nueva Modalidad</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="neuro-card-soft p-8 animate-fade-in">
        <div className="flex items-center space-x-2 mb-6">
          <MagnifyingGlassIcon className="w-5 h-5 neuro-text-secondary" />
          <h3 className="font-semibold neuro-text-primary text-base">Búsqueda</h3>
        </div>
        <div className="neuro-input-wrapper">
          <MagnifyingGlassIcon className="w-5 h-5 neuro-text-tertiary absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Buscar por código o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neuro-input"
            style={{ paddingLeft: '48px' }}
          />
        </div>
      </div>

      {/* Results count and pagination */}
      <div className="flex justify-between items-center">
        <p className="neuro-text-tertiary text-sm">
          {searchTerm
            ? `${modalidades.length} resultado${modalidades.length !== 1 ? 's' : ''} encontrado${modalidades.length !== 1 ? 's' : ''}`
            : `Mostrando ${modalidades.length} de ${pagination?.total || 0} modalidades`
          }
        </p>

        {pagination && !searchTerm && pagination.totalPages > 1 && (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="neuro-button px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>
            <span className="neuro-text-secondary text-sm">
              Página {currentPage} de {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage >= pagination.totalPages}
              className="neuro-button px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>

      {/* Lista de Modalidades */}
      <div className="neuro-card animate-fade-in">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando modalidades...</p>
          </div>
        ) : modalidades.length === 0 ? (
          <div className="p-8 text-center">
            <TagIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No se encontraron modalidades que coincidan con la búsqueda' : 'No hay modalidades registradas'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => handleOpenModal('create')}
                className="btn-primary mt-4"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Crear Primera Modalidad
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {modalidades.map((modalidad: any, index: number) => (
                  <motion.tr
                    key={modalidad.modalidad_id || `modalidad-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <TagIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {modalidad.codigo}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {modalidad.descripcion || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal('edit', modalidad)}
                        className="text-blue-600 hover:text-blue-900 mr-3 p-1 rounded-md hover:bg-blue-50 transition-colors"
                        title="Editar modalidad"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(modalidad)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                        title="Eliminar modalidad"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={modalType === 'create' ? 'Nueva Modalidad' : 'Editar Modalidad'}
        size="md"
      >
        <ModalidadForm
          modalidad={selectedModalidad || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
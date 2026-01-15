'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BuildingOfficeIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ActionCard } from '@/components/ui/ActionCard';
import { FabricanteForm } from '@/components/forms/FabricanteForm';
import { fabricantesService } from '@/services/fabricantesService';
import { SkeletonCard } from '@/components/ui/Skeleton';

export default function FabricantesPage() {
  const [fabricantes, setFabricantes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFabricante, setSelectedFabricante] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch paginado
  const fetchFabricantes = useCallback(async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const { data, pagination: pag } = await fabricantesService.getPaginated(page, 10, search);
      setFabricantes(data || []);
      setPagination(pag);
    } catch (error) {
      console.error('Error fetching fabricantes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFabricantes(searchTerm ? 1 : currentPage, searchTerm);
      if (searchTerm && currentPage !== 1) {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, currentPage, fetchFabricantes]);

  // Manejar creación
  const handleCreateFabricante = async (data: any) => {
    try {
      await fabricantesService.create({
        nombre: data.nombre,
        pais: data.pais,
        soporte_tel: data.soporte_tel,
        web: data.web
      });
      setIsCreateModalOpen(false);
      fetchFabricantes(currentPage, searchTerm);
    } catch (error) {
      console.error('Error al crear fabricante:', error);
    }
  };

  // Manejar edición
  const handleEditFabricante = async (data: any) => {
    if (!selectedFabricante) return;

    try {
      await fabricantesService.update(parseInt(selectedFabricante.fabricante_id || selectedFabricante.id), {
        nombre: data.nombre,
        pais: data.pais,
        soporte_tel: data.soporte_tel,
        web: data.web
      });
      setIsEditModalOpen(false);
      setSelectedFabricante(null);
      fetchFabricantes(currentPage, searchTerm);
    } catch (error) {
      console.error('Error al editar fabricante:', error);
    }
  };

  const handleViewFabricante = (fabricante: any) => {
    setSelectedFabricante(fabricante);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (fabricante: any) => {
    setSelectedFabricante(fabricante);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold neuro-text-primary mb-2">
          Fabricantes
        </h1>
        <p className="text-lg neuro-text-secondary mb-4">
          Gestión de fabricantes de equipos médicos
        </p>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="neuro-button-white"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nuevo Fabricante</span>
        </button>
      </div>

      {/* Controles */}
      <div className="neuro-card-soft p-8 animate-fade-in">
        <div className="flex items-center space-x-2 mb-6">
          <MagnifyingGlassIcon className="w-5 h-5 neuro-text-secondary" />
          <h3 className="font-semibold neuro-text-primary text-base">Búsqueda</h3>
        </div>
        <div className="neuro-input-wrapper">
          <MagnifyingGlassIcon className="w-5 h-5 neuro-text-tertiary absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Buscar fabricantes..."
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
            ? `${fabricantes.length} resultado${fabricantes.length !== 1 ? 's' : ''} encontrado${fabricantes.length !== 1 ? 's' : ''}`
            : `Mostrando ${fabricantes.length} de ${pagination?.total || 0} fabricantes`
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

      {/* Lista de fabricantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Mostrar skeletons mientras carga
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {fabricantes.map((fabricante: any, index: number) => (
              <motion.div
                key={fabricante.fabricante_id || `fabricante-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
              >
                <ActionCard
                  onClick={() => handleViewFabricante(fabricante)}
                  onEdit={() => handleEditClick(fabricante)}
                  showActions={false}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {fabricante.nombre}
                          </h3>
                          <p className="text-sm text-gray-500">{fabricante.pais}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Teléfono:</span>
                        <span className="font-medium">{fabricante.soporte_tel || 'N/A'}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Website:</span>
                        <span className="font-medium truncate ml-2">{fabricante.web || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </ActionCard>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {!isLoading && fabricantes.length === 0 && (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron fabricantes
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando un nuevo fabricante'}
          </p>
        </div>
      )}

      {/* Modal Crear */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nuevo Fabricante"
      >
        <FabricanteForm
          onSubmit={handleCreateFabricante}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedFabricante(null);
        }}
        title="Editar Fabricante"
      >
        <FabricanteForm
          fabricante={selectedFabricante}
          onSubmit={handleEditFabricante}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedFabricante(null);
          }}
        />
      </Modal>

      {/* Modal Ver Detalles */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedFabricante(null);
        }}
        title="Detalles del Fabricante"
      >
        {selectedFabricante && (
          <div className="p-6 space-y-6">
            {/* Header with Icon */}
            <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1D1D1F]">{selectedFabricante.nombre}</h3>
                <p className="text-sm text-[#86868B] mt-0.5">{selectedFabricante.pais}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">País</p>
                <p className="text-[#1D1D1F] font-semibold">{selectedFabricante.pais || 'No especificado'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Teléfono Soporte</p>
                <p className="text-[#1D1D1F] font-semibold">{selectedFabricante.soporte_tel || 'No especificado'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Website</p>
                <p className="text-[#1D1D1F] font-semibold break-all">{selectedFabricante.web || 'No especificado'}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                onClick={() => setIsViewModalOpen(false)}
              >
                Cerrar
              </button>
              <button
                className="px-4 py-2.5 text-sm font-medium text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-xl transition-colors"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setIsEditModalOpen(true);
                }}
              >
                Editar Fabricante
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
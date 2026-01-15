'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ActionCard } from '@/components/ui/ActionCard';
import { TecnicoForm } from '@/components/forms/TecnicoForm';
import { tecnicosService } from '@/services/tecnicosService';
import { SkeletonCard } from '@/components/ui/Skeleton';

const especialidadLabels = {
  'XR': 'Rayos X',
  'CT': 'Tomografía',
  'MR': 'Resonancia',
  'US': 'Ultrasonido',
  'MG': 'Mamografía',
  'PET/CT': 'PET/CT',
  'Multi-mod': 'Multi-modalidad',
  'DEXA': 'DEXA',
  'RF': 'Fluoroscopía',
  'CATH': 'Cateterismo'
};

export default function TecnicosPage() {
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTecnico, setSelectedTecnico] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch paginado de técnicos
  const fetchTecnicos = useCallback(async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const { data, pagination: pag } = await tecnicosService.getPaginated(page, 10, search);
      setTecnicos(data || []);
      setPagination(pag);
    } catch (error) {
      console.error('Error fetching tecnicos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect con debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTecnicos(searchTerm ? 1 : currentPage, searchTerm);
      if (searchTerm && currentPage !== 1) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, currentPage, fetchTecnicos]);

  // Manejar creación
  const handleCreateTecnico = async (data: any) => {
    try {
      await tecnicosService.create({
        nombre: data.nombre,
        especialidad: data.especialidad,
        certificaciones: data.certificaciones,
        telefono: data.telefono,
        email: data.email,
        base_ciudad: data.base_ciudad,
        activo: data.activo
      });
      setIsCreateModalOpen(false);
      fetchTecnicos(currentPage, searchTerm); // Refetch
    } catch (error) {
      console.error('Error al crear técnico:', error);
    }
  };

  // Manejar edición
  const handleEditTecnico = async (data: any) => {
    if (!selectedTecnico) return;

    try {
      await tecnicosService.update(parseInt(selectedTecnico.tecnico_id || selectedTecnico.id), {
        nombre: data.nombre,
        especialidad: data.especialidad,
        certificaciones: data.certificaciones,
        telefono: data.telefono,
        email: data.email,
        base_ciudad: data.base_ciudad,
        activo: data.activo
      });
      setIsEditModalOpen(false);
      setSelectedTecnico(null);
      fetchTecnicos(currentPage, searchTerm); // Refetch
    } catch (error) {
      console.error('Error al editar técnico:', error);
    }
  };

  const handleViewTecnico = (tecnico: any) => {
    setSelectedTecnico(tecnico);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (tecnico: any) => {
    setSelectedTecnico(tecnico);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold neuro-text-primary mb-2">
          Técnicos
        </h1>
        <p className="text-lg neuro-text-secondary mb-4">
          Gestión de técnicos especializados
        </p>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="neuro-button-white"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nuevo Técnico</span>
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
            placeholder="Buscar técnicos..."
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
            ? `${tecnicos.length} resultado${tecnicos.length !== 1 ? 's' : ''} encontrado${tecnicos.length !== 1 ? 's' : ''}`
            : `Mostrando ${tecnicos.length} de ${pagination?.total || 0} técnicos`
          }
        </p>

        {/* Pagination Controls */}
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

      {/* Lista de técnicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Mostrar skeletons mientras carga
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {tecnicos.map((tecnico: any, index: number) => (
              <motion.div
                key={tecnico.tecnico_id || `tecnico-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
              >
                <ActionCard
                  onClick={() => handleViewTecnico(tecnico)}
                  onEdit={() => handleEditClick(tecnico)}
                  showActions={false}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tecnico.activo ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <UserIcon className={`w-6 h-6 ${tecnico.activo ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {tecnico.nombre}
                          </h3>
                          <p className="text-sm text-gray-500">{tecnico.base_ciudad}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tecnico.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {tecnico.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Especialidad:</p>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                          {especialidadLabels[tecnico.especialidad as keyof typeof especialidadLabels] || tecnico.especialidad}
                        </span>
                      </div>

                      {tecnico.certificaciones && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Certificaciones:</p>
                          <p className="text-sm text-gray-600">{tecnico.certificaciones}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Email:</span>
                        <span className="font-semibold text-xs truncate ml-2">{tecnico.email || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </ActionCard>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {!isLoading && tecnicos.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron técnicos
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando un nuevo técnico'}
          </p>
        </div>
      )}

      {/* Modal Crear */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nuevo Técnico"
      >
        <TecnicoForm
          onSubmit={handleCreateTecnico}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTecnico(null);
        }}
        title="Editar Técnico"
      >
        <TecnicoForm
          tecnico={selectedTecnico}
          onSubmit={handleEditTecnico}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedTecnico(null);
          }}
        />
      </Modal>

      {/* Modal Ver Detalles */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTecnico(null);
        }}
        title="Detalles del Técnico"
      >
        {selectedTecnico && (
          <div className="p-6 space-y-6">
            {/* Header with Avatar */}
            <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${selectedTecnico.activo ? 'bg-gradient-to-br from-green-50 to-green-100' : 'bg-gradient-to-br from-gray-50 to-gray-100'
                }`}>
                <UserIcon className={`w-8 h-8 ${selectedTecnico.activo ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1D1D1F]">{selectedTecnico.nombre}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                    {especialidadLabels[selectedTecnico.especialidad as keyof typeof especialidadLabels] || selectedTecnico.especialidad}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${selectedTecnico.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {selectedTecnico.activo ? '● Activo' : '○ Inactivo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Grid - 2 columns forced */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Ciudad Base</p>
                <p className="text-[#1D1D1F] font-semibold">{selectedTecnico.base_ciudad || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Teléfono</p>
                <p className="text-[#1D1D1F] font-semibold">{selectedTecnico.telefono || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Email</p>
                <p className="text-[#1D1D1F] font-semibold">{selectedTecnico.email || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Certificaciones</p>
                <p className="text-[#1D1D1F] font-semibold">{selectedTecnico.certificaciones || 'N/A'}</p>
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
                Editar Técnico
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
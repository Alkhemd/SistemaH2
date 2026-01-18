// Archivo reemplazado por versión limpia y corregida
'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  PlusIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { fade, slideUp, staggerListParent, staggerListItem } from '@/lib/animationPresets';
import ScrollReveal from '@/components/animations/ScrollReveal';
import SplitText from '@/components/animations/SplitText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { ActionCard } from '@/components/ui/ActionCard';
import { SimpleEquipmentForm } from '@/components/forms/SimpleEquipmentForm';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useStore } from '@/store/useStore';
import { useEquipments } from '@/hooks/useApi';
import { Equipment } from '@/lib/api';
import { EquipmentUI } from '@/types/equipment';

export default function EquiposPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentUI | null>(null);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [currentPage, setCurrentPage] = useState(1);
  const { modalOpen, setModal, isLoading } = useStore();
  const { equipments, pagination, fetchEquipments, createEquipment, updateEquipment, deleteEquipment } = useEquipments();

  // Effect para buscar cuando cambia el término de búsqueda o la página
  useEffect(() => {
    const timer = setTimeout(() => {
      // Búsqueda global en backend
      fetchEquipments({
        page: searchTerm ? 1 : currentPage,
        limit: 20,
        search: searchTerm
      });
      if (searchTerm && currentPage !== 1) {
        setCurrentPage(1); // Reset to page 1 when searching
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [searchTerm, currentPage]);

  const handleCreateEquipment = async (data: any) => {
    try {
      await createEquipment(data);
      setModal(false);
      setSelectedEquipment(null);
    } catch (error) {
      console.error('Error creating equipment:', error);
    }
  };

  const handleEditEquipment = (equipment: EquipmentUI) => {
    setSelectedEquipment(equipment);
    setModalType('edit');
    setModal(true);
  };

  const handleViewDetails = (equipmentId: string) => {
    const equipment = equipments.find(eq => eq.id === equipmentId);
    if (equipment) {
      setSelectedEquipment(equipment);
      setModalType('view');
      setModal(true);
    }
  };

  const handleDeleteEquipment = async (equipmentId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este equipo?')) {
      try {
        await deleteEquipment(equipmentId);
      } catch (error) {
        console.error('Error deleting equipment:', error);
      }
    }
  };

  const handleUpdateEquipment = async (data: any) => {
    if (selectedEquipment) {
      try {
        await updateEquipment(selectedEquipment.id ?? '', data);
        setModal(false);
        setSelectedEquipment(null);
      } catch (error) {
        console.error('Error updating equipment:', error);
      }
    }
  };

  const openCreateModal = () => {
    setSelectedEquipment(null);
    setModalType('create');
    setModal(true);
  };

  if (isLoading && equipments.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold neuro-text-primary mb-2">
          Gestión de equipos médicos
        </h1>
        <button
          onClick={openCreateModal}
          className="neuro-button-white mt-4"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nuevo Equipo</span>
        </button>
      </div>

      {/* Filtros Section */}
      <div className="neuro-card-soft p-8">
        <div className="flex items-center space-x-2 mb-6">
          <FunnelIcon className="w-5 h-5 neuro-text-secondary" />
          <h3 className="font-semibold neuro-text-primary text-base">Búsqueda</h3>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div className="neuro-input-wrapper">
            <MagnifyingGlassIcon className="w-5 h-5 neuro-text-tertiary absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Buscar por modelo, fabricante, cliente o número de serie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neuro-input"
              style={{ paddingLeft: '48px' }}
            />
          </div>
        </div>
      </div>

      {/* Results count and pagination  */}
      <div className="flex justify-between items-center">
        <p className="neuro-text-tertiary text-sm">
          {pagination?.isSearch
            ? `${equipments.length} resultado${equipments.length !== 1 ? 's' : ''} encontrado${equipments.length !== 1 ? 's' : ''}`
            : `Mostrando ${equipments.length} de ${pagination?.total || 0} equipos`
          }
        </p>

        {/* Pagination Controls */}
        {pagination && !pagination.isSearch && pagination.totalPages > 1 && (
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

      {/* Equipment Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`
          ${viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }
        `}
      >
        {equipments.map((equipment, index) => (
          <motion.div
            key={equipment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.03 }}
          >
            <ActionCard
              onClick={() => handleViewDetails(equipment.id)}
              onEdit={() => handleEditEquipment(equipment)}
              onDelete={() => handleDeleteEquipment(equipment.id)}
            >
              <div className="p-4 flex gap-5">
                {/* Left Side: Image */}
                <div className="flex-shrink-0 w-32 h-32 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
                  {equipment.fotoUrl ? (
                    <img src={equipment.fotoUrl} alt={equipment.modelo} className="w-full h-full object-cover" />
                  ) : (
                    <CubeIcon className="w-12 h-12 text-blue-200" />
                  )}
                </div>

                {/* Right Side: Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 truncate pr-2" title={equipment.modelo}>
                        {equipment.modelo}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium truncate" title={equipment.fabricante}>
                        {equipment.fabricante}
                      </p>
                    </div>
                    <span className={`
                      flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold
                      ${equipment.estado === 'operativo' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        equipment.estado === 'mantenimiento' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-red-100 text-red-800 border border-red-200'}
                    `}>
                      {equipment.estado}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 gap-1 text-sm text-gray-600 mt-2">
                    <p className="truncate" title={equipment.numeroSerie}>
                      <span className="text-gray-400 text-xs uppercase tracking-wider mr-1">SERIE</span>
                      {equipment.numeroSerie}
                    </p>
                    <p className="truncate" title={equipment.cliente}>
                      <span className="text-gray-400 text-xs uppercase tracking-wider mr-1">CLIENTE</span>
                      {equipment.cliente}
                    </p>
                    <p className="truncate" title={equipment.ubicacion}>
                      <span className="text-gray-400 text-xs uppercase tracking-wider mr-1">UBICACIÓN</span>
                      {equipment.ubicacion}
                    </p>
                  </div>
                </div>
              </div>
            </ActionCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {equipments.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <CubeIcon className="icon-xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron equipos
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Intenta ajustar los filtros de búsqueda' : 'Comienza agregando tu primer equipo médico'}
          </p>
          <button
            className="btn-primary"
            onClick={() => searchTerm ? setSearchTerm('') : openCreateModal()}
          >
            {searchTerm ? 'Limpiar filtros' : 'Agregar Equipo'}
          </button>
        </motion.div>
      )}

      {/* Modal para crear/editar/ver equipo */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModal(false);
          setSelectedEquipment(null);
        }}
        title={
          modalType === 'create' ? 'Nuevo Equipo' :
            modalType === 'edit' ? 'Editar Equipo' : 'Detalles del Equipo'
        }
        size="lg"
      >
        {modalType === 'view' && selectedEquipment ? (
          <div className="p-6 space-y-6">
            {/* Header with Icon */}
            <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
                {selectedEquipment.fotoUrl ? (
                  <img src={selectedEquipment.fotoUrl} alt={selectedEquipment.modelo} className="w-full h-full object-cover" />
                ) : (
                  <CubeIcon className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1D1D1F]">{selectedEquipment.modelo}</h3>
                <p className="text-sm text-[#86868B] mt-0.5">
                  {typeof selectedEquipment.fabricante === 'string' ? selectedEquipment.fabricante : (selectedEquipment.fabricante as any)?.nombre || 'N/A'} · {selectedEquipment.numeroSerie}
                </p>
              </div>
              <span className={`ml-auto px-3 py-1.5 rounded-full text-xs font-medium ${selectedEquipment.estado === 'operativo' ? 'bg-green-100 text-green-800' :
                selectedEquipment.estado === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                {selectedEquipment.estado}
              </span>
            </div>

            {/* Info Grid - 2 columns forced */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Fabricante</p>
                <p className="text-[#1D1D1F] font-semibold">
                  {typeof selectedEquipment.fabricante === 'string' ? selectedEquipment.fabricante : (selectedEquipment.fabricante as any)?.nombre || 'No especificado'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Modalidad</p>
                <p className="text-[#1D1D1F] font-semibold">
                  {typeof selectedEquipment.modalidad === 'string' ? selectedEquipment.modalidad : (selectedEquipment.modalidad as any)?.nombre || 'No especificado'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Cliente</p>
                <p className="text-[#1D1D1F] font-semibold">
                  {typeof selectedEquipment.cliente === 'string' ? selectedEquipment.cliente : (selectedEquipment.cliente as any)?.nombre || 'No especificado'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Ubicación</p>
                <p className="text-[#1D1D1F] font-semibold">{selectedEquipment.ubicacion || 'No especificado'}</p>
              </div>
            </div>

            {/* Fechas Grid - 3 columns forced */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Instalación</p>
                <p className="text-[#1D1D1F] font-semibold">{selectedEquipment.fechaInstalacion || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Últ. Calibración</p>
                <p className="text-[#1D1D1F] font-semibold">{selectedEquipment.ultimaCalibacion || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Próx. Calibración</p>
                <p className="text-[#1D1D1F] font-semibold">{selectedEquipment.proximaCalibacion || 'N/A'}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                onClick={() => {
                  setModal(false);
                  setSelectedEquipment(null);
                }}
              >
                Cerrar
              </button>
              <button
                className="px-4 py-2.5 text-sm font-medium text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-xl transition-colors"
                onClick={() => {
                  setModalType('edit');
                }}
              >
                Editar Equipo
              </button>
            </div>
          </div>
        ) : (
          <SimpleEquipmentForm
            equipment={modalType === 'edit' ? selectedEquipment : undefined}
            onSubmit={modalType === 'edit' ? handleUpdateEquipment : handleCreateEquipment}
            onCancel={() => {
              setModal(false);
              setSelectedEquipment(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

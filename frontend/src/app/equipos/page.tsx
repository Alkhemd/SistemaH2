// Archivo reemplazado por versión limpia y corregida
'use client';

import { useState, useMemo } from 'react';
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
  const { modalOpen, setModal, isLoading } = useStore();
  const { equipments, createEquipment, updateEquipment, deleteEquipment } = useEquipments();

  const filteredEquipments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!equipments) return [] as EquipmentUI[];
    if (!term) return equipments as EquipmentUI[];

    return (equipments as any[]).filter((equipment) => {
      const modelo = (equipment.modelo || '').toString().toLowerCase();
      const numeroSerie = (equipment.numeroSerie || '').toString().toLowerCase();

      const fabricante = typeof equipment.fabricante === 'string'
        ? equipment.fabricante
        : (equipment.fabricante && (equipment.fabricante as any).nombre) || '';

      const cliente = typeof equipment.cliente === 'string'
        ? equipment.cliente
        : (equipment.cliente && (equipment.cliente as any).nombre) || '';

      return (
        modelo.includes(term) ||
        numeroSerie.includes(term) ||
        fabricante.toString().toLowerCase().includes(term) ||
        cliente.toString().toLowerCase().includes(term)
      );
    }) as EquipmentUI[];
  }, [equipments, searchTerm]);

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <ScrollReveal enableBlur={false} baseOpacity={0.12} baseRotation={2} containerClassName="mb-2">
            <SplitText text="Equipos" tag="h1" className="text-4xl font-bold text-gray-900" />
          </ScrollReveal>
          <p className="text-lg text-gray-600">
            Gestión de equipos médicos
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <ListBulletIcon className="icon-md" />
            ) : (
              <Squares2X2Icon className="icon-md" />
            )}
          </Button>

          <button className="btn-primary" onClick={openCreateModal}>
            <PlusIcon className="icon-sm mr-2" />
            Nuevo Equipo
          </button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Input
          placeholder="Buscar equipos por modelo, fabricante, cliente o número de serie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<MagnifyingGlassIcon className="icon-md" />}
        />
      </motion.div>

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <p className="text-gray-600">
          Mostrando {filteredEquipments.length} de {equipments.length} equipos
        </p>
      </motion.div>

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
        {filteredEquipments.map((equipment, index) => (
          <motion.div
            key={equipment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
          >
            <Card hover>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {equipment.modelo}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {equipment.fabricante}
                    </p>
                  </div>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${equipment.estado === 'operativo' ? 'bg-green-100 text-green-800' :
                      equipment.estado === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}
                  `}>
                    {equipment.estado}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Serie:</span> {equipment.numeroSerie}</p>
                  <p><span className="font-medium">Cliente:</span> {equipment.cliente}</p>
                  <p><span className="font-medium">Ubicación:</span> {equipment.ubicacion}</p>
                  <p><span className="font-medium">Modalidad:</span> {equipment.modalidad}</p>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button 
                    className="btn-ghost"
                    onClick={() => handleViewDetails(equipment.id)}
                  >
                    Ver Detalles
                  </button>
                  <button 
                    className="btn-ghost"
                    onClick={() => handleEditEquipment(equipment)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-ghost text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteEquipment(equipment.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredEquipments.length === 0 && !isLoading && (
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
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 md-grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Información General</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Modelo:</span>
                    <p className="text-gray-900">{selectedEquipment.modelo}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Fabricante:</span>
                    <p className="text-gray-900">{typeof selectedEquipment.fabricante === 'string' ? selectedEquipment.fabricante : (selectedEquipment.fabricante as any)?.nombre || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Número de Serie:</span>
                    <p className="text-gray-900">{selectedEquipment.numeroSerie}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Modalidad:</span>
                    <p className="text-gray-900">{typeof selectedEquipment.modalidad === 'string' ? selectedEquipment.modalidad : (selectedEquipment.modalidad as any)?.nombre || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Ubicación y Estado</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Cliente:</span>
                    <p className="text-gray-900">{typeof selectedEquipment.cliente === 'string' ? selectedEquipment.cliente : (selectedEquipment.cliente as any)?.nombre || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Ubicación:</span>
                    <p className="text-gray-900">{selectedEquipment.ubicacion}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Estado:</span>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      selectedEquipment.estado === 'operativo' ? 'status-operativo' :
                      selectedEquipment.estado === 'mantenimiento' ? 'status-mantenimiento' :
                      'status-fuera-servicio'
                    }`}>
                      {selectedEquipment.estado}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Fechas Importantes</h3>
              <div className="grid grid-cols-1 md-grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Instalación:</span>
                  <p className="text-gray-900">{selectedEquipment.fechaInstalacion}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Última Calibración:</span>
                  <p className="text-gray-900">{selectedEquipment.ultimaCalibacion}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Próxima Calibración:</span>
                  <p className="text-gray-900">{selectedEquipment.proximaCalibacion}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button 
                className="btn-ghost"
                onClick={() => {
                  setModalType('edit');
                }}
              >
                Editar
              </button>
              <button 
                className="btn-ghost"
                onClick={() => {
                  setModal(false);
                  setSelectedEquipment(null);
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <SimpleEquipmentForm
            onSubmit={handleCreateEquipment}
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

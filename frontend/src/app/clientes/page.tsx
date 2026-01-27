'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { slideUp, fade, staggerListParent, staggerListItem } from '@/lib/animationPresets';
import ScrollReveal from '@/components/animations/ScrollReveal';
import SplitText from '@/components/animations/SplitText';
import { useClients } from '@/hooks/useApi';
import { ClientUI } from '@/types/equipment';
import { Modal } from '@/components/ui/Modal';
import { ActionCard } from '@/components/ui/ActionCard';
import { ClientForm } from '@/components/forms/ClientForm';
import { ordenesService, Orden } from '@/services/ordenesService';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  BeakerIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Usando la interfaz Client del API y datos del mock API

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientUI | null>(null);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Client history states
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');
  const [clientOrders, setClientOrders] = useState<Orden[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const { clients, pagination, fetchClients, createClient, updateClient, deleteClient } = useClients();

  // Fix hydration error - wait for client mount before animations
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch clients with debounce when search or page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClients({
        page: searchTerm ? 1 : currentPage,
        limit: 10,
        search: searchTerm
      });
      if (searchTerm && currentPage !== 1) {
        setCurrentPage(1);
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [searchTerm, currentPage]);

  // Backend handles search, only apply dropdown filters client-side
  const filteredClients = useMemo(() => {
    const filtered = clients.filter(client => {
      const matchesTipo = selectedTipo === '' || client.tipo === selectedTipo;
      const matchesEstado = selectedEstado === '' || client.estado_cliente === selectedEstado;

      return matchesTipo && matchesEstado;
    });

    return filtered;
  }, [clients, selectedTipo, selectedEstado]);

  // Don't render animated content until mounted on client to prevent hydration mismatch
  // This check must be AFTER all hooks to satisfy Rules of Hooks
  if (!mounted) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card h-32 bg-gray-100"></div>
          ))}
        </div>
      </div>
    );
  }

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTipo('');
    setSelectedEstado('');
  };

  const hasActiveFilters = searchTerm || selectedTipo || selectedEstado;

  // Funciones para manejar el modal
  const openCreateModal = () => {
    setSelectedClient(null);
    setModalType('create');
    setModalOpen(true);
  };

  const fetchClientOrders = async (clientId: string) => {
    setLoadingOrders(true);
    try {
      const result = await ordenesService.getAll({ clienteId: parseInt(clientId) });
      if (result.data) {
        setClientOrders(result.data);
      }
    } catch (error) {
      console.error('Error fetching client orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleViewClient = (client: ClientUI) => {
    setSelectedClient(client);
    setModalType('view');
    setActiveTab('info'); // Reset to info tab
    setModalOpen(true);
    // Fetch orders for this client
    fetchClientOrders(client.id);
  };

  const handleEditClient = (client: ClientUI) => {
    setSelectedClient(client);
    setModalType('edit');
    setModalOpen(true);
  };

  const handleCreateClient = async (data: any) => {
    try {
      await createClient(data);
      setModalOpen(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const handleUpdateClient = async (data: any) => {
    if (selectedClient) {
      try {
        await updateClient(selectedClient.id, data);
        setModalOpen(false);
        setSelectedClient(null);
      } catch (error) {
        console.error('Error updating client:', error);
      }
    }
  };

  const getTipoColor = (tipo: ClientUI['tipo']) => {
    return tipo === 'publico'
      ? 'bg-blue-50 text-blue-600'
      : 'bg-purple-50 text-purple-600';
  };

  const getEstadoColor = (estado: ClientUI['estado_cliente']) => {
    return estado === 'activo'
      ? 'bg-green-50 text-green-600'
      : 'bg-gray-50 text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold neuro-text-primary mb-2">
          Gestión de hospitales y clínicas
        </h1>
        <button
          className="neuro-button-white mt-4"
          onClick={openCreateModal}
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="neuro-card-soft p-8">
        <div className="flex items-center space-x-2 mb-6">
          <MagnifyingGlassIcon className="w-5 h-5 neuro-text-secondary" />
          <h3 className="font-semibold neuro-text-primary text-base">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Search */}
          <div className="md:col-span-2 neuro-input-wrapper">
            <MagnifyingGlassIcon className="w-5 h-5 neuro-text-tertiary absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neuro-input"
              style={{ paddingLeft: '48px' }}
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
            className="neuro-input"
          >
            <option value="">Todos los tipos</option>
            <option value="publico">Público</option>
            <option value="privado">Privado</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            className="neuro-input"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Results Count and Pagination */}
      <div className="flex justify-between items-center">
        <p className="neuro-text-tertiary text-sm">
          {pagination?.isSearch
            ? `${filteredClients.length} cliente${filteredClients.length !== 1 ? 's' : ''} encontrado${filteredClients.length !== 1 ? 's' : ''}`
            : `Mostrando ${clients.length} de ${pagination?.total || 0} clientes`
          }
        </p>

        {/* Pagination Controls */}
        {pagination && !pagination.isSearch && pagination.totalPages > 1 && (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="neuro-button px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              ← Anterior
            </button>
            <span className="neuro-text-secondary text-sm">
              Página {currentPage} de {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage >= pagination.totalPages}
              className="neuro-button px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>

      {/* Clients List - Using regular divs with CSS animations for reliability */}
      <div className="space-y-4">
        {filteredClients.map((client, index) => (
          <ActionCard
            key={client.id}
            onClick={() => handleViewClient(client)}
            onEdit={() => handleEditClient(client)}
            showActions={false}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {/* Icon - Neumorphic Design */}
                <div className="w-16 h-16 neuro-convex-sm rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 relative overflow-hidden group">
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent opacity-60" />

                  {/* Icon */}
                  <BuildingOfficeIcon className="w-8 h-8 text-blue-600 relative z-10 transition-transform duration-300 group-hover:scale-110" />

                  {/* Hover accent */}
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-[#1D1D1F] truncate">
                      {client.nombre}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(client.tipo)}`}>
                      {client.tipo === 'publico' ? 'Público' : 'Privado'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(client.estado_cliente)}`}>
                      {client.estado_cliente === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {/* Location */}
                    <div className="flex items-center space-x-2 text-[#6E6E73]">
                      <MapPinIcon className="icon-sm" />
                      <span>{client.ciudad}, {client.estado}</span>
                    </div>

                    {/* Equipment Count */}
                    <div className="flex items-center space-x-2 text-[#6E6E73]">
                      <BeakerIcon className="icon-sm" />
                      <span>{client.equiposCount} equipos</span>
                    </div>

                    {/* Contact */}
                    <div className="flex items-center space-x-2 text-[#6E6E73]">
                      <UserGroupIcon className="icon-sm" />
                      <span>{client.contacto.responsable}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm">
                    {/* Phone */}
                    <div className="flex items-center space-x-2 text-[#86868B]">
                      <PhoneIcon className="icon-sm" />
                      <span>{client.contacto.telefono}</span>
                    </div>

                    {/* Last Activity */}
                    <div className="flex items-center space-x-2 text-[#86868B]">
                      <CalendarIcon className="icon-sm" />
                      <span>Últ. actividad: {client.ultimaActividad}</span>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </ActionCard>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MagnifyingGlassIcon className="icon-lg text-[#86868B]" />
          </div>
          <h3 className="text-xl font-semibold text-[#1D1D1F] mb-2">
            No se encontraron clientes
          </h3>
          <p className="text-[#6E6E73] mb-6">
            Intenta ajustar los filtros o términos de búsqueda
          </p>
          <button
            onClick={clearFilters}
            className="btn-secondary"
          >
            Limpiar filtros
          </button>
        </motion.div>
      )}

      {/* Pagination */}
      {filteredClients.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center pt-4"
        >
          <div className="flex items-center space-x-2 text-[#6E6E73]">
            <button className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              ←
            </button>
            <span className="px-3 py-2 bg-[#0071E3] text-white rounded-lg">1</span>
            <span className="px-3 py-2">2</span>
            <button className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              →
            </button>
          </div>
        </motion.div>
      )}

      {/* Modal para crear/editar/ver cliente */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedClient(null);
        }}
        title={
          modalType === 'create' ? 'Nuevo Cliente' :
            modalType === 'edit' ? 'Editar Cliente' : 'Detalles del Cliente'
        }
        size="lg"
      >
        {modalType === 'view' && selectedClient ? (
          <div className="p-6 space-y-6">
            {/* Header with Icon */}
            <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1D1D1F]">{selectedClient.nombre}</h3>
                <p className="text-sm text-[#86868B] mt-0.5">
                  {selectedClient.ciudad}, {selectedClient.estado}
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedClient.tipo === 'publico' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                  {selectedClient.tipo === 'publico' ? 'Público' : 'Privado'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedClient.estado_cliente === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                  {selectedClient.estado_cliente === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'info'
                  ? 'bg-white text-[#0071E3] shadow-sm'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
              >
                Información
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'history'
                  ? 'bg-white text-[#0071E3] shadow-sm'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
              >
                Historial de Órdenes ({clientOrders.length})
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'info' ? (
              <>
                {/* Info Grid - 2 columns forced */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Tipo</p>
                    <p className="text-[#1D1D1F] font-semibold">{selectedClient.tipo === 'publico' ? 'Público' : 'Privado'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Equipos</p>
                    <p className="text-[#1D1D1F] font-semibold">{selectedClient.equiposCount || 0} equipos</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                    <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Ubicación</p>
                    <p className="text-[#1D1D1F] font-semibold">{selectedClient.ciudad || 'N/A'}, {selectedClient.estado || 'N/A'}</p>
                  </div>
                </div>

                {/* Contacto Grid - 2 columns forced */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Responsable</p>
                    <p className="text-[#1D1D1F] font-semibold">{selectedClient.contacto?.responsable || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Teléfono</p>
                    <p className="text-[#1D1D1F] font-semibold">{selectedClient.contacto?.telefono || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                    <p className="text-xs font-medium text-[#86868B] uppercase tracking-wide mb-1">Email</p>
                    <p className="text-[#1D1D1F] font-semibold">{selectedClient.contacto?.email || 'N/A'}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {loadingOrders ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-[#0071E3] border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-sm text-[#6E6E73] mt-3">Cargando historial...</p>
                  </div>
                ) : clientOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ClockIcon className="w-16 h-16 text-[#86868B] mx-auto mb-3" />
                    <p className="text-[#6E6E73]">Este cliente no tiene órdenes registradas</p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#86868B] uppercase">ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#86868B] uppercase">Equipo</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#86868B] uppercase">Estado</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#86868B] uppercase">Prioridad</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#86868B] uppercase">Fecha</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {clientOrders.map((order) => (
                          <tr key={order.orden_id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-[#1D1D1F]">#{order.orden_id}</td>
                            <td className="px-4 py-3 text-sm text-[#1D1D1F]">
                              {order.equipo?.modelo || 'N/A'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.estado === 'completada' || order.estado === 'cerrada'
                                ? 'bg-green-100 text-green-800'
                                : order.estado === 'en proceso'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.estado === 'cancelada'
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {order.estado || 'Pendiente'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.prioridad === 'critica'
                                ? 'bg-red-100 text-red-800'
                                : order.prioridad === 'alta'
                                  ? 'bg-orange-100 text-orange-800'
                                  : order.prioridad === 'media'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                {order.prioridad || 'Baja'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-[#6E6E73]">
                              {new Date(order.fecha_apertura).toLocaleDateString('es-MX')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                onClick={() => {
                  setModalOpen(false);
                  setSelectedClient(null);
                }}
              >
                Cerrar
              </button>
              <button
                className="px-4 py-2.5 text-sm font-medium text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-xl transition-colors"
                onClick={() => selectedClient && handleEditClient(selectedClient)}
              >
                Editar Cliente
              </button>
            </div>
          </div>
        ) : (
          <ClientForm
            client={modalType === 'edit' && selectedClient ? selectedClient! : undefined}
            onSubmit={modalType === 'edit' ? handleUpdateClient : handleCreateClient}
            onCancel={() => {
              setModalOpen(false);
              setSelectedClient(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

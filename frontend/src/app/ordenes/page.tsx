'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Filter,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Settings,
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  RefreshCw,
  X,
  FileText
} from 'lucide-react';
import { useOrdenes } from '@/hooks/useCatalogs';
import { useEquipments, useClients } from '@/hooks/useApi';
import { useTecnicos } from '@/hooks/useCatalogs';
import { showToast } from '@/components/ui/Toast';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { useStore } from '@/store/useStore';
import { formatDateTime } from '@/lib/utils';
import { clientesService } from '@/services/clientesService';
import { equiposService } from '@/services/equiposService';

interface Order {
  id: string;
  equipo: {
    modelo: string;
    numeroSerie: string;
    fabricante: string;
  };
  cliente: string;
  prioridad: 'critica' | 'alta' | 'normal';
  estado: 'abierta' | 'proceso' | 'cerrada';
  tipo: 'correctivo' | 'preventivo' | 'calibracion';
  titulo: string;
  fechaCreacion: string;
  fechaVencimiento?: string;
  tecnico?: string;
  tiempoEstimado: string;
}

export default function OrdenesPage() {
  // Hooks para datos del API
  const { ordenes: orders, createOrden: createOrder, updateOrden: updateOrder, deleteOrden: deleteOrder, isLoading: isLoadingOrdenes, pagination, fetchOrdenes } = useOrdenes();
  const { equipments } = useEquipments();
  const { clients } = useClients();
  const { tecnicos } = useTecnicos();
  const { isLoading: isLoadingOrders } = useStore();

  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedPrioridad, setSelectedPrioridad] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para dropdowns en cascada
  const [allClients, setAllClients] = useState<any[]>([]);
  const [clientEquipments, setClientEquipments] = useState<any[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    equipo_id: 0,
    cliente_id: 0,
    tipo: 'correctivo' as 'correctivo' | 'preventivo' | 'calibracion',
    prioridad: 'normal' as 'critica' | 'alta' | 'normal',
    prioridad_manual: 'media' as 'critica' | 'alta' | 'media' | 'baja',
    titulo: '',
    descripcion: '',
    tecnico_id: undefined as number | undefined,
    fecha_vencimiento: '',
    tiempo_estimado: ''
  });

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  // Cargar todos los clientes para el dropdown cuando se abre el modal
  useEffect(() => {
    const loadAllClients = async () => {
      try {
        const { data, error } = await clientesService.getAllForDropdown();
        if (error) throw error;
        setAllClients(data || []);
      } catch (err) {
        console.error('Error loading clients for dropdown:', err);
      }
    };
    if (isModalOpen) {
      loadAllClients();
    }
  }, [isModalOpen]);

  // Cargar equipos cuando cambia el cliente seleccionado
  useEffect(() => {
    const loadClientEquipments = async () => {
      if (!formData.cliente_id || formData.cliente_id === 0) {
        setClientEquipments([]);
        return;
      }
      try {
        setIsLoadingDropdowns(true);
        const { data, error } = await equiposService.getByClient(formData.cliente_id);
        if (error) throw error;
        setClientEquipments(data || []);
      } catch (err) {
        console.error('Error loading client equipments:', err);
        setClientEquipments([]);
      } finally {
        setIsLoadingDropdowns(false);
      }
    };
    loadClientEquipments();
  }, [formData.cliente_id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Si cambia el cliente, resetear el equipo seleccionado
    if (name === 'cliente_id') {
      setFormData((prev: any) => ({
        ...prev,
        cliente_id: value ? parseInt(value) : 0,
        equipo_id: 0 // Reset equipo when client changes
      }));
      return;
    }

    setFormData((prev: any) => ({
      ...prev,
      [name]: name.includes('_id') ? (value ? parseInt(value) : 0) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.equipo_id || formData.equipo_id === 0) {
      showToast.error('Selecciona un equipo');
      return;
    }
    if (!formData.cliente_id || formData.cliente_id === 0) {
      showToast.error('Selecciona un cliente');
      return;
    }
    if (!formData.titulo.trim()) {
      showToast.error('Ingresa un título');
      return;
    }
    if (!formData.fecha_vencimiento) {
      showToast.error('La fecha de vencimiento es obligatoria');
      return;
    }

    setIsLoading(true);
    try {
      await createOrder({
        equipo_id: formData.equipo_id,
        cliente_id: formData.cliente_id,
        tipo: formData.tipo,
        prioridad: formData.prioridad.charAt(0).toUpperCase() + formData.prioridad.slice(1),
        prioridad_manual: formData.prioridad_manual,
        fecha_vencimiento: formData.fecha_vencimiento || null,
        estado: formData.tipo === 'preventivo' ? 'En Proceso' : 'Abierta',
        falla_reportada: formData.descripcion || formData.titulo,
        tecnico_id: formData.tecnico_id || undefined,
        origen: 'Portal'
      });
      showToast.success('¡Orden creada exitosamente!');
      setIsModalOpen(false);
      // Resetear formulario
      setFormData({
        equipo_id: 0,
        cliente_id: 0,
        tipo: 'correctivo',
        prioridad: 'normal',
        prioridad_manual: 'media',
        titulo: '',
        descripcion: '',
        tecnico_id: undefined,
        fecha_vencimiento: '',
        tiempo_estimado: ''
      });
    } catch (error: any) {
      console.error('Error al crear orden:', error);
      showToast.error(error.response?.data?.message || 'Error al crear la orden');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
    setOpenMenuId(null);
  };

  // Estado para edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);

  const handleEdit = (order: Order) => {
    const orderData = order as any;
    setEditFormData({
      id: order.id,
      equipo_id: orderData.equipo_id || 0,
      cliente_id: orderData.cliente_id || 0,
      prioridad: order.prioridad,
      estado: order.estado,
      titulo: order.titulo,
      descripcion: orderData.descripcion || order.titulo || '',
      tecnico_id: orderData.tecnico_id || undefined,
    });
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;
    setIsLoading(true);
    try {
      await updateOrder(parseInt(editFormData.id), {
        equipo_id: editFormData.equipo_id,
        cliente_id: editFormData.cliente_id,
        prioridad: editFormData.prioridad,
        estado: editFormData.estado,
        falla_reportada: editFormData.descripcion || editFormData.titulo,
        tecnico_id: editFormData.tecnico_id || undefined
      });
      // Manually refresh with current filters to ensure UI sync
      await fetchOrdenes({
        page: currentPage,
        limit: 10,
        search: debouncedSearch || undefined,
        prioridad: selectedPrioridad || undefined,
        estado: selectedEstado || undefined,
      });
      showToast.success('¡Orden actualizada exitosamente!');
      setIsEditModalOpen(false);
    } catch (error: any) {
      showToast.error('Error al actualizar la orden');
    } finally {
      setIsLoading(false);
    }
  };

  // Estado para cambio de estado
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusOrder, setStatusOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('abierta');
  const [justificacion, setJustificacion] = useState('');

  // Estado para historial de orden
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const fetchOrderHistory = async (id: string) => {
    try {
      setIsLoadingHistory(true);
      // const history = await ordenesService.getHistory(id);
      // setOrderHistory(history);
      setOrderHistory([]);
      setShowHistory(true);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      showToast.error('No se pudo cargar el historial');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleChangeStatus = (order: Order) => {
    setStatusOrder(order);
    setNewStatus(order.estado);
    setJustificacion('');
    setIsStatusModalOpen(true);
    setOpenMenuId(null);
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusOrder) return;

    // Validar justificación
    if (!justificacion.trim()) {
      showToast.error('La justificación es obligatoria');
      return;
    }

    setIsLoading(true);
    try {
      // Usar el nuevo endpoint de cambiar-estado con justificación
      const response = await fetch(`http://localhost:3000/api/ordenes/${statusOrder.id}/cambiar-estado`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado_nuevo: newStatus,
          justificacion: justificacion.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cambiar estado');
      }

      // Manually refresh with current filters to ensure UI sync
      await fetchOrdenes({
        page: currentPage,
        limit: 10,
        search: debouncedSearch || undefined,
        prioridad: selectedPrioridad || undefined,
        estado: selectedEstado || undefined,
      });
      showToast.success('Estado actualizado exitosamente');
      setIsStatusModalOpen(false);
      setJustificacion('');
    } catch (error: any) {
      console.error('Error al cambiar estado:', error);
      showToast.error(error.message || 'Error al cambiar el estado');

      // Función para cargar historial de una orden
      const fetchOrderHistory = async (orderId: string) => {
        setIsLoadingHistory(true);
        try {
          const response = await fetch(`http://localhost:3000/api/ordenes/${orderId}/historial`);
          if (!response.ok) {
            throw new Error('Error al cargar historial');
          }
          const result = await response.json();
          setOrderHistory(result.data || []);
          setShowHistory(true);
        } catch (error: any) {
          console.error('Error loading history:', error);
          showToast.error('Error al cargar el historial');
          setOrderHistory([]);
        } finally {
          setIsLoadingHistory(false);
        }
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (order: Order) => {
    if (!confirm(`¿Estás seguro de eliminar la orden ${order.id}?`)) {
      return;
    }

    try {
      await deleteOrder(parseInt(order.id));
      showToast.success('Orden eliminada exitosamente');
      setOpenMenuId(null);
    } catch (error) {
      console.error('Error al eliminar orden:', error);
      showToast.error('Error al eliminar la orden');
    }
  };

  const toggleMenu = (orderId: string) => {
    setOpenMenuId(openMenuId === orderId ? null : orderId);
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch orders when filters change
  useEffect(() => {
    fetchOrdenes({
      page: currentPage,
      limit: 10,
      search: debouncedSearch || undefined,
      prioridad: selectedPrioridad || undefined,
      estado: selectedEstado || undefined,
    });
  }, [currentPage, debouncedSearch, selectedPrioridad, selectedEstado]);

  // Reset to page 1 when filters change
  const handleFilterChange = useCallback((setter: (val: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  }, []);

  // Orders are now directly from the hook (already paginated from server)
  const filteredOrders = orders;

  const getPriorityIcon = (prioridad: Order['prioridad']) => {
    switch (prioridad) {
      case 'critica':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'alta':
        return <AlertTriangle size={16} className="text-orange-500" />;
      case 'normal':
        return <CheckCircle size={16} className="text-green-500" />;
    }
  };

  const getPriorityColor = (prioridad: Order['prioridad']) => {
    switch (prioridad) {
      case 'critica':
        return 'bg-red-50 text-red-600';
      case 'alta':
        return 'bg-orange-50 text-orange-600';
      case 'normal':
        return 'bg-green-50 text-green-600';
    }
  };

  const getStatusColor = (estado: Order['estado']) => {
    switch (estado) {
      case 'abierta':
        return 'bg-red-50 text-red-600';
      case 'proceso':
        return 'bg-yellow-50 text-yellow-600';
      case 'cerrada':
        return 'bg-green-50 text-green-600';
    }
  };

  const getStatusIcon = (estado: Order['estado']) => {
    switch (estado) {
      case 'abierta': return <Clock size={14} />;
      case 'proceso': return <Settings size={14} />;
      case 'cerrada': return <CheckCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getTypeStyles = (tipo: Order['tipo']) => {
    switch (tipo) {
      case 'correctivo':
        return {
          color: 'bg-red-50 text-red-700 border-red-100',
          icon: <AlertTriangle size={12} />,
          label: 'Correctivo'
        };
      case 'preventivo':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-100',
          icon: <CheckCircle size={12} />,
          label: 'Preventivo'
        };
      case 'calibracion':
        return {
          color: 'bg-purple-50 text-purple-700 border-purple-100',
          icon: <RefreshCw size={12} />,
          label: 'Calibración'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-100',
          icon: <FileText size={12} />,
          label: tipo
        };
    }
  };

  const clearFilters = () => {
    setSelectedPrioridad('');
    setSelectedEstado('');
    setSelectedTipo('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedPrioridad || selectedEstado || selectedTipo || searchTerm;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold neuro-text-primary mb-2">
          Órdenes de Trabajo
        </h1>
        <p className="text-lg neuro-text-secondary mb-4">
          Gestión de órdenes de mantenimiento y reparación
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="neuro-button-white"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Orden</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="neuro-card-soft p-8">
        <div className="flex items-center space-x-2 mb-6">
          <Filter className="w-5 h-5 neuro-text-secondary" />
          <h3 className="font-semibold neuro-text-primary text-base">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="neuro-input-wrapper">
            <Search className="w-5 h-5 neuro-text-tertiary absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Buscar órdenes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neuro-input"
              style={{ paddingLeft: '48px' }}
            />
          </div>

          <select
            value={selectedPrioridad}
            onChange={(e) => handleFilterChange(setSelectedPrioridad, e.target.value)}
            className="neuro-input"
          >
            <option value="">Todas las prioridades</option>
            <option value="Crítica">Crítica</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
            <option value="Normal">Normal</option>
          </select>

          <select
            value={selectedEstado}
            onChange={(e) => handleFilterChange(setSelectedEstado, e.target.value)}
            className="neuro-input"
          >
            <option value="">Todos los estados</option>
            <option value="Abierta">Abierta</option>
            <option value="En Proceso">En Proceso</option>
            <option value="En Espera">En Espera</option>
            <option value="Cerrada">Cerrada</option>
          </select>

          <select
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
            className="neuro-input"
          >
            <option value="">Todos los tipos</option>
            <option value="correctivo">Correctivo</option>
            <option value="preventivo">Preventivo</option>
            <option value="calibracion">Calibración</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="neuro-text-tertiary text-sm">
        {pagination.isSearch ? filteredOrders.length : `Mostrando ${filteredOrders.length} de ${pagination.total}`} órdenes
      </p>

      {/* Orders Table */}
      {isLoadingOrders ? (
        <SkeletonTable rows={8} />
      ) : (
        <div className="neuro-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-[#6E6E73] text-sm uppercase tracking-wider">ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#6E6E73] text-sm uppercase tracking-wider">Equipo</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#6E6E73] text-sm uppercase tracking-wider">Tipo</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#6E6E73] text-sm uppercase tracking-wider">Prioridad</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#6E6E73] text-sm uppercase tracking-wider">Estado</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#6E6E73] text-sm uppercase tracking-wider">Técnico</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#6E6E73] text-sm uppercase tracking-wider">Cliente</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#6E6E73] text-sm uppercase tracking-wider">Creación</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#6E6E73] text-sm uppercase tracking-wider">Vencimiento</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#6E6E73] text-sm uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-[#0071E3] font-medium">
                        {order.id}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <p className="font-semibold text-[#1D1D1F] text-sm leading-tight">
                          {order.equipo.modelo}
                        </p>
                        <p className="text-[11px] text-[#86868B] mt-0.5">
                          {order.equipo.fabricante} • {order.equipo.numeroSerie}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {(() => {
                        const styles = getTypeStyles(order.tipo);
                        return (
                          <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${styles.color}`}>
                            {styles.icon}
                            <span>{styles.label}</span>
                          </div>
                        );
                      })()}
                    </td>

                    <td className="py-4 px-4">
                      <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${getPriorityColor(order.prioridad)}`}>
                        {getPriorityIcon(order.prioridad)}
                        <span className="capitalize">{order.prioridad}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusColor(order.estado)}`}>
                        {getStatusIcon(order.estado)}
                        <span className="capitalize">{order.estado}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <User size={12} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-[#1D1D1F] line-clamp-1">{order.tecnico}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-sm text-[#424245] font-medium">{order.cliente}</span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col text-[#6E6E73]">
                        <div className="flex items-center space-x-1 text-sm font-medium text-[#1D1D1F]">
                          <Calendar size={12} className="text-[#86868B]" />
                          <span>{formatDateTime(order.fechaCreacion).split(',')[0]}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-[11px] mt-0.5 ml-4">
                          <Clock size={10} />
                          <span>{formatDateTime(order.fechaCreacion).split(',')[1]}</span>
                        </div>
                      </div>
                    </td>

                    {/* Fecha de Vencimiento */}
                    <td className="py-4 px-4">
                      {order.fechaVencimiento ? (
                        (() => {
                          const hoy = new Date();
                          const vencimiento = new Date(order.fechaVencimiento);
                          const diasRestantes = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
                          const isOverdue = diasRestantes < 0;
                          const isUrgent = diasRestantes >= 0 && diasRestantes <= 3;

                          return (
                            <div className="flex flex-col">
                              <div className={`flex items-center space-x-1 text-sm font-medium ${isOverdue ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-[#1D1D1F]'}`}>
                                <Calendar size={12} className={isOverdue ? 'text-red-500' : isUrgent ? 'text-orange-500' : 'text-[#86868B]'} />
                                <span>{new Date(order.fechaVencimiento).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}</span>
                              </div>
                              <div className={`text-[11px] mt-0.5 ml-4 font-semibold ${isOverdue ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-green-600'}`}>
                                {isOverdue
                                  ? `⚠️ Vencida hace ${Math.abs(diasRestantes)} días`
                                  : diasRestantes === 0
                                    ? '⏰ Vence hoy'
                                    : diasRestantes === 1
                                      ? '⏰ Vence mañana'
                                      : `✓ ${diasRestantes} días restantes`
                                }
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <span className="text-gray-400 text-sm">Sin fecha</span>
                      )}
                    </td>

                    <td className="py-4 px-4 relative">
                      <div className="flex items-center space-x-2">
                        {/* Botón de menú desplegable */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMenu(order.id);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                          >
                            <MoreVertical size={16} className="text-[#6E6E73]" />
                          </button>

                          {/* Menú desplegable */}
                          <AnimatePresence>
                            {openMenuId === order.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => handleViewDetails(order)}
                                  className="w-full px-4 py-2 text-left text-sm text-[#1D1D1F] hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                                >
                                  <Eye size={16} className="text-[#0071E3]" />
                                  <span>Ver detalles</span>
                                </button>

                                <button
                                  onClick={() => handleEdit(order)}
                                  className="w-full px-4 py-2 text-left text-sm text-[#1D1D1F] hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                                >
                                  <Edit size={16} className="text-[#34C759]" />
                                  <span>Editar</span>
                                </button>

                                <button
                                  onClick={() => handleChangeStatus(order)}
                                  className="w-full px-4 py-2 text-left text-sm text-[#1D1D1F] hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                                >
                                  <RefreshCw size={16} className="text-[#FF9500]" />
                                  <span>Cambiar estado</span>
                                </button>

                                <div className="border-t border-gray-200 my-1"></div>

                                <button
                                  onClick={() => handleDelete(order)}
                                  className="w-full px-4 py-2 text-left text-sm text-[#FF3B30] hover:bg-red-50 flex items-center space-x-2 transition-colors"
                                >
                                  <Trash2 size={16} />
                                  <span>Eliminar</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-[#6E6E73]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1D1D1F] mb-2">
                No se encontraron órdenes
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
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && pagination.totalPages > 1 && (
        <div className="flex justify-center pt-4 animate-fade-in">
          <div className="flex items-center space-x-3 neuro-text-secondary">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="neuro-button-white px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-lg transition-colors duration-200 ${currentPage === pageNum
                    ? 'bg-[#0071E3] text-white'
                    : 'hover:bg-gray-50'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
              disabled={currentPage === pagination.totalPages}
              className="neuro-button-white px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}

      {/* Modal Nueva Orden */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#1D1D1F]">Nueva Orden de Trabajo</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Información del Equipo */}
              <div>
                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-4">Información del Equipo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Cliente PRIMERO */}
                  <div>
                    <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                      Cliente *
                    </label>
                    <select
                      name="cliente_id"
                      value={formData.cliente_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="0">Seleccionar cliente...</option>
                      {allClients.map((cliente: any) => (
                        <option key={cliente.cliente_id} value={cliente.cliente_id}>
                          {cliente.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Equipo DESPUÉS (filtrado por cliente) */}
                  <div>
                    <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                      Equipo * {isLoadingDropdowns && <span className="text-xs text-blue-500">(Cargando...)</span>}
                    </label>
                    <select
                      name="equipo_id"
                      value={formData.equipo_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                      disabled={!formData.cliente_id || formData.cliente_id === 0}
                    >
                      <option value="0">
                        {!formData.cliente_id || formData.cliente_id === 0
                          ? 'Primero selecciona un cliente...'
                          : clientEquipments.length === 0
                            ? 'Este cliente no tiene equipos'
                            : 'Seleccionar equipo...'}
                      </option>
                      {clientEquipments.map((equipo: any) => (
                        <option key={equipo.equipo_id} value={equipo.equipo_id}>
                          {equipo.modelo} - {equipo.numero_serie}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Detalles de la Orden */}
              <div>
                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-4">Detalles de la Orden</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      placeholder="Ej: Mantenimiento preventivo trimestral"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Describe el problema o trabajo a realizar..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                        Tipo *
                      </label>
                      <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="correctivo">Correctivo</option>
                        <option value="preventivo">Preventivo</option>
                        <option value="calibracion">Calibración</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                        Prioridad *
                      </label>
                      <select
                        name="prioridad"
                        value={formData.prioridad}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="critica">Crítica</option>
                        <option value="alta">Alta</option>
                        <option value="normal">Normal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                        Prioridad Manual *
                      </label>
                      <select
                        name="prioridad_manual"
                        value={formData.prioridad_manual}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="critica">Crítica</option>
                        <option value="alta">Alta</option>
                        <option value="media">Media</option>
                        <option value="baja">Baja</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Se usa para calcular la prioridad automática
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                        Técnico
                      </label>
                      <select
                        name="tecnico_id"
                        value={formData.tecnico_id || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Sin asignar</option>
                        {tecnicos.map(tecnico => (
                          <option key={tecnico.id} value={tecnico.id}>
                            {tecnico.nombre} {tecnico.apellido}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                        Fecha de Vencimiento *
                      </label>
                      <input
                        type="date"
                        name="fecha_vencimiento"
                        value={formData.fecha_vencimiento}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Fecha límite para completar la orden
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Afecta el cálculo de prioridad automática
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                        Tiempo Estimado
                      </label>
                      <input
                        type="text"
                        name="tiempo_estimado"
                        value={formData.tiempo_estimado}
                        onChange={handleInputChange}
                        placeholder="Ej: 2 horas"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer del Modal */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-[#6E6E73] hover:text-[#1D1D1F] font-medium rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancelar
              </motion.button>
              <motion.button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creando...</span>
                  </>
                ) : (
                  <span>Crear Orden</span>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal de Detalles */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsDetailsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del Modal */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1D1D1F]">Detalles de la Orden</h2>
                    <p className="text-sm text-[#6E6E73] mt-1">
                      Orden {selectedOrder.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Contenido del Modal */}
              <div className="p-6 space-y-6">
                {/* Estado y Prioridad */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-[#6E6E73] mb-2">Estado</p>
                    <div className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.estado)}`}>
                      {getStatusIcon(selectedOrder.estado)}
                      <span className="capitalize">{selectedOrder.estado}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-[#6E6E73] mb-2">Prioridad</p>
                    <div className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium ${getPriorityColor(selectedOrder.prioridad)}`}>
                      {getPriorityIcon(selectedOrder.prioridad)}
                      <span className="capitalize">{selectedOrder.prioridad}</span>
                    </div>
                  </div>
                </div>

                {/* Información General */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#1D1D1F] mb-4 flex items-center space-x-2">
                    <FileText size={20} className="text-[#0071E3]" />
                    <span>Información General</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-[#6E6E73] mb-1">Título</p>
                      <p className="text-sm font-medium text-[#1D1D1F]">{selectedOrder.titulo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6E6E73] mb-1">Tipo de Orden</p>
                      <p className="text-sm font-medium text-[#1D1D1F] capitalize">{selectedOrder.tipo}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#6E6E73] mb-1">Fecha de Creación</p>
                        <div className="flex items-center space-x-1 text-sm font-medium text-[#1D1D1F]">
                          <Calendar size={14} />
                          <span>{selectedOrder.fechaCreacion}</span>
                        </div>
                      </div>
                      {selectedOrder.fechaVencimiento && (
                        <div>
                          <p className="text-xs text-[#6E6E73] mb-1">Fecha de Vencimiento</p>
                          <div className="flex items-center space-x-1 text-sm font-medium text-[#1D1D1F]">
                            <Calendar size={14} />
                            <span>{selectedOrder.fechaVencimiento}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-[#6E6E73] mb-1">Tiempo Estimado</p>
                      <div className="flex items-center space-x-1 text-sm font-medium text-[#1D1D1F]">
                        <Clock size={14} />
                        <span>{selectedOrder.tiempoEstimado}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información del Equipo */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#1D1D1F] mb-4 flex items-center space-x-2">
                    <Settings size={20} className="text-[#34C759]" />
                    <span>Equipo</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-[#6E6E73] mb-1">Modelo</p>
                      <p className="text-sm font-medium text-[#1D1D1F]">{selectedOrder.equipo.modelo}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#6E6E73] mb-1">Fabricante</p>
                        <p className="text-sm font-medium text-[#1D1D1F]">{selectedOrder.equipo.fabricante}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6E6E73] mb-1">Número de Serie</p>
                        <p className="text-sm font-mono text-[#1D1D1F]">{selectedOrder.equipo.numeroSerie}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información del Cliente */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#1D1D1F] mb-4 flex items-center space-x-2">
                    <User size={20} className="text-[#AF52DE]" />
                    <span>Cliente</span>
                  </h3>
                  <div>
                    <p className="text-xs text-[#6E6E73] mb-1">Nombre</p>
                    <p className="text-sm font-medium text-[#1D1D1F]">{selectedOrder.cliente}</p>
                  </div>
                </div>

                {/* Técnico Asignado */}
                {selectedOrder.tecnico && (
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#1D1D1F] mb-4 flex items-center space-x-2">
                      <User size={20} className="text-[#FF9500]" />
                      <span>Técnico Asignado</span>
                    </h3>
                    <div>
                      <p className="text-xs text-[#6E6E73] mb-1">Nombre</p>
                      <p className="text-sm font-medium text-[#1D1D1F]">{selectedOrder.tecnico}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer del Modal */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEdit(selectedOrder)}
                  className="px-6 py-2.5 bg-white border border-gray-300 text-[#1D1D1F] font-medium rounded-xl hover:bg-gray-50 transition-all flex items-center space-x-2"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fetchOrderHistory(selectedOrder.id)}
                  disabled={isLoadingHistory}
                  className="px-6 py-2.5 bg-white border border-gray-300 text-[#1D1D1F] font-medium rounded-xl hover:bg-gray-50 transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  <FileText size={16} />
                  <span>{isLoadingHistory ? 'Cargando...' : 'Ver Historial'}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                >
                  Cerrar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Edición */}
      {isEditModalOpen && editFormData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">Editar Orden</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#6E6E73] mb-2">Prioridad</label>
                <select
                  value={editFormData.prioridad}
                  onChange={(e) => setEditFormData({ ...editFormData, prioridad: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Crítica">Crítica</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6E6E73] mb-2">Estado</label>
                <select
                  value={editFormData.estado}
                  onChange={(e) => setEditFormData({ ...editFormData, estado: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Abierta">Abierta</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="En Espera">En Espera</option>
                  <option value="Cerrada">Cerrada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6E6E73] mb-2">Descripción</label>
                <textarea
                  value={editFormData.descripcion}
                  onChange={(e) => setEditFormData({ ...editFormData, descripcion: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 text-[#6E6E73] hover:text-[#1D1D1F] font-medium rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Cambio de Estado */}
      {isStatusModalOpen && statusOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">Cambiar Estado</h2>
            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#6E6E73] mb-2">Estado</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Abierta">Abierta</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="En Espera">En Espera</option>
                  <option value="Cerrada">Cerrada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                  Justificación *
                </label>
                <textarea
                  value={justificacion}
                  onChange={(e) => setJustificacion(e.target.value)}
                  rows={4}
                  placeholder="Explica el motivo del cambio de estado..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  La justificación se guardará en el historial de la orden
                </p>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-6 py-2.5 text-[#6E6E73] hover:text-[#1D1D1F] font-medium rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : 'Guardar Estado'}

                  {/* Modal de Historial */}
                  <AnimatePresence>
                    {showHistory && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowHistory(false)}
                      >
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          transition={{ type: "spring", duration: 0.5 }}
                          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                              <h2 className="text-2xl font-bold text-[#1D1D1F] flex items-center space-x-2">
                                <FileText size={24} className="text-[#0071E3]" />
                                <span>Historial de Cambios</span>
                              </h2>
                              <button
                                onClick={() => setShowHistory(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <X size={24} />
                              </button>
                            </div>
                          </div>

                          <div className="p-6">
                            {orderHistory.length === 0 ? (
                              <div className="text-center py-12">
                                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">No hay cambios registrados para esta orden</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {orderHistory.map((item, index) => (
                                  <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative pl-8 pb-8 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
                                  >
                                    {/* Timeline dot */}
                                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-md"></div>

                                    <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                                      {/* Header */}
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700">
                                            {item.estado_anterior || 'N/A'}
                                          </span>
                                          <span className="text-gray-400">→</span>
                                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-700">
                                            {item.estado_nuevo}
                                          </span>
                                        </div>
                                        <div className="text-xs text-gray-500 flex items-center space-x-1">
                                          <Clock size={12} />
                                          <span>{new Date(item.created_at).toLocaleString('es-MX', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}</span>
                                        </div>
                                      </div>

                                      {/* Justification */}
                                      <div className="mb-3">
                                        <p className="text-sm text-gray-700 italic">
                                          "{item.justificacion}"
                                        </p>
                                      </div>

                                      {/* User */}
                                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                                        <User size={14} />
                                        <span>Por: {item.usuario}</span>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end">
                            <button
                              onClick={() => setShowHistory(false)}
                              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg"
                            >
                              Cerrar
                            </button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

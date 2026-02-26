'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Filter,
    RefreshCw,
    Clock,
    User,
    AlertCircle,
    CheckCircle,
    XCircle,
    Pause,
    Eye,
    Edit3,
    Calendar,
    Wrench,
    ChevronLeft,
    ChevronRight,
    Search,
    X,
    FileText,
    MessageSquare,
    Save,
    Play,
    AlertTriangle
} from 'lucide-react';

interface Order {
    id: string;
    prioridad_calculada: number;
    prioridad_manual: string;
    estado: string;
    equipo: string;
    numero_serie?: string;
    cliente: string;
    tecnico?: string;
    fecha_vencimiento?: string;
    modalidad: string;
    falla_reportada?: string;
    created_at: string;
}

interface Stats {
    ordenes_por_estado: {
        [key: string]: number;
    };
    total_activas: number;
    alertas_no_leidas: number;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function CentroOperacionesPage() {
    const [ordenes, setOrdenes] = useState<Order[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });

    // Panel de detalles
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailPanel, setShowDetailPanel] = useState(false);

    // Modal de cambio de estado
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusChangeData, setStatusChangeData] = useState({
        orderId: '',
        nuevoEstado: '',
        justificacion: ''
    });
    const [isChangingStatus, setIsChangingStatus] = useState(false);

    // Modal de postergación de fecha
    const [showPostponeModal, setShowPostponeModal] = useState(false);
    const [postponeData, setPostponeData] = useState({
        orderId: '',
        nuevaFecha: '',
        justificacion: ''
    });
    const [isPostponing, setIsPostponing] = useState(false);

    // Historial de orden
    const [orderHistory, setOrderHistory] = useState<any[]>([]);

    // Filtros
    const [filters, setFilters] = useState({
        estado: '',
        prioridad: '',
        search: ''
    });

    // Fetch ordenes
    const fetchOrdenes = useCallback(async (page = pagination.page) => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            params.append('page', String(page));
            params.append('limit', String(pagination.limit));
            if (filters.estado) params.append('estado', filters.estado);
            if (filters.prioridad) params.append('prioridad', filters.prioridad);
            if (filters.search) params.append('search', filters.search);

            const url = `http://localhost:3000/api/centro-operaciones/ordenes-activas?${params}`;
            console.log('🔍 Fetching with URL:', url);
            console.log('🔍 Filters:', filters);

            const response = await fetch(url, { cache: 'no-store' });
            const result = await response.json();

            if (result.success) {
                setOrdenes(result.data || []);
                setPagination({
                    page: result.pagination?.page || page,
                    limit: result.pagination?.limit || 10,
                    total: result.pagination?.total || 0,
                    totalPages: result.pagination?.totalPages || 1
                });
                setLastUpdate(new Date());
            }
        } catch (error) {
            console.error('Error fetching ordenes:', error);
        } finally {
            setIsLoading(false);
        }
    }, [filters, pagination.limit]);

    // Fetch stats
    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/centro-operaciones/estadisticas', { cache: 'no-store' });
            const result = await response.json();

            if (result.data) {
                setStats(result.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Fetch order history
    const fetchOrderHistory = async (orderId: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/ordenes/${orderId}/historial`, { cache: 'no-store' });
            const result = await response.json();
            if (result.data) {
                setOrderHistory(result.data);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
            setOrderHistory([]);
        }
    };

    // Change order status
    const handleChangeStatus = async () => {
        if (!statusChangeData.justificacion.trim()) {
            alert('La justificación es obligatoria');
            return;
        }

        setIsChangingStatus(true);
        try {
            const response = await fetch(`http://localhost:3000/api/ordenes/${statusChangeData.orderId}/cambiar-estado`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    estado_nuevo: statusChangeData.nuevoEstado,
                    justificacion: statusChangeData.justificacion
                })
            });

            const result = await response.json();
            if (result.error) {
                alert('Error: ' + result.error);
            } else {
                // Refresh data
                await fetchOrdenes();
                await fetchStats();
                setShowStatusModal(false);
                setStatusChangeData({ orderId: '', nuevoEstado: '', justificacion: '' });

                // Update selected order if panel is open
                if (selectedOrder && selectedOrder.id === statusChangeData.orderId) {
                    setSelectedOrder({ ...selectedOrder, estado: statusChangeData.nuevoEstado });
                    await fetchOrderHistory(statusChangeData.orderId);
                }
            }
        } catch (error) {
            console.error('Error changing status:', error);
            alert('Error al cambiar estado');
        } finally {
            setIsChangingStatus(false);
        }
    };

    // Handle postpone due date
    const handlePostpone = async () => {
        if (!postponeData.nuevaFecha) {
            alert('La nueva fecha es obligatoria');
            return;
        }
        if (!postponeData.justificacion.trim()) {
            alert('La justificación es obligatoria');
            return;
        }

        setIsPostponing(true);
        try {
            const response = await fetch(`http://localhost:3000/api/ordenes/${postponeData.orderId}/posponer-vencimiento`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nueva_fecha: postponeData.nuevaFecha,
                    justificacion: postponeData.justificacion
                })
            });

            const result = await response.json();
            if (result.error) {
                alert('Error: ' + result.error);
            } else {
                // Refresh data
                await fetchOrdenes();
                setShowPostponeModal(false);
                setPostponeData({ orderId: '', nuevaFecha: '', justificacion: '' });

                // Update selected order if panel is open
                if (selectedOrder && selectedOrder.id === postponeData.orderId) {
                    setSelectedOrder({ ...selectedOrder, fecha_vencimiento: postponeData.nuevaFecha });
                    await fetchOrderHistory(postponeData.orderId);
                }
            }
        } catch (error) {
            console.error('Error postponing date:', error);
            alert('Error al posponer fecha');
        } finally {
            setIsPostponing(false);
        }
    };

    // Open postpone modal
    const openPostponeModal = (order: Order) => {
        setPostponeData({
            orderId: order.id,
            nuevaFecha: order.fecha_vencimiento || '',
            justificacion: ''
        });
        setShowPostponeModal(true);
    };

    // Open detail panel
    const openDetailPanel = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailPanel(true);
        fetchOrderHistory(order.id);
    };

    // Open status change modal
    const openStatusModal = (orderId: string, currentStatus: string) => {
        setStatusChangeData({
            orderId,
            nuevoEstado: currentStatus,
            justificacion: ''
        });
        setShowStatusModal(true);
    };

    // Initial load
    useEffect(() => {
        fetchOrdenes(1);
        fetchStats();
    }, []);

    // Reload when filters change
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchOrdenes(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [filters]);

    // Auto-refresh every 2 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            fetchOrdenes();
            fetchStats();
        }, 120000);

        return () => clearInterval(interval);
    }, [fetchOrdenes]);

    // Helper functions
    const getPriorityColor = (priority: number) => {
        if (priority >= 150) return 'border-red-500 bg-red-50';
        if (priority >= 100) return 'border-orange-500 bg-orange-50';
        if (priority >= 50) return 'border-yellow-500 bg-yellow-50';
        return 'border-green-500 bg-green-50';
    };

    const getPriorityLabel = (priority: number) => {
        if (priority >= 150) return { text: 'CRÍTICA', color: 'text-red-700 bg-red-100' };
        if (priority >= 100) return { text: 'ALTA', color: 'text-orange-700 bg-orange-100' };
        if (priority >= 50) return { text: 'MEDIA', color: 'text-yellow-700 bg-yellow-100' };
        return { text: 'BAJA', color: 'text-green-700 bg-green-100' };
    };

    const getStatusIcon = (estado: string) => {
        switch (estado) {
            case 'Abierta': return <AlertCircle className="text-blue-500" size={18} />;
            case 'En Proceso': return <Activity className="text-yellow-500" size={18} />;
            case 'En Espera': return <Pause className="text-orange-500" size={18} />;
            case 'Cerrada': return <CheckCircle className="text-green-500" size={18} />;
            default: return <XCircle className="text-gray-500" size={18} />;
        }
    };

    const getDaysUntilDue = (fecha: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalizar a medianoche
        const due = new Date(fecha);
        due.setHours(0, 0, 0, 0); // Normalizar a medianoche
        const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const estadoOptions = ['Abierta', 'En Proceso', 'En Espera', 'Cerrada', 'Completada', 'Cancelada'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 flex items-center space-x-3">
                            <Activity className="text-blue-600" size={40} />
                            <span>Centro de Operaciones</span>
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Gestión inteligente de órdenes priorizadas
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                            <Clock size={16} />
                            <span>Última actualización: {lastUpdate.toLocaleTimeString('es-MX')}</span>
                        </div>
                        <button
                            onClick={() => {
                                fetchOrdenes();
                                fetchStats();
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center space-x-2"
                        >
                            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                            <span>Actualizar</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards - Neumorphic Design */}
                {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group"
                        >
                            <div className="neuro-card-soft p-4 relative overflow-hidden hover:scale-[1.02] transition-all duration-300">
                                {/* Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100/50 to-transparent opacity-60"></div>

                                {/* Content */}
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Abiertas</p>
                                        <p className="text-4xl font-bold bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                            {stats.ordenes_por_estado['Abierta'] || 0}
                                        </p>
                                    </div>
                                    <div className="w-14 h-14 neuro-convex-sm rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
                                        <AlertCircle className="text-blue-600" size={28} />
                                    </div>
                                </div>

                                {/* Hover Accent */}
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="group"
                        >
                            <div className="neuro-card-soft p-4 relative overflow-hidden hover:scale-[1.02] transition-all duration-300">
                                {/* Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-yellow-100/50 to-transparent opacity-60"></div>

                                {/* Content */}
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">En Proceso</p>
                                        <p className="text-4xl font-bold bg-gradient-to-br from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
                                            {stats.ordenes_por_estado['En Proceso'] || 0}
                                        </p>
                                    </div>
                                    <div className="w-14 h-14 neuro-convex-sm rounded-2xl flex items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-50">
                                        <Activity className="text-yellow-600" size={28} />
                                    </div>
                                </div>

                                {/* Hover Accent */}
                                <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="group"
                        >
                            <div className="neuro-card-soft p-4 relative overflow-hidden hover:scale-[1.02] transition-all duration-300">
                                {/* Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-orange-100/50 to-transparent opacity-60"></div>

                                {/* Content */}
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">En Espera</p>
                                        <p className="text-4xl font-bold bg-gradient-to-br from-orange-600 to-orange-400 bg-clip-text text-transparent">
                                            {stats.ordenes_por_estado['En Espera'] || 0}
                                        </p>
                                    </div>
                                    <div className="w-14 h-14 neuro-convex-sm rounded-2xl flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                                        <Pause className="text-orange-600" size={28} />
                                    </div>
                                </div>

                                {/* Hover Accent */}
                                <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="group"
                        >
                            <div className="neuro-card-soft p-4 relative overflow-hidden hover:scale-[1.02] transition-all duration-300">
                                {/* Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-green-100/50 to-transparent opacity-60"></div>

                                {/* Content */}
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Total Activas</p>
                                        <p className="text-4xl font-bold bg-gradient-to-br from-green-600 to-green-400 bg-clip-text text-transparent">
                                            {pagination.total}
                                        </p>
                                    </div>
                                    <div className="w-14 h-14 neuro-convex-sm rounded-2xl flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50">
                                        <CheckCircle className="text-green-600" size={28} />
                                    </div>
                                </div>

                                {/* Hover Accent */}
                                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Alerta de Órdenes Vencidas */}
            {ordenes.some(orden => orden.fecha_vencimiento && getDaysUntilDue(orden.fecha_vencimiento) < 0) && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-600 rounded-xl p-4 shadow-lg"
                >
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="text-red-600 animate-pulse" size={28} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-red-900">
                                ⚠️ Órdenes Vencidas Detectadas
                            </h3>
                            <p className="text-red-700 text-sm mt-1">
                                Hay <span className="font-bold">
                                    {ordenes.filter(orden => orden.fecha_vencimiento && getDaysUntilDue(orden.fecha_vencimiento) < 0).length}
                                </span> orden(es) que ya vencieron. Se requiere atención inmediata.
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-lg animate-pulse">
                                URGENTE
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Filters - Vertical Layout */}
            <div className="neuro-card-soft p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Filter className="text-gray-500" size={20} />
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Filtros</h3>
                    </div>
                    {(filters.estado || filters.prioridad || filters.search) && (
                        <button
                            onClick={() => setFilters({ estado: '', prioridad: '', search: '' })}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar órdenes..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full px-4 py-3 neuro-concave bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm placeholder:text-gray-400"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>

                    {/* Priority Filter */}
                    <select
                        value={filters.prioridad}
                        onChange={(e) => setFilters({ ...filters, prioridad: e.target.value })}
                        className="w-full px-4 py-3 neuro-concave bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm appearance-none cursor-pointer"
                    >
                        <option value="">Todas las prioridades</option>
                        <option value="critica">Crítica</option>
                        <option value="alta">Alta</option>
                        <option value="media">Media</option>
                        <option value="baja">Baja</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filters.estado}
                        onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                        className="w-full px-4 py-3 neuro-concave bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm appearance-none cursor-pointer"
                    >
                        <option value="">Todos los estados</option>
                        <option value="Abierta">Abierta</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="En Espera">En Espera</option>
                    </select>

                    {/* Optional: Add Type Filter if needed */}
                    {/* <select
                        className="w-full px-4 py-3 neuro-concave bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm appearance-none cursor-pointer"
                    >
                        <option value="">Todos los tipos</option>
                    </select> */}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex gap-6">
                {/* Orders List */}
                <div className={`flex-1 space-y-4 transition-all ${showDetailPanel ? 'w-2/3' : 'w-full'}`}>
                    {isLoading ? (
                        <div className="text-center py-12">
                            <RefreshCw className="animate-spin mx-auto text-blue-600 mb-4" size={48} />
                            <p className="text-gray-600">Cargando órdenes...</p>
                        </div>
                    ) : ordenes.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center shadow-md">
                            <Activity className="mx-auto text-gray-300 mb-4" size={64} />
                            <p className="text-gray-600 text-lg">No hay órdenes activas</p>
                            <p className="text-gray-400 text-sm mt-2">
                                Las órdenes aparecerán aquí cuando sean creadas
                            </p>
                        </div>
                    ) : (
                        <>
                            {ordenes.map((orden, index) => {
                                const priorityLabel = getPriorityLabel(orden.prioridad_calculada);
                                const daysUntilDue = orden.fecha_vencimiento ? getDaysUntilDue(orden.fecha_vencimiento) : null;

                                return (
                                    <motion.div
                                        key={orden.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className={`bg-white rounded-xl px-4 py-3 shadow-md hover:shadow-lg transition-all border-l-4 cursor-pointer ${getPriorityColor(orden.prioridad_calculada)} ${selectedOrder?.id === orden.id ? 'ring-2 ring-blue-500' : ''}`}
                                        onClick={() => openDetailPanel(orden)}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">

                                                {/* Fila 1: Badge prioridad + ID + Equipo + N/S */}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${priorityLabel.color}`}>
                                                        {priorityLabel.text}
                                                    </span>
                                                    <span className="text-gray-400 text-xs font-semibold shrink-0">#{orden.id}</span>
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        <Wrench size={13} className="text-gray-500 shrink-0" />
                                                        <span className="text-sm font-semibold text-gray-900 truncate">{orden.equipo}</span>
                                                    </div>
                                                    {orden.numero_serie && (
                                                        <span className="text-gray-400 text-[11px] hidden md:inline">
                                                            S/N: {orden.numero_serie}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Fila 2: Falla reportada (1 línea) */}
                                                {orden.falla_reportada && (
                                                    <p className="flex items-center gap-1 text-gray-500 text-[11px] mt-1 line-clamp-1">
                                                        <FileText size={11} className="shrink-0" />
                                                        {orden.falla_reportada}
                                                    </p>
                                                )}

                                                {/* Fila 3: Metadatos */}
                                                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5">
                                                    <div className="flex items-center gap-1 text-gray-600 text-xs">
                                                        <User size={12} />
                                                        <span>{orden.cliente}</span>
                                                    </div>

                                                    <div className="flex items-center gap-1 text-xs">
                                                        {getStatusIcon(orden.estado)}
                                                        <span className="text-gray-700">{orden.estado}</span>
                                                    </div>

                                                    {daysUntilDue !== null && (
                                                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] ${daysUntilDue < 0
                                                            ? 'bg-red-100 border border-red-400 animate-pulse'
                                                            : daysUntilDue === 0
                                                                ? 'bg-red-50 border border-red-300'
                                                                : daysUntilDue <= 3
                                                                    ? 'bg-orange-100'
                                                                    : 'bg-green-100'
                                                            }`}>
                                                            <Calendar size={11} className={
                                                                daysUntilDue < 0 ? 'text-red-700'
                                                                    : daysUntilDue === 0 ? 'text-red-600'
                                                                        : daysUntilDue <= 3 ? 'text-orange-600'
                                                                            : 'text-green-600'
                                                            } />
                                                            <span className={
                                                                daysUntilDue < 0 ? 'text-red-900 font-bold'
                                                                    : daysUntilDue === 0 ? 'text-red-800 font-bold'
                                                                        : daysUntilDue <= 3 ? 'text-orange-700'
                                                                            : 'text-green-700'
                                                            }>
                                                                {daysUntilDue < 0
                                                                    ? `VENCIDA hace ${Math.abs(daysUntilDue)} día${Math.abs(daysUntilDue) !== 1 ? 's' : ''}`
                                                                    : daysUntilDue === 0
                                                                        ? 'VENCE HOY'
                                                                        : daysUntilDue === 1
                                                                            ? 'Vence mañana'
                                                                            : `✓ ${daysUntilDue} días restantes`
                                                                }
                                                            </span>
                                                        </div>
                                                    )}

                                                    {orden.tecnico && (
                                                        <div className="flex items-center gap-1 text-gray-600 text-xs">
                                                            <User size={12} />
                                                            <span>Tec. {orden.tecnico}</span>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>

                                            {/* Acciones */}
                                            <div className="flex items-center gap-1.5 shrink-0 self-center" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => openStatusModal(orden.id, orden.estado)}
                                                    className="px-2.5 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all flex items-center gap-1 text-xs"
                                                    title="Cambiar estado"
                                                >
                                                    <Edit3 size={13} />
                                                    <span className="hidden md:inline">Estado</span>
                                                </button>
                                                <button
                                                    onClick={() => openPostponeModal(orden)}
                                                    className="px-2.5 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-all flex items-center gap-1 text-xs"
                                                    title="Posponer fecha"
                                                >
                                                    <Calendar size={13} />
                                                    <span className="hidden md:inline">Posponer</span>
                                                </button>
                                                <button
                                                    onClick={() => openDetailPanel(orden)}
                                                    className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all flex items-center gap-1 text-xs"
                                                >
                                                    <Eye size={13} />
                                                    <span className="hidden md:inline">Ver</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-md mt-6">
                                    <div className="text-sm text-gray-600">
                                        Mostrando {ordenes.length} de {pagination.total} órdenes
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => fetchOrdenes(pagination.page - 1)}
                                            disabled={pagination.page <= 1}
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft size={16} />
                                            <span>Anterior</span>
                                        </button>
                                        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-semibold">
                                            {pagination.page} / {pagination.totalPages}
                                        </span>
                                        <button
                                            onClick={() => fetchOrdenes(pagination.page + 1)}
                                            disabled={pagination.page >= pagination.totalPages}
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span>Siguiente</span>
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Detail Panel */}
                <AnimatePresence>
                    {showDetailPanel && selectedOrder && (
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            className="w-1/3 bg-white rounded-xl shadow-lg p-6 sticky top-6 h-fit max-h-[calc(100vh-120px)] overflow-y-auto"
                        >
                            {/* Panel Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Orden #{selectedOrder.id}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowDetailPanel(false);
                                        setSelectedOrder(null);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Priority Badge */}
                            <div className="mb-4">
                                <span className={`px-4 py-2 rounded-lg text-sm font-bold ${getPriorityLabel(selectedOrder.prioridad_calculada).color}`}>
                                    Prioridad: {getPriorityLabel(selectedOrder.prioridad_calculada).text}
                                </span>
                            </div>

                            {/* Order Details */}
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                                        <Wrench size={16} />
                                        <span>Equipo</span>
                                    </h3>
                                    <p className="text-gray-900 font-medium">{selectedOrder.equipo}</p>
                                    {selectedOrder.numero_serie && (
                                        <p className="text-gray-500 text-sm">S/N: {selectedOrder.numero_serie}</p>
                                    )}
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                                        <User size={16} />
                                        <span>Cliente</span>
                                    </h3>
                                    <p className="text-gray-900">{selectedOrder.cliente}</p>
                                </div>

                                {selectedOrder.falla_reportada && (
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h3 className="font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                                            <AlertTriangle size={16} />
                                            <span>Falla Reportada</span>
                                        </h3>
                                        <p className="text-gray-900">{selectedOrder.falla_reportada}</p>
                                    </div>
                                )}

                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                                        <Activity size={16} />
                                        <span>Estado Actual</span>
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(selectedOrder.estado)}
                                        <span className="text-gray-900 font-medium">{selectedOrder.estado}</span>
                                    </div>
                                </div>

                                {selectedOrder.fecha_vencimiento && (
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h3 className="font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                                            <Calendar size={16} />
                                            <span>Fecha de Vencimiento</span>
                                        </h3>
                                        <p className="text-gray-900">
                                            {new Date(selectedOrder.fecha_vencimiento).toLocaleDateString('es-MX', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="pt-4 space-y-2">
                                    <button
                                        onClick={() => openStatusModal(selectedOrder.id, selectedOrder.estado)}
                                        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all flex items-center justify-center space-x-2"
                                    >
                                        <Edit3 size={18} />
                                        <span>Cambiar Estado</span>
                                    </button>
                                    <button
                                        onClick={() => window.open(`/ordenes?id=${selectedOrder.id}`, '_blank')}
                                        className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all flex items-center justify-center space-x-2"
                                    >
                                        <Eye size={18} />
                                        <span>Ver en Órdenes</span>
                                    </button>
                                </div>

                                {/* History */}
                                {orderHistory.length > 0 && (
                                    <div className="pt-4 border-t">
                                        <h3 className="font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                                            <Clock size={16} />
                                            <span>Historial de Cambios</span>
                                        </h3>
                                        <div className="space-y-3 max-h-64 overflow-y-auto">
                                            {orderHistory.map((item, idx) => (
                                                <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="text-red-500 line-through">{item.estado_anterior}</span>
                                                        <span>→</span>
                                                        <span className="text-green-600 font-medium">{item.estado_nuevo}</span>
                                                    </div>
                                                    <p className="text-gray-600 text-xs">{item.justificacion}</p>
                                                    <p className="text-gray-400 text-xs mt-1">
                                                        {formatDate(item.created_at)} • {item.usuario}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Status Change Modal */}
            <AnimatePresence>
                {showStatusModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowStatusModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Cambiar Estado - Orden #{statusChangeData.orderId}
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nuevo Estado
                                    </label>
                                    <select
                                        value={statusChangeData.nuevoEstado}
                                        onChange={(e) => setStatusChangeData({ ...statusChangeData, nuevoEstado: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {estadoOptions.map(estado => (
                                            <option key={estado} value={estado}>{estado}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Justificación <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={statusChangeData.justificacion}
                                        onChange={(e) => setStatusChangeData({ ...statusChangeData, justificacion: e.target.value })}
                                        placeholder="Explique el motivo del cambio de estado..."
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        onClick={() => setShowStatusModal(false)}
                                        className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleChangeStatus}
                                        disabled={isChangingStatus || !statusChangeData.justificacion.trim()}
                                        className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isChangingStatus ? (
                                            <RefreshCw size={18} className="animate-spin" />
                                        ) : (
                                            <Save size={18} />
                                        )}
                                        <span>{isChangingStatus ? 'Guardando...' : 'Guardar'}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de Postergación de Fecha */}
            <AnimatePresence>
                {showPostponeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowPostponeModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Posponer Fecha de Vencimiento</h3>
                                <button
                                    onClick={() => setShowPostponeModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nueva Fecha de Vencimiento *
                                    </label>
                                    <input
                                        type="date"
                                        value={postponeData.nuevaFecha}
                                        onChange={(e) => setPostponeData({ ...postponeData, nuevaFecha: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Justificación (obligatoria) *
                                    </label>
                                    <textarea
                                        value={postponeData.justificacion}
                                        onChange={(e) => setPostponeData({ ...postponeData, justificacion: e.target.value })}
                                        placeholder="Explica la razón de la postergación..."
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        La justificación quedará registrada en el historial
                                    </p>
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        onClick={() => setShowPostponeModal(false)}
                                        className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handlePostpone}
                                        disabled={isPostponing || !postponeData.nuevaFecha || !postponeData.justificacion.trim()}
                                        className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isPostponing ? (
                                            <RefreshCw size={18} className="animate-spin" />
                                        ) : (
                                            <Calendar size={18} />
                                        )}
                                        <span>{isPostponing ? 'Guardando...' : 'Posponer'}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

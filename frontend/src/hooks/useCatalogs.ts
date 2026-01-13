'use client';

import { useState, useEffect } from 'react';
// import { modalidadApi, fabricanteApi, tecnicoApi } from '@/lib/api';
import { tecnicosService } from '../services/tecnicosService';
import { modalidadesService } from '../services/modalidadesService';
import { fabricantesService } from '../services/fabricantesService';
import { ordenesService } from '../services/ordenesService';
import { showToast } from '@/components/ui/Toast';
import { mapModalidadToUI, mapFabricanteToUI, mapTecnicoToUI, mapOrderToUI } from '@/lib/mappers';
import { getErrorMessage } from '@/types/errors';

// ============================================================================
// HOOK PARA MODALIDADES
// ============================================================================

export const useModalidades = () => {
  const [modalidades, setModalidades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CRUD Supabase
  const fetchModalidades = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await modalidadesService.getAll();
      if (error) throw error;
      const mapped = Array.isArray(data) ? data.map(mapModalidadToUI) : [];
      setModalidades(mapped);
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al cargar modalidades';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const createModalidad = async (data: { codigo: string; descripcion?: string }) => {
    try {
      setIsLoading(true);
      const { data: created, error } = await modalidadesService.create(data);
      if (error || !created) throw error;
      const mapped = mapModalidadToUI(created);
      setModalidades([...modalidades, mapped]);
      showToast.success('Modalidad creada exitosamente');
      return mapped;
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al crear modalidad';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  const updateModalidad = async (id: number, data: Partial<{ codigo: string; descripcion?: string }>) => {
    try {
      setIsLoading(true);
      const { data: updated, error } = await modalidadesService.update(id, data);
      if (error || !updated) throw error;
      const mapped = mapModalidadToUI(updated);
      setModalidades(modalidades.map(m => m.id === id.toString() ? mapped : m));
      showToast.success('Modalidad actualizada exitosamente');
      return mapped;
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al actualizar modalidad';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  const deleteModalidad = async (id: number) => {
    try {
      setIsLoading(true);
      const { error } = await modalidadesService.delete(id);

      if (error) {
        console.error('[deleteModalidad] Error de Supabase:', error);
        throw new Error(error.message || 'Error al eliminar modalidad');
      }

      setModalidades(modalidades.filter(m => m.id !== id.toString()));
      showToast.success('Modalidad eliminada exitosamente');
    } catch (err) {
      console.error('[deleteModalidad] Error capturado:', err);
      const errorMessage = getErrorMessage(err) || 'Error al eliminar modalidad';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    if (modalidades.length === 0) {
      fetchModalidades();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    modalidades,
    isLoading,
    error,
    fetchModalidades,
    createModalidad,
    updateModalidad,
    deleteModalidad,
  };
};

// ============================================================================
// HOOK PARA FABRICANTES
// ============================================================================

export const useFabricantes = () => {
  const [fabricantes, setFabricantes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CRUD Supabase
  const fetchFabricantes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await fabricantesService.getAll();
      if (error) throw error;
      const mapped = Array.isArray(data) ? data.map(mapFabricanteToUI) : [];
      setFabricantes(mapped);
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al cargar fabricantes';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const createFabricante = async (data: { nombre: string; pais?: string; soporte_tel?: string; web?: string }) => {
    try {
      setIsLoading(true);
      console.log('[createFabricante] Enviando datos:', data);
      const { data: created, error } = await fabricantesService.create(data);
      console.log('[createFabricante] Respuesta:', { created, error });

      if (error) {
        console.error('[createFabricante] Error de Supabase:', error);
        throw new Error(error.message || 'Error al crear fabricante');
      }

      if (!created) {
        throw new Error('No se recibió respuesta del servidor');
      }

      const mapped = mapFabricanteToUI(created);
      setFabricantes([...fabricantes, mapped]);
      showToast.success('Fabricante creado exitosamente');
      return mapped;
    } catch (err) {
      console.error('[createFabricante] Error capturado:', err);
      const errorMessage = getErrorMessage(err) || 'Error al crear fabricante';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  const updateFabricante = async (id: number, data: Partial<{ nombre: string; pais?: string; soporte_tel?: string; web?: string }>) => {
    try {
      setIsLoading(true);
      const { data: updated, error } = await fabricantesService.update(id, data);
      if (error || !updated) throw error;
      const mapped = mapFabricanteToUI(updated);
      setFabricantes(fabricantes.map(f => f.id === id.toString() ? mapped : f));
      showToast.success('Fabricante actualizado exitosamente');
      return mapped;
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al actualizar fabricante';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  const deleteFabricante = async (id: number) => {
    try {
      setIsLoading(true);
      const { error } = await fabricantesService.delete(id);

      if (error) {
        console.error('[deleteFabricante] Error de Supabase:', error);
        throw new Error(error.message || 'Error al eliminar fabricante');
      }

      setFabricantes(fabricantes.filter(f => f.id !== id.toString()));
      showToast.success('Fabricante eliminado exitosamente');
    } catch (err) {
      console.error('[deleteFabricante] Error capturado:', err);
      const errorMessage = getErrorMessage(err) || 'Error al eliminar fabricante';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    if (fabricantes.length === 0) {
      fetchFabricantes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    fabricantes,
    isLoading,
    error,
    fetchFabricantes,
    createFabricante,
    updateFabricante,
    deleteFabricante,
  };
};

// ============================================================================
// HOOK PARA TÉCNICOS
// ============================================================================

export const useTecnicos = () => {
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTecnicos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await tecnicosService.getAll();
      if (error) throw error;
      // Adaptar especialidad a los valores esperados por el mapeador
      const mapped = Array.isArray(data)
        ? data.map((t: any) => mapTecnicoToUI({
          ...t,
          especialidad: [
            'XR', 'CT', 'MR', 'US', 'MG', 'PET/CT', 'Multi-mod', 'DEXA', 'RF', 'CATH'
          ].includes(String(t.especialidad)) ? String(t.especialidad) : 'Multi-mod',
        }))
        : [];
      setTecnicos(mapped);
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al cargar técnicos';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createTecnico = async (data: any) => {
    try {
      setIsLoading(true);
      const { data: created, error } = await tecnicosService.create(data);
      if (error || !created) throw error;
      const especialidades = [
        'XR', 'CT', 'MR', 'US', 'MG', 'PET/CT', 'Multi-mod', 'DEXA', 'RF', 'CATH'
      ] as const;
      const especialidadStr = String(created.especialidad || '');
      const especialidadVal = especialidades.includes(especialidadStr as any)
        ? (especialidadStr as typeof especialidades[number])
        : 'Multi-mod';
      const mapped = mapTecnicoToUI({
        ...created,
        especialidad: especialidadVal,
        activo: typeof created.activo === 'boolean' ? (created.activo ? 1 : 0) : created.activo,
      });
      setTecnicos([...tecnicos, mapped]);
      showToast.success('Técnico creado exitosamente');
      return mapped;
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al crear técnico';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTecnico = async (id: number, data: any) => {
    try {
      setIsLoading(true);
      const { data: updated, error } = await tecnicosService.update(id, data);
      if (error || !updated) throw error;
      const especialidades = [
        'XR', 'CT', 'MR', 'US', 'MG', 'PET/CT', 'Multi-mod', 'DEXA', 'RF', 'CATH'
      ] as const;
      const especialidadStr = String(updated.especialidad || '');
      const especialidadVal = especialidades.includes(especialidadStr as any)
        ? (especialidadStr as typeof especialidades[number])
        : 'Multi-mod';
      const mapped = mapTecnicoToUI({
        ...updated,
        especialidad: especialidadVal,
        activo: typeof updated.activo === 'boolean' ? (updated.activo ? 1 : 0) : updated.activo,
      });
      setTecnicos(tecnicos.map(t => t.id === id.toString() ? mapped : t));
      showToast.success('Técnico actualizado exitosamente');
      return mapped;
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al actualizar técnico';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTecnico = async (id: number) => {
    try {
      setIsLoading(true);
      const { error } = await tecnicosService.delete(id);

      if (error) {
        console.error('[deleteTecnico] Error de Supabase:', error);
        throw new Error(error.message || 'Error al eliminar técnico');
      }

      setTecnicos(tecnicos.filter(t => t.id !== id.toString()));
      showToast.success('Técnico eliminado exitosamente');
    } catch (err) {
      console.error('[deleteTecnico] Error capturado:', err);
      const errorMessage = getErrorMessage(err) || 'Error al eliminar técnico';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Si tienes endpoint de técnicos activos, implementa aquí
  const fetchTecnicosActivos = async () => {
    // Implementar si se requiere
    return null;
  };

  useEffect(() => {
    if (tecnicos.length === 0) {
      fetchTecnicos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    tecnicos,
    isLoading,
    error,
    fetchTecnicos,
    fetchTecnicosActivos,
    createTecnico,
    updateTecnico,
    deleteTecnico,
  };
};

// ============================================================================
// HOOK PARA ÓRDENES
// ============================================================================

export const useOrdenes = () => {
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    isSearch: false
  });

  const fetchOrdenes = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    prioridad?: string;
    estado?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, pagination: paginationData, error } = await ordenesService.getAll(params);
      if (error) throw error;
      const mapped = Array.isArray(data) ? data.map(mapOrderToUI) : [];
      console.log('[fetchOrdenes] Órdenes mapeadas:', mapped.length, 'de', paginationData?.total);
      setOrdenes(mapped);
      if (paginationData) {
        setPagination(paginationData);
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al cargar órdenes';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createOrden = async (data: any) => {
    try {
      setIsLoading(true);
      console.log('[createOrden] Enviando datos:', data);
      const { data: created, error } = await ordenesService.create(data);
      console.log('[createOrden] Respuesta:', { created, error });

      if (error) {
        console.error('[createOrden] Error de Supabase:', error);
        throw new Error(error.message || 'Error al crear orden');
      }

      if (!created) {
        throw new Error('No se recibió respuesta del servidor');
      }

      const mapped = mapOrderToUI(created as any);
      // Refresh to update pagination counts
      await fetchOrdenes({ page: pagination.page, limit: pagination.limit });
      showToast.success('Orden creada exitosamente');
      return mapped;
    } catch (err) {
      console.error('[createOrden] Error capturado:', err);
      const errorMessage = getErrorMessage(err) || 'Error al crear orden';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrden = async (id: number, data: any) => {
    try {
      console.log('[updateOrden] Actualizando orden:', id, data);
      const { data: updated, error } = await ordenesService.update(id, data);

      if (error) {
        console.error('[updateOrden] Error de Supabase:', error);
        throw new Error(error.message || 'Error al actualizar orden');
      }

      if (!updated) {
        throw new Error('No se recibió respuesta del servidor');
      }

      console.log('[updateOrden] Orden actualizada, refrescando lista...');

      // Refresh current page
      await fetchOrdenes({ page: pagination.page, limit: pagination.limit });

      showToast.success('Orden actualizada exitosamente');
      return updated;
    } catch (err) {
      console.error('[updateOrden] Error capturado:', err);
      const errorMessage = getErrorMessage(err) || 'Error al actualizar orden';
      showToast.error(errorMessage);
      throw err;
    }
  };

  const deleteOrden = async (id: number) => {
    try {
      setIsLoading(true);
      const { error } = await ordenesService.delete(id);

      if (error) {
        console.error('[deleteOrden] Error de Supabase:', error);
        throw new Error(error.message || 'Error al eliminar orden');
      }

      // Refresh to update pagination counts
      await fetchOrdenes({ page: pagination.page, limit: pagination.limit });
      showToast.success('Orden eliminada exitosamente');
    } catch (err) {
      console.error('[deleteOrden] Error capturado:', err);
      const errorMessage = getErrorMessage(err) || 'Error al eliminar orden';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Don't auto-fetch on mount - let the page control fetching with params
  // useEffect(() => {
  //   fetchOrdenes();
  // }, []);

  return {
    ordenes,
    isLoading,
    error,
    pagination,
    fetchOrdenes,
    createOrden,
    updateOrden,
    deleteOrden,
  };
};


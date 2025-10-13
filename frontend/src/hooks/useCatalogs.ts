'use client';

import { useState, useEffect } from 'react';
import { modalidadApi, fabricanteApi, tecnicoApi } from '@/lib/api';
import { showToast } from '@/components/ui/Toast';
import { mapModalidadToUI, mapFabricanteToUI, mapTecnicoToUI } from '@/lib/mappers';
import { getErrorMessage } from '@/types/errors';

// ============================================================================
// HOOK PARA MODALIDADES
// ============================================================================

export const useModalidades = () => {
  const [modalidades, setModalidades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModalidades = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await modalidadApi.getAll();
      const data = response.data.data || response.data;
      const mapped = data.map(mapModalidadToUI);
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
      const response = await modalidadApi.create(data);
      const responseData = response.data.data || response.data;
      const mapped = mapModalidadToUI(responseData);
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
      const response = await modalidadApi.update(id, data);
      const responseData = response.data.data || response.data;
      const mapped = mapModalidadToUI(responseData);
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
      await modalidadApi.delete(id);
      setModalidades(modalidades.filter(m => m.id !== id.toString()));
      showToast.success('Modalidad eliminada exitosamente');
    } catch (err) {
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

  const fetchFabricantes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fabricanteApi.getAll();
      const data = response.data.data || response.data;
      const mapped = data.map(mapFabricanteToUI);
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
      const response = await fabricanteApi.create(data);
      const responseData = response.data.data || response.data;
      const mapped = mapFabricanteToUI(responseData);
      setFabricantes([...fabricantes, mapped]);
      showToast.success('Fabricante creado exitosamente');
      return mapped;
    } catch (err) {
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
      const response = await fabricanteApi.update(id, data);
      const responseData = response.data.data || response.data;
      const mapped = mapFabricanteToUI(responseData);
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
      await fabricanteApi.delete(id);
      setFabricantes(fabricantes.filter(f => f.id !== id.toString()));
      showToast.success('Fabricante eliminado exitosamente');
    } catch (err) {
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
      const response = await tecnicoApi.getAll();
      const data = response.data.data || response.data;
      const mapped = data.map(mapTecnicoToUI);
      setTecnicos(mapped);
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al cargar técnicos';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createTecnico = async (data: {
    nombre: string;
    especialidad?: 'XR' | 'CT' | 'MR' | 'US' | 'MG' | 'PET/CT' | 'Multi-mod' | 'DEXA' | 'RF' | 'CATH';
    certificaciones?: string;
    telefono?: string;
    email?: string;
    base_ciudad?: string;
    activo?: number;
  }) => {
    try {
      setIsLoading(true);
      const response = await tecnicoApi.create(data as any);
      const responseData = response.data.data || response.data;
      const mapped = mapTecnicoToUI(responseData);
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

  const updateTecnico = async (id: number, data: Partial<{
    nombre: string;
    especialidad?: 'XR' | 'CT' | 'MR' | 'US' | 'MG' | 'PET/CT' | 'Multi-mod' | 'DEXA' | 'RF' | 'CATH';
    certificaciones?: string;
    telefono?: string;
    email?: string;
    base_ciudad?: string;
    activo?: number;
  }>) => {
    try {
      setIsLoading(true);
      const response = await tecnicoApi.update(id, data as any);
      const responseData = response.data.data || response.data;
      const mapped = mapTecnicoToUI(responseData);
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
      await tecnicoApi.delete(id);
      setTecnicos(tecnicos.filter(t => t.id !== id.toString()));
      showToast.success('Técnico eliminado exitosamente');
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al eliminar técnico';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTecnicosActivos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await tecnicoApi.getActivos();
      const data = response.data.data || response.data;
      const mapped = data.map(mapTecnicoToUI);
      setTecnicos(mapped);
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al cargar técnicos activos';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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

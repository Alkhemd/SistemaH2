// Mock API - Simula el backend sin necesidad de servidor
import { EquipmentUI, ClientUI, OrderUI } from '@/types/equipment';

// Datos mock para equipos
let mockEquipments: EquipmentUI[] = [
  {
    id: '1',
    modelo: 'Tomógrafo GE Revolution',
    numeroSerie: 'GE-REV-2023-001',
    fabricante: 'General Electric',
    modalidad: 'Tomografía Computarizada',
    cliente: 'Hospital General de México',
    estado: 'operativo',
    ubicacion: 'Sala de Imagenología 1',
    fechaInstalacion: '2023-01-15',
    ultimaCalibacion: '2024-09-15',
    proximaCalibacion: '2025-03-15'
  },
  {
    id: '2',
    modelo: 'Resonador Siemens Aera',
    numeroSerie: 'SIE-AER-2023-002',
    fabricante: 'Siemens Healthineers',
    modalidad: 'Resonancia Magnética',
    cliente: 'Clínica San José',
    estado: 'mantenimiento',
    ubicacion: 'Sala de RM 2',
    fechaInstalacion: '2023-03-20',
    ultimaCalibacion: '2024-08-20',
    proximaCalibacion: '2025-02-20'
  },
  {
    id: '3',
    modelo: 'Mamógrafo Hologic Selenia',
    numeroSerie: 'HOL-SEL-2023-003',
    fabricante: 'Hologic',
    modalidad: 'Mamografía',
    cliente: 'Hospital Privado ABC',
    estado: 'operativo',
    ubicacion: 'Unidad de Mastología',
    fechaInstalacion: '2023-05-10',
    ultimaCalibacion: '2024-10-01',
    proximaCalibacion: '2025-04-01'
  },
  {
    id: '4',
    modelo: 'Ultrasonido Philips EPIQ',
    numeroSerie: 'PHI-EPI-2023-004',
    fabricante: 'Philips Healthcare',
    modalidad: 'Ultrasonografía',
    cliente: 'Centro Médico Norte',
    estado: 'fuera-servicio',
    ubicacion: 'Consulta Externa 3',
    fechaInstalacion: '2023-07-25',
    ultimaCalibacion: '2024-07-25',
    proximaCalibacion: '2025-01-25'
  },
  {
    id: '5',
    modelo: 'Rayos X Siemens Ysio Max',
    numeroSerie: 'SIE-YSI-2023-005',
    fabricante: 'Siemens Healthineers',
    modalidad: 'Radiografía',
    cliente: 'Hospital Universitario',
    estado: 'operativo',
    ubicacion: 'Sala de Rayos X 1',
    fechaInstalacion: '2023-09-12',
    ultimaCalibacion: '2024-09-12',
    proximaCalibacion: '2025-03-12'
  }
];

// Datos mock para clientes
let mockClients: ClientUI[] = [
  {
    id: '1',
    nombre: 'Hospital General de México',
    tipo: 'publico',
    ciudad: 'Ciudad de México',
    estado: 'CDMX',
    contacto: {
      telefono: '+52-55-1234-5678',
      email: 'contacto@hgm.salud.gob.mx',
      responsable: 'Dr. Juan Carlos Mendoza'
    },
    estado_cliente: 'activo',
    equiposCount: 15,
    fechaRegistro: '2023-01-15',
    ultimaActividad: '2024-10-08'
  },
  {
    id: '2',
    nombre: 'Clínica San José',
    tipo: 'privado',
    ciudad: 'Guadalajara',
    estado: 'Jalisco',
    contacto: {
      telefono: '+52-33-9876-5432',
      email: 'admin@clinicasanjose.com',
      responsable: 'Lic. María Elena Rodríguez'
    },
    estado_cliente: 'activo',
    equiposCount: 8,
    fechaRegistro: '2023-03-20',
    ultimaActividad: '2024-10-09'
  },
  {
    id: '3',
    nombre: 'Hospital Privado ABC',
    tipo: 'privado',
    ciudad: 'Monterrey',
    estado: 'Nuevo León',
    contacto: {
      telefono: '+52-81-5555-1234',
      email: 'servicios@hospitalabc.com',
      responsable: 'Ing. Roberto Silva'
    },
    estado_cliente: 'activo',
    equiposCount: 22,
    fechaRegistro: '2023-05-10',
    ultimaActividad: '2024-10-10'
  }
];

// Datos mock para órdenes
let mockOrders: OrderUI[] = [
  {
    id: '1',
    equipo: {
      modelo: 'Tomógrafo GE Revolution',
      numeroSerie: 'GE-REV-2023-001',
      fabricante: 'General Electric'
    },
    cliente: 'Hospital General de México',
    prioridad: 'alta',
    estado: 'proceso',
    tipo: 'preventivo',
    titulo: 'Mantenimiento preventivo programado',
    descripcion: 'Revisión general del sistema, calibración de detectores y limpieza de componentes internos.',
    fechaCreacion: '2024-10-08',
    fechaVencimiento: '2024-10-15',
    tecnico: 'Ing. Carlos Méndez',
    tiempoEstimado: '4 horas'
  },
  {
    id: '2',
    equipo: {
      modelo: 'Resonador Siemens Aera',
      numeroSerie: 'SIE-AER-2023-002',
      fabricante: 'Siemens Healthineers'
    },
    cliente: 'Clínica San José',
    prioridad: 'critica',
    estado: 'abierta',
    tipo: 'correctivo',
    titulo: 'Falla en sistema de enfriamiento',
    descripcion: 'El sistema de enfriamiento del magneto presenta temperaturas elevadas. Requiere revisión inmediata.',
    fechaCreacion: '2024-10-10',
    fechaVencimiento: '2024-10-11',
    tecnico: 'Ing. Ana López',
    tiempoEstimado: '6 horas'
  }
];

// Función para simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función para generar IDs únicos
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Mock API para equipos
export const mockEquipmentApi = {
  async getAll() {
    await delay(800); // Simula latencia de red
    return {
      data: mockEquipments,
      status: 200,
      message: 'Equipos obtenidos exitosamente'
    };
  },

  async getById(id: string) {
    await delay(500);
    const equipment = mockEquipments.find(eq => eq.id === id);
    if (!equipment) {
      throw new Error('Equipo no encontrado');
    }
    return {
      data: equipment,
      status: 200,
      message: 'Equipo obtenido exitosamente'
    };
  },

  async create(data: Omit<EquipmentUI, 'id'>) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newEquipment: EquipmentUI = {
      ...data,
      id: generateId()
    };
    mockEquipments.push(newEquipment);
    return {
      data: newEquipment,
      status: 201,
      message: 'Equipo creado exitosamente'
    };
  },

  async update(id: string, data: Partial<EquipmentUI>) {
    await delay(800);
    const index = mockEquipments.findIndex(eq => eq.id === id);
    if (index === -1) {
      throw new Error('Equipo no encontrado');
    }
    mockEquipments[index] = { ...mockEquipments[index], ...data };
    return {
      data: mockEquipments[index],
      status: 200,
      message: 'Equipo actualizado exitosamente'
    };
  },

  async delete(id: string) {
    await delay(600);
    const index = mockEquipments.findIndex(eq => eq.id === id);
    if (index === -1) {
      throw new Error('Equipo no encontrado');
    }
    mockEquipments.splice(index, 1);
    return {
      status: 200,
      message: 'Equipo eliminado exitosamente'
    };
  }
};

// Mock API para clientes
export const mockClientApi = {
  async getAll() {
    await delay(700);
    return {
      data: mockClients,
      status: 200,
      message: 'Clientes obtenidos exitosamente'
    };
  },

  async getById(id: string) {
    await delay(500);
    const client = mockClients.find(cl => cl.id === id);
    if (!client) {
      throw new Error('Cliente no encontrado');
    }
    return {
      data: client,
      status: 200,
      message: 'Cliente obtenido exitosamente'
    };
  },

  async create(data: Omit<ClientUI, 'id'>) {
    await delay(1000);
    const newClient: ClientUI = {
      ...data,
      id: generateId()
    };
    mockClients.push(newClient);
    return {
      data: newClient,
      status: 201,
      message: 'Cliente creado exitosamente'
    };
  },

  async update(id: string, data: Partial<ClientUI>) {
    await delay(800);
    const index = mockClients.findIndex(cl => cl.id === id);
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }
    mockClients[index] = { ...mockClients[index], ...data };
    return {
      data: mockClients[index],
      status: 200,
      message: 'Cliente actualizado exitosamente'
    };
  },

  async delete(id: string) {
    await delay(600);
    const index = mockClients.findIndex(cl => cl.id === id);
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }
    mockClients.splice(index, 1);
    return {
      status: 200,
      message: 'Cliente eliminado exitosamente'
    };
  }
};

// Mock API para órdenes
export const mockOrderApi = {
  async getAll() {
    await delay(900);
    return {
      data: mockOrders,
      status: 200,
      message: 'Órdenes obtenidas exitosamente'
    };
  },

  async getById(id: string) {
    await delay(500);
    const order = mockOrders.find(or => or.id === id);
    if (!order) {
      throw new Error('Orden no encontrada');
    }
    return {
      data: order,
      status: 200,
      message: 'Orden obtenida exitosamente'
    };
  },

  async create(data: Omit<OrderUI, 'id'>) {
    await delay(1000);
    const newOrder: OrderUI = {
      ...data,
      id: generateId(),
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    mockOrders.push(newOrder);
    return {
      data: newOrder,
      status: 201,
      message: 'Orden creada exitosamente'
    };
  },

  async update(id: string, data: Partial<OrderUI>) {
    await delay(800);
    const index = mockOrders.findIndex(or => or.id === id);
    if (index === -1) {
      throw new Error('Orden no encontrada');
    }
    mockOrders[index] = { ...mockOrders[index], ...data };
    return {
      data: mockOrders[index],
      status: 200,
      message: 'Orden actualizada exitosamente'
    };
  },

  async delete(id: string) {
    await delay(600);
    const index = mockOrders.findIndex(or => or.id === id);
    if (index === -1) {
      throw new Error('Orden no encontrada');
    }
    mockOrders.splice(index, 1);
    return {
      status: 200,
      message: 'Orden eliminada exitosamente'
    };
  }
};

// Función para obtener estadísticas del dashboard
export const mockDashboardApi = {
  async getStats() {
    await delay(600);
    return {
      data: {
        totalEquipments: mockEquipments.length,
        operativeEquipments: mockEquipments.filter(eq => eq.estado === 'operativo').length,
        maintenanceEquipments: mockEquipments.filter(eq => eq.estado === 'mantenimiento').length,
        outOfServiceEquipments: mockEquipments.filter(eq => eq.estado === 'fuera-servicio').length,
        totalClients: mockClients.length,
        activeClients: mockClients.filter(cl => cl.estado_cliente === 'activo').length,
        totalOrders: mockOrders.length,
        openOrders: mockOrders.filter(or => or.estado === 'abierta').length,
        inProgressOrders: mockOrders.filter(or => or.estado === 'proceso').length,
        completedOrders: mockOrders.filter(or => or.estado === 'cerrada').length,
        criticalOrders: mockOrders.filter(or => or.prioridad === 'critica').length
      },
      status: 200,
      message: 'Estadísticas obtenidas exitosamente'
    };
  },

  async getRecentActivity() {
    await delay(400);
    return {
      data: mockOrders.slice(0, 5).map(order => ({
        id: order.id,
        type: order.tipo,
        equipment: order.equipo.modelo,
        client: order.cliente,
        time: `Hace ${Math.floor(Math.random() * 24) + 1} horas`,
        status: order.estado,
        priority: order.prioridad
      })),
      status: 200,
      message: 'Actividad reciente obtenida exitosamente'
    };
  }
};

/**
 * Script para generar automáticamente una colección de Postman
 * con todos los endpoints GET y POST de la API Sistema H
 */

const fs = require('fs');
const path = require('path');

// Configuración base
const BASE_URL = '{{base_url}}';
const API_VERSION = '/api/v1';

// Definición de recursos CRUD (generados por createCrudRoutes)
const crudResources = [
  { 
    name: 'Clientes', 
    path: 'clientes',
    examplePost: {
      nombre: 'Hospital Ejemplo',
      tipo: 'Hospital',
      direccion: 'Calle Principal #123',
      ciudad: 'Mérida',
      estado: 'Yucatán',
      pais: 'México',
      contacto: 'Dr. Juan Pérez',
      telefono: '+52 999-123-4567',
      email: 'contacto@hospital.mx'
    }
  },
  { 
    name: 'Equipos', 
    path: 'equipos',
    examplePost: {
      cliente_id: 1,
      modalidad_id: 1,
      fabricante_id: 1,
      modelo: 'Modelo X-1000',
      numero_serie: 'SN-2025-12345',
      asset_tag: 'AST-001',
      fecha_instalacion: '2025-01-15',
      estado_equipo: 'Operativo',
      ubicacion: 'Sala A',
      software_version: '1.0.0',
      horas_uso: 100
    }
  },
  { 
    name: 'Órdenes de Trabajo', 
    path: 'ordenes',
    examplePost: {
      equipo_id: 1,
      cliente_id: 1,
      contrato_id: 1,
      fecha_apertura: '2025-10-09T10:00:00',
      prioridad: 'Media',
      estado: 'Abierta',
      falla_reportada: 'Equipo no enciende',
      origen: 'Llamada'
    }
  },
  { 
    name: 'Modalidades', 
    path: 'modalidades',
    examplePost: {
      codigo: 'DEXA',
      descripcion: 'Densitometría Ósea'
    }
  },
  { 
    name: 'Fabricantes', 
    path: 'fabricantes',
    examplePost: {
      nombre: 'Fabricante Ejemplo SA',
      pais: 'México',
      soporte_tel: '+52 55-1234-5678',
      web: 'https://fabricante.com'
    }
  },
  { 
    name: 'Técnicos', 
    path: 'tecnicos',
    examplePost: {
      nombre: 'Carlos Ramírez',
      especialidad: 'Multi-mod',
      certificaciones: 'OEM Multi-mod; Seguridad eléctrica',
      telefono: '+52 999-555-0001',
      email: 'carlos.ramirez@empresa.mx',
      base_ciudad: 'Mérida',
      activo: 1
    }
  },
  { 
    name: 'Contratos', 
    path: 'contratos',
    examplePost: {
      cliente_id: 1,
      tipo: 'Full',
      fecha_inicio: '2025-01-01',
      fecha_fin: '2026-01-01',
      sla_horas_respuesta: 4,
      visitas_pm_anuales: 2,
      cobertura: 'Piezas+Mano_Obra'
    }
  },
  { 
    name: 'Eventos de Orden', 
    path: 'eventos-orden',
    examplePost: {
      orden_id: 1,
      fecha_hora: '2025-10-09T11:00:00',
      estado: 'Asignada',
      nota: 'Técnico asignado a la orden'
    }
  },
  { 
    name: 'Intervenciones', 
    path: 'intervenciones',
    examplePost: {
      orden_id: 1,
      tecnico_id: 1,
      fecha_inicio: '2025-10-09T12:00:00',
      fecha_fin: '2025-10-09T14:00:00',
      horas_labor: 2.0,
      accion_realizada: 'Reemplazo de componente',
      causa_raiz: 'Desgaste',
      resultado: 'Reparado'
    }
  },
  { 
    name: 'Mantenimientos PM', 
    path: 'mantenimientos-pm',
    examplePost: {
      equipo_id: 1,
      fecha_programada: '2025-11-01',
      fecha_ejecucion: '2025-11-01',
      tecnico_id: 1,
      checklist_ok: 1,
      observaciones: 'PM anual completado'
    }
  },
  { 
    name: 'Calibraciones QC', 
    path: 'calibraciones-qc',
    examplePost: {
      equipo_id: 1,
      fecha: '2025-10-09',
      tecnico_id: 1,
      prueba: 'kVp salida',
      valor: 70.5,
      unidad: 'kVp',
      resultado: 'OK',
      observaciones: 'Dentro de especificaciones'
    }
  },
  { 
    name: 'Partes', 
    path: 'partes',
    examplePost: {
      fabricante: 'Generic',
      numero_parte: 'PART-001',
      descripcion: 'Componente ejemplo',
      costo_unitario: 150.00,
      stock: 10,
      ubicacion: 'ALM-A1'
    }
  },
  { 
    name: 'Partes Usadas', 
    path: 'partes-usadas',
    examplePost: {
      intervencion_id: 1,
      parte_id: 1,
      cantidad: 2,
      costo_unitario: 150.00
    }
  }
];

// Endpoints GET especiales (no CRUD estándar)
const specialGetEndpoints = [
  {
    name: 'Clientes por Ciudad',
    path: 'clientes/ciudad/:ciudad',
    folder: 'Clientes',
    description: 'Obtener clientes filtrados por ciudad',
    pathVariables: [
      { key: 'ciudad', value: 'Mérida', description: 'Nombre de la ciudad' }
    ]
  },
  {
    name: 'Cliente con Equipos',
    path: 'clientes/:id/equipos',
    folder: 'Clientes',
    description: 'Obtener cliente con todos sus equipos',
    pathVariables: [
      { key: 'id', value: '1', description: 'ID del cliente' }
    ]
  },
  {
    name: 'Equipos por Estado',
    path: 'equipos/estado/:estado',
    folder: 'Equipos',
    description: 'Filtrar equipos por estado operativo',
    pathVariables: [
      { key: 'estado', value: 'Operativo', description: 'Estado del equipo (Operativo, En_Mantenimiento, Fuera_Servicio)' }
    ]
  },
  {
    name: 'Equipo por Serial',
    path: 'equipos/serial/:serial',
    folder: 'Equipos',
    description: 'Buscar equipo por número de serie',
    pathVariables: [
      { key: 'serial', value: 'CM-XR-2024-45093', description: 'Número de serie del equipo' }
    ]
  },
  {
    name: 'Historial Completo de Equipo',
    path: 'equipos/:id/historial',
    folder: 'Equipos',
    description: 'Obtener historial completo del equipo (órdenes, eventos, intervenciones, partes)',
    pathVariables: [
      { key: 'id', value: '1', description: 'ID del equipo' }
    ]
  },
  {
    name: 'Historial de Orden de Trabajo',
    path: 'ordenes/:id/historial',
    folder: 'Órdenes de Trabajo',
    description: 'Obtener orden con historial completo de eventos e intervenciones',
    pathVariables: [
      { key: 'id', value: '1', description: 'ID de la orden' }
    ]
  },
  {
    name: 'Órdenes por Estado',
    path: 'ordenes/estado/:estado',
    folder: 'Órdenes de Trabajo',
    description: 'Filtrar órdenes por estado',
    pathVariables: [
      { key: 'estado', value: 'Abierta', description: 'Estado de la orden (Abierta, Asignada, En Proceso, En Espera, Cerrada)' }
    ]
  },
  {
    name: 'Estadísticas Dashboard',
    path: 'dashboard/estadisticas',
    folder: 'Dashboard',
    description: 'Obtener estadísticas generales del sistema'
  },
  {
    name: 'Técnicos Activos',
    path: 'tecnicos/activos',
    folder: 'Técnicos',
    description: 'Listar solo técnicos activos'
  },
  {
    name: 'Eventos por Orden',
    path: 'eventos-orden/orden/:orden_id',
    folder: 'Eventos de Orden',
    description: 'Obtener todos los eventos de una orden específica',
    pathVariables: [
      { key: 'orden_id', value: '1', description: 'ID de la orden' }
    ]
  },
  {
    name: 'Partes con Stock Bajo',
    path: 'partes/stock-bajo',
    folder: 'Partes',
    description: 'Listar partes con stock por debajo del mínimo'
  }
];

/**
 * Genera un item de colección Postman para GET
 */
function createGetRequest(name, path, folder, description = '', pathVariables = []) {
  const url = `${BASE_URL}${API_VERSION}/${path}`;
  
  return {
    name: name,
    request: {
      method: 'GET',
      header: [
        {
          key: 'Accept',
          value: 'application/json',
          type: 'text'
        }
      ],
      url: {
        raw: url,
        host: [BASE_URL],
        path: `${API_VERSION}/${path}`.split('/').filter(p => p),
        variable: pathVariables.length > 0 ? pathVariables : undefined
      },
      description: description
    },
    response: []
  };
}

/**
 * Genera un item de colección Postman para POST
 */
function createPostRequest(name, path, exampleBody, description = '') {
  const url = `${BASE_URL}${API_VERSION}/${path}`;
  
  return {
    name: name,
    request: {
      method: 'POST',
      header: [
        {
          key: 'Content-Type',
          value: 'application/json',
          type: 'text'
        },
        {
          key: 'Accept',
          value: 'application/json',
          type: 'text'
        }
      ],
      body: {
        mode: 'raw',
        raw: JSON.stringify(exampleBody, null, 2),
        options: {
          raw: {
            language: 'json'
          }
        }
      },
      url: {
        raw: url,
        host: [BASE_URL],
        path: `${API_VERSION}/${path}`.split('/').filter(p => p)
      },
      description: description
    },
    response: []
  };
}

/**
 * Genera la estructura de carpetas y requests
 */
function generateCollection() {
  const items = [];

  // Agregar endpoint raíz de health check
  items.push({
    name: 'Health Check',
    item: [
      createGetRequest(
        'Health Check',
        '',
        'Health Check',
        'Verifica el estado del servidor y la conexión a la base de datos'
      )
    ]
  });

  // Generar carpetas por recurso CRUD
  crudResources.forEach(resource => {
    const folderItems = [];
    
    // GET All (con paginación)
    folderItems.push(createGetRequest(
      `Listar ${resource.name}`,
      `${resource.path}?page=1&limit=10`,
      resource.name,
      `Obtener lista paginada de ${resource.name.toLowerCase()}`
    ));
    
    // GET By ID
    folderItems.push(createGetRequest(
      `Obtener ${resource.name.slice(0, -1)} por ID`,
      `${resource.path}/:id`,
      resource.name,
      `Obtener un ${resource.name.toLowerCase().slice(0, -1)} específico por ID`,
      [{ key: 'id', value: '1', description: 'ID del registro' }]
    ));
    
    // POST Create
    folderItems.push(createPostRequest(
      `Crear ${resource.name.slice(0, -1)}`,
      resource.path,
      resource.examplePost,
      `Crear un nuevo ${resource.name.toLowerCase().slice(0, -1)}`
    ));
    
    items.push({
      name: resource.name,
      item: folderItems
    });
  });

  // Agregar endpoints GET especiales organizados por carpeta
  const specialFolders = {};
  
  specialGetEndpoints.forEach(endpoint => {
    if (!specialFolders[endpoint.folder]) {
      specialFolders[endpoint.folder] = [];
    }
    
    specialFolders[endpoint.folder].push(
      createGetRequest(
        endpoint.name,
        endpoint.path,
        endpoint.folder,
        endpoint.description,
        endpoint.pathVariables || []
      )
    );
  });

  // Agregar endpoints especiales a las carpetas existentes o crear nuevas
  Object.keys(specialFolders).forEach(folderName => {
    const existingFolder = items.find(item => item.name === folderName);
    
    if (existingFolder) {
      // Agregar a carpeta existente
      existingFolder.item.push(...specialFolders[folderName]);
    } else {
      // Crear nueva carpeta
      items.push({
        name: folderName,
        item: specialFolders[folderName]
      });
    }
  });

  return {
    info: {
      name: 'Sistema H - API REST (GET & POST)',
      description: 'Colección generada automáticamente con todos los endpoints GET y POST de la API Sistema H para gestión de equipos biomédicos.\n\n**Generado:** ' + new Date().toISOString(),
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      _postman_id: generateUUID()
    },
    item: items,
    variable: [
      {
        key: 'base_url',
        value: 'http://localhost:3000',
        type: 'string'
      }
    ]
  };
}

/**
 * Genera un UUID simple para Postman
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Función principal
 */
function main() {
  try {
    console.log('🚀 Generando colección de Postman...');
    
    const collection = generateCollection();
    
    // Guardar en archivo
    const outputPath = path.join(__dirname, '../../postman/Sistema-H-API-Generated.postman_collection.json');
    
    // Crear directorio si no existe
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), 'utf8');
    
    console.log('✅ Colección generada exitosamente!');
    console.log(`📁 Archivo: ${outputPath}`);
    console.log(`📊 Total de recursos: ${crudResources.length}`);
    console.log(`🔍 Endpoints GET especiales: ${specialGetEndpoints.length}`);
    console.log(`📝 Total de carpetas: ${collection.item.length}`);
    
    // Contar requests
    let totalRequests = 0;
    collection.item.forEach(folder => {
      totalRequests += folder.item.length;
    });
    console.log(`🎯 Total de requests: ${totalRequests}`);
    
    console.log('\n💡 Para usar en Postman:');
    console.log('   1. Abrir Postman');
    console.log('   2. Import > Upload Files');
    console.log(`   3. Seleccionar: ${outputPath}`);
    console.log('   4. Configurar variable {{base_url}} si es necesario');
    
  } catch (error) {
    console.error('❌ Error al generar colección:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { generateCollection };

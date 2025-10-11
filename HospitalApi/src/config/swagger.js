const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema H - API de Gestión de Equipos Médicos',
      version: '1.0.0',
      description: 'API REST completa para la gestión de equipos médicos, mantenimientos, órdenes de trabajo y control de calidad.',
      contact: {
        name: 'Sistema H Team',
        email: 'support@sistemah.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      schemas: {
        // Schemas para INPUT (POST/PUT) - SIN campos ID autoincrementales
        ClienteInput: {
          type: 'object',
          required: ['nombre'],
          properties: {
            nombre: {
              type: 'string',
              description: 'Nombre del cliente',
              example: 'Hospital San José'
            },
            tipo: {
              type: 'string',
              enum: ['Hospital', 'Clínica', 'Centro Médico', 'Laboratorio'],
              description: 'Tipo de establecimiento',
              example: 'Hospital'
            },
            direccion: {
              type: 'string',
              description: 'Dirección del cliente',
              example: 'Calle Principal 123'
            },
            ciudad: {
              type: 'string',
              description: 'Ciudad del cliente',
              example: 'Ciudad de México'
            },
            estado: {
              type: 'string',
              description: 'Estado del cliente',
              example: 'CDMX'
            },
            pais: {
              type: 'string',
              description: 'País del cliente',
              example: 'México'
            },
            contacto: {
              type: 'string',
              description: 'Nombre del contacto',
              example: 'Juan Pérez'
            },
            telefono: {
              type: 'string',
              description: 'Teléfono de contacto',
              example: '+52 55 1234 5678'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email de contacto',
              example: 'contacto@hospital.com'
            }
          }
        },
        // Schemas para OUTPUT (respuestas) - CON campos ID
        Cliente: {
          type: 'object',
          required: ['nombre'],
          properties: {
            cliente_id: {
              type: 'integer',
              description: 'ID único del cliente (autoincremental)',
              readOnly: true
            },
            nombre: {
              type: 'string',
              description: 'Nombre del cliente'
            },
            tipo: {
              type: 'string',
              enum: ['Hospital', 'Clínica', 'Centro Médico', 'Laboratorio'],
              description: 'Tipo de establecimiento'
            },
            direccion: {
              type: 'string',
              description: 'Dirección del cliente'
            },
            ciudad: {
              type: 'string',
              description: 'Ciudad del cliente'
            },
            estado: {
              type: 'string',
              description: 'Estado del cliente'
            },
            pais: {
              type: 'string',
              description: 'País del cliente'
            },
            contacto: {
              type: 'string',
              description: 'Nombre del contacto'
            },
            telefono: {
              type: 'string',
              description: 'Teléfono de contacto'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email de contacto'
            }
          }
        },
        EquipoInput: {
          type: 'object',
          required: ['cliente_id', 'modalidad_id', 'fabricante_id'],
          properties: {
            cliente_id: {
              type: 'integer',
              description: 'ID del cliente propietario',
              example: 1
            },
            modalidad_id: {
              type: 'integer',
              description: 'ID de la modalidad del equipo',
              example: 1
            },
            fabricante_id: {
              type: 'integer',
              description: 'ID del fabricante',
              example: 1
            },
            contrato_id: {
              type: 'integer',
              description: 'ID del contrato de servicio',
              example: 1
            },
            modelo: {
              type: 'string',
              description: 'Modelo del equipo',
              example: 'Revolution CT'
            },
            numero_serie: {
              type: 'string',
              description: 'Número de serie único',
              example: 'SN123456'
            },
            asset_tag: {
              type: 'string',
              description: 'Etiqueta de activo',
              example: 'AT-001'
            },
            fecha_instalacion: {
              type: 'string',
              format: 'date',
              description: 'Fecha de instalación',
              example: '2024-01-15'
            },
            estado_equipo: {
              type: 'string',
              enum: ['Operativo', 'En_Mantenimiento', 'Fuera_Servicio', 'Desinstalado'],
              description: 'Estado actual del equipo',
              example: 'Operativo'
            },
            ubicacion: {
              type: 'string',
              description: 'Ubicación del equipo',
              example: 'Sala de Tomografía 1'
            },
            software_version: {
              type: 'string',
              description: 'Versión del software',
              example: 'v12.3.1'
            },
            horas_uso: {
              type: 'integer',
              description: 'Horas de uso acumuladas',
              example: 15000
            },
            garantia_hasta: {
              type: 'string',
              format: 'date',
              description: 'Fecha de fin de garantía',
              example: '2025-12-31'
            }
          }
        },
        Equipo: {
          type: 'object',
          required: ['cliente_id', 'modalidad_id', 'fabricante_id'],
          properties: {
            equipo_id: {
              type: 'integer',
              description: 'ID único del equipo (autoincremental)',
              readOnly: true
            },
            cliente_id: {
              type: 'integer',
              description: 'ID del cliente propietario'
            },
            modalidad_id: {
              type: 'integer',
              description: 'ID de la modalidad del equipo'
            },
            fabricante_id: {
              type: 'integer',
              description: 'ID del fabricante'
            },
            contrato_id: {
              type: 'integer',
              description: 'ID del contrato de servicio'
            },
            modelo: {
              type: 'string',
              description: 'Modelo del equipo'
            },
            numero_serie: {
              type: 'string',
              description: 'Número de serie único'
            },
            asset_tag: {
              type: 'string',
              description: 'Etiqueta de activo'
            },
            fecha_instalacion: {
              type: 'string',
              format: 'date',
              description: 'Fecha de instalación'
            },
            estado_equipo: {
              type: 'string',
              enum: ['Operativo', 'En_Mantenimiento', 'Fuera_Servicio', 'Desinstalado'],
              description: 'Estado actual del equipo'
            },
            ubicacion: {
              type: 'string',
              description: 'Ubicación del equipo'
            },
            software_version: {
              type: 'string',
              description: 'Versión del software'
            },
            horas_uso: {
              type: 'integer',
              description: 'Horas de uso acumuladas'
            },
            garantia_hasta: {
              type: 'string',
              format: 'date',
              description: 'Fecha de fin de garantía'
            }
          }
        },
        OrdenTrabajo: {
          type: 'object',
          required: ['equipo_id', 'cliente_id'],
          properties: {
            orden_id: {
              type: 'integer',
              description: 'ID único de la orden'
            },
            equipo_id: {
              type: 'integer',
              description: 'ID del equipo'
            },
            cliente_id: {
              type: 'integer',
              description: 'ID del cliente'
            },
            contrato_id: {
              type: 'integer',
              description: 'ID del contrato'
            },
            fecha_apertura: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha y hora de apertura'
            },
            prioridad: {
              type: 'string',
              enum: ['Baja', 'Media', 'Alta', 'Crítica'],
              description: 'Prioridad de la orden'
            },
            estado: {
              type: 'string',
              enum: ['Abierta', 'Asignada', 'En Proceso', 'En Espera', 'Cerrada', 'Cancelada'],
              description: 'Estado actual de la orden'
            },
            falla_reportada: {
              type: 'string',
              description: 'Descripción de la falla reportada'
            },
            origen: {
              type: 'string',
              enum: ['Llamada', 'Portal', 'PM', 'Alarma Remota', 'Email'],
              description: 'Origen de la orden'
            }
          }
        },
        Modalidad: {
          type: 'object',
          required: ['codigo'],
          properties: {
            modalidad_id: {
              type: 'integer',
              description: 'ID único de la modalidad'
            },
            codigo: {
              type: 'string',
              description: 'Código de la modalidad'
            },
            descripcion: {
              type: 'string',
              description: 'Descripción de la modalidad'
            }
          }
        },
        Fabricante: {
          type: 'object',
          required: ['nombre'],
          properties: {
            fabricante_id: {
              type: 'integer',
              description: 'ID único del fabricante'
            },
            nombre: {
              type: 'string',
              description: 'Nombre del fabricante'
            },
            pais: {
              type: 'string',
              description: 'País del fabricante'
            },
            soporte_tel: {
              type: 'string',
              description: 'Teléfono de soporte'
            },
            web: {
              type: 'string',
              format: 'uri',
              description: 'Sitio web del fabricante'
            }
          }
        },
        Tecnico: {
          type: 'object',
          required: ['nombre'],
          properties: {
            tecnico_id: {
              type: 'integer',
              description: 'ID único del técnico'
            },
            nombre: {
              type: 'string',
              description: 'Nombre del técnico'
            },
            especialidad: {
              type: 'string',
              enum: ['XR', 'CT', 'MR', 'US', 'MG', 'PET/CT', 'Multi-mod', 'DEXA', 'RF', 'CATH'],
              description: 'Especialidad del técnico'
            },
            certificaciones: {
              type: 'string',
              description: 'Certificaciones del técnico'
            },
            telefono: {
              type: 'string',
              description: 'Teléfono de contacto'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email de contacto'
            },
            base_ciudad: {
              type: 'string',
              description: 'Ciudad base del técnico'
            },
            activo: {
              type: 'integer',
              enum: [0, 1],
              description: 'Estado activo del técnico'
            }
          }
        },
        Parte: {
          type: 'object',
          required: ['codigo_parte', 'descripcion'],
          properties: {
            parte_id: {
              type: 'integer',
              description: 'ID único de la parte'
            },
            codigo_parte: {
              type: 'string',
              description: 'Código de la parte'
            },
            descripcion: {
              type: 'string',
              description: 'Descripción de la parte'
            },
            fabricante_id: {
              type: 'integer',
              description: 'ID del fabricante'
            },
            precio_unitario: {
              type: 'number',
              format: 'decimal',
              description: 'Precio unitario'
            },
            stock: {
              type: 'integer',
              description: 'Cantidad en stock'
            },
            ubicacion_almacen: {
              type: 'string',
              description: 'Ubicación en almacén'
            }
          }
        },
        Contrato: {
          type: 'object',
          required: ['cliente_id', 'tipo_contrato', 'fecha_inicio'],
          properties: {
            contrato_id: {
              type: 'integer',
              description: 'ID único del contrato'
            },
            cliente_id: {
              type: 'integer',
              description: 'ID del cliente'
            },
            tipo_contrato: {
              type: 'string',
              enum: ['Full_Service', 'Time_Material', 'Parts_Only', 'No_Contract'],
              description: 'Tipo de contrato'
            },
            fecha_inicio: {
              type: 'string',
              format: 'date',
              description: 'Fecha de inicio del contrato'
            },
            fecha_fin: {
              type: 'string',
              format: 'date',
              description: 'Fecha de fin del contrato'
            },
            monto_anual: {
              type: 'number',
              format: 'decimal',
              description: 'Monto anual del contrato'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica si la operación fue exitosa'
            },
            message: {
              type: 'string',
              description: 'Mensaje descriptivo de la respuesta'
            },
            data: {
              type: 'object',
              description: 'Datos de la respuesta'
            },
            error: {
              type: 'string',
              description: 'Mensaje de error si aplica'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            data: {
              type: 'array',
              items: {}
            },
            pagination: {
              type: 'object',
              properties: {
                currentPage: {
                  type: 'integer'
                },
                totalPages: {
                  type: 'integer'
                },
                totalItems: {
                  type: 'integer'
                },
                itemsPerPage: {
                  type: 'integer'
                }
              }
            }
          }
        }
      },
      parameters: {
        PageParam: {
          name: 'page',
          in: 'query',
          description: 'Número de página',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          }
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          description: 'Elementos por página',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10
          }
        },
        IdParam: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID del registro',
          schema: {
            type: 'integer'
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Rutas donde buscar anotaciones
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
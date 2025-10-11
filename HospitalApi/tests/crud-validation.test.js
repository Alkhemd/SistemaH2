const request = require('supertest');
const app = require('../src/server');

jest.setTimeout(20000);

describe('Validación CRUD - IDs autoincrementales', () => {
  let createdClienteId;

  test('POST /api/v1/clientes - NO debe permitir especificar cliente_id', async () => {
    const res = await request(app)
      .post('/api/v1/clientes')
      .send({
        cliente_id: 0, // Intentar especificar ID (debe ser ignorado)
        nombre: 'Test Hospital',
        tipo: 'Hospital',
        ciudad: 'Test Ciudad',
        email: 'test@hospital.com'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('cliente_id');
    // El ID debe ser autoincremental, NO 0
    expect(res.body.data.cliente_id).not.toBe(0);
    expect(res.body.data.cliente_id).toBeGreaterThan(0);
    
    createdClienteId = res.body.data.cliente_id;
  });

  test('POST /api/v1/clientes - Debe ignorar cliente_id en el body', async () => {
    const res = await request(app)
      .post('/api/v1/clientes')
      .send({
        cliente_id: 999, // Intentar forzar un ID específico
        nombre: 'Otro Hospital',
        tipo: 'Clínica',
        ciudad: 'Otra Ciudad'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.cliente_id).not.toBe(999);
    expect(res.body.data.cliente_id).toBeGreaterThan(0);
  });

  test('PUT /api/v1/clientes/:id - NO debe permitir modificar cliente_id', async () => {
    const res = await request(app)
      .put(`/api/v1/clientes/${createdClienteId}`)
      .send({
        cliente_id: 999, // Intentar cambiar el ID
        nombre: 'Hospital Actualizado'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    // El ID debe seguir siendo el original
    expect(res.body.data.cliente_id).toBe(createdClienteId);
    expect(res.body.data.cliente_id).not.toBe(999);
    expect(res.body.data.nombre).toBe('Hospital Actualizado');
  });

  test('POST /api/v1/modalidades - IDs autoincrementales para otras entidades', async () => {
    const uniqueCode = `TEST_${Date.now()}`;
    const res = await request(app)
      .post('/api/v1/modalidades')
      .send({
        modalidad_id: 0,
        codigo: uniqueCode,
        descripcion: 'Modalidad de prueba'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.modalidad_id).not.toBe(0);
    expect(res.body.data.modalidad_id).toBeGreaterThan(0);
  });

  // Limpiar datos de prueba
  afterAll(async () => {
    if (createdClienteId) {
      await request(app).delete(`/api/v1/clientes/${createdClienteId}`);
    }
  });
});

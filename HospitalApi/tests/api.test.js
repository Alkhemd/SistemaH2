const request = require('supertest');
const app = require('../src/server');

jest.setTimeout(20000);

describe('API Sistema H - Endpoints básicos', () => {
  test('GET /health debe responder OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('database', 'Connected');
  });

  test('GET /api/v1/clientes debe listar clientes (paginado)', async () => {
    const res = await request(app).get('/api/v1/clientes').query({ page: 1, limit: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/v1/clientes/1 debe devolver un cliente', async () => {
    const res = await request(app).get('/api/v1/clientes/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('cliente_id', 1);
  });

  test('GET /api/v1/equipos debe listar equipos', async () => {
    const res = await request(app).get('/api/v1/equipos').query({ page: 1, limit: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/v1/equipos/1 debe devolver un equipo', async () => {
    const res = await request(app).get('/api/v1/equipos/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('equipo_id', 1);
  });

  test('GET /api/v1/ordenes debe listar ordenes', async () => {
    const res = await request(app).get('/api/v1/ordenes').query({ page: 1, limit: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/v1/ordenes/1 debe devolver una orden', async () => {
    const res = await request(app).get('/api/v1/ordenes/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('orden_id', 1);
  });

  test('GET /api/v1/modalidades debe listar modalidades', async () => {
    const res = await request(app).get('/api/v1/modalidades');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/v1/partes/stock-bajo debe devolver partes', async () => {
    const res = await request(app).get('/api/v1/partes/stock-bajo');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

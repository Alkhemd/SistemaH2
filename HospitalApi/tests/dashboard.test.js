const request = require('supertest');
const app = require('../src/server');

describe('Dashboard API Tests', () => {
  test('GET /api/v1/dashboard/estadisticas - Debe retornar estadísticas', async () => {
    const res = await request(app).get('/api/v1/dashboard/estadisticas');
    
    console.log('Response status:', res.statusCode);
    console.log('Response body:', JSON.stringify(res.body, null, 2));
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('totalEquipos');
    expect(res.body.data).toHaveProperty('equiposOperativos');
    expect(res.body.data).toHaveProperty('ordenesAbiertas');
  });

  test('GET /api/v1/dashboard/actividad-reciente - Debe retornar actividad reciente', async () => {
    const res = await request(app).get('/api/v1/dashboard/actividad-reciente');
    
    console.log('Response status:', res.statusCode);
    console.log('Response body:', JSON.stringify(res.body, null, 2));
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/v1/dashboard/actividad-reciente?limit=5 - Debe respetar el límite', async () => {
    const res = await request(app).get('/api/v1/dashboard/actividad-reciente?limit=5');
    
    console.log('Response status:', res.statusCode);
    console.log('Response body:', JSON.stringify(res.body, null, 2));
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
  });

  test('GET /api/v1/dashboard/resumen - Debe retornar resumen completo', async () => {
    const res = await request(app).get('/api/v1/dashboard/resumen');
    
    console.log('Response status:', res.statusCode);
    console.log('Response body:', JSON.stringify(res.body, null, 2));
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('estadisticas');
    expect(res.body.data).toHaveProperty('actividadReciente');
  });
});

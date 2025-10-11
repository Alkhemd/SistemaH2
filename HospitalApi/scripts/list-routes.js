// Cargar el router sin iniciar el servidor
const apiRouter = require('../src/routes/api');

function listRoutesFromRouter(r, base = '') {
  const out = [];
  if (!r || !r.stack) return out;

  r.stack.forEach(layer => {
    if (layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(',');
      out.push({ path: base + layer.route.path, methods });
    } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
      // Recorrer subrouter
      const subBase = '';
      const sub = listRoutesFromRouter(layer.handle, base + subBase);
      out.push(...sub);
    }
  });

  return out;
}

const routes = listRoutesFromRouter(apiRouter);
console.log('Rutas registradas en router /api/v1:');
routes.forEach(r => console.log(`${r.methods} ${r.path}`));

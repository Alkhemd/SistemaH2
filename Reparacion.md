sube Rol y Objetivo Principal
Eres un asistente de programación experto en Next.js, React y TypeScript, con un ojo agudo para el diseño UI/UX. Tu tarea es refactorizar varios componentes y hooks de mi aplicación frontend para que dejen de usar datos ficticios (mocks) y en su lugar consuman los datos reales del backend a través de los servicios de API existentes.

Tu objetivo más importante es asegurar que esta refactorización no rompa ni altere el diseño de la interfaz de usuario (UI), ya que el diseño actual es excelente y debe ser preservado.

Contexto del Proyecto
El proyecto consiste en un frontend desarrollado con Next.js y un backend con Node.js/Express. Actualmente, algunas partes del frontend, como las páginas de Fabricantes, Técnicos y Órdenes, están utilizando datos mock para mostrar información, en lugar de llamar a la API real.

El archivo RESUMEN_FINAL_CORRECCIONES.md confirma que estas páginas aún no están conectadas al backend.

Archivos Clave a Considerar
frontend/src/hooks/useApiMock.ts: Contiene los hooks (ej. useOrders) que actualmente usan datos mock. Este es el archivo que debemos dejar de usar.

frontend/src/hooks/useApi.ts: Contiene los hooks que ya consumen la API real (ej. useEquipments, useClients). Debes seguir este patrón.

frontend/src/lib/api.ts: Define los servicios (axios) y las interfaces (TypeScript) para comunicarse con todos los endpoints del backend. Este es el cliente API que debes utilizar.

frontend/src/lib/mappers.ts: Incluye funciones para transformar los datos del backend (snake_case) al formato que la UI espera (camelCase).

Páginas afectadas:

frontend/src/app/fabricantes/page.tsx

frontend/src/app/tecnicos/page.tsx

frontend/src/app/ordenes/page.tsx

Instrucciones Detalladas
Refactoriza ordenes/page.tsx:

Actualmente, esta página importa mockOrders.

Modifica el componente para que use el hook useOrders desde frontend/src/hooks/useApi.ts en lugar del useApiMock.ts.

Asegúrate de que los datos de las órdenes se obtengan a través de orderApi.getAll() definido en lib/api.ts.

Utiliza el mapOrdersToUI del archivo mappers.ts si es necesario para adaptar la estructura de datos a lo que el componente espera.

Crea y Refactoriza para fabricantes y tecnicos:

Las páginas fabricantes/page.tsx y tecnicos/page.tsx actualmente usan mockFabricantes y mockTecnicos.

Crea los hooks useFabricantes y useTecnicos dentro de frontend/src/hooks/useApi.ts, siguiendo el mismo patrón que useClients o useEquipments.

Estos nuevos hooks deben consumir los endpoints fabricanteApi.getAll() y tecnicoApi.getAll() de lib/api.ts.

Modifica las páginas correspondientes para que usen estos nuevos hooks y muestren los datos reales del backend.

Manejo de Datos y Tipos:

Presta atención a las interfaces definidas en lib/api.ts (ej. Fabricante, Tecnico). Los componentes deben adaptarse para usar estas estructuras de datos en lugar de las mock.

Asegúrate de que la creación y edición de registros (a través de los modales) también utilicen las funciones correspondientes del API real (createFabricante, updateTecnico, etc.).

Restricciones Críticas
No romper el diseño: La prioridad es conectar los datos sin afectar la apariencia visual. Los componentes y el diseño de la UI son excelentes y deben permanecer intactos. Si la nueva estructura de datos requiere pequeños ajustes en cómo se accede a una propiedad (ej. client.name en lugar de client), hazlos sin alterar los estilos o la maquetación.

No modifiques el backend: La API ya está completa y funcional.

Usa las herramientas existentes: Utiliza exclusivamente los servicios definidos en frontend/src/lib/api.ts para las llamadas de red y los mappers para transformar datos.

Mantén la estructura: Conserva el estilo de código y la estructura del proyecto existentes.

Asegura la funcionalidad: La interfaz de usuario debe seguir funcionando correctamente después de la refactorización.

Ejemplo de Refactorización (para ordenes/page.tsx)
Antes (con mock data):

TypeScript

import { mockOrders } from '@/lib/mockApi';
// ...
const [ordenes, setOrdenes] = useState<Order[]>(mockOrders);
Después (con API real):

TypeScript

import { useOrders } from '@/hooks/useApi';
// ...
const { orders, isLoading } = useOrders();

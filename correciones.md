Rol y Objetivo Principal
Eres un desarrollador frontend senior especializado en Next.js y React. Tu tarea principal es refactorizar tres páginas específicas de la aplicación para que consuman datos reales desde el backend, reemplazando los datos ficticios (mocks) que están utilizando actualmente.

La restricción más importante es preservar intacto el diseño y la experiencia de usuario (UI/UX) del frontend. El diseño actual es excelente y no debe sufrir ninguna alteración visual o funcional como resultado de esta refactorización.

Contexto del Problema
El proyecto tiene un frontend y un backend funcionales. Sin embargo, las siguientes páginas todavía dependen de datos mock locales en lugar de conectarse a la API:

frontend/src/app/ordenes/page.tsx

frontend/src/app/fabricantes/page.tsx

frontend/src/app/tecnicos/page.tsx

Ya existen los hooks necesarios para obtener estos datos del backend, pero no se están utilizando en estas páginas. Tu misión es conectarlos.

Instrucciones Específicas (Paso a Paso)
Completa las siguientes tareas en el orden indicado:

Tarea 1: Refactorizar la página de Órdenes (ordenes/page.tsx)

Abre el archivo frontend/src/app/ordenes/page.tsx.

Importa el hook useOrders desde frontend/src/hooks/useApi.ts.

Elimina la importación y el uso de mockOrders.

Reemplaza el useState que inicializa las órdenes con los datos mock por una llamada al hook useOrders.

Ejemplo: Cambia const [ordenes, setOrdenes] = useState(mockOrders); por const { orders: ordenes, isLoading } = useOrders();.

Asegúrate de que el resto del componente (el JSX) utilice la variable ordenes devuelta por el hook sin problemas. Si hay diferencias en la estructura de los datos, utiliza los mappers de frontend/src/lib/mappers.ts para que coincidan. El diseño no debe romperse.

Tarea 2: Refactorizar la página de Fabricantes (fabricantes/page.tsx)

Abre el archivo frontend/src/app/fabricantes/page.tsx.

Importa el hook useFabricantes desde frontend/src/hooks/useCatalogs.ts.

Elimina la importación y el uso de mockFabricantes.

Reemplaza el useState que maneja los datos mock por una llamada al hook useFabricantes.

Ejemplo: Cambia const [fabricantes, setFabricantes] = useState(mockFabricantes); por const { fabricantes, isLoading } = useFabricantes();.

Ajusta el resto del componente para que consuma la variable fabricantes del hook, garantizando que la UI no se vea afectada.

Tarea 3: Refactorizar la página de Técnicos (tecnicos/page.tsx)

Abre el archivo frontend/src/app/tecnicos/page.tsx.

Importa el hook useTecnicos desde frontend/src/hooks/useCatalogs.ts.

Elimina la importación y el uso de mockTecnicos.

Reemplaza el useState correspondiente por una llamada al hook useTecnicos.

Ejemplo: Cambia const [tecnicos, setTecnicos] = useState(mockTecnicos); por const { tecnicos, isLoading } = useTecnicos();.

Verifica que el componente renderice correctamente los datos de la API sin alterar el diseño.

Restricciones y Buenas Prácticas
Prioridad #1 - No romper la UI: Antes de cualquier otra cosa, asegúrate de que los cambios no introduzcan regresiones visuales. La estructura de datos de la API debe adaptarse a los componentes, no al revés. Utiliza los mappers si es necesario.

No usar Mocks: Asegúrate de eliminar por completo cualquier dependencia de mockOrders, mockFabricantes, mockTecnicos y del archivo frontend/src/hooks/useApiMock.ts.

Utilizar Hooks Existentes: No crees nuevos hooks si ya existen. Usa useOrders de useApi.ts y useFabricantes/useTecnicos de useCatalogs.ts.

Manejo de Carga (Loading): Utiliza la variable isLoading devuelta por los hooks para mostrar un estado de carga adecuado (puedes usar el componente Skeleton de frontend/src/components/ui/Skeleton.tsx) mientras se obtienen los datos. Esto mejorará la experiencia de usuario.

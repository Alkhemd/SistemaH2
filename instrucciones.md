Rol: Eres un asistente experto en desarrollo backend con Node.js, Express y Sequelize, especializado en la gestión de bases de datos SQLite.

Contexto del Proyecto:
Estoy trabajando en un proyecto (SistemaH) cuyo backend está en la carpeta HospitalApi/. Este backend utiliza Sequelize como ORM para definir los modelos de la base de datos y se conecta a una base de datos SQLite ubicada en HospitalApi/database/sistema_h.db.

Los modelos de datos están definidos en la carpeta HospitalApi/src/models/, con archivos como Equipo.js, Cliente.js, Tecnico.js, etc. La configuración de la conexión de Sequelize se encuentra en HospitalApi/src/config/database.js. El proyecto ya cuenta con un sistema de rutas CRUD que consume estos modelos.

Objetivo Principal:
Necesito que generes un script de Node.js robusto y reutilizable que funcione como un sistema de migración de base de datos no destructivo. El propósito de este script es actualizar el esquema de la base de datos SQLite existente para que coincida con las definiciones actuales de los modelos de Sequelize, pero sin borrar los datos que ya existen en las tablas.

Requisitos Detallados del Script:

Conexión a la Base de Datos: El script debe importar la configuración de sequelize desde database.js para conectarse a la base de datos.

Inspección de Modelos y Base de Datos:

Debe importar todos los modelos definidos en HospitalApi/src/models/index.js.

Para cada modelo, debe inspeccionar su definición (nombre de tabla, columnas, tipos de datos).

Debe conectarse a la base de datos SQLite y, para cada tabla, obtener su esquema actual (usando PRAGMA table_info(tableName);).

Lógica de Comparación y Migración:

El script debe comparar las columnas definidas en cada modelo de Sequelize con las columnas existentes en la tabla correspondiente de la base de datos.

Si una columna existe en el modelo pero no en la tabla de la base de datos, el script debe generar y ejecutar una sentencia ALTER TABLE tableName ADD COLUMN columnName type;.

El script no debe eliminar ni modificar columnas existentes para evitar la pérdida de datos. Solo debe agregar las que faltan.

Ejecución Segura:

Debe manejar errores de forma adecuada. Por ejemplo, si una columna ya existe (porque la migración ya se corrió), debe registrar un aviso en la consola y continuar, en lugar de fallar.

Debe mostrar en la consola un registro claro de las acciones que está realizando (ej. "Analizando tabla equipo...", "Agregando columna ultima_calibracion a la tabla equipo.").

Ejemplo de Funcionamiento Esperado:
Si yo modifico el modelo HospitalApi/src/models/Equipo.js y le agrego los siguientes campos nuevos:

JavaScript

// En Equipo.js
...
  ultima_calibracion: {
    type: DataTypes.DATEONLY
  },
  proxima_calibracion: {
    type: DataTypes.DATEONLY
  },
...
Al ejecutar el script de migración, la salida en la consola debería ser similar a esto:

🚀 Iniciando migración de base de datos...
✅ Conexión a la base de datos establecida.
- Analizando tabla 'equipo'...
  -> Agregando columna 'ultima_calibracion' a la tabla 'equipo'.
  -> Agregando columna 'proxima_calibracion' a la tabla 'equipo'.
- Analizando tabla 'cliente'... (Sin cambios)
... (y así con todas las demás tablas)
✅ Migración completada exitosamente.
Formato de Entrega:
Proporcióname el código completo del script de Node.js que cumpla con todos estos requisitos. El script debe estar listo para ser guardado como un archivo (por ejemplo, run-migrations.js) y ejecutado desde la terminal con node run-migrations.js.
# 📚 Sistema de Migraciones de Base de Datos

## 🎯 Descripción

Este sistema proporciona scripts para gestionar migraciones **no destructivas** de la base de datos SQLite. Los scripts actualizan el esquema de la base de datos para que coincida con las definiciones de los modelos de Sequelize, **sin eliminar datos existentes**.

## 📁 Archivos del Sistema

- **`run-migrations.js`**: Script principal de migración que agrega columnas faltantes
- **`verify-schema.js`**: Script de verificación que compara el esquema actual con los modelos
- **`package.json`**: Incluye comandos npm para ejecutar los scripts fácilmente

## 🚀 Uso Rápido

### Verificar el Estado del Esquema

Antes de ejecutar una migración, puedes verificar qué diferencias existen:

```bash
# Opción 1: Usando npm
npm run verify-schema

# Opción 2: Usando node directamente
node verify-schema.js
```

**Salida esperada:**
```
🔍 Verificando esquema de base de datos...

✅ Conexión establecida.

📋 Tabla: cliente
  ✅ Esquema sincronizado (10 columnas)

📋 Tabla: equipo
  ⚠️  Columnas faltantes en DB: ultima_calibracion, proxima_calibracion

═══════════════════════════════════════════════════════
⚠️  Se encontraron 2 diferencias
💡 Ejecuta "node run-migrations.js" para sincronizar
═══════════════════════════════════════════════════════
```

### Ejecutar la Migración

Una vez verificado, ejecuta la migración:

```bash
# Opción 1: Usando npm
npm run migrate

# Opción 2: Usando node directamente
node run-migrations.js
```

**Salida esperada:**
```
🚀 Iniciando migración de base de datos...
✅ Conexión a la base de datos establecida.
- Analizando tabla 'cliente'...
  (Sin cambios)
- Analizando tabla 'equipo'...
  -> Agregando columna 'ultima_calibracion' a la tabla 'equipo'.
  -> Agregando columna 'proxima_calibracion' a la tabla 'equipo'.
- Analizando tabla 'tecnico'...
  (Sin cambios)
✅ Migración completada exitosamente.

📊 Resumen:
   - Tablas analizadas: 13
   - Columnas agregadas: 2

🔌 Conexión a la base de datos cerrada.
```

## 📝 Flujo de Trabajo Típico

### Escenario: Agregar Nuevos Campos a un Modelo

**Paso 1:** Modifica el modelo (por ejemplo, `Equipo.js`)

```javascript
// HospitalApi/src/models/Equipo.js
const Equipo = sequelize.define('equipo', {
  // ... campos existentes ...
  
  // Nuevos campos agregados
  ultima_calibracion: {
    type: DataTypes.DATEONLY
  },
  proxima_calibracion: {
    type: DataTypes.DATEONLY
  }
});
```

**Paso 2:** Verifica las diferencias

```bash
npm run verify-schema
```

**Paso 3:** Ejecuta la migración

```bash
npm run migrate
```

**Paso 4:** Verifica que todo esté sincronizado

```bash
npm run verify-schema
```

Deberías ver: `✅ Todos los esquemas están sincronizados`

## 🔧 Características Técnicas

### ✅ Lo que el Script HACE

- ✅ **Agrega columnas nuevas** que existen en los modelos pero no en la base de datos
- ✅ **Crea tablas nuevas** si no existen en la base de datos
- ✅ **Preserva todos los datos** existentes
- ✅ **Maneja errores** de forma segura (continúa si una columna ya existe)
- ✅ **Muestra progreso** detallado en la consola
- ✅ **Es idempotente** (puedes ejecutarlo múltiples veces sin problemas)

### ❌ Lo que el Script NO HACE

- ❌ **NO elimina** columnas existentes
- ❌ **NO modifica** tipos de datos de columnas existentes
- ❌ **NO elimina** tablas
- ❌ **NO borra** datos
- ❌ **NO modifica** restricciones existentes (foreign keys, unique, etc.)

### 🗺️ Mapeo de Tipos de Datos

El script convierte automáticamente los tipos de Sequelize a tipos de SQLite:

| Tipo Sequelize | Tipo SQLite |
|----------------|-------------|
| INTEGER | INTEGER |
| FLOAT, DOUBLE, REAL | REAL |
| STRING, TEXT | TEXT |
| DATE, DATEONLY | TEXT |
| BOOLEAN | INTEGER |
| BLOB | BLOB |

### 🛡️ Manejo de Restricciones

- **NOT NULL**: Solo se aplica si la columna tiene un valor DEFAULT (requerimiento de SQLite)
- **UNIQUE**: Se preserva de la definición del modelo
- **DEFAULT**: Se aplica automáticamente si está definido en el modelo
- **PRIMARY KEY**: No se puede agregar a tablas existentes (solo en creación)
- **FOREIGN KEY**: No se puede agregar a tablas existentes (solo en creación)

## ⚠️ Limitaciones de SQLite

SQLite tiene restricciones importantes en `ALTER TABLE`:

1. **No se pueden eliminar columnas** (hasta SQLite 3.35.0)
2. **No se pueden modificar columnas** existentes
3. **No se pueden agregar** PRIMARY KEY o FOREIGN KEY a tablas existentes
4. **Las nuevas columnas** deben ser NULL o tener un DEFAULT

Para operaciones más complejas, necesitarás:
- Crear una nueva tabla con la estructura deseada
- Copiar los datos
- Eliminar la tabla antigua
- Renombrar la nueva tabla

## 🔍 Solución de Problemas

### Error: "Cannot find module"

**Causa:** No estás en el directorio correcto

**Solución:**
```bash
cd HospitalApi
npm run migrate
```

### Error: "SQLITE_ERROR: duplicate column name"

**Causa:** La columna ya existe en la base de datos

**Solución:** Esto es normal. El script detecta este error y continúa. Si ves este mensaje, significa que la columna ya fue agregada anteriormente.

### Error: "SQLITE_ERROR: table X already exists"

**Causa:** La tabla ya existe

**Solución:** Esto es normal si ejecutas el script múltiples veces. El script omitirá la creación de tablas existentes.

### Error de conexión a la base de datos

**Causa:** El archivo de base de datos no existe o no tiene permisos

**Solución:**
1. Verifica que `HospitalApi/database/sistema_h.db` existe
2. Verifica los permisos de escritura del archivo
3. Si no existe, ejecuta primero: `npm run init-db`

## 📌 Mejores Prácticas

### 1. Siempre Verifica Antes de Migrar

```bash
npm run verify-schema
```

Esto te mostrará exactamente qué cambios se aplicarán.

### 2. Haz Backup en Producción

Antes de ejecutar migraciones en producción:

```bash
# En Windows
copy HospitalApi\database\sistema_h.db HospitalApi\database\sistema_h.db.backup

# En Linux/Mac
cp HospitalApi/database/sistema_h.db HospitalApi/database/sistema_h.db.backup
```

### 3. Prueba en Desarrollo Primero

Siempre prueba las migraciones en tu entorno de desarrollo antes de aplicarlas en producción.

### 4. Documenta los Cambios

Mantén un registro de los cambios que haces a los modelos:

```javascript
// Equipo.js
// CHANGELOG:
// 2024-10-13: Agregados campos ultima_calibracion y proxima_calibracion
```

### 5. Ejecuta Migraciones Después de Pull

Si trabajas en equipo, ejecuta las migraciones después de hacer `git pull`:

```bash
git pull
npm run migrate
```

## 🔄 Integración con Git

Agrega estos archivos a tu repositorio:

```bash
git add HospitalApi/run-migrations.js
git add HospitalApi/verify-schema.js
git add HospitalApi/MIGRACIONES.md
git add HospitalApi/package.json
git commit -m "feat: agregar sistema de migraciones no destructivas"
```

**NO agregues** el archivo de base de datos a Git:

```bash
# .gitignore
HospitalApi/database/*.db
HospitalApi/database/*.db-*
```

## 📚 Recursos Adicionales

- [Documentación de Sequelize](https://sequelize.org/docs/v6/)
- [Documentación de SQLite ALTER TABLE](https://www.sqlite.org/lang_altertable.html)
- [Tipos de datos en SQLite](https://www.sqlite.org/datatype3.html)

## 🆘 Soporte

Si encuentras problemas:

1. Revisa la sección de **Solución de Problemas**
2. Verifica los logs de error en la consola
3. Asegúrate de que tu versión de Node.js sea >= 16.0.0
4. Verifica que todas las dependencias estén instaladas: `npm install`

---

**Nota Final:** Este sistema de migraciones es ideal para desarrollo y cambios incrementales. Para operaciones complejas en producción, considera usar herramientas más avanzadas como `sequelize-cli` o `umzug`.

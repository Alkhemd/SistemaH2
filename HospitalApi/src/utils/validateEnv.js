/**
 * Validación de variables de entorno
 * Asegura que todas las variables necesarias estén configuradas
 */

function validateEnv() {
  const requiredEnvVars = [];
  
  const optionalEnvVars = {
    PORT: '3000',
    NODE_ENV: 'development',
    SQL_LOGGING: 'false'
  };

  // Verificar variables requeridas
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Error: Faltan las siguientes variables de entorno requeridas:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\n💡 Crea un archivo .env basado en .env.example');
    process.exit(1);
  }

  // Establecer valores por defecto para variables opcionales
  Object.entries(optionalEnvVars).forEach(([key, defaultValue]) => {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
      console.log(`ℹ️  Variable ${key} no definida, usando valor por defecto: ${defaultValue}`);
    }
  });

  // Validar NODE_ENV
  const validEnvironments = ['development', 'production', 'test'];
  if (!validEnvironments.includes(process.env.NODE_ENV)) {
    console.warn(`⚠️  NODE_ENV="${process.env.NODE_ENV}" no es válido. Valores permitidos: ${validEnvironments.join(', ')}`);
    process.env.NODE_ENV = 'development';
  }

  console.log('✅ Variables de entorno validadas correctamente');
  console.log(`   Ambiente: ${process.env.NODE_ENV}`);
  console.log(`   Puerto: ${process.env.PORT}`);
}

module.exports = { validateEnv };

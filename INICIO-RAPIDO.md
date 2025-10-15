# 🚀 Inicio Rápido - Sistema de Gestión Hospitalaria

## Para Colaboradores del Proyecto

Si eres parte del equipo y quieres ejecutar el proyecto rápidamente:

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/TU_USUARIO/SistemaH.git
cd SistemaH/frontend
```

### 2️⃣ Instalar Dependencias

```bash
npm install
```

### 3️⃣ Configurar Credenciales (Automático)

**Windows:**
```bash
.\setup-env.ps1
```

**Mac/Linux:**
```bash
chmod +x setup-env.sh
./setup-env.sh
```

### 4️⃣ Ejecutar el Proyecto

```bash
npm run dev
```

### 5️⃣ Abrir en el Navegador

```
http://localhost:3001
```

---

## ✅ ¡Listo!

El proyecto debería estar funcionando. Si tienes problemas, revisa el [README.md](README.md) completo.

---

## 🔑 Credenciales

Las credenciales de Supabase están incluidas en el script `setup-env.ps1` / `setup-env.sh`.

**Todos los colaboradores comparten la misma base de datos de Supabase.**

⚠️ **Importante**: No modifiques datos de producción sin autorización.

---

## 📝 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Inicia servidor en http://localhost:3001

# Producción
npm run build        # Construye la app
npm start            # Inicia servidor de producción

# Linting
npm run lint         # Revisa errores de código
```

---

## 🐛 Problemas Comunes

### "Faltan las variables de entorno"
- Ejecuta el script `setup-env.ps1` o `setup-env.sh`
- O crea manualmente `.env.local` con las credenciales

### "Failed to fetch"
- Verifica tu conexión a internet
- Las credenciales de Supabase podrían haber cambiado
- Contacta al administrador del proyecto

### "Port 3001 already in use"
- Cierra otros procesos en el puerto 3001
- O cambia el puerto en `package.json`

---

**¿Dudas? Contacta al equipo.** 👥

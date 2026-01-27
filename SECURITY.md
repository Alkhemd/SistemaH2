# 🔒 Arquitectura de Seguridad - Sistema H2

## Principio Fundamental

**El frontend NUNCA debe tener acceso directo a servicios de backend como Supabase, bases de datos, o servicios de almacenamiento.**

## Arquitectura Segura

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│             │         │              │         │            │
│   Frontend  │────────▶│   Backend    │────────▶│  Supabase  │
│  (Next.js)  │  HTTP   │  (Express)   │  SDK    │            │
│             │         │              │         │            │
└─────────────┘         └──────────────┘         └────────────┘
```

### ✅ Correcto (Implementación Actual)

- Frontend usa `fetch()` para llamar al backend API
- Backend maneja todas las credenciales en variables de entorno
- Credenciales nunca se exponen en el código del frontend

### ❌ Incorrecto (Lo que se corrigió)

- ~~Frontend accede directamente a Supabase con `createClient()`~~
- ~~Credenciales en `NEXT_PUBLIC_*` variables (expuestas al navegador)~~
- ~~Archivo `supabase.ts` en `frontend/src/lib/`~~

## Archivos de Configuración

### Backend (`/backend/.env`)
```env
# ✅ SEGURO - Solo accesible desde servidor
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_ANON_KEY=...
```

### Frontend (`/frontend/.env.local`)
```env
# ✅ SEGURO - Solo URL del backend
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# ❌ NUNCA hacer esto:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Flujo de Carga de Imágenes

### Antes (Inseguro) ❌
```typescript
// frontend/src/lib/storage.ts
import { supabase } from '@/lib/supabase'; // ❌ Acceso directo

export const uploadImage = async (file: File) => {
    const { data } = await supabase.storage // ❌ Credenciales en frontend
        .from('bucket')
        .upload(file);
};
```

### Ahora (Seguro) ✅
```typescript
// frontend/src/lib/storage.ts
export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/storage/upload`, { // ✅ A través del backend
        method: 'POST',
        body: formData,
    });
    
    return response.json();
};
```

```javascript
// backend/src/routes/storage.js
const { supabase } = require('../config/supabase'); // ✅ Solo en backend

router.post('/upload', upload.single('file'), async (req, res) => {
    const { error } = await supabase.storage // ✅ Credenciales seguras
        .from('bucket')
        .upload(fileName, req.file.buffer);
    
    res.json({ url: publicUrl });
});
```

## Reglas de Oro 🏆

1. **Frontend es público** - Todo el código JavaScript del frontend es visible en el navegador
2. **Backend es privado** - Solo el backend puede tener credenciales secretas
3. **API Gateway Pattern** - El backend actúa como gateway entre frontend y servicios externos
4. **Never Trust Client** - Siempre valida y autentica en el backend

## Endpoints de Storage Seguros

### Upload Image
```bash
POST /api/storage/upload
Content-Type: multipart/form-data

FormData:
  - file: File
  - bucket: string (optional, default: 'imagenes_equipo')

Response:
{
  "success": true,
  "url": "https://...supabase.co/storage/.../file.jpg",
  "fileName": "random_timestamp.jpg"
}
```

### Delete Image
```bash
DELETE /api/storage/delete
Content-Type: application/json

Body:
{
  "imageUrl": "https://...supabase.co/storage/.../file.jpg",
  "bucket": "imagenes_equipo"
}

Response:
{
  "success": true
}
```

## Verificación de Seguridad

### Checklist ✓

- [ ] No hay archivos `supabase.ts` o `prisma.ts` en `frontend/src/`
- [ ] No hay variables `NEXT_PUBLIC_SUPABASE_*` en `.env.local`
- [ ] Todas las llamadas usan `fetch()` hacia `/api/*`
- [ ] El archivo `.env` del backend NO está en git (`.gitignore`)
- [ ] Las credenciales solo existen en `backend/.env`

## Para Nuevos Desarrolladores

**Al agregar una nueva funcionalidad:**

1. ¿Necesitas acceder a Supabase? → Crea un endpoint en `/backend/src/routes/`
2. ¿Necesitas datos privados? → Backend API, nunca en frontend
3. ¿Credenciales de terceros? → Backend `.env`, nunca en frontend

**Pregunta siempre antes de exponer credenciales al frontend.**

---

**Fecha de implementación:** 2026-01-27  
**Responsable:** Uziel + Asistente AI  
**Razón:** Corrección de vulnerabilidad de seguridad en sistema de carga de imágenes

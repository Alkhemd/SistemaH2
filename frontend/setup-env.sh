#!/bin/bash
# Script para crear el archivo .env.local
# Ejecuta este script con: bash setup-env.sh

echo "🔧 Configurando variables de entorno..."

ENV_CONTENT="NEXT_PUBLIC_SUPABASE_URL=https://imratsgicognfygvbwcq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltcmF0c2dpY29nbmZ5Z3Zid2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODUzMDcsImV4cCI6MjA3NTk2MTMwN30.oCd_20OrZ_C2R8Xaw4bejYL6HO6ZLhh8OhPl-0fq9so"

ENV_PATH=".env.local"

if [ -f "$ENV_PATH" ]; then
    echo "⚠️  El archivo .env.local ya existe."
    read -p "¿Deseas sobrescribirlo? (s/n): " overwrite
    if [ "$overwrite" != "s" ]; then
        echo "❌ Operación cancelada."
        exit 1
    fi
fi

echo "$ENV_CONTENT" > "$ENV_PATH"

echo "✅ Archivo .env.local creado exitosamente!"
echo ""
echo "📝 Contenido:"
cat "$ENV_PATH"
echo ""
echo "🚀 Ahora puedes ejecutar: npm run dev"

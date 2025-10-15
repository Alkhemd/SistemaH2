# Script para crear el archivo .env.local
# Ejecuta este script con: .\setup-env.ps1

Write-Host "Configurando variables de entorno..." -ForegroundColor Cyan

$envContent = @"
NEXT_PUBLIC_SUPABASE_URL=https://imratsgicognfygvbwcq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltcmF0c2dpY29nbmZ5Z3Zid2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODUzMDcsImV4cCI6MjA3NTk2MTMwN30.oCd_20OrZ_C2R8Xaw4bejYL6HO6ZLhh8OhPl-0fq9so
"@

$envPath = Join-Path $PSScriptRoot ".env.local"

if (Test-Path $envPath) {
    Write-Host "El archivo .env.local ya existe." -ForegroundColor Yellow
    $overwrite = Read-Host "Deseas sobrescribirlo? (s/n)"
    if ($overwrite -ne "s") {
        Write-Host "Operacion cancelada." -ForegroundColor Red
        exit
    }
}

$envContent | Out-File -FilePath $envPath -Encoding UTF8 -NoNewline

Write-Host "Archivo .env.local creado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Contenido:" -ForegroundColor Cyan
Write-Host $envContent
Write-Host ""
Write-Host "Ahora puedes ejecutar: npm run dev" -ForegroundColor Green

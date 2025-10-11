@echo off
echo ========================================
echo   Sistema H - Inicio Rapido
echo ========================================
echo.

echo [1/3] Iniciando Backend API...
cd HospitalApi
start cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo [2/3] Esperando que el backend este listo...
timeout /t 5 /nobreak >nul

echo [3/3] Iniciando Frontend...
cd ..\frontend
start cmd /k "npm run dev"

echo.
echo ========================================
echo   Servidores Iniciados!
echo ========================================
echo.
echo Backend API: http://localhost:3000
echo Swagger Docs: http://localhost:3000/api-docs
echo Frontend App: http://localhost:3001
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul

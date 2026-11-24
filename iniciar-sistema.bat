@echo off
title Sistema de Farmacias - Gestor de Inicio
echo ============================================================
echo      SISTEMA DE FARMACIAS - SEMINARIO DE PROGRAMACION
echo ============================================================
echo.
echo Seleccione una opcion:
echo [1] Iniciar Servidor Backend (Node.js + Express en Puerto 4000)
echo [2] Iniciar Aplicacion Frontend (Next.js en Puerto 3000)
echo [3] Instalar dependencias completas (Backend + Frontend)
echo [4] Salir
echo.
set /p opcion="Ingrese opcion (1-4): "

if "%opcion%"=="1" goto backend
if "%opcion%"=="2" goto frontend
if "%opcion%"=="3" goto install_all
if "%opcion%"=="4" goto exit

:backend
cls
echo Iniciando Backend en http://localhost:4000 ...
cd /d "C:\Users\areli\farmacia-system\farmacia-backend"
npm run dev
pause
goto exit

:frontend
cls
echo Iniciando Frontend en http://localhost:3000 ...
cd /d "C:\Users\areli\farmacia-system\farmacia-frontend"
npm run dev
pause
goto exit

:install_all
cls
echo [1/2] Instalando dependencias de Backend...
cd /d "C:\Users\areli\farmacia-system\farmacia-backend"
call npm install
echo.
echo [2/2] Instalando dependencias de Frontend...
cd /d "C:\Users\areli\farmacia-system\farmacia-frontend"
call npm install
echo.
echo ============================================================
echo Instalacion de paquetes completada con exito!
echo ============================================================
pause
goto exit

:exit
exit

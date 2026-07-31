@echo off
echo =============================================
echo    Guedes WebBuilder - Iniciando...
echo =============================================
echo.
echo Iniciando servidor local...
echo Abra http://localhost:8080 no seu navegador
echo.
echo Pressione Ctrl+C para parar o servidor
echo.
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
pause

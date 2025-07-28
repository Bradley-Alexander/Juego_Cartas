@echo off
echo 🔮 Iniciando Oráculo de las Cartas...
echo ✨ Verificando Python...

python --version
if errorlevel 1 (
    echo ❌ Python no está instalado o no está en el PATH
    pause
    exit /b 1
)

echo ✅ Python encontrado
echo 🚀 Iniciando servidor Flask...

cd /d "%~dp0"
python app.py

pause

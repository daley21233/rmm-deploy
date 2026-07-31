@echo off
title RMM Agent Installer
echo ========================================
echo     RMM Agent One-Click Installer
echo ========================================
echo.

:: Check if Python is installed
echo 🔍 Checking for Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed!
    echo.
    echo 📥 Please install Python from: https://python.org
    echo    ⚠️  IMPORTANT: Check "Add Python to PATH" during installation
    echo.
    pause
    exit /b 1
)

:: Get Python version
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VER=%%i
echo ✅ Python %PYTHON_VER% found!

:: Download the agent script from GitHub
echo.
echo 📥 Downloading agent...
powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/daley21233/rmm-agent-system/main/agent.py' -OutFile '%TEMP%\agent.py'"

:: Check if download was successful
if not exist "%TEMP%\agent.py" (
    echo ❌ Failed to download the agent.
    echo    Please check your internet connection.
    pause
    exit /b 1
)
echo ✅ Agent downloaded successfully!

:: Install dependencies
echo.
echo 📦 Installing dependencies...
pip install requests psutil python-dotenv

:: Run the agent with custom ID
echo.
echo 🚀 Starting RMM Agent...
echo 📍 Connecting to: https://rmm-agent-system.onrender.com/api
echo 🏷️  Agent ID: %COMPUTERNAME%
echo.
echo 💡 Agent is now running. Keep this window open!
echo    To stop the agent, close this window or press Ctrl+C.
echo ========================================
echo.

python "%TEMP%\agent.py" --server https://rmm-agent-system.onrender.com/api --agent-id %COMPUTERNAME% --interval 10

echo.
echo ✅ Agent stopped.
pause

// src/app/api/deploy/[userId]/route.ts
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    const userId = params.userId;

    // Create the custom batch file content
    const batchContent = `
@echo off
title RMM Agent Installer
echo ========================================
echo     RMM Agent Installer
echo ========================================
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install from https://python.org
    pause
    exit /b 1
)

:: Download agent with user ID
echo 📥 Downloading agent...
powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/daley21233/rmm-agent-system/main/agent.py' -OutFile '%TEMP%\\agent.py'"

:: Install dependencies
pip install requests psutil python-dotenv

:: Run agent with custom user ID
echo 🚀 Starting RMM Agent...
python "%TEMP%\\agent.py" --server https://rmm-agent-system.onrender.com/api --agent-id ${userId} --interval 10

echo ✅ Agent installed!
pause
`;

    // Return as a downloadable file
    return new NextResponse(batchContent, {
        headers: {
            'Content-Type': 'application/bat',
            'Content-Disposition': `attachment; filename="install-rmm-agent-${userId}.bat"`,
        },
    });
}
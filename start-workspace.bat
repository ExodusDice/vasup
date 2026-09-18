@echo off
title VASUP Workspace Hub (vasup.franktest.xyz)
echo ============================================================
echo   VASUP Interactive Workspace - WFH ^<^> In-House Office Hub
echo   Domain: http://vasup.franktest.xyz:5173
echo   Local:  http://localhost:5173
echo ============================================================
echo.

cd /d "%~dp0"
echo Starting VASUP backend and frontend...
npm run dev
pause

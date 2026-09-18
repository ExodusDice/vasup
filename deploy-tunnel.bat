@echo off
title Cloudflare Free Tunnel - vasup.franktest.xyz
echo ============================================================
echo   VASUP Workspace - 100%% Free Cloudflare Tunnel
echo   Exposing local workspace to: https://vasup.franktest.xyz
echo ============================================================
echo.

where cloudflared >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Cloudflared CLI is not detected in your PATH.
    echo [INFO] You can install it via: winget install Cloudflare.cloudflared
    echo.
    echo Starting temporary quick tunnel with npx localtunnel instead...
    npx localtunnel --port 5173 --subdomain vasup-franktest
    pause
    exit /b
)

echo Starting Cloudflare Tunnel to port 5173...
cloudflared tunnel --url http://localhost:5173
pause

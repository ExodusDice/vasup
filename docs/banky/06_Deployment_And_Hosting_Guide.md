# HOSTING & DEPLOYMENT GUIDE: `www.franktest.xyz/vasupbanky`
## Project Name: BankY - Mobile Virtual Bank & Payment Gateway Platform
**Target Subpath:** `https://www.franktest.xyz/vasupbanky`  
**Server Topology:** Nginx Reverse Proxy / Cloudflare / Node.js Express Container  

---

## 1. Subpath Architecture & Path Routing

To host BankY under the subpath `https://www.franktest.xyz/vasupbanky`, the application must properly prefix all asset bundles, client-side routes, and API endpoints.

```
Incoming Request: https://www.franktest.xyz/vasupbanky/
       │
       ▼
[ Cloudflare / Reverse Proxy (Nginx) ]
       │
       ├─► /vasupbanky/api/v1/* ────► Forward to BankY Core API (Port 5000)
       ├─► /vasupbanky/assets/* ────► Static Asset Cache (dist/assets/)
       └─► /vasupbanky/*        ────► Serve dist/index.html (SPA Fallback)
```

---

## 2. Frontend Configuration (`vite.config.ts`)

Update `vite.config.ts` to set the base URL for asset generation:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/vasupbanky/',
  server: {
    port: 5173,
    proxy: {
      '/vasupbanky/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/vasupbanky/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
```

---

## 3. Production Nginx Configuration

Add the following block to your Nginx virtual host configuration (`/etc/nginx/sites-available/franktest.xyz`):

```nginx
server {
    server_name www.franktest.xyz franktest.xyz;
    listen 443 ssl http2;

    ssl_certificate /etc/letsencrypt/live/franktest.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/franktest.xyz/privkey.pem;

    # BankY Subpath Application
    location /vasupbanky/ {
        alias /var/www/vasupbanky/dist/;
        try_files $uri $uri/ /vasupbanky/index.html;
        
        # Security Headers (OWASP & PDPA Hardening)
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;
    }

    # BankY Backend API Reverse Proxy
    location /vasupbanky/api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 4. Docker Deployment (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  banky-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: banky-virtual-bank
    environment:
      - NODE_ENV=production
      - PORT=5000
      - VITE_BASE_PATH=/vasupbanky/
      - BOT_API_SANDBOX_URL=https://sandbox.bot.or.th/v1
    ports:
      - "5000:5000"
    restart: always
```

---

## 5. Deployment Verification Checklist (`BR-024`, `TC-023`)
1. Run build: `npm run build`
2. Test static assets: verify all `<script src="/vasupbanky/assets/...">` links have the `/vasupbanky/` prefix.
3. Test direct deep linking: accessing `https://www.franktest.xyz/vasupbanky/scan` resolves without 404.
4. Test API routing: `POST https://www.franktest.xyz/vasupbanky/api/v1/gateway/checkout/create` succeeds.

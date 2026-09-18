# 🌐 Free Deployment Guide: `vasup.franktest.xyz`

Here are the **top 3 100% free ways** to deploy and access your VASUP Workspace from anywhere (WFH PC & In-House Corporate Notebook).

---

## 🥇 Method 1: Cloudflare Tunnel (Recommended — 100% Free & Zero Setup Cost)

Since you own the domain `franktest.xyz`, **Cloudflare Tunnels** allow you to securely expose your local WFH PC or In-House Server to `https://vasup.franktest.xyz` with **Free SSL** and **no port forwarding needed**.

### Steps:
1. **Install `cloudflared`** on your PC (run in PowerShell as Admin):
   ```powershell
   winget install Cloudflare.cloudflared
   ```
2. **Authenticate with your Cloudflare account**:
   ```powershell
   cloudflared tunnel login
   ```
3. **Create your tunnel**:
   ```powershell
   cloudflared tunnel create vasup-tunnel
   ```
4. **Route your domain (`vasup.franktest.xyz`) to the tunnel**:
   ```powershell
   cloudflared tunnel route dns vasup-tunnel vasup.franktest.xyz
   ```
5. **Run the tunnel**:
   ```powershell
   cloudflared tunnel run --url http://localhost:3001 vasup-tunnel
   ```
   *Your workspace is now live securely at `https://vasup.franktest.xyz`!*

---

## 🥈 Method 2: Render.com (Free 24/7 Cloud Hosting)

If you want your workspace running online 24/7 without keeping your PC powered on:

1. Push this folder to a GitHub/GitLab repository.
2. Go to [https://render.com](https://render.com) (Free account).
3. Click **New +** → **Web Service** → Connect your repository.
4. Render will automatically detect [`render.yaml`](file:///f:/Projects/Vasup/render.yaml):
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/index.js`
5. In **Custom Domains**, add `vasup.franktest.xyz` and follow the DNS CNAME record prompt.

---

## 🥉 Method 3: In-House Server or Docker (Free Self-Hosted)

If you have an in-house office machine or Linux home server:

```bash
docker compose up -d --build
```
Your workspace will run on port `3001` with persistent storage in `./server/data` and `./server/uploads`.

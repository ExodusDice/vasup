# 🌐 Namecheap DNS & GitHub Actions Deployment Guide

This guide walks you through connecting your **Namecheap domain** (`vasup.franktest.xyz`) and setting up automated CI/CD using **GitHub Actions**.

---

## 📋 Summary of the Architecture

```
Push code to GitHub (main branch)
       │
       ▼
GitHub Actions CI/CD (Builds & Verifies code automatically)
       │
       ▼
Deploys to Free Cloud Host (e.g. Render / Vercel / Railway)
       │
       ▲
Namecheap DNS (CNAME: vasup ➔ vasup-workspace.onrender.com)
       │
       ▼
Accessible securely at: https://vasup.franktest.xyz
```

---

## 🛠️ Step 1: Push Code to GitHub

1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "feat: initial VASUP WFH-InHouse workspace"
   ```
2. Create a new repository on GitHub (e.g. `vasup-workspace`) and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/vasup-workspace.git
   git branch -M main
   git push -u origin main
   ```
3. Whenever you push new commits to `main`, the included **GitHub Actions workflow** (`.github/workflows/deploy.yml`) will automatically trigger, build, and test your code.

---

## 🌐 Step 2: Set up Free 24/7 Cloud Host (e.g. Render)

1. Sign up at [https://render.com](https://render.com) (Free account) using your GitHub login.
2. Click **New +** → **Web Service**.
3. Select your `vasup-workspace` repository.
4. Render automatically detects the repository settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/index.js`
5. Click **Create Web Service** (Free plan).
6. Note down your default Render URL (e.g. `vasup-workspace-xxxx.onrender.com`).

---

## 🏷️ Step 3: Configure Namecheap DNS for `vasup.franktest.xyz`

1. Log into your **[Namecheap Account Dashboard](https://ap.www.namecheap.com/)**.
2. Go to **Domain List** → Click **Manage** next to `franktest.xyz`.
3. Click on the **Advanced DNS** tab at the top.
4. Under the **Host Records** section, click **Add New Record**:
   - **Type**: `CNAME Record`
   - **Host**: `vasup`
   - **Value / Target**: `vasup-workspace-xxxx.onrender.com.` *(replace with your host URL from Step 2)*
   - **TTL**: `Automatic` (or `1 min`)
5. Click the green checkmark (✔) to save.

---

## 🔒 Step 4: Add Custom Domain in Render

1. In your Render service dashboard, navigate to **Settings** → **Custom Domains**.
2. Click **Add Custom Domain** and enter:
   ```
   vasup.franktest.xyz
   ```
3. Render will verify the Namecheap CNAME record and automatically issue a **Free SSL Certificate (HTTPS)**!

---

## 🚀 Step 5: Automated GitHub Actions Deploy Hook (Optional)

To have GitHub Actions trigger a live redeploy on Render every time you push:

1. In Render, go to **Settings** → **Deploy Hook** → Copy the URL.
2. In GitHub, go to your repository **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:
   - **Name**: `RENDER_DEPLOY_HOOK_URL`
   - **Value**: *(Paste your Render Deploy Hook URL)*
3. Your `.github/workflows/deploy.yml` will automatically trigger a fresh deployment on every commit to `main`!

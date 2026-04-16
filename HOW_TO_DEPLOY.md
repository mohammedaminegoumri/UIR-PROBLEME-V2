# 🚀 Deployment Guide — UIR PROBLEMES V2

## What was changed
- ForumPage now uses the real backend API + real-time sockets (was localStorage-only)
- Server now stores SQLite in a persistent volume on Railway
- Added health check endpoint `/api/health`
- Added `railway.json` and `nixpacks.toml` for Railway deployment
- Added `vercel.json` for Vercel frontend deployment

---

## STEP 1 — Push this updated code to GitHub

```bash
cd /path/to/your/project
git add .
git commit -m "fix: real-time chat & forum, deploy config"
git push origin main
```

---

## STEP 2 — Deploy the Backend to Railway (FREE)

1. Go to https://railway.app and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `UIR-PROBLEMES-V2` repo
4. Railway will auto-detect the config and deploy the server

### Add a Persistent Volume (so data survives restarts):
1. In your Railway project → click your service → **"Volumes"**
2. Add volume, mount path: `/data`
3. Set environment variable: `RAILWAY_VOLUME_MOUNT_PATH=/data`

### Get your backend URL:
- Go to your Railway service → **"Settings"** → **"Networking"** → **"Generate Domain"**
- Your URL will look like: `https://uir-problemes-v2.up.railway.app`

---

## STEP 3 — Deploy the Frontend to Vercel (FREE)

1. Go to https://vercel.com and sign in with GitHub
2. Click **"New Project"** → import `UIR-PROBLEMES-V2`
3. Set the **Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: your Railway URL from Step 2 (e.g. `https://uir-problemes-v2.up.railway.app`)
4. Click **Deploy**

Your app will be live at: `https://uir-problemes-v2.vercel.app`

---

## STEP 4 — Test it

1. Open the app in two different browser tabs
2. Go to **Chat** → create a room → type a message → it should appear instantly in the other tab ✅
3. Go to **Forum** → create a thread → it should appear instantly in the other tab ✅

---

## Summary

| Service | URL | Cost |
|---|---|---|
| Backend (Railway) | `https://your-app.up.railway.app` | Free (500 hrs/month) |
| Frontend (Vercel) | `https://your-app.vercel.app` | Free |
| Database (SQLite) | On Railway volume | Free |

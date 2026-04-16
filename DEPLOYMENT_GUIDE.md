# Production Deployment Guide

## Overview

UIR PROBLEMES consists of two parts that need to be deployed:
1. **Backend Server** (Node.js/Express with Socket.IO)
2. **Frontend Client** (Static React files)

---

## Option 1: Deploy to Render.com (Recommended - Free Tier Available)

### Deploy Backend Server

1. **Create a new Web Service on Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the service:**
   - **Name:** `uir-problemes-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server/server.js`
   - **Plan:** Free (or paid for better performance)

3. **Add Environment Variables:**
   - `PORT` → `3001` (or Render's default)

4. **Note your backend URL:**
   - Example: `https://uir-problemes-backend.onrender.com`

### Deploy Frontend Client

1. **Create a new Static Site on Render**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure the site:**
   - **Name:** `uir-problemes`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

3. **Add Environment Variable:**
   - `VITE_API_URL` → Your backend URL from above
   - Example: `https://uir-problemes-backend.onrender.com`

4. **Deploy!**
   - Your site will be available at: `https://uir-problemes.onrender.com`

---

## Option 2: Deploy to Vercel (Frontend) + Railway (Backend)

### Deploy Backend to Railway

1. **Go to https://railway.app**
2. **Create a new project**
3. **Deploy from GitHub**
4. **Configure:**
   - Root directory: `/`
   - Start command: `node server/server.js`
5. **Add custom domain or note the Railway URL**

### Deploy Frontend to Vercel

1. **Go to https://vercel.com**
2. **Import your GitHub repository**
3. **Configure:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Add Environment Variable:**
   - `VITE_API_URL` → Your Railway backend URL
5. **Deploy!**

---

## Option 3: Deploy to Single VPS (DigitalOcean, AWS, etc.)

### Prerequisites
- Ubuntu 20.04+ server
- Node.js 18+ installed
- Nginx installed
- Domain name (optional but recommended)

### Setup Backend

```bash
# Clone repository
git clone <your-repo-url>
cd <repo-name>

# Install dependencies
npm install

# Install PM2 for process management
npm install -g pm2

# Start backend server
pm2 start server/server.js --name uir-backend

# Make it run on startup
pm2 startup
pm2 save
```

### Setup Frontend

```bash
# Build frontend
npm run build

# Copy build files to web directory
sudo cp -r dist/* /var/www/html/uir-problemes/
```

### Configure Nginx

Create `/etc/nginx/sites-available/uir-problemes`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html/uir-problemes;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/uir-problemes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Setup SSL (Recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Option 4: Deploy to Heroku

### Deploy Backend

1. **Create Heroku app:**
```bash
heroku create uir-problemes-backend
```

2. **Add Procfile:**
```
web: node server/server.js
```

3. **Deploy:**
```bash
git push heroku main
```

### Deploy Frontend

1. **Build with backend URL:**
```bash
VITE_API_URL=https://uir-problemes-backend.herokuapp.com npm run build
```

2. **Deploy to Netlify/Vercel** or serve static files through a simple Express server on Heroku

---

## Environment Variables Reference

### Backend
- `PORT` - Server port (default: 3001)

### Frontend
- `VITE_API_URL` - Backend server URL (e.g., `https://api.yourdomain.com`)

---

## Database Considerations

### SQLite in Production
- **Good for:** Small to medium traffic, single server deployments
- **Limitations:** Not ideal for multi-server setups
- **Backup:** Regularly backup `server/uir_problemes.db`

### Upgrading to PostgreSQL (For Scale)
If you expect high traffic, consider migrating to PostgreSQL:

1. Install PostgreSQL
2. Update `server/server.js` to use a PostgreSQL library (e.g., `pg`)
3. Migrate database schema
4. Update connection strings

---

## Post-Deployment Checklist

- [ ] Backend server is running and accessible
- [ ] Frontend can connect to backend API
- [ ] Socket.IO connections work (test chat)
- [ ] Database is being created and data persists
- [ ] SSL certificate is installed (HTTPS)
- [ ] Environment variables are set correctly
- [ ] CORS is configured for your domain
- [ ] Database backups are scheduled
- [ ] Monitoring is set up (optional)
- [ ] Privacy policy is accessible
- [ ] Test all features in production

---

## Testing Production Deployment

1. **Test Problems Page:**
   - Submit a problem
   - Vote on a problem
   - Add a comment

2. **Test Crush Finder:**
   - Submit a crush request
   - Upload a photo
   - Vote and comment

3. **Test Chat:**
   - Create a room
   - Join a room
   - Send messages
   - Test with multiple browsers

4. **Test Real-Time Sync:**
   - Open two browser windows
   - Perform actions in one
   - Verify updates appear in the other

---

## Monitoring & Maintenance

### Check Server Health
```bash
pm2 status
pm2 logs uir-backend
```

### Database Backup
```bash
# Backup
cp server/uir_problemes.db backups/uir_problemes_$(date +%Y%m%d).db

# Automate with cron
0 2 * * * cp /path/to/server/uir_problemes.db /path/to/backups/uir_problemes_$(date +\%Y\%m\%d).db
```

### Update Application
```bash
git pull
npm install
npm run build
pm2 restart uir-backend
```

---

## Scaling Considerations

### For High Traffic:

1. **Use PostgreSQL** instead of SQLite
2. **Add Redis** for Socket.IO adapter (multi-server support)
3. **Use Load Balancer** for multiple server instances
4. **CDN** for static files
5. **Separate database server**

---

## Troubleshooting

### Frontend can't connect to backend
- Check CORS settings in server
- Verify `VITE_API_URL` is correct
- Check firewall rules

### Socket.IO not working
- Ensure WebSocket connections are allowed
- Check reverse proxy configuration
- Verify Socket.IO version compatibility

### Database errors
- Check file permissions
- Ensure disk space is available
- Verify SQLite is installed

---

## Cost Estimates

### Free Tier Options:
- **Render Free:** Backend + Frontend (with limitations)
- **Vercel Free:** Frontend only
- **Railway Free:** $5 credit/month
- **Total:** $0-5/month

### Paid Options (Recommended for Production):
- **Render:** $7-25/month
- **DigitalOcean Droplet:** $5-12/month
- **AWS EC2 (t2.micro):** $8-15/month
- **Domain:** $10-15/year

---

## Support

For deployment issues:
1. Check service provider documentation
2. Review error logs
3. Test locally first
4. Ensure all environment variables are set

Good luck with your deployment! 🚀

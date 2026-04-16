# 📦 Installation Guide

## Prerequisites

Before you begin, make sure you have:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **A code editor** (VS Code recommended)
- **A modern browser** (Chrome, Firefox, Safari, or Edge)

---

## Step 1: Verify Prerequisites

Open your terminal and run:

```bash
node --version
# Should show: v18.x.x or higher

npm --version
# Should show: 9.x.x or higher
```

If these commands work, you're ready! If not, install Node.js first.

---

## Step 2: Navigate to Project

Open terminal and navigate to the project folder:

```bash
cd path/to/uir-problemes
```

---

## Step 3: Install Dependencies

Run this command to install all required packages:

```bash
npm install
```

**What this does:**
- Downloads all frontend dependencies (React, Vite, etc.)
- Downloads all backend dependencies (Express, Socket.IO, etc.)
- Sets up the project for development

**Time:** 1-3 minutes depending on your internet speed

**Expected output:**
```
added XXX packages in XXs
```

---

## Step 4: Start the Application

Run the development server:

```bash
npm run dev
```

**What this does:**
- Starts the backend server on port 3001
- Starts the frontend client on port 5173
- Opens automatic reload when you make changes

**Expected output:**
```
> Server running on port 3001

> VITE v7.x.x ready in XXX ms
> Local: http://localhost:5173/
```

---

## Step 5: Open in Browser

1. Open your browser
2. Go to: **http://localhost:5173**
3. You should see the UIR PROBLEMES homepage!

---

## Step 6: Verify Everything Works

### Check Server
In the terminal, you should see:
- ✅ "Server running on port 3001"
- ✅ Vite development server message
- ✅ No red error messages

### Check Website
In the browser, you should see:
- ✅ UIR PROBLEMES homepage loads
- ✅ Navigation bar at top
- ✅ Blue and yellow colors
- ✅ No console errors (F12 → Console tab)

---

## Step 7: Test Real-Time Features

1. **Open a SECOND browser window**
2. Navigate to: **http://localhost:5173/problems**
3. In Window 1: Submit a problem
4. In Window 2: Watch it appear instantly! ✨

**If it works, everything is installed correctly!**

---

## Troubleshooting Installation

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: "Port 3001 is already in use"
**Solution:**
```bash
# Kill the process using port 3001
npx kill-port 3001

# Then restart
npm run dev
```

### Issue: "Port 5173 is already in use"
**Solution:**
```bash
# Kill the process using port 5173
npx kill-port 5173

# Then restart
npm run dev
```

### Issue: "Cannot find module" errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "EACCES: permission denied"
**Solution:**
```bash
# On Mac/Linux, you might need sudo
sudo npm install

# Or fix npm permissions (recommended)
# See: https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally
```

### Issue: Build fails with TypeScript errors
**Solution:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

## Stopping the Application

To stop the server:
1. Go to the terminal where it's running
2. Press: **Ctrl + C** (Mac: Cmd + C)
3. Wait for it to shut down

---

## Restarting the Application

If you stopped the server, restart it with:
```bash
npm run dev
```

---

## Alternative Installation Methods

### Install Backend and Frontend Separately

If you want more control:

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

### Install Production Build

To create a production build:
```bash
npm run build
```

This creates optimized files in the `dist/` folder.

---

## Directory Structure After Installation

```
uir-problemes/
├── node_modules/          ← Installed packages (auto-created)
├── server/
│   ├── server.js
│   └── uir_problemes.db   ← Database (auto-created on first run)
├── src/
│   └── ... (all source files)
├── dist/                  ← Production build (after npm run build)
├── package.json
└── ... (other files)
```

---

## What Gets Created Automatically

When you first run the app:

1. **node_modules/** folder (after `npm install`)
2. **server/uir_problemes.db** (when you first post something)
3. **dist/** folder (after `npm run build`)

---

## Verifying Successful Installation

Run through this checklist:

- [ ] `npm install` completed without errors
- [ ] `npm run dev` starts without errors
- [ ] Terminal shows "Server running on port 3001"
- [ ] Terminal shows Vite dev server message
- [ ] Browser loads http://localhost:5173
- [ ] Homepage appears correctly
- [ ] Navigation works
- [ ] No console errors (F12)
- [ ] Can navigate to all pages

If all checked ✅, installation is successful!

---

## Next Steps After Installation

1. **Read:** `START_HERE.md` for getting started guide
2. **Test:** Open two browsers and test real-time sync
3. **Explore:** Try all features (Problems, Crush Finder, Chat)
4. **Customize:** Modify colors, add your logo
5. **Deploy:** When ready, read `DEPLOYMENT_GUIDE.md`

---

## System Requirements

### Minimum
- **CPU:** Any modern processor
- **RAM:** 4GB
- **Disk:** 500MB free space
- **OS:** Windows 10+, macOS 10.14+, or Linux

### Recommended
- **CPU:** Multi-core processor
- **RAM:** 8GB or more
- **Disk:** 1GB free space
- **OS:** Latest version

---

## Network Requirements

### Ports Used
- **3001** - Backend server
- **5173** - Frontend dev server

Make sure these ports are not blocked by firewall.

### Internet Required
- Initial installation (to download packages)
- After installation, works offline (except real-time features across different networks)

---

## Development Tools (Optional)

### Recommended VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

### Recommended Browser Extensions
- React Developer Tools
- Redux DevTools (if using Redux)

---

## Database Setup

The database is **automatically created** when you first run the app. No manual setup needed!

**Location:** `server/uir_problemes.db`

**To reset database:**
```bash
rm server/uir_problemes.db
# Restart server - new database will be created
```

---

## Environment Configuration

The `.env` file is already created with default settings:

```env
VITE_API_URL=http://localhost:3001
```

**For production**, create `.env.production`:
```env
VITE_API_URL=https://your-backend-url.com
```

---

## Update Dependencies (Future)

To update packages in the future:

```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm update package-name
```

---

## Uninstallation

If you want to completely remove the project:

```bash
# Delete node_modules
rm -rf node_modules

# Delete database
rm server/uir_problemes.db

# Delete build files
rm -rf dist

# The rest is just source code
```

---

## Platform-Specific Notes

### Windows
- Use Command Prompt or PowerShell
- Paths use backslashes: `\`
- Some commands might need administrator privileges

### macOS
- Use Terminal
- May need to install Xcode Command Line Tools
- Permissions usually work out of the box

### Linux
- Use Terminal
- May need sudo for some operations
- Make sure Node.js is in PATH

---

## Docker Installation (Alternative)

If you prefer Docker, create a `Dockerfile`:

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001 5173
CMD ["npm", "run", "dev"]
```

Then run:
```bash
docker build -t uir-problemes .
docker run -p 3001:3001 -p 5173:5173 uir-problemes
```

---

## Cloud IDE Installation

### GitHub Codespaces
1. Open repository in Codespaces
2. Run `npm install`
3. Run `npm run dev`
4. Forward ports 3001 and 5173

### Gitpod
1. Open in Gitpod
2. Run `npm install`
3. Run `npm run dev`
4. Ports auto-forward

---

## Installation Complete! ✅

If you've reached this point and everything is working:

🎉 **Congratulations!** Your UIR PROBLEMES platform is installed and ready to use!

**Next:** Read `START_HERE.md` to learn what to do next.

---

## Getting Help

If you're stuck:

1. Check the **Troubleshooting** section above
2. Review error messages carefully
3. Check browser console (F12)
4. Check server terminal for errors
5. Read `QUICK_START.md` for common issues
6. Review `TESTING_GUIDE.md` for verification

---

**Installation Time:** 5-10 minutes  
**Difficulty:** Easy  
**Success Rate:** 99% if prerequisites met  

**Happy coding! 🚀**

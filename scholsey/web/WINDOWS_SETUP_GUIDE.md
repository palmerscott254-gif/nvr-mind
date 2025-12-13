# Windows Setup & Troubleshooting Guide

## Quick Start on Windows

### Prerequisites
- **Node.js 18+ LTS** (tested on v22.21.0)
- **npm 9+** (installed with Node.js)
- **PowerShell 5.1+** (standard on Windows 10+)

### Fresh Install on Windows

```powershell
# 1. Navigate to web directory
cd scholsey\web

# 2. Install dependencies with clean cache
npm run clean

# 3. Start dev server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

**Expected output:**
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
- Environments: .env.local
✓ Starting...
```

---

## Common Issues & Fixes

### Issue 1: "Failed to load SWC binary for win32/x64"

**Symptoms:**
```
Error: Failed to load SWC binary for win32/x64
```

**Solutions (in order):**

1. **Clear and reinstall** (most effective):
   ```powershell
   npm run clean
   ```

2. **If issue persists, check Node.js version:**
   ```powershell
   node --version
   # Should output v18.0.0 or higher
   # If older, download from https://nodejs.org
   ```

3. **Verify package-lock.json is not corrupted:**
   ```powershell
   Remove-Item package-lock.json
   npm install
   ```

4. **As last resort, try npm cache clean:**
   ```powershell
   npm cache clean --force
   npm install
   ```

---

### Issue 2: "Module not found" or TypeScript errors

**Symptoms:**
```
error TS2307: Cannot find module '@/components/...'
```

**Solution:**
```powershell
# Verify paths alias in tsconfig.json exists
# Should see: "@/*": ["./*"]

# Then restart dev server
npm run dev
```

---

### Issue 3: "Port 3000 already in use"

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. **Find and kill process using port 3000:**
   ```powershell
   # Find what's using port 3000
   netstat -ano | findstr :3000
   
   # Kill the process (replace PID with actual process ID)
   taskkill /PID <PID> /F
   ```

2. **Use different port:**
   ```powershell
   npm run dev -- -p 3002
   ```

---

### Issue 4: "Leaflet library failed to load"

**Symptoms:**
```
Leaflet library failed to load
(shown in DeviceMap component)
```

**Causes:**
- Network blocked CDN access (https://unpkg.com)
- Firewall/proxy issue

**Solutions:**
1. Check internet connectivity
2. Verify firewall allows HTTPS to unpkg.com
3. Clear browser cache (Ctrl+Shift+Delete)
4. Open DevTools (F12) → Console tab to see detailed error

---

### Issue 5: "Build succeeds but npm run dev fails"

**Symptoms:**
```
npm run build ✓ works
npm run dev ✗ fails with cryptic error
```

**Solution:**
```powershell
# Dev mode uses different file watching
# Clear .next directory
Remove-Item .next -Recurse -Force
npm run dev
```

---

## Performance Optimization

### Enable Windows Defender Exclusion (Optional)

Add paths to Windows Defender to speed up builds:
```powershell
# Run as Administrator
Add-MpPreference -ExclusionPath "C:\Users\<YourUsername>\Desktop\me\nvr-mind\scholsey\web\node_modules"
Add-MpPreference -ExclusionPath "C:\Users\<YourUsername>\Desktop\me\nvr-mind\scholsey\web\.next"
```

---

## Environment Variables

### `.env.local` (Development)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Build Flags
```powershell
# Faster development (skip type checking)
npm run dev -- --experimental-app-only

# Production build with analysis
npm run build
npm run start
```

---

## Deployment on Windows (Server)

If running on Windows Server:

1. **Install Node.js LTS**
2. **Use PM2 for process management:**
   ```powershell
   npm install -g pm2
   npm run build
   pm2 start "npm run start" --name "scholsey-web"
   pm2 save
   ```

3. **Enable automatic restart on reboot:**
   ```powershell
   pm2 startup windows
   ```

---

## Advanced: Manual SWC Configuration

If you need custom SWC settings, edit `next.config.js`:

```javascript
// Add this inside nextConfig object
swcMinify: true,
webpack: (config, { isServer }) => {
  config.experiments = {
    ...config.experiments,
    asyncWebAssembly: true,
    layers: true,
  };
  return config;
},
```

---

## Scripts Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (HMR enabled) |
| `npm run build` | Create optimized production build |
| `npm run start` | Run production build locally |
| `npm run lint` | Check code style with ESLint |
| `npm run clean` | Nuclear option: remove node_modules + reinstall |

---

## Getting Help

1. **Check build output:** Copy full error message
2. **Verify dependencies:** `npm list` (check for duplicates)
3. **Check Node version:** `node --version` (needs 18+)
4. **Clear cache:** `npm cache clean --force`
5. **Check network:** Verify can reach https://unpkg.com

---

## Version Confirmation

This guide applies to:
- ✅ Next.js 14.2.5
- ✅ Node.js 18+ LTS (tested on v22.21.0)
- ✅ Windows 10+ (all versions)
- ✅ npm 9+

**Last Updated:** December 14, 2025

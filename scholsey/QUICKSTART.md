# Quick Start Guide

## Start the application in 3 steps:

### 1. Setup Backend

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup database (make sure PostgreSQL is running)
npm run prisma:generate
npm run prisma:migrate

# Start backend server
npm run start:dev
```

Backend will run on http://localhost:3001

### 2. Setup Frontend

```powershell
# Open new terminal, navigate to web
cd web

# Install dependencies
npm install

# Start frontend
npm run dev
```

Frontend will run on http://localhost:3000

### 3. Test Phone Tracking

**Using the HTML tracker (easiest for testing):**

1. Open `mobile-tracker.html` in your phone's web browser
2. If testing on same computer, use http://localhost:3001
3. If testing from phone:
   - Find your computer's IP address: `ipconfig` (look for IPv4)
   - Use http://YOUR-IP:3001 (e.g., http://192.168.1.100:3001)
4. Enter a device ID (e.g., "test-phone-123")
5. Click "Start Tracking"

**Then in the web app:**

1. Go to http://localhost:3000
2. Register/Login
3. Go to "Devices" page
4. Click "Link New Device"
5. Enter device name and the SAME device ID you used in the tracker
6. You should now see your phone's location and battery on the map!

## Testing Without a Phone

You can simulate location updates using curl:

```powershell
# First, link a device through the web UI and note its deviceId

# Then send a test location update
curl -X POST http://localhost:3001/devices/location/YOUR-DEVICE-ID `
  -H "Content-Type: application/json" `
  -d '{
    \"latitude\": 37.7749,
    \"longitude\": -122.4194,
    \"accuracy\": 10,
    \"batteryLevel\": 85,
    \"isCharging\": false
  }'
```

Replace YOUR-DEVICE-ID with the deviceId you created.

## Common Issues

### PostgreSQL not installed?

Install PostgreSQL:
1. Download from https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember your postgres password
4. Update DATABASE_URL in backend/.env with your password

### Port already in use?

Change ports in:
- Backend: `.env` (change PORT=3001 to another port)
- Frontend: Run with different port: `npm run dev -- -p 3002`

### Can't access from phone?

1. Make sure your phone is on the same WiFi network
2. Check your firewall allows connections on port 3001
3. Use your computer's local IP (not localhost) in the mobile tracker

# Scholsey - Phone Tracking System

A full-stack application for tracking phone locations and battery status in real-time.

## Features

- 🔐 User authentication (register/login)
- 📱 Link multiple devices to your account
- 📍 Real-time location tracking
- 🔋 Battery level and charging status monitoring
- 🗺️ Interactive map view with device markers
- 🔄 Live updates via WebSocket
- 📊 Location history tracking

## Tech Stack

### Backend
- NestJS (Node.js framework)
- PostgreSQL (Database)
- Prisma (ORM)
- WebSocket (Real-time updates)
- JWT Authentication

### Frontend
- Next.js 14
- React
- Redux Toolkit
- Tailwind CSS
- Leaflet (Maps)
- Socket.io Client

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

### Backend Setup

1. Navigate to backend directory:
```bash
cd scholsey/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/scholsey?schema=public"
JWT_SECRET="your-secret-key-here-change-in-production"
PORT=3001
```

4. Setup database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start the backend server:
```bash
npm run start:dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to web directory:
```bash
cd scholsey/web
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Using the Phone Tracker

### Option 1: HTML Mobile Tracker (Simple Testing)

1. Open `mobile-tracker.html` in your phone's browser
2. Enter the server URL (your computer's IP address:3001)
3. Enter the device ID you used when linking the device
4. Click "Start Tracking"

The app will send location and battery updates every 30 seconds.

### Option 2: Building a Real Mobile App

For production use, you should build a native mobile app:

**React Native Example:**

```javascript
import Geolocation from '@react-native-community/geolocation';
import { getBatteryLevel, isCharging } from 'react-native-device-info';
import axios from 'axios';

const sendLocationUpdate = async (deviceId) => {
  Geolocation.getCurrentPosition(
    async (position) => {
      const battery = await getBatteryLevel();
      const charging = await isCharging();
      
      const data = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        speed: position.coords.speed,
        heading: position.coords.heading,
        batteryLevel: Math.round(battery * 100),
        isCharging: charging,
      };
      
      await axios.post(
        `http://your-server:3001/devices/location/${deviceId}`,
        data
      );
    },
    (error) => console.error(error),
    { enableHighAccuracy: true }
  );
};

// Run every 30 seconds
setInterval(() => sendLocationUpdate('your-device-id'), 30000);
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Devices
- `POST /devices/link` - Link a new device (requires auth)
- `GET /devices` - Get all user devices (requires auth)
- `GET /devices/:id` - Get specific device details (requires auth)
- `DELETE /devices/:id` - Unlink device (requires auth)
- `POST /devices/location/:deviceId` - Update device location (public)

### WebSocket Events
- `subscribe-device-updates` - Subscribe to device updates
- `device-updated` - Emitted when device status changes
- `location-updated` - Emitted when location is updated

## Database Schema

### User
- id (UUID)
- email (String, unique)
- password (String, hashed)
- name (String, optional)

### Device
- id (UUID)
- name (String)
- deviceId (String, unique) - Phone's unique identifier
- userId (Foreign key)
- batteryLevel (Int, 0-100)
- isCharging (Boolean)
- lastSeen (DateTime)

### LocationUpdate
- id (UUID)
- deviceId (Foreign key)
- latitude (Float)
- longitude (Float)
- accuracy (Float, optional)
- altitude (Float, optional)
- speed (Float, optional)
- heading (Float, optional)
- timestamp (DateTime)

## Security Notes

⚠️ **Important for Production:**

1. Change the JWT_SECRET to a strong random string
2. Use HTTPS in production
3. Implement rate limiting on location updates
4. Add device verification/pairing flow
5. Encrypt sensitive data
6. Use environment variables for all secrets
7. Enable CORS only for your domains
8. Implement proper error handling

## Development Tips

### Testing Location Updates

Use this curl command to test location updates:

```bash
curl -X POST http://localhost:3001/devices/location/your-device-id \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 37.7749,
    "longitude": -122.4194,
    "accuracy": 10,
    "batteryLevel": 85,
    "isCharging": false
  }'
```

### Viewing Database

Run Prisma Studio to view/edit database:
```bash
cd backend
npm run prisma:studio
```

## Troubleshooting

### Location not updating
- Check that the device has location permissions
- Verify the deviceId matches between phone and web app
- Check browser console for errors
- Ensure backend server is running

### WebSocket not connecting
- Check CORS settings in backend
- Verify the API URL in frontend .env.local
- Check browser console for connection errors

### Database errors
- Ensure PostgreSQL is running
- Run `npm run prisma:generate` after schema changes
- Check DATABASE_URL in .env file

## License

MIT

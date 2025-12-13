# 📱 Scholsey Phone Tracking - System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PHONE TRACKING SYSTEM                        │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│                  │         │                  │         │                  │
│  MOBILE PHONE    │◄────────┤   WEB BROWSER    │◄────────┤   LOCATION       │
│                  │         │                  │         │   SIMULATOR      │
│  • GPS Location  │  HTTP   │  • React App     │  HTTP   │                  │
│  • Battery API   │  POST   │  • Map View      │  POST   │  • Test Tool     │
│  • Real Tracker  │────────►│  • Device Mgmt   │────────►│  • Fake Data     │
│                  │         │  • Live Updates  │         │                  │
│  mobile-tracker  │         │  localhost:3000  │         │  location-sim    │
│  .html           │         │                  │         │  ulator.html     │
└────────┬─────────┘         └────────┬─────────┘         └────────┬─────────┘
         │                            │                            │
         │        POST /devices/      │      GET/POST/DELETE       │
         │        location/:id        │      /devices/*            │
         │                            │                            │
         └────────────────────────────┼────────────────────────────┘
                                      │
                                      ▼
         ┌────────────────────────────────────────────────────────┐
         │                                                        │
         │              BACKEND API (NestJS)                      │
         │              localhost:3001                            │
         │                                                        │
         │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
         │  │              │  │              │  │             │ │
         │  │   Auth       │  │   Devices    │  │  WebSocket  │ │
         │  │   Module     │  │   Module     │  │  Gateway    │ │
         │  │              │  │              │  │             │ │
         │  │  • Register  │  │  • Link      │  │  • Live     │ │
         │  │  • Login     │  │  • Track     │  │    Updates  │ │
         │  │  • JWT       │  │  • Location  │  │  • Real-    │ │
         │  │              │  │  • Battery   │  │    time     │ │
         │  │              │  │              │  │             │ │
         │  └──────┬───────┘  └──────┬───────┘  └─────┬───────┘ │
         │         │                 │                 │         │
         └─────────┼─────────────────┼─────────────────┼─────────┘
                   │                 │                 │
                   └─────────────────┼─────────────────┘
                                     │
                                     ▼
         ┌────────────────────────────────────────────────────────┐
         │                                                        │
         │         DATABASE (PostgreSQL + Prisma)                 │
         │                                                        │
         │  ┌──────────┐   ┌──────────┐   ┌─────────────────┐  │
         │  │          │   │          │   │                 │  │
         │  │  User    │   │  Device  │   │ LocationUpdate  │  │
         │  │          │   │          │   │                 │  │
         │  │ • id     │   │ • id     │   │ • id            │  │
         │  │ • email  │   │ • name   │   │ • latitude      │  │
         │  │ • pass   │   │ • battery│   │ • longitude     │  │
         │  │ • name   │   │ • userId │   │ • deviceId      │  │
         │  │          │   │ • lastSee│   │ • timestamp     │  │
         │  └──────────┘   └──────────┘   └─────────────────┘  │
         │                                                        │
         └────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════

                          DATA FLOW DIAGRAM

┌─────────────┐
│   PHONE     │  1. Phone gets GPS location + battery level
└──────┬──────┘
       │
       │ 2. HTTP POST to /devices/location/:deviceId
       │    { latitude, longitude, batteryLevel, isCharging }
       ▼
┌─────────────┐
│   BACKEND   │  3. Receives update, validates deviceId
└──────┬──────┘
       │
       │ 4. Saves to database (Device + LocationUpdate tables)
       ▼
┌─────────────┐
│  DATABASE   │  5. Stores location history
└──────┬──────┘
       │
       │ 6. Backend emits WebSocket event
       ▼
┌─────────────┐
│  WEB APP    │  7. Browser receives real-time update
└──────┬──────┘
       │
       │ 8. Map updates, battery updates, device card refreshes
       ▼
┌─────────────┐
│   USER      │  9. Sees phone location on map instantly!
└─────────────┘

═══════════════════════════════════════════════════════════════════════

                        FEATURE BREAKDOWN

┌────────────────────────────────────────────────────────────────┐
│  📍 LOCATION TRACKING                                          │
├────────────────────────────────────────────────────────────────┤
│  • GPS coordinates (latitude/longitude)                        │
│  • Accuracy radius                                             │
│  • Altitude, speed, heading                                    │
│  • Automatic updates every 30 seconds                          │
│  • History of last 50 locations                                │
│  • Interactive map with OpenStreetMap                          │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  🔋 BATTERY MONITORING                                         │
├────────────────────────────────────────────────────────────────┤
│  • Current battery percentage (0-100%)                         │
│  • Charging status (plugged in or not)                         │
│  • Color-coded indicators (green/yellow/red)                   │
│  • Visual battery icons                                        │
│  • Real-time updates                                           │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  🔄 REAL-TIME UPDATES                                          │
├────────────────────────────────────────────────────────────────┤
│  • WebSocket connection (Socket.io)                            │
│  • Instant updates without page refresh                        │
│  • Live device status changes                                  │
│  • Connection status indicators                                │
│  • Auto-reconnect on disconnect                                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  👤 USER MANAGEMENT                                            │
├────────────────────────────────────────────────────────────────┤
│  • User registration                                           │
│  • Secure login (JWT tokens)                                   │
│  • Password hashing (bcrypt)                                   │
│  • Session management                                          │
│  • Protected routes                                            │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  📱 DEVICE MANAGEMENT                                          │
├────────────────────────────────────────────────────────────────┤
│  • Link unlimited devices                                      │
│  • Custom device names                                         │
│  • Unique device IDs                                           │
│  • Unlink/remove devices                                       │
│  • Device status (online/offline)                              │
│  • Last seen timestamp                                         │
└────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════

                        FILE STRUCTURE

scholsey/
│
├── 📄 setup.ps1                    # Automated setup script
├── 📄 README.md                    # Complete documentation
├── 📄 QUICKSTART.md                # Quick start guide
├── 📄 IMPLEMENTATION_COMPLETE.md   # Implementation summary
├── 📄 package.json                 # Monorepo scripts
│
├── 🌐 mobile-tracker.html          # Mobile phone tracker app
├── 🌐 location-simulator.html      # Desktop testing tool
│
├── backend/                        # NestJS Backend
│   ├── .env                        # Environment variables
│   ├── package.json                # Dependencies
│   │
│   ├── prisma/
│   │   └── schema.prisma           # Database schema
│   │
│   └── src/
│       ├── main.ts                 # App entry point
│       ├── app.module.ts           # Root module
│       │
│       ├── auth/                   # Authentication
│       │   ├── auth.module.ts
│       │   ├── auth.service.ts
│       │   ├── auth.controller.ts
│       │   ├── jwt.strategy.ts
│       │   ├── jwt-auth.guard.ts
│       │   └── dto/
│       │       └── auth.dto.ts
│       │
│       ├── devices/                # Device tracking
│       │   ├── devices.module.ts
│       │   ├── devices.service.ts
│       │   ├── devices.controller.ts
│       │   ├── devices.gateway.ts  # WebSocket
│       │   └── dto/
│       │       └── device.dto.ts
│       │
│       └── prisma/                 # Database
│           ├── prisma.module.ts
│           └── prisma.service.ts
│
└── web/                            # Next.js Frontend
    ├── .env.local                  # Environment variables
    ├── package.json                # Dependencies
    │
    ├── app/
    │   ├── layout.tsx              # Root layout
    │   ├── page.tsx                # Home page
    │   ├── login/
    │   │   └── page.tsx            # Login page
    │   ├── register/
    │   │   └── page.tsx            # Register page
    │   └── devices/
    │       └── page.tsx            # Device tracking page ⭐
    │
    ├── components/
    │   ├── DeviceCard.tsx          # Device info card
    │   ├── DeviceMap.tsx           # Interactive map
    │   ├── LinkDeviceModal.tsx     # Device linking modal
    │   ├── Navbar.tsx              # Navigation
    │   └── Sidebar.tsx             # Sidebar menu
    │
    └── lib/
        ├── api.ts                  # API client
        ├── store.ts                # Redux store
        └── Provider.tsx            # Redux provider

═══════════════════════════════════════════════════════════════════════

                        TECHNOLOGIES USED

Backend:
  🟢 NestJS         - Node.js framework
  🟢 TypeScript     - Type-safe JavaScript
  🔵 PostgreSQL     - Relational database
  🔵 Prisma         - ORM for database
  🟡 JWT            - Authentication
  🟡 Passport       - Auth middleware
  🔴 Socket.io      - WebSocket (real-time)
  🟣 bcrypt         - Password hashing

Frontend:
  ⚛️  Next.js 14     - React framework
  ⚛️  React 18       - UI library
  🔵 TypeScript     - Type safety
  🎨 Tailwind CSS   - Styling
  🗺️  Leaflet        - Maps
  🔴 Socket.io      - WebSocket client
  📦 Redux Toolkit  - State management
  🌐 Axios          - HTTP client

═══════════════════════════════════════════════════════════════════════

                        API ENDPOINTS

Authentication:
  POST   /auth/register          Register new user
  POST   /auth/login             Login and get JWT token

Devices:
  GET    /devices                Get all user devices 🔒
  POST   /devices/link           Link new device 🔒
  GET    /devices/:id            Get device details 🔒
  DELETE /devices/:id            Unlink device 🔒
  POST   /devices/location/:id   Update device location

🔒 = Requires JWT authentication

WebSocket Events:
  📤 subscribe-device-updates    Subscribe to updates
  📥 device-updated              Device status changed
  📥 location-updated            New location received

═══════════════════════════════════════════════════════════════════════

                        GETTING STARTED

1. Run setup:
   .\setup.ps1

2. Start backend:
   cd backend
   npm run start:dev

3. Start frontend:
   cd web
   npm run dev

4. Open browser:
   http://localhost:3000

5. Test tracking:
   Open location-simulator.html

🎉 You're ready to track phones!

═══════════════════════════════════════════════════════════════════════

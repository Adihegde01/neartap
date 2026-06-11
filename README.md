<div align="center">

# 💧 NearTap

### Community Water Locator for Bengaluru

Find clean, affordable drinking water near you — powered by the community.

[![Live Demo](https://img.shields.io/badge/Live-neartap.vercel.app-1D9E75?style=for-the-badge&logo=vercel&logoColor=white)](https://neartap.vercel.app)
[![Backend](https://img.shields.io/badge/API-Render-4353ff?style=for-the-badge&logo=render&logoColor=white)](https://neartap-server.onrender.com)

</div>

---

## 📖 About

**NearTap** is a community-driven web application that helps citizens and workers in Bengaluru find clean drinking water near their location. It maps public water ATMs (BBMP/BWSSB), community taps, RO plants, and trust-run water points across the city.

Users can:
- 🗺️ **Locate** nearby water taps on an interactive map
- ✅ **Confirm** whether a tap is functional
- 🚩 **Report** water quality or pressure issues
- ➕ **Submit** newly discovered taps directly on the map
- 💾 **Save** frequently visited taps for quick access

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS |
| **Map** | Leaflet + CARTO Voyager Tiles |
| **Backend** | Go (Golang), Chi Router |
| **Database** | Firebase Firestore |
| **Auth** | Firebase Auth (Google Sign-In) |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |

---

## 🏗️ Architecture

```
┌──────────────────────────────┐
│      React Frontend          │
│   (Vercel - neartap.vercel)  │
│                              │
│  ┌─────────┐  ┌───────────┐  │
│  │ MapView │  │ TapDetail │  │
│  │ (Leaflet)│  │   Page   │  │
│  └─────────┘  └───────────┘  │
│          │                   │
│    Firebase Auth (Google)    │
└──────────┬───────────────────┘
           │ REST API (JWT)
           ▼
┌──────────────────────────────┐
│      Go Backend              │
│   (Render - onrender.com)    │
│                              │
│  ┌──────────┐ ┌───────────┐  │
│  │ Handlers │ │Middleware  │  │
│  │ (CRUD)   │ │(Auth/CORS)│  │
│  └──────────┘ └───────────┘  │
│          │                   │
│   Firebase Admin SDK         │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│    Firebase Firestore        │
│    (NoSQL Database)          │
│                              │
│  Collections:                │
│    • taps                    │
│    • admins                  │
└──────────────────────────────┘
```

---

## 📁 Project Structure

### Frontend (`/`)

```
src/
├── api/
│   └── client.js             # REST API client (axios)
├── components/
│   ├── Badges.jsx            # Status badge components
│   ├── BottomNav.jsx         # Mobile bottom navigation bar
│   ├── DesktopNavRail.jsx    # Desktop side navigation rail
│   ├── FilterChips.jsx       # Map filter chips (Free, Open, etc.)
│   ├── MapView.jsx           # Leaflet map with tap markers
│   └── TapCard.jsx           # Tap list card component
├── context/
│   └── AppContext.jsx        # Global app state (auth, taps, filters)
├── data/
│   └── mockTaps.js           # Utilities (distance calc, time helpers)
├── pages/
│   ├── AddTapPage.jsx        # Add new water tap form with map pin
│   ├── AdminDashboardPage.jsx# Super admin panel (edit/delete taps)
│   ├── HomePage.jsx          # Map view with search & filters
│   ├── LeaderboardPage.jsx   # Community contributor rankings
│   ├── ListPage.jsx          # Tap list view (sorted by distance)
│   ├── ProfilePage.jsx       # User profile & settings
│   ├── SavedPage.jsx         # Saved/bookmarked taps
│   └── TapDetailPage.jsx     # Individual tap detail & actions
├── firebase.js               # Firebase config & initialization
├── App.jsx                   # Route definitions & layout
├── index.css                 # Global styles & design system
└── main.jsx                  # App entry point
```

### Backend (`neartap-server/`)

```
neartap-server/
├── cmd/
│   └── server/main.go        # Entry point
├── config/
│   └── config.go             # Environment config loader
├── internal/
│   ├── handlers/
│   │   └── tap.go            # REST handlers (CRUD, confirm, report)
│   ├── middleware/
│   │   └── auth.go           # Firebase JWT auth middleware
│   ├── models/
│   │   └── tap.go            # Tap data model
│   └── store/
│       └── firestore.go      # Firestore database operations
├── Dockerfile                # Container build
├── render.yaml               # Render deployment config
├── go.mod / go.sum           # Go dependencies
└── Makefile                  # Build & dev commands
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Go** ≥ 1.21
- **Firebase Project** with Firestore & Auth enabled

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/Adihegde01/neartap.git
cd neartap

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your Firebase config and backend URL

# Start dev server
npm run dev
```

### Backend Setup

```bash
cd neartap-server

# Install Go dependencies
go mod download

# Set environment variables
export PORT=8080
export FIREBASE_PROJECT_ID=your-project-id
export FIREBASE_CREDENTIALS_PATH=./serviceAccountKey.json
export FRONTEND_URL=http://localhost:5173

# Run the server
go run cmd/server/main.go
```

---

## 🔑 Environment Variables

### Frontend (`.env`)

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_API_BASE_URL` | Backend API URL |

### Backend

| Variable | Description |
|---|---|
| `PORT` | Server port (default: `8080`) |
| `FIREBASE_PROJECT_ID` | Firebase Project ID |
| `FIREBASE_CREDENTIALS_PATH` | Path to service account JSON |
| `FRONTEND_URL` | Frontend origin for CORS |
| `ENV` | `development` or `production` |

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/taps` | ❌ | List all taps |
| `GET` | `/api/taps/:id` | ❌ | Get tap by ID |
| `POST` | `/api/taps` | ✅ | Add a new tap |
| `PUT` | `/api/taps/:id` | ✅ | Update a tap |
| `DELETE` | `/api/taps/:id` | ✅ | Delete a tap (admin only) |
| `POST` | `/api/taps/:id/confirm` | ✅ | Confirm tap is working (once per user) |
| `POST` | `/api/taps/:id/report` | ✅ | Report an issue |
| `GET` | `/health` | ❌ | Health check |

---

## 📱 Features

### For Users
- **Interactive Map** — Pan, zoom, and tap markers to view water sources
- **Smart Search** — Search by tap name or address
- **Filters** — Filter by Free, Open Now, Verified, Paid
- **Tap Details** — View hours, water quality, payment methods, distance
- **Confirm / Report** — Verify taps are working or flag issues
- **Add Taps** — Submit new water sources with pin drop on map
- **Save Taps** — Bookmark favourite taps for quick access
- **Leaderboard** — Community contributor rankings

### For Admins
- **Dashboard** — View all taps with edit/delete capabilities
- **Statistics** — Total taps, verified count, issue reports
- **Bulk Management** — Edit tap details, verify, or remove entries

---

## 🔐 Authentication

- **Google Sign-In** via Firebase Authentication
- **JWT tokens** are sent to the Go backend for API authorization
- **Admin access** is determined by checking the user's email against the `admins` collection in Firestore

---

## 📊 Data Model

### Tap Document (Firestore)

```json
{
  "id": "auto-generated",
  "name": "BBMP RO Water Plant",
  "address": "Koramangala, Bengaluru",
  "lat": 12.9352,
  "lng": 77.6245,
  "hours": "24/7",
  "isOpen": true,
  "isFree": false,
  "paymentMethods": ["Coin", "UPI"],
  "isVerified": true,
  "waterQuality": "RO Purified",
  "description": "BBMP maintained RO plant",
  "confirmations": 5,
  "confirmedBy": ["uid1", "uid2"],
  "issues": [],
  "addedBy": {
    "uid": "firebase-uid",
    "name": "User Name",
    "photoURL": "https://..."
  },
  "photos": [],
  "createdAt": "2026-06-09T...",
  "updatedAt": "2026-06-11T..."
}
```

---

## 🌐 Deployment

### Frontend → Vercel
- Connected to GitHub for auto-deploy on push to `main`
- Build command: `npm run build`
- Output directory: `dist`

### Backend → Render
- Deployed as a Docker web service
- Uses `render.yaml` for configuration
- Firebase credentials stored as a secret file

---

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with 💧 for Bengaluru

**[neartap.vercel.app](https://neartap.vercel.app)**

</div>

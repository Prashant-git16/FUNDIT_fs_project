# FundIt — Crowdfunding Platform

> **Give Hope. Change Lives. Fund Every Dream.**

A full-stack crowdfunding platform built for the MERN stack, supporting medical, education, environment, disaster relief, and social causes across India. Secure payments powered by Razorpay.

---

## 🖼️ Screenshots

| Home Page | Campaign Detail | Login |
|:---------:|:--------------:|:-----:|
| Hero + Campaign Grid | Donate via Razorpay | Auth with Brand Panel |

---

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js 18, React Router v6, Axios, Context API |
| **Styling** | Vanilla CSS with custom Design System (Outfit + Inter fonts) |
| **Backend** | Node.js, Express.js (REST API) |
| **Database** | MongoDB Atlas + Mongoose ODM |
| **Auth** | JWT (JSON Web Tokens) + bcryptjs |
| **Payments** | Razorpay (Indian payment gateway — test mode) |
| **Containerization** | Docker + docker-compose |
| **CI/CD** | GitHub Actions |
| **Deployment** | Frontend → Vercel · Backend → Render |

---

## 📁 Project Structure

```
fundit1/
├── backend/                    # Express.js REST API
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js             # User (name, email, password, role)
│   │   ├── Campaign.js         # Campaign (title, goal, raised, category...)
│   │   └── Donation.js         # Donation (amount, paymentId, status)
│   ├── routes/                 # API route handlers
│   │   ├── auth.js             # Register + Login
│   │   ├── campaigns.js        # Campaign CRUD
│   │   ├── donations.js        # Razorpay order + record
│   │   ├── fundUsage.js        # Fund usage tracker
│   │   └── users.js            # User profile + thank-you
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   ├── server.js               # Entry point (Express + MongoDB)
│   ├── .env                    # Environment variables
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # React.js SPA
│   ├── public/
│   │   ├── index.html          # HTML entry + SEO meta tags
│   │   └── fundit.png          # App logo (navbar + favicon)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js/css   # Glassmorphism navbar with logo
│   │   │   └── Footer.js/css   # Dark footer with social media icons
│   │   ├── context/
│   │   │   └── AuthContext.js  # Auth state (user, token, login/logout)
│   │   ├── pages/
│   │   │   ├── Home.js/css     # Hero + campaign grid + CTA
│   │   │   ├── Login.js        # Sign In form
│   │   │   ├── Register.js     # Sign Up form
│   │   │   ├── Auth.css        # Shared auth page styles
│   │   │   ├── CampaignDetail.js/css  # Campaign details + donate
│   │   │   ├── CreateCampaign.js/css  # Create campaign form
│   │   │   ├── UserProfile.js/css     # Profile, campaigns, donations
│   │   │   └── AdminDashboard.js/css  # Admin stats + campaign management
│   │   ├── App.js              # React Router routes
│   │   ├── index.css           # Global design system (CSS variables, utils)
│   │   └── index.js            # React entry point
│   ├── .env                    # Frontend env (API URL, Razorpay key)
│   ├── Dockerfile
│   └── package.json
│
├── fundit.png                  # Brand logo
├── docker-compose.yml
├── .github/workflows/deploy.yml
└── README.md
```

---

## ✨ Features

| # | Feature | Details |
|---|---------|---------|
| 1 | **User Authentication** | Register/Login with JWT + bcrypt password hashing |
| 2 | **Campaign Creation** | Title, description, goal, category, image URL |
| 3 | **Razorpay Payments** | Secure 2-step donation flow (create order → verify → record) |
| 4 | **Campaign Detail Page** | Progress bar, donor list, fund usage tracker, share buttons |
| 5 | **User Profile** | View created campaigns, donation history, thank-you messages |
| 6 | **Admin Dashboard** | Platform stats, manage all campaigns |
| 7 | **Search & Filter** | Search by keyword, filter by category (Medical, Education, etc.) |
| 8 | **Responsive Design** | Mobile-first, works on all screen sizes |
| 9 | **Premium UI** | Glassmorphism navbar, animated hero, dark footer with social icons |
| 10 | **Fund Usage Tracker** | Campaign creators can post how funds are being used |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB Atlas account (free tier at [cloud.mongodb.com](https://cloud.mongodb.com))
- Razorpay account — test keys from [dashboard.razorpay.com](https://dashboard.razorpay.com)

---

### Step 1 — Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/fundit.git
cd fundit1

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

---

### Step 2 — MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create free cluster
2. **Database Access** → Add user with password
3. **Network Access** → Allow `0.0.0.0/0`
4. **Connect** → Copy connection string → Replace `<password>`

---

### Step 3 — Razorpay Setup

1. Sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. **Settings → API Keys** → Generate Test Keys
3. Copy both `Key ID` and `Key Secret`

---

### Step 4 — Environment Variables

**`backend/.env`:**
```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/fundit
JWT_SECRET=any_long_random_secret_string
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

**`frontend/.env`:**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxxxxxx
```

---

### Step 5 — Run Locally

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm start
```

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Frontend (React) |
| http://localhost:5000 | Backend API |
| http://localhost:5000/api/health | Health check |

---

### Step 6 — Create Admin User

1. Register at http://localhost:3000/register
2. MongoDB Atlas → Collections → `users`
3. Find your user → Edit → Set `role: "admin"`
4. Log out & back in → **Admin** tab appears in navbar

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Create account |
| `POST` | `/api/auth/login` | ❌ | Login, returns JWT |

### Campaigns
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/campaigns` | ❌ | List all active campaigns |
| `GET` | `/api/campaigns/:id` | ❌ | Single campaign detail |
| `POST` | `/api/campaigns` | ✅ User | Create campaign |
| `DELETE` | `/api/campaigns/:id` | 🔒 Admin | Delete campaign |
| `GET` | `/api/campaigns/admin/all` | 🔒 Admin | All campaigns |

### Donations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/donations/create-order` | ✅ User | Create Razorpay order |
| `POST` | `/api/donations/record` | ✅ User | Record successful donation |
| `GET` | `/api/donations/:campaignId` | ❌ | Get campaign donations |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/users/profile` | ✅ User | Get own profile |
| `GET` | `/api/users/my-campaigns` | ✅ User | My campaigns |
| `GET` | `/api/users/my-donations` | ✅ User | My donations |
| `POST` | `/api/users/thank/:donationId` | ✅ User | Send thank-you message |

---

## 🔄 Key Flows

### Donation Flow
```
1. User clicks "Donate" →
2. Frontend: POST /api/donations/create-order →
3. Backend: Creates Razorpay order → returns orderId + key →
4. Frontend opens Razorpay checkout popup →
5. User pays → Razorpay returns { paymentId, orderId, signature } →
6. Frontend: POST /api/donations/record →
7. Backend: saves Donation + Campaign.$inc(raised) →
8. UI updates with new amount raised
```

### Auth Flow
```
1. Register: POST /api/auth/register →
2. Password bcrypt-hashed → saved to MongoDB →
3. JWT generated (userId + role in payload) →
4. Frontend stores in localStorage →
5. Every protected request: Authorization: Bearer <token> header →
6. authMiddleware verifies + decodes → req.user set
```

---

## 🐳 Docker

```bash
# Build and start all services
docker-compose up --build

# Services: frontend (:3000), backend (:5000), (MongoDB Atlas — cloud)
```

---

## 🎨 Design System

The UI is built on a custom CSS design system in `src/index.css`:

- **Fonts**: `Outfit` (headings — weight 900) + `Inter` (body)
- **Colors**: Ocean Blue `#1a56db` · Life Green `#059669` · Teal `#0891b2`
- **Components**: Glassmorphism navbar · Dark footer · Gradient buttons · Animated hero
- **Special effects**: Animated gradient top bar · Floating blobs · Springy card hover · Grid pattern overlays

---

## 👥 Team

Built as a **Capstone Software Engineering Project**

- **Stack**: MERN (MongoDB · Express · React · Node.js)
- **Payments**: Razorpay (test mode)
- **DevOps**: Docker + GitHub Actions CI/CD
- **Deployment**: Vercel (frontend) + Render (backend)

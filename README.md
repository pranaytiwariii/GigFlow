# 🚀 GigFlow – Mini Freelance Marketplace

GigFlow is a powerful, full-stack freelance marketplace platform where users can seamlessly transition between being a **Client** (posting gigs) and a **Freelancer** (bidding on gigs). Built with a modern tech stack, it emphasizes security, scalability, and atomic business logic.

fronend live on Vercel : https://gigflow.vercel.app
backend live on render : https://gigflow-we5x.onrender.com

---

## 🏗️ Tech Stack

### Frontend

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI (Radix UI)
- **State Management:** TanStack Query (React Query)
- **Routing:** React Router Dom
- **HTTP Client:** Axios

### Backend

- **Runtime:** Node.js
- **Framework:** Express (TypeScript)
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with HttpOnly Cookies
- **Validation:** Zod & Custom Middleware

---

## ✨ Key Features

### 🔐 Secure Authentication

- **Unified Auth:** Single login for both Clients and Freelancers.
- **Security:** CSRF-resistant authentication using HttpOnly cookies for JWT storage.
- **Session Management:** Persistent login with `/api/auth/me` verification.

### 💼 Gig Management

- **Create Gigs:** Users can post projects with title, description, and budget.
- **Browse & Search:** Dynamic feed of open gigs with real-time title-based search.
- **Responsive Dashboard:** Manage your own postings and applications in one place.

### 🤝 The Hiring Flow (Atomic Logic)

The core of GigFlow is its robust hiring mechanism:

1. **Bidding:** Freelancers submit competitive bids with custom messages and pricing.
2. **Review:** Gig owners can view all applicants and their proposals.
3. **Hire:** One-click hiring process that executes atomicity:
   - **Gig Status:** Updates from `open` to `assigned`.
   - **Winning Bid:** Status becomes `hired`.
   - **Other Bids:** Automatically marked as `rejected`.
   - **Validation:** Prevents multi-hiring or self-hidding.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Atlas or Local)
- npm or bun

### 1. Clone & Install

```bash
git clone <repository-url>
cd GigFlow

# Install Backend Dependencies
cd server
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

Create a `.env` file in the `server` directory (refer to `.env.example` in the root):

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

### 3. Run the Application

Start the backend server:

```bash
# In /server
npm run dev
```

Start the frontend development server:

```bash
# In /frontend
npm run dev
```

The app will be available at `http://localhost:8080`.

---

## 📡 API Overview

| Category | Endpoint                | Method  | Description                  |
| -------- | ----------------------- | ------- | ---------------------------- |
| **Auth** | `/api/auth/register`    | `POST`  | Create new account           |
| **Auth** | `/api/auth/login`       | `POST`  | Login & set cookie           |
| **Gigs** | `/api/gigs`             | `GET`   | Fetch open gigs (searchable) |
| **Gigs** | `/api/gigs`             | `POST`  | Post a new project           |
| **Bids** | `/api/bids`             | `POST`  | Submit a proposal            |
| **Bids** | `/api/bids/:gigId`      | `GET`   | View applicants (Owner only) |
| **Hire** | `/api/bids/:bidId/hire` | `PATCH` | Execute hiring logic         |

---

## 📂 Project Structure

```text
GigFlow/
├── frontend/           # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application views
│   │   ├── api/        # Axios API definitions
│   │   └── lib/        # Shared utilities
├── server/             # Node.js + Express + TS
│   ├── src/
│   │   ├── controllers/# Business logic
│   │   ├── models/     # Mongoose schemas
│   │   ├── routes/     # API endpoints
│   │   └── middleware/ # Auth & error handlers
└── .env.example        # Reference environment variables
```

---

## ✅ Submission Checklist

- [x] Clean Backend Architecture
- [x] Secure JWT-based Authentication
- [x] Atomic Hiring Logic Implementation
- [x] Interactive UI with Shadcn
- [x] Full TypeScript Type Safety

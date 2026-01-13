# GigFlow – Full Stack Development Assignment

## 📌 Project Overview
GigFlow is a **mini freelance marketplace platform** where:
- **Clients** can post jobs (called *Gigs*)
- **Freelancers** can apply to these jobs by submitting *Bids*

The objective of this assignment is to evaluate your ability to:
- Design clean backend APIs
- Handle authentication securely
- Manage complex database relationships
- Implement atomic business logic (Hiring flow)


## 🔐 Core Features

### A. User Authentication
- Secure user **Sign-up** and **Login**
- Role system is **fluid**:
  - Any user can act as a **Client** (post jobs)
  - Any user can act as a **Freelancer** (bid on jobs)

---

### B. Gig Management (CRUD)

#### 1. Browse Gigs
- Display all gigs with status **Open**
- Public or private feed (based on auth)

#### 2. Search & Filter
- Search gigs by **title**

#### 3. Job Posting
- Logged-in users can post a job with:
  - Title
  - Description
  - Budget

---

### C. Hiring Logic (Crucial Feature)

This is the most important part of the assignment.

#### Step-by-step Flow
1. **Bidding**
   - A freelancer submits a bid with:
     - Message
     - Proposed price

2. **Review Bids**
   - The client who posted the gig can view all bids

3. **Hire Freelancer**
   - Client clicks **Hire** on one specific bid

#### Business Rules
- Gig status changes from `open` → `assigned`
- Selected bid status becomes `hired`
- All other bids for the same gig automatically become `rejected`

---

## 🌐 API Architecture

| Category | Method | Endpoint | Description |
|--------|--------|---------|-------------|
| Auth | POST | /api/auth/register | Register new user |
| Auth | POST | /api/auth/login | Login & set HttpOnly cookie |
| Gigs | GET | /api/gigs | Fetch all open gigs (with search) |
| Gigs | POST | /api/gigs | Create a new gig |
| Bids | POST | /api/bids | Submit a bid |
| Bids | GET | /api/bids/:gigId | Get all bids for a gig (Owner only) |
| Hiring | PATCH | /api/bids/:bidId/hire | Hire a freelancer (atomic) |

---

## 🗄️ Database Schema (Hints)

### User
- name
- email
- password

### Gig
- title
- description
- budget
- ownerId
- status (`open` | `assigned`)

### Bid
- gigId
- freelancerId
- message
- status (`pending` | `hired` | `rejected`)

---

## ⭐ Bonus Challenges (Optional but Recommended)

### Bonus 1: Transactional Integrity (Race Conditions)
- Implement the **Hire** logic using MongoDB Transactions
- Ensure only **one freelancer** can be hired even if multiple users click hire simultaneously

### Bonus 2: Real-time Updates
- Integrate **Socket.io**
- Notify freelancers instantly when they are hired:
  > "You have been hired for [Project Name]!"

---

## 📦 Submission Guidelines

1. **Code Repository**
   - GitHub repository with complete source code
   - Proper README.md

2. **Environment Setup**
   - Include a `.env.example` file

3. **Demo Video**
   - 2-minute Loom video explaining the **Hiring flow**

---

## 📧 Email Submission Details

**To:** ritik.yadav@servicehive.tech

**CC:** hiring@servicehive.tech

---

## ✅ Evaluation Focus
- Clean backend architecture
- Secure authentication
- Correct business logic
- Proper database design
- Code readability & scalability

---

Good luck! 🚀 This project closely mirrors real-world freelance marketplace systems and is designed to test production-level backend thinking.


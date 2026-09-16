# 🎓 SkillBridge — Peer-to-Peer Student Skill Sharing Platform

A clean, simple, and beginner-level full-stack MERN (MongoDB, Express, React, Node.js) web application designed for students to exchange skills (e.g. trading React web development for Python tutoring) without any money involved.

---

## 📌 Core Flow

```
Register ➔ Create Profile ➔ Add Skills ➔ Add Wanted Skills ➔ Browse Students ➔ Send Swap Request ➔ Accept / Reject ➔ Learning Exchange ➔ Mark Completed ➔ Review
```

---

## 🌟 The 7 Core Pages

1. **`/` (Home)**: Landing page explaining the peer-to-peer exchange workflow.
2. **`/register` (Register)**: Create account with name, email, password, bio, offered skills, and wanted skills.
3. **`/login` (Login)**: Login with email and password.
4. **`/explore` (Explore Students)**: Browse students across campus and propose skill swaps.
5. **`/profile` (My Profile)**: View and edit bio, skills offered, skills wanted, and peer reviews.
6. **`/requests` (Swap Requests)**: View incoming and outgoing swap requests with **Accept**, **Reject**, **Mark Completed**, and **Give Review** actions.
7. **`/dashboard` (Dashboard)**: Simple student overview displaying:
   - My Skills
   - I Want To Learn
   - My Requests counts (Pending, Accepted, Completed)

---

## 🏗️ Technology Stack

- **Frontend**: React (Vite) + React Router + Context API + Vanilla CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose

---

## 🗄️ Database Collections

### 1. `users`
```json
{
  "name": "Student Name",
  "email": "student@gmail.com",
  "password": "plain_password_string",
  "skillsOffered": ["React", "JavaScript"],
  "skillsWanted": ["Python", "MongoDB"],
  "bio": "3rd year IT student"
}
```

### 2. `skills`
```json
{
  "name": "React",
  "category": "Web Development"
}
```

### 3. `swaprequests`
```json
{
  "sender": "ObjectId(...)",
  "receiver": "ObjectId(...)",
  "offeredSkill": "React",
  "requestedSkill": "Python",
  "message": "Let's swap skills!",
  "status": "pending"
}
```

### 4. `reviews`
```json
{
  "reviewer": "ObjectId(...)",
  "reviewee": "ObjectId(...)",
  "rating": 5,
  "comment": "Great learning session on React components!"
}
```

---

## 🚀 How to Run Locally

### 1. Start Backend Server
```bash
cd server
npm install
npm start               # Runs on http://localhost:5000
```

### 2. Start Frontend Client (in a new terminal)
```bash
cd client
npm install
npm run dev             # Runs on http://localhost:5173
```

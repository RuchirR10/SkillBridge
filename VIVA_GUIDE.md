# 🎓 SkillBridge — Faculty Viva & Project Defense Guide

This guide contains simple, clear, and confident answers to the most common viva questions asked by college examiners.

---

## 📌 1. 30-Second Project Summary (Elevator Pitch)

> *"SkillBridge is a peer-to-peer skill sharing web application built on the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows college students to exchange academic and technical skills directly without any money involved. For example, a student proficient in React can mentor a peer in exchange for Python tutoring. The application includes 7 core pages: Home, Register, Login, Explore Students, Profile, Swap Requests, and Dashboard. Students can browse peers, send and accept swap proposals, mark exchanges as completed, and leave ratings and feedback."*

---

## 🏛️ 2. Core Architecture & Modules

### 🔹 Frontend (React + Vite)
- **7 Pages**:
  - `Home.jsx` — Platform introduction and workflow.
  - `Register.jsx` — New student registration.
  - `Login.jsx` — Student login.
  - `Explore.jsx` — Browse students across campus and send swap requests.
  - `Profile.jsx` — Manage bio, offered skills, wanted skills, and view peer reviews.
  - `Requests.jsx` — Manage swap requests across the full lifecycle (`Pending` ➔ `Accepted` ➔ `Learning Exchange` ➔ `Mark Completed` ➔ `Review`).
  - `Dashboard.jsx` — Quick overview of *My Skills*, *I Want To Learn*, and *My Requests* count.
- **State Management**: `AuthContext.jsx` manages the logged-in user in React and stores session data in `localStorage`.
- **API Calls**: Direct, standard `fetch()` calls.

### 🔹 Backend (Node.js + Express.js)
- **`server.js`**: Connects to MongoDB and mounts REST API routes.
- **`routes/users.js`**: Handles registration, login (direct string password check), listing users, and profile updates.
- **`routes/skills.js`**: Handles listing and creating skill categories.
- **`routes/swaps.js`**: Handles creating swap proposals, fetching user swaps, and status updates (`accepted`, `rejected`, `completed`).
- **`routes/reviews.js`**: Handles submitting and viewing ratings/comments.

### 🔹 Database (MongoDB + Mongoose)
- **4 Collections**:
  1. `users`: Name, email, password (String), bio, skillsOffered, skillsWanted.
  2. `skills`: Skill name and category.
  3. `swaprequests`: Sender, receiver, offeredSkill, requestedSkill, message, status.
  4. `reviews`: Reviewer, reviewee, rating (1–5), comment.

---

## 💡 3. Important Viva Questions & Answers

### Q1: "How does a Swap Request lifecycle progress?"
- **Answer**:
  > *"1. **Pending**: Student A sends a proposal specifying what they offer and want in return.*
  > *2. **Accepted**: Student B accepts the request. Both students can now see each other's email address to coordinate.*
  > *3. **Learning Exchange**: Both students conduct their mentoring/study sessions.*
  > *4. **Mark Completed**: Either student clicks 'Mark Completed' to finish the swap.*
  > *5. **Review**: The students can submit a 1 to 5 star rating and comment for each other."*

### Q2: "How is authentication handled?"
- **Answer**:
  > *"When a student registers or logs in via `POST /api/register` or `POST /api/login`, the backend verifies the credentials and returns the user object. The frontend stores this user object in React State (`AuthContext`) and `localStorage` so the student stays logged in across page refreshes."*

### Q3: "Why did you use MERN stack (MongoDB, Express, React, Node.js)?"
- **Answer**:
  > *"1. Single language (JavaScript) across both frontend and backend.*
  > *2. React provides dynamic single-page rendering without page reloads.*
  > *3. Node.js & Express provide a lightweight and fast asynchronous REST API.*
  > *4. MongoDB offers flexible JSON-like document storage well suited for user profiles and array lists like skills."*

---

## 🚀 4. Live Viva Demonstration Steps

1. **Step 1: Open Application (`http://localhost:5173`)**
   - Show the **Home** page and explain the 3-step workflow.
2. **Step 2: Register Student A (e.g., Rahul)**
   - Click **Register**, enter Name, Email, Password, Bio, Skills Offered (*React*), and Skills Wanted (*Python*).
3. **Step 3: Register Student B (e.g., Aman)**
   - Log out, click **Register**, enter Name, Email, Password, Bio, Skills Offered (*Python*), and Skills Wanted (*React*).
4. **Step 4: Explore Students & Send Swap Request**
   - Go to **Explore Students**. View peer students.
   - Click **Send Swap Request** to propose a skill trade.
5. **Step 5: Accept Request & Mark Completed**
   - Log back in as Student A.
   - Go to **Requests** ➔ **Incoming Requests**. Click **Accept**.
   - Show the contact email for the Learning Exchange.
   - Click **Mark Completed**.
6. **Step 6: Give Review**
   - Click **⭐ Give Review**, submit a 5-star rating with comment, and view it under the student's profile.

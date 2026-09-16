# 🏛️ Comprehensive Architecture & Class Diagram — SkillBridge

This document provides a comprehensive structural representation of the **SkillBridge** web application project, covering the **Frontend Component Hierarchy & State Management**, **Backend REST Routing Layer**, and **Mongoose Database Data Models**.

---

## 📊 Comprehensive Class Diagram

```mermaid
classDiagram
    direction TB

    %% ==========================================
    %% 1. FRONTEND LAYER (React + Vite)
    %% ==========================================
    class App {
        +render() JSX.Element
    }

    class AuthContext {
        +User user
        +Boolean loading
        +login(userData) void
        +logout() void
        +updateUser(updatedData) void
    }

    class Navbar {
        +useAuth() AuthContext
        +handleLogout() void
        +render() JSX.Element
    }

    class SwapModal {
        +User receiver
        +String offeredSkill
        +String requestedSkill
        +String message
        +Boolean loading
        +String error
        +handleSendSwap(e) Promise~void~
        +onClose() void
        +onSuccess() void
        +render() JSX.Element
    }

    class HomePage {
        +useAuth() AuthContext
        +render() JSX.Element
    }

    class RegisterPage {
        +String name
        +String email
        +String password
        +String bio
        +String skillsOfferedInput
        +String skillsWantedInput
        +String error
        +Boolean loading
        +handleRegister(e) Promise~void~
        +render() JSX.Element
    }

    class LoginPage {
        +String email
        +String password
        +String error
        +Boolean loading
        +handleLogin(e) Promise~void~
        +render() JSX.Element
    }

    class ExplorePage {
        +Array~User~ users
        +Boolean loading
        +User selectedUserForSwap
        +fetchUsers() Promise~void~
        +handleOpenSwap(peer) void
        +render() JSX.Element
    }

    class ProfilePage {
        +String profileId
        +User profile
        +Array~Review~ reviews
        +Boolean isEditing
        +Boolean saveLoading
        +fetchProfileAndReviews() Promise~void~
        +handleSaveProfile(e) Promise~void~
        +render() JSX.Element
    }

    class RequestsPage {
        +Array~SwapRequest~ swaps
        +String activeTab
        +Object reviewModalTarget
        +Number rating
        +String comment
        +Boolean submittingReview
        +fetchSwaps() Promise~void~
        +handleUpdateStatus(swapId, newStatus) Promise~void~
        +handleSendReview(e) Promise~void~
        +render() JSX.Element
    }

    class DashboardPage {
        +Object stats
        +Boolean loading
        +fetchMyStats() Promise~void~
        +render() JSX.Element
    }

    %% ==========================================
    %% 2. BACKEND API ROUTING LAYER (Express)
    %% ==========================================
    class ServerApp {
        +Number PORT
        +connectDB() void
        +useMiddlewares() void
        +mountRoutes() void
        +listen() void
    }

    class UsersRouter {
        +POST /api/register(name, email, password, bio, skillsOffered, skillsWanted)
        +POST /api/login(email, password)
        +GET /api/users()
        +GET /api/users/:id()
        +PUT /api/users/:id(name, bio, skillsOffered, skillsWanted)
    }

    class SkillsRouter {
        +GET /api/skills()
        +POST /api/skills(name, category)
    }

    class SwapsRouter {
        +POST /api/swaps(sender, receiver, offeredSkill, requestedSkill, message)
        +GET /api/swaps?userId=:id()
        +GET /api/swaps/stats?userId=:id() [MongoDB Aggregation]
        +PUT /api/swaps/:id(status)
    }

    class ReviewsRouter {
        +POST /api/reviews(reviewer, reviewee, rating, comment)
        +GET /api/reviews/:userId()
    }

    %% ==========================================
    %% 3. DATABASE MODELS LAYER (Mongoose)
    %% ==========================================
    class User {
        +ObjectId _id
        +String name
        +String email
        +String password
        +Array~String~ skillsOffered
        +Array~String~ skillsWanted
        +String bio
        +Date createdAt
        +Date updatedAt
    }

    class Skill {
        +ObjectId _id
        +String name
        +String category
        +Date createdAt
        +Date updatedAt
    }

    class SwapRequest {
        +ObjectId _id
        +ObjectId sender
        +ObjectId receiver
        +String offeredSkill
        +String requestedSkill
        +String message
        +String status
        +Date createdAt
        +Date updatedAt
    }

    class Review {
        +ObjectId _id
        +ObjectId reviewer
        +ObjectId reviewee
        +Number rating
        +String comment
        +Date createdAt
        +Date updatedAt
    }

    %% ==========================================
    %% RELATIONSHIPS & DEPENDENCIES
    %% ==========================================
    %% Frontend Composition & Dependencies
    App --> AuthContext : provides
    App --> Navbar : renders
    App --> HomePage : routes
    App --> RegisterPage : routes
    App --> LoginPage : routes
    App --> ExplorePage : routes
    App --> ProfilePage : routes
    App --> RequestsPage : routes
    App --> DashboardPage : routes

    ExplorePage ..> SwapModal : opens
    ProfilePage ..> SwapModal : opens

    Navbar ..> AuthContext : consumes
    RegisterPage ..> AuthContext : consumes
    LoginPage ..> AuthContext : consumes
    ExplorePage ..> AuthContext : consumes
    ProfilePage ..> AuthContext : consumes
    RequestsPage ..> AuthContext : consumes
    DashboardPage ..> AuthContext : consumes
    SwapModal ..> AuthContext : consumes

    %% Client to Backend HTTP Calls
    RegisterPage ..> UsersRouter : POST /api/register
    LoginPage ..> UsersRouter : POST /api/login
    ExplorePage ..> UsersRouter : GET /api/users
    ProfilePage ..> UsersRouter : GET & PUT /api/users/:id
    ProfilePage ..> ReviewsRouter : GET /api/reviews/:userId
    RequestsPage ..> SwapsRouter : GET & PUT /api/swaps
    RequestsPage ..> ReviewsRouter : POST /api/reviews
    DashboardPage ..> SwapsRouter : GET /api/swaps/stats?userId
    SwapModal ..> SwapsRouter : POST /api/swaps

    %% Backend Server to Routers
    ServerApp --> UsersRouter : mounts
    ServerApp --> SkillsRouter : mounts
    ServerApp --> SwapsRouter : mounts
    ServerApp --> ReviewsRouter : mounts

    %% Backend Routers to Mongoose Models
    UsersRouter ..> User : CRUD
    SkillsRouter ..> Skill : CRUD
    SwapsRouter ..> SwapRequest : CRUD
    ReviewsRouter ..> Review : CRUD

    %% Mongoose Model Relationships
    User "1" -- "0..*" SwapRequest : sender (initiates)
    User "1" -- "0..*" SwapRequest : receiver (receives)
    User "1" -- "0..*" Review : reviewer (writes)
    User "1" -- "0..*" Review : reviewee (receives)
```

---

## 🔍 Structural Layer Breakdown

### 1. Presentation & State Layer (React 18 + Vite)
- **`App`**: Main single-page application router providing top-level routes and global authentication context.
- **`AuthContext`**: Global authentication state manager handling session persistence with `localStorage`.
- **7 Core Views**:
  - `HomePage`: Landing overview and explanation of the skill sharing workflow.
  - `RegisterPage`: User registration with skills list and plain text password.
  - `LoginPage`: Authentication entry point with direct credential check.
  - `ExplorePage`: Directory of fellow students displaying their offered and wanted skills.
  - `ProfilePage`: User profile display, edit capabilities, and peer feedback history.
  - `RequestsPage`: Swap proposal management supporting status transitions (`pending` ➔ `accepted` ➔ `completed` ➔ `review`).
  - `DashboardPage`: Overview displaying active skills offered, learning wishlist, and request counts.
- **`SwapModal`**: Reusable dialogue component for initiating bilateral skill exchange proposals.

---

### 2. Service & Routing Layer (Express.js)
- **`ServerApp` (`server.js`)**: Configures CORS, parses JSON payloads, connects to MongoDB, and binds route handlers.
- **`UsersRouter` (`routes/users.js`)**: Endpoints for authentication, user listing, and profile modification.
- **`SkillsRouter` (`routes/skills.js`)**: Endpoints for querying available skills and categories.
- **`SwapsRouter` (`routes/swaps.js`)**: Endpoints for creating swap proposals, fetching student requests, and updating request lifecycle status.
- **`ReviewsRouter` (`routes/reviews.js`)**: Endpoints for submitting and fetching peer ratings and comments.

---

### 3. Data Persistence Layer (MongoDB + Mongoose)
- **`User`**: Core student profile document containing credentials, offered skills array, wanted skills array, and bio.
- **`Skill`**: Skill metadata document containing skill title and category.
- **`SwapRequest`**: Transaction document linking `sender` and `receiver` with skill exchange terms and status (`pending`, `accepted`, `rejected`, `completed`).
- **`Review`**: Rating and feedback document referencing the `reviewer` and `reviewee`.

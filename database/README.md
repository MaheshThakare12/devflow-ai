# 🗄️ DevFlow AI — Database & Schema Documentation (Week 3)

This directory contains the database design, MongoDB connection logic, and Mongoose ORM schemas for the **DevFlow AI** task management platform.

---

## 📐 Database Architecture Overview

- **Database Engine**: MongoDB (NoSQL Document Store)
- **ORM / ODM**: Mongoose `^8.0.0`
- **Primary Database Name**: `taskflow`
- **Connection URI**: `mongodb://127.0.0.1:27017/taskflow` (Local) / MongoDB Atlas (Production)

---

## 📊 Collections & Schemas

### 1. `users` Collection (`database/models/User.ts`)
Stores developer accounts, Google OAuth authentication details, role/specialization, and password hashes.

| Field | Type | Rules / Enum | Description |
|---|---|---|---|
| `_id` | `ObjectId` | Auto Primary Key | Unique MongoDB document identifier |
| `name` | `String` | Required (2-100 chars) | Developer full name |
| `email` | `String` | Required, Unique, Lowercase | User email address |
| `password` | `String` | Optional (select: false) | Bcrypt hashed password (empty for Google OAuth) |
| `googleId` | `String` | Unique, Sparse | Google OAuth Subject Identifier |
| `avatar` | `String` | Default UI-Avatar | Profile picture URL |
| `role` | `String` | Enum: `["admin", "member"]` | Access permissions level |
| `createdAt` | `Date` | Timestamp | Account creation date |

---

### 2. `projects` Collection (`database/models/Project.ts`)
Stores engineering workspace projects.

| Field | Type | Rules / Enum | Description |
|---|---|---|---|
| `_id` | `ObjectId` | Auto Primary Key | Unique project identifier |
| `title` | `String` | Required, Trimmed | Project title |
| `description` | `String` | Optional | Technical goals & project description |
| `owner` | `ObjectId` | Ref: `User` | Project creator/owner reference ID |
| `color` | `String` | Default: `"blue"` | UI color tone badge |
| `status` | `String` | Enum: `["active", "completed", "archived"]` | Current project state |
| `createdAt` | `Date` | Timestamp | Creation date |

---

### 3. `tasks` Collection (`database/models/Task.ts`)
Stores workspace tasks, priority, due dates, and project associations (including Gemini AI generated tasks).

| Field | Type | Rules / Enum | Description |
|---|---|---|---|
| `_id` | `ObjectId` | Auto Primary Key | Unique task identifier |
| `title` | `String` | Required, Trimmed | Actionable task title |
| `description` | `String` | Optional | Task breakdown details |
| `project` | `ObjectId` | Ref: `Project` | Associated project ID |
| `assignedTo` | `ObjectId` | Ref: `User` | Assigned developer ID |
| `status` | `String` | Enum: `["todo", "in-progress", "done"]` | Task workflow status |
| `priority` | `String` | Enum: `["low", "medium", "high", "urgent"]` | Priority rating |
| `dueDate` | `Date` | Optional | Target completion date |
| `createdAt` | `Date` | Timestamp | Creation date |

---

## ⚡ Data Relationships

```
┌──────────────┐         1 : N         ┌──────────────┐
│   User       │ ────────────────────> │   Project    │
└──────────────┘                       └──────────────┘
       │                                      │
       │ 1:N                                  │ 1:N
       ▼                                      ▼
┌─────────────────────────────────────────────────────┐
│   Task (assignedTo, project)                        │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
database/
├── README.md              # Complete Database Documentation & ER Schema
├── config/
│   └── db.ts             # Mongoose connection initialization
└── models/
    ├── User.ts           # User Schema & Password Hashing hooks
    ├── Project.ts        # Project Schema definition
    └── Task.ts           # Task Schema definition
```


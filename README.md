<div align="center">
  <h1>⚡ TaskFlow AI</h1>
  <p><strong>AI-Powered Project & Task Management Platform</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript" />
    <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?style=for-the-badge&logo=mongodb" />
    <img src="https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai" />
  </p>
  <p>
    <a href="#demo">🎬 Demo</a> •
    <a href="#features">✨ Features</a> •
    <a href="#installation">🚀 Installation</a> •
    <a href="#tech-stack">🛠️ Tech Stack</a> •
    <a href="#api">📡 API</a>
  </p>
</div>

---

## 🎬 Demo

> 🔗 **Live Demo**: [Coming Soon — Deploy to Vercel + Railway]

---

## 📸 Screenshots

> _(Screenshots will be added after deployment)_

| Dashboard | Projects | Tasks Board |
|-----------|----------|-------------|
| ![Dashboard](./screenshots/dashboard.png) | ![Projects](./screenshots/projects.png) | ![Tasks](./screenshots/tasks.png) |

---

## ✨ Features

### 🔐 Authentication
- JWT-based registration, login & logout
- Refresh token rotation with httpOnly cookies
- Protected routes with automatic redirect
- User profile management & password change

### 📊 Dashboard
- Real-time project & task statistics
- Progress tracking with animated rings
- Recent activity feed
- Quick-action buttons
- Fully responsive (mobile → desktop)

### 📁 Project Management
- Create, edit, archive, and delete projects
- Color-coded project cards with emoji
- Member management (invite by email)
- Per-project task statistics

### ✅ Task Management
- Full CRUD with status (todo / in-progress / done)
- Priority levels: Low, Medium, High, Urgent
- Due dates with overdue highlighting
- Tags / labels
- Drag-and-drop Kanban board
- Advanced filtering & search

### 🤖 AI Task Generator
- Click **✨ Suggest Tasks** on any project
- GPT-4o-mini analyzes your project description
- Returns 5–10 actionable tasks with priorities
- Select which tasks to import with one click
- Works in mock mode without an API key

### 🎨 UI/UX
- Dark premium design with glassmorphism
- Framer Motion animations
- Skeleton loading states
- Empty & error states
- Toast notifications

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **UI Libs** | Framer Motion, Lucide Icons, React Hot Toast |
| **State** | Zustand (auth) + TanStack Query v5 (server state) |
| **DnD** | @hello-pangea/dnd |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT (access + refresh), bcrypt |
| **AI** | OpenAI GPT-4o-mini |
| **Validation** | express-validator (backend), Zod (frontend) |

---

## 🚀 Installation

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)
- npm ≥ 9

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/taskflow-ai.git
cd taskflow-ai
npm install
```

### 2. Configure Environment Variables

```bash
# Backend
cp .env.example apps/backend/.env
# Edit apps/backend/.env with your values

# Frontend
cp .env.example apps/frontend/.env.local
# Edit apps/frontend/.env.local with your values
```

> See [`.env.example`](./.env.example) for all required variables.

### 3. Generate JWT Secrets

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as `JWT_SECRET` and `JWT_REFRESH_SECRET` in your `.env`.

### 4. Run in Development

```bash
# Run both frontend and backend concurrently
npm run dev

# OR run individually:
npm run dev --workspace=apps/backend   # http://localhost:5000
npm run dev --workspace=apps/frontend  # http://localhost:3000
```

### 5. (Optional) Add OpenAI Key

Add `OPENAI_API_KEY=sk-...` to `apps/backend/.env`.  
Without it, the AI feature runs in **mock mode** (returns sample tasks).

---

## 📡 API Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| POST | `/api/auth/logout` | Logout | ✅ |
| GET | `/api/auth/me` | Get current user | ✅ |
| GET | `/api/users/me` | Get profile | ✅ |
| PATCH | `/api/users/me` | Update profile | ✅ |
| GET | `/api/projects` | List projects | ✅ |
| POST | `/api/projects` | Create project | ✅ |
| GET | `/api/projects/:id` | Get project | ✅ |
| PATCH | `/api/projects/:id` | Update project | ✅ |
| DELETE | `/api/projects/:id` | Delete project | ✅ |
| GET | `/api/tasks` | List tasks | ✅ |
| POST | `/api/tasks` | Create task | ✅ |
| PATCH | `/api/tasks/:id` | Update task | ✅ |
| DELETE | `/api/tasks/:id` | Delete task | ✅ |
| POST | `/api/ai/suggest-tasks` | AI task generation | ✅ |

---

## 📂 Folder Structure

```
taskflow-ai/
├── apps/
│   ├── backend/          # Express API (TypeScript)
│   │   └── src/
│   │       ├── config/   # DB connection, env vars
│   │       ├── controllers/
│   │       ├── middleware/
│   │       ├── models/   # Mongoose schemas
│   │       ├── routes/
│   │       └── services/
│   └── frontend/         # Next.js 14 (App Router)
│       └── src/
│           ├── app/      # Pages & layouts
│           ├── components/
│           ├── hooks/
│           ├── lib/
│           ├── store/
│           └── types/
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚢 Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Set root directory to `apps/frontend`
4. Add `NEXT_PUBLIC_API_URL` env var

### Backend → Railway / Render
1. Create new service from GitHub repo
2. Set root directory to `apps/backend`
3. Add all env vars from `.env.example`
4. Deploy!

---

## 📄 License

MIT © 2024 TaskFlow AI

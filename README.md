<div align="center">
  <h1>⚡ DevFlow AI</h1>
  <p><strong>AI-Powered Project & Task Management Platform</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript" />
    <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?style=for-the-badge&logo=mongodb" />
    <img src="https://img.shields.io/badge/Google--AI-Gemini-4285F4?style=for-the-badge&logo=google" />
  </p>
  <p>
    <a href="#-milestone-submission-links">📌 Submission Links</a> •
    <a href="#-features">✨ Features</a> •
    <a href="#-tech-stack">🛠️ Tech Stack</a> •
    <a href="#-folder-structure">📂 Structure</a>
  </p>
</div>

---

## 📌 Milestone Submission Links

- 🎨 **Week 1 (Frontend)**: [`github.com/MaheshThakare12/devflow-ai/tree/main/frontend`](https://github.com/MaheshThakare12/devflow-ai/tree/main/frontend)
- ⚙️ **Week 2 (Backend / API)**: [`github.com/MaheshThakare12/devflow-ai/tree/main/backend`](https://github.com/MaheshThakare12/devflow-ai/tree/main/backend)
- 🗄️ **Week 3 (Database / Schemas)**: [`github.com/MaheshThakare12/devflow-ai/tree/main/database`](https://github.com/MaheshThakare12/devflow-ai/tree/main/database)

---

## ✨ Features

### 🔐 Authentication & Google OAuth
- JWT-based authentication with bcrypt password hashing
- Actual Google Account Sign-In with instant OAuth credential verification
- Role & Specialization dropdown (Frontend, Backend, Fullstack, AI Engineer)

### 📊 Engineering Dashboard & Analytics
- Live project stats and completed tasks breakdown
- Overall progress graph (`AreaChart`)
- Interactive Weekly Goal Tracker with Mon-Sun daily velocity chart
- Recent Activity timeline with quick task navigation

### 🤖 Gemini AI Task Breakdown Engine
- Powered by Google Gemini AI SDK (`gemini-1.5-flash`)
- Generates 5–10 structured engineering subtasks for any project
- Instant task import with status and priority configuration

---

## 📂 Folder Structure

```
devflow-ai/
├── 📁 frontend/          # Week 1: Next.js 14, Tailwind CSS, Dashboard, Auth UI
├── 📁 backend/           # Week 2: Node.js Express REST API, Gemini AI Engine
├── 📁 database/          # Week 3: MongoDB Mongoose Schemas & ER Specs
├── 📁 .github/           # GitHub Actions workflows for live deployment
├── .env.example
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts |
| **State** | Zustand (auth) + TanStack Query v5 |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB, Mongoose ORM |
| **AI Integration** | Google Gemini AI (`@google/generative-ai`) |
| **Authentication** | Google OAuth + JWT (Access Token) + Bcrypt |

---

MIT © 2026 DevFlow AI — Mahesh Thakare


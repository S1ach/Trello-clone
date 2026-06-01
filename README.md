# 🌌 Trello Clone Aurora

A premium, state-of-the-art Trello clone built with **Next.js 15**, **Feature-Sliced Design (FSD)**, **Prisma ORM**, and a beautiful theme-aware glassmorphic user interface.

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react&logoColor=white)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![FSD Architecture](https://img.shields.io/badge/Architecture-Feature--Sliced_Design-50BFF2.svg)](https://feature-sliced.design/)

---

## 🎨 Premium Visual Showcase

### ✨ Deep Neutral Dark Theme & Card Details
Enjoy a highly polished, distraction-free neutral dark theme (`#0a0a0c`) designed to make details, tags, and actions pop.

![Deep Neutral Dark Card Modal](./public/screenshots/card-modal-dark.png)

### 📊 Real-time Board Analytics Dashboard
Keep track of progress with an interactive burndown chart, priority distributions, and current task stats.

![Interactive Analytics Dashboard](./public/screenshots/dashboard-dark.png)

### ☀️ Refreshing Light Mode
Swap themes instantly for a clean, professional, and accessible day-time palette.

![Light Theme Card Modal](./public/screenshots/card-modal-light.png)

---

## 🚀 Key Features

*   **🎨 True Dual-Theme & Glassmorphic depth:** Premium theme-aware components that use smooth translucent backdrops, vibrant Aurora gradients, and support local image/photo background uploads.
*   **🌙 Professional Neutral Dark Mode:** Shifted from blue-purple tints to a clean matte-black backdrop (`#0a0a0c`) to minimize eye strain and match modern IDE aesthetics.
*   **📊 Dynamic Analytics Dashboard:** Direct chart insights featuring task completion ratios, overdue deadlines, and interactive Burndown charts.
*   **🌐 Fluent Internationalization (i18n):** Toggle layout and text languages dynamically between **English** and **Русский** with a single click.
*   **⚡ Feature-Sliced Design (FSD) Directory:** A highly scalable, decoupled folder architecture ensuring code maintainability and robust separation of concerns.
*   **💾 Fully-functional SQLite Client:** Real-time database sync using **Prisma ORM** for persistent Drag & Drop sorting, task checklist progress, and uploads.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Core Framework** | React 19, Next.js 15 (App Router), TypeScript |
| **Styling** | Tailwind CSS v4, Lucide React, Radix UI Primitives |
| **State Management** | Redux Toolkit (RTK) |
| **Database & ORM** | SQLite, Prisma ORM |
| **Linting & Rules** | ESLint, Prettier, Husky Pre-commit hooks |

---

## 📂 FSD Architecture & Directory Structure

```yaml
src/
├── app/                  # Application routing, global store configurations, and providers
├── entities/             # Business entities with independent slices (Board, Card, Column, Settings)
│   ├── board/
│   └── settings/
├── shared/               # Reusable UI-kit components, API clients, i18n configs, and hook helpers
│   ├── lib/
│   └── ui/
└── widgets/              # Composite widgets uniting multiple features (Board, Dashboard, Header)
    ├── board/
    ├── dashboard/
    ├── header/
    └── locale-toggle/
```

---

## ⚙️ Quick Installation & Setup

Follow these steps to spin up the development server locally:

### 1. Clone the Repository & Install Dependencies
```bash
git clone https://github.com/S1ach/Trello-clone.git
cd Trello-clone
npm install
```

### 2. Configure Database & Run Migration
Generate the SQLite database and seed initial tables through Prisma:
```bash
npx prisma db push
```

### 3. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

---

## 🛡️ Security & Performance

*   **Safe Static Routing:** Next.js 15 routing ensures zero exposure of critical APIs.
*   **Optimal Rendering:** Glassmorphic backdrops leverage modern GPU-accelerated backdrop filters for seamless FPS performance.
*   **Local Privacy:** All background uploads and SQLite items remain securely on your local storage.

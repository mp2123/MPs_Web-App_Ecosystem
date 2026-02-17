# System Architecture Report: Insurance & Mixology Monorepo

## 1. Core Architecture
The workspace uses a **Monorepo** structure:
- **`/frontend`**: Life Insurance AZ 2026 Study App.
- **`/bartender-app`**: Professional Mixology Portfolio.
Both are built with **Next.js 16**, **Tailwind CSS 4**, and **TypeScript**. They are hosted as separate projects on **Vercel**, sharing a single GitHub repository.

## 2. High-Performance Visuals
We have implemented several trending UI components:
- **Butter-Smooth Scroller:** The `CardScanner` component uses Framer Motion's `useAnimationFrame` and `useMotionValue` to achieve sub-pixel smooth motion at 120Hz, perfectly synced with high-refresh-rate displays.
- **WebGL Backgrounds:** Interactive dot-grid shaders and 3D topographical maps react to mouse movement using `@react-three/fiber`.
- **ASCII Glitch System:** Real-time hardware-accelerated clipping logic provides a futuristic "digital verification" aesthetic.

## 3. Data Management
- **Database:** Two separate **Supabase PostgreSQL** databases (connected via Prisma).
- **Optimization:** All database commands (`db push`, `generate`) are configured to use the **Session Pooler (Port 5432)** to bypass IPv6 and transaction locking issues.
- **Live Data:** 307 verified insurance questions are live in the production database.

## 4. AI & BYOK Model
The applications use a **"Bring Your Own Key"** model via the **Vercel AI SDK v6**.
- **User Choice:** Students can use free **Gemini 1.5 Flash** or OpenAI keys.
- **Zero-Cost Hosting:** Because keys are stored in the user's browser `localStorage`, there are no API costs for the site owner.

---
*Last Update: February 17, 2026*

# Yoseph Design

> **Architectural furniture & 3D studio** — A full-stack e‑commerce monorepo with storefront, REST API, and admin dashboard.

---

## Overview

| App | Port | Stack | Description |
|-----|------|--------|-------------|
| **Client** | `3000` | React, Vite, Tailwind | Public storefront: products, categories, Studio (3D models), cart, checkout, contact |
| **Server** | `4000` | Express, Node | REST API: products, orders, studio models, auth, image upload (Cloudinary) |
| **Admin** | `3001` | React, Vite | Dashboard: products & studio CRUD, orders, auth (`admin@example.com` / `admin123`) |

---

## Quick start

From the repo root:

```bash
npm install
npm run dev
```

| Link | URL |
|------|-----|
| **Store** | http://localhost:3000 |
| **Admin** | http://localhost:3001 |
| **API** | http://localhost:4000 |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run client, server, and admin in parallel |
| `npm run dev:client` | Storefront only |
| `npm run dev:server` | API only |
| `npm run dev:admin` | Admin dashboard only |
| `npm run build` | Build all apps |
| `npm run build:client` \| `build:server` \| `build:admin` | Build a single app |

**From an app folder:**

```bash
cd client && npm run dev
cd server && npm run dev
cd admin  && npm run dev
```

---

## Project structure

```
arch_design/
├── client/          # Storefront SPA (React + Vite)
├── server/          # Express API (products, orders, studio, auth, uploads)
├── admin/           # Admin dashboard SPA
└── package.json     # npm workspaces root
```

---

## Tech stack

- **Frontend:** React 18, React Router, Vite, Tailwind CSS, Framer Motion, Radix UI
- **Backend:** Express, multer, Cloudinary (optional), stateless admin auth
- **Tooling:** TypeScript, npm workspaces

# Ghost OS — Hacker Simulation Dashboard

> **DISCLAIMER:** This is a fully fictional entertainment simulation. No real hacking, network scanning, exploitation, or unauthorized activity occurs. All targets, systems, credentials, and darknet listings are fabricated.

---

## Requirements

- Node.js 18+
- MySQL 8.0+

---

## Setup

### 1. Clone & install

```bash
cd "d:\Hacker"
npm install
```

### 2. Configure environment

```bash
copy .env.example .env.local
```

Edit `.env.local` and fill in your MySQL credentials and a strong `JWT_SECRET`.

### 3. Create the database

```bash
node database/migrate.js
```

### 4. Seed the database

```bash
node database/seed.js
```

This creates:
- User: `ghost` / password: `ghost2077`
- 6 missions with stages
- Virtual filesystem nodes
- Darknet listings
- Crypto wallet entries (fictional)

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Login

| Field    | Value      |
|----------|------------|
| Username | `ghost`    |
| Password | `ghost2077`|

---

## Terminal Commands

| Command              | Description                        |
|---------------------|------------------------------------|
| `help`              | List all commands                  |
| `scan <ip>`         | Fake port scan                     |
| `connect <ip>`      | Connect to a fake host             |
| `breach <ip>`       | Simulate exploit chain             |
| `decrypt <file>`    | Fake decryption                    |
| `trace <ip>`        | Trace route simulation             |
| `inject <payload>`  | SQL/payload injection sim          |
| `bypass <target>`   | Firewall bypass simulation         |
| `ls [-a] [-l]`      | List virtual filesystem            |
| `cd <path>`         | Change directory                   |
| `cat <file>`        | Read virtual file                  |
| `missions`          | Show active mission                |
| `ai <message>`      | Talk to ORACLE AI assistant        |
| `matrix`            | Toggle matrix rain effect          |
| `status`            | System status overview             |
| `logs`              | View system event log              |
| `sudo <cmd>`        | Elevated command (mission trigger) |

---

## Architecture

```
src/
├── app/
│   ├── page.tsx              # Login
│   ├── dashboard/            # Main dashboard
│   ├── terminal/             # Full-screen terminal
│   ├── missions/             # Mission board
│   ├── darknet/              # Darknet marketplace
│   ├── settings/             # Settings panel
│   └── api/                  # REST API routes
│       ├── auth/login/
│       ├── missions/
│       ├── ai/
│       ├── settings/
│       └── terminal/
├── components/
│   ├── ui/                   # Shared UI components
│   ├── dashboard/            # Dashboard widgets
│   └── terminal/             # Terminal emulator
├── lib/
│   ├── db.ts                 # MySQL pool
│   ├── auth.ts               # JWT helpers
│   ├── terminal/             # Command parser, filesystem, simulators
│   ├── ai/                   # ORACLE response generator
│   └── missions/             # Mission engine
├── store/appStore.ts         # Zustand global state
├── hooks/useSound.ts         # Web Audio API sounds
└── types/index.ts            # TypeScript interfaces
```

---

## Scripts

```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

---

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **React 19**
- **Tailwind CSS v4**
- **Framer Motion** — animations
- **Zustand** — global state
- **MySQL 2** — database
- **bcryptjs** — password hashing
- **jsonwebtoken** — JWT auth
- **lucide-react** — icons

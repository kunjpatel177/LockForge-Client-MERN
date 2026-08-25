# LockForge Client

React frontend for **LockForge** — a secure password manager with vault encryption, dashboard, and public marketing pages.

**Created by Kunj Patel**

## Tech Stack

- React 19 + Vite
- React Router 7
- Axios
- Bootstrap 5
- Font Awesome
- React Toastify

## Prerequisites

- Node.js 18+
- LockForge server running on `http://localhost:5000` (see `../server/README.md`)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the example file and adjust if needed:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `/api/v1` | API base path (proxied to the server in dev) |

In development, Vite proxies `/api` requests to `http://localhost:5000` — no extra config is required for local work.

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Production build

```bash
npm run build
npm run preview
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production (`dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Oxlint |

## Project Structure

```
client/
├── public/              # Static assets (favicon, owner photo, etc.)
├── src/
│   ├── api/             # Axios instance + API modules
│   ├── components/      # Shared UI (navbar, sidebar, layouts)
│   ├── config/          # App config (owner profile)
│   ├── context/         # Auth & theme providers
│   └── pages/
│       ├── auth/        # Login, register, reset password
│       ├── dashboard/   # Vault, folders, settings, etc.
│       └── public/      # Home, About, Features, Security, Guide
├── index.html
└── vite.config.js
```

## Key Routes

### Public

| Path | Page |
|------|------|
| `/` | Home |
| `/about` | About |
| `/features` | Features |
| `/security` | Security |
| `/guide` | User Guide |
| `/login` | Login |
| `/register` | Register |

### Dashboard (protected)

| Path | Page |
|------|------|
| `/dashboard` | Overview |
| `/vault` | Credential vault |
| `/vault/add` | Add credential |
| `/folders` | Folders |
| `/favorites` | Favorites |
| `/notes` | Secure notes |
| `/generator` | Password generator |
| `/security-dashboard` | Password health |
| `/sessions` | Active sessions |
| `/activity` | Activity logs |
| `/backup` | Backup & restore |
| `/trash` | Trash |
| `/settings` | Settings |
| `/profile` | Profile |

## Authentication

- JWT access tokens are stored in `sessionStorage`
- API requests use `Authorization: Bearer <token>`
- Vault unlock state is managed separately via the master password
- Protected routes redirect unauthenticated users to `/login`

## Theme

Light and dark themes are supported via `ThemeContext`. The user's preference is saved and applied across public and dashboard pages.

## API Proxy (Development)

`vite.config.js` proxies API calls:

```js
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}
```

Ensure the server is running before using auth or vault features.

## Related

- [Server README](../server/README.md)
- [Project README](../README.md)

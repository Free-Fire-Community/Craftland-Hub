# Craftland Hub

A platform for discovering and sharing Free Fire Craftland maps, built with Next.js 15, Firebase, and TypeScript.

**Live site: [craftlandhub.freefirecommunity.com](https://craftlandhub.freefirecommunity.com)**

## Features

- **Map lookup**: Fetch and preview map details by code through a server-side API route.
- **Community submissions**: Signed-in users can submit maps, with duplicate prevention.
- **Voting & ranking**: Community-driven ranking for map discovery.
- **Internationalization**: UI available in English, Spanish, Hindi, Indonesian, Portuguese, and Urdu (via `next-intl`).
- **Server-side hardening**: Rate limiting, request-size limits, input validation, and security headers on API routes.
- **Modern UI**: Tailwind CSS with shadcn/ui (Radix) components, responsive across devices.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript, React 18 |
| Styling | Tailwind CSS, shadcn/ui, Radix UI |
| Backend | Firebase (Firestore, Auth) + Firebase Admin SDK |
| i18n | next-intl |
| Validation | Zod, react-hook-form |

## Prerequisites

- Node.js 18.18+ (Node 20+ recommended)
- A Firebase project with Firestore and Authentication enabled
- Firebase CLI: `npm install -g firebase-tools`

## Getting Started

1. **Clone and install**
   ```bash
   git clone https://github.com/iamaanahmad/craftland-hub.git
   cd craftland-hub
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then fill in `.env.local` with your own values. See [Environment Variables](#environment-variables) below.

3. **Point the Firebase CLI at your project**
   ```bash
   firebase login
   firebase use <your-firebase-project-id>
   ```

4. **Deploy Firestore rules and indexes**
   ```bash
   npm run deploy
   # equivalent to: firebase deploy --only firestore
   ```

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   The app runs on [http://localhost:9002](http://localhost:9002).

## Environment Variables

All variables are documented (names only) in [`.env.example`](./.env.example). Copy it to `.env.local` and fill in your values.

| Variable | Scope | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_FIREBASE_*` | Public | Firebase web config. Public by design; secured by Firestore rules + Auth, not by secrecy. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Public | OAuth 2.0 Web client ID used for Google One Tap. One Tap stays disabled until set. |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Server only | Full service-account JSON for the Admin SDK. Never commit a real value. |
| `INTERNAL_API_KEY` | Server only | Used to authorize internal API requests. |
| `NEXT_PUBLIC_API_KEY` | Public | Sent from the browser; not a true secret (see note below). |
| `MAP_API_BASE_URL` | Server only | Base URL of the upstream map-details API. Do not prefix with `NEXT_PUBLIC_`. |

> **Note on `NEXT_PUBLIC_API_KEY`:** anything prefixed with `NEXT_PUBLIC_` is bundled into the browser and visible to all visitors, so it provides no real secrecy. Server-side authorization for submissions relies on verifying the Firebase ID token, which is the actual security boundary.

## Available Scripts

```bash
npm run dev          # Start the dev server (Turbopack, port 9002)
npm run build        # Production build
npm run start        # Start the production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks (tsc --noEmit)
npm run deploy       # firebase deploy --only firestore
```

## Project Structure

```
src/
├── ai/             # Genkit AI scaffolding (placeholder, not yet wired)
├── app/            # Next.js App Router
│   ├── [locale]/   # Localized pages (home, map, category, search, submit, ...)
│   └── api/        # API routes
│       ├── fetch-map/    # Server-side map lookup
│       └── submit-map/   # Community submission endpoint
├── components/     # React components (incl. ui/ from shadcn)
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── i18n/           # next-intl routing/config
├── lib/            # Services & utilities (firebase, firestore-service, api-security, ...)
└── types/          # Shared TypeScript types

messages/           # Translation files per locale (en, es, hi, id, pt, ur)
firestore.rules     # Firestore security rules
firestore.indexes.json
```

## API Endpoints

### `POST /api/fetch-map`
Looks up map details by code. Protected by rate limiting, request-size limits, and an API-key header check.

Request:
```json
{ "map_code": "#FREEFIRE123", "region": "IND" }
```

Response (truncated):
```json
{
  "success": true,
  "map_details": {
    "workshop_name": "Epic Battle Map",
    "author_name": "MapCreator",
    "map_cover_url": "https://...",
    "team_count": 4,
    "min_est_play_time": 5,
    "max_est_play_time": 15
  }
}
```

### `POST /api/submit-map`
Submits a map to the community database. Requires a valid Firebase ID token (`Authorization: Bearer <token>`); anonymous users are rejected.

Request:
```json
{
  "mapCode": "#FREEFIRE123",
  "region": "IND",
  "tags": ["battle", "fun"],
  "fetchedData": { "...": "map details from /api/fetch-map" }
}
```

## Security

Security practices and reporting are documented in [SECURITY.md](./SECURITY.md). Key points:

- Never commit secrets. Keep `.env.local` out of version control (it is gitignored).
- Rotate the Firebase service-account key if it is ever exposed.
- Firestore rules are the real access-control boundary for client reads/writes — review them before going live.
- Keep dependencies patched.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for the workflow, setup, and conventions.

## License

Released under the MIT License. Add a `LICENSE` file with the full MIT text before publishing if one is not already present.

---

Built for the Free Fire community.

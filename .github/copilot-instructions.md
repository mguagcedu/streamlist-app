# Copilot / AI agent instructions — StreamList

Quick, actionable notes so an AI coding assistant can be productive immediately.

- Project type: Vite + React (React 18). Entry is `src/main.jsx`. Routing is handled with `react-router-dom` v6.
- Dev commands (package.json): `npm install`, `npm run dev` (vite), `npm run build`, `npm run preview`.

- Primary app provider: the running app imports `AppProvider` from `src/state/AppContext.jsx` (see `src/main.jsx`). Prefer edits there for global state and persisted keys.
  - That file persists theme/favorites/cart to localStorage under keys like `sl-favs`, `sl-theme` and stores a TMDB key in `tmdbKey` (localStorage) or via `import.meta.env.VITE_TMDB_KEY`.

- TMDB integration:
  - Service helper: `src/services/tmdb.js` exports `searchMovies(query)` and expects `import.meta.env.VITE_TMDB_API_KEY` (note suffix `_API_KEY`). It falls back to a small `mock()` when the key is missing.
  - UI usage: `src/components/SearchBox.jsx` performs its own fetch to TMDB using the `tmdbKey` from context. This means there are two TMDB code paths (service vs direct fetch) — be careful when changing API key names or centralizing logic.
  - README and `.env.local` reference `VITE_TMDB_API_KEY`; `src/state/AppContext.jsx` references `VITE_TMDB_KEY` — these names are inconsistent. If you change env names, update `src/services/tmdb.js`, `src/state/AppContext.jsx` and README consistently.

- Duplicate/legacy code to be aware of:
  - There is a legacy `src/context/AppContext.jsx` with a different shape/keys (KEY constants like `sl.list`, `sl.favorites`, etc.). The app uses `src/state/AppContext.jsx`. Do not modify `src/context/*` unless intentionally migrating.
  - `src/App.jsx` currently contains duplicated blocks (likely from an edit/merge error). Tests or runtime may fail until that file is cleaned. Use `src/App.jsx.bak` as a reference if needed.

- State & persistence conventions:
  - Context providers persist to localStorage via fine-grained keys (see `src/state/AppContext.jsx` and `src/context/AppContext.jsx`). Prefer the `useApp()` hook exported from `src/state/AppContext.jsx` (used across components).
  - Recent searches, favorites, cart and theme are all persisted. When adding new state, follow the existing pattern: initialize from localStorage, write via useEffect on change, and expose helpers via context.

- Components and where to look for common tasks:
  - Search & TMDB UX: `src/components/SearchBox.jsx`, `src/components/MovieResults.jsx`.
  - Display lists/cards: `src/components/MovieList.jsx`, `src/components/MovieCard.jsx`.
  - Cart UI: `src/components/CartDrawer.jsx` and cart helpers in `src/state/AppContext.jsx` or `src/context/AppContext.jsx` (different implementations).

- Conventions & gotchas for PRs/edits:
  - Keep routing in `src/main.jsx` / `src/App.jsx` consistent with react-router v6 patterns (Routes/Route). Avoid mixing older v5 patterns.
  - When adding env vars, use the Vite pattern `VITE_...` and update both service and state references.
  - Prefer `src/state/AppContext.jsx` as the authoritative provider (it is imported by `main.jsx`).
  - Use `src/services/tmdb.js` when adding search logic intended for reuse; refactor UI components (`SearchBox.jsx`) after ensuring the service contains equivalent behavior and a mock fallback.

- Example quick tasks and files to touch:
  - Add TMDB key fallback flow: edit `src/state/AppContext.jsx` (tmdbKey handling) and `src/services/tmdb.js` (env var name). Update `README.md` and `.env.local`.
  - Fix app entry bugs: inspect `src/App.jsx` and compare with `src/App.jsx.bak` to remove duplicated blocks.

If anything in these notes is unclear or you want more detail (for example, a list of exact localStorage keys or the preferred env var name), tell me which area to expand and I'll update this file.

# StreamList — Week 1–4 Combined

This package is a clean, ready project that satisfies Week 1, Week 2, Week 3, and Week 4 requirements in one place.

## Features by Week

- **Week 1 (Base app and styling):** Vite + React app scaffold, branded header, responsive grid, modern styles.
- **Week 2 (User events and icons):** Add to favorites, simple badge counter, event log persisted to localStorage.
- **Week 3 (LocalStorage + API):** Favorites and event history saved in localStorage. Movie search via TMDB, with a mock fallback if no API key.
- **Week 4 (AI testing improvements):** Debounced search, memoized cards, fixed effect dependencies, a11y labels, and stable callbacks.

## Setup

```bash
npm install
# optional: create .env file — the project accepts either VITE_TMDB_API_KEY (preferred) or VITE_TMDB_KEY
# example (preferred):
echo VITE_TMDB_API_KEY=your_tmdb_key_here > .env
# if you already use the older name, VITE_TMDB_KEY will also work
# example (alternate):
echo VITE_TMDB_KEY=your_tmdb_key_here > .env
npm run dev
```

If you skip the API key, the app will use mock movie results so the UI still works. The app will also accept a key entered in the UI (saved to `localStorage` as `tmdbKey`).

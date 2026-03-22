# Dragonflies — Fall 2025 Availability Tracker

A simple team availability web app for the Dragonflies soccer team. Players and parents can view the schedule, mark availability for each game, check the roster grid, and see the snack rotation.

## Features

- **Schedule view** — Game cards with date, time, location, and availability counts
- **Roster grid** — Spreadsheet-style overview of every player's status across all games
- **Snack schedule** — Who's bringing snacks each week (plus allergy info)
- **Persistent data** — Availability saves to localStorage

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for production

```bash
npm run build
```

The built files will be in `dist/`. You can deploy this to GitHub Pages, Netlify, Vercel, or any static host.

## Customizing

All team data (players, games, snack schedule) lives at the top of `src/App.jsx`. Edit those arrays to update for a new season.

# TPASS Calculator

A Progressive Web App (PWA) for tracking your TPASS transit card savings in Taiwan.

## What is TPASS?

TPASS is Taiwan's monthly transit pass (NT$1,200/month) that provides unlimited rides on metro, bus, and other public transportation. This app helps you track whether you're getting your money's worth.

## Features

- **Trip Recording** - Log trips with automatic fare calculation
- **Savings Tracker** - Visual progress showing how much you've saved (or need to ride more)
- **Quick Commute** - One-tap buttons for daily commute routes
- **Station Picker** - Select stations with auto fare lookup
- **Period Management** - Track multiple TPASS periods
- **Offline Support** - Works without internet (PWA)
- **Data Export/Import** - Backup and restore your data

## Supported Transit Systems

| System | Auto Fare |
|--------|-----------|
| Taipei Metro | Yes |
| New Taipei Metro (Circular Line) | Yes |
| Taoyuan Airport MRT | Yes |
| Danhai LRT | Yes |
| Ankeng LRT | Yes |
| TRA (Taiwan Railway) | Yes |
| Bus | Yes (by segments) |
| YouBike | Yes (by duration) |
| Highway Bus | Manual |
| Ferry | Manual |

## Tech Stack

- React 18 + TypeScript
- Vite + Tailwind CSS v4
- Dexie.js (IndexedDB)
- React Router v6
- Recharts
- vite-plugin-pwa

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Install as App

1. Deploy to Vercel: `npx vercel --prod`
2. Open the URL on your phone
3. Tap "Add to Home Screen"
4. Use offline anytime

## License

MIT

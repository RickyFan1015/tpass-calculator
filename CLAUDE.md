# TPASS Calculator

React + TypeScript + Tailwind PWA for tracking TPASS transit savings.

**Live:** https://tpass-calculator.vercel.app/
**Version:** v1.2.1

## Tech Stack
- Vite + React 18 + TypeScript
- Tailwind CSS v4 (via @tailwindcss/vite)
- Dexie.js (IndexedDB) + dexie-react-hooks
- React Router v6
- Recharts (charts)
- react-datepicker
- vite-plugin-pwa

## Commands
```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Production build
npm run preview  # Preview production build
```

## Project Structure
```
src/
├── components/
│   ├── common/       # Button, Card, Input, Modal, Layout, BottomNav, CircularProgress, TransportIcons, SwipeableItem
│   ├── Trip/         # EditTripModal, StationPicker
│   └── Settings/     # CommutePresetsManager
├── data/
│   ├── stations/     # Taipei Metro, Taoyuan Metro, New Taipei Metro, Danhai LRT, Ankeng LRT, TRA
│   └── fares/        # Fare matrices for all supported transit systems
├── hooks/            # usePeriodCheck
├── pages/            # Home, AddTrip, TripHistory, Periods, PeriodDetail, Settings
├── types/            # TypeScript interfaces (use const object, not enum)
└── utils/            # db, dateUtils, fareCalculator, formatters, statsCalculator, transportTypes
```

## Key Conventions
- All amounts in TWD (Taiwan Dollar)
- Dates use ISO 8601 strings (not Date objects)
- Statistics calculated on-demand (not cached)
- Use `const object as const` instead of `enum` (erasableSyntaxOnly)
- All functions must have JSDoc comments

## Database Schema (Dexie.js v3)
- `periods`: id, startDate, endDate, status, ticketPrice
- `trips`: id, periodId, transportType, amount, timestamp, departureStation?, arrivalStation?
- `settings`: id, defaultBusFare, favoriteStations
- `commutePresets`: id, name, transportType, departureStation, arrivalStation, amount, sortOrder

## Supported Transit Systems
| System | Station Picker | Auto Fare Calculation |
|--------|---------------|----------------------|
| Taipei Metro | Yes | Yes |
| New Taipei Metro (Circular Line) | Yes | Yes |
| Taoyuan Airport MRT | Yes | Yes |
| Danhai LRT | Yes | Yes |
| Ankeng LRT | Yes | Yes |
| TRA (Taiwan Railway) | Yes | Yes |
| Bus | No | Yes (by segments) |
| Highway Bus | No | Manual |
| YouBike | No | Yes (by duration + city, allows $0 for free promotions) |
| Ferry | No | Manual |

## UI Design
- **Glassmorphism style**: Semi-transparent backgrounds (`bg-white/70`) with backdrop blur
- **Gradient background**: Purple-blue gradient (`#667eea` → `#764ba2`)
- **CircularProgress**: SVG ring chart with fill animation (green=profit, orange=in progress)
- **TransportIcons**: Custom SVG icons for all transport types
- **BottomNav**: Duotone icons with gradient fill when active
- **SwipeableItem**: iOS-style swipe gestures for list items
- **Modal**: Bottom sheet on mobile, centered on desktop

## Features

### Home Page
- Compact layout optimized for iPhone 15 Pro Max (430x932)
- Circular progress with animated fill effect
- Quick commute buttons (2x2 grid, max 4) fixed above bottom nav
- Recent trips (5 items) with swipe gestures (right=copy, left=delete)
- Period info with animated day progress bar

### Quick Commute Buttons
- User-configurable routes via Settings page (max 4)
- Fixed position at bottom for easy thumb access
- One-tap recording without navigation
- 2x2 grid layout with gradient colors

### Add Trip
- Auto-fill last used stations for each transport type
- Swap button to reverse departure/arrival stations
- Auto fare calculation when both stations selected
- Full-height station picker modal (80vh)

### Trip History
- Group trips by date
- Duplicate button to copy trip with current timestamp
- Edit button to modify all fields including datetime
- Delete with confirmation

### Edit Trip Modal
- Modify transport type, amount, notes
- Edit datetime using react-datepicker (iOS compatible)
- Type-specific fields (segments for bus, duration for YouBike)

### Periods Page
- Shows "省下" for positive savings, "虧損" for negative
- Absolute value display for clearer understanding

### Settings Page
- Quick commute buttons management (max 4)
- Default bus fare setting
- Data export/import (JSON backup)
- Clear all data

## Completed Features
- [x] PWA setup with offline support
- [x] Period CRUD + auto-expiration check
- [x] Trip CRUD with edit/duplicate/delete
- [x] Multi-line station picker + fare calculation
- [x] YouBike fee calculation (city-based free time)
- [x] Period detail with Recharts pie chart
- [x] Glassmorphism UI modernization
- [x] Custom SVG transport icons
- [x] Circular progress indicator with animation
- [x] Auto-fill last stations + swap button
- [x] Datetime editing with react-datepicker
- [x] Duplicate trip feature
- [x] Quick commute buttons (max 4, via Settings)
- [x] Swipeable list items (copy/delete)
- [x] Mobile-optimized layout (iPhone 15 Pro Max)
- [x] Data backup/restore (JSON export/import)
- [x] Deployed to Vercel

## TODO (Optional)
- [ ] Refund calculator
- [ ] TPASS expiration reminder (Notification API)

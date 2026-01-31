# TPASS Calculator

React + TypeScript + Tailwind PWA for tracking TPASS transit savings.

## Tech Stack
- Vite + React 18 + TypeScript
- Tailwind CSS v4 (via @tailwindcss/vite)
- Dexie.js (IndexedDB) + dexie-react-hooks
- React Router v6
- Recharts (charts)
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
│   ├── common/       # Button, Card, Input, Modal, Layout, BottomNav, CircularProgress, TransportIcons, AnimatedNumber, SwipeableItem
│   ├── Trip/         # EditTripModal, StationPicker, FavoriteRoutes
│   └── Settings/     # FavoriteRoutesManager
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

## Database Schema (Dexie.js)
- `periods`: id, startDate, endDate, status, ticketPrice
- `trips`: id, periodId, transportType, amount, timestamp, departureStation?, arrivalStation?
- `favoriteRoutes`: id, name, transportType, sortOrder, defaultAmount?
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
| YouBike | No | Yes (by duration + city) |
| Ferry | No | Manual |

## UI Design
- **Glassmorphism style**: Semi-transparent backgrounds (`bg-white/70`) with backdrop blur
- **Gradient background**: Purple-blue gradient (`#667eea` → `#764ba2`)
- **CircularProgress**: SVG ring chart with fill animation (green=profit, orange=in progress)
- **TransportIcons**: Custom SVG icons for all transport types
- **BottomNav**: Duotone icons with gradient fill when active
- **SwipeableItem**: iOS-style swipe gestures for list items

## Features

### Home Page
- Compact layout optimized for iPhone 15 Pro Max (430x932)
- Circular progress with animated fill effect
- Quick commute buttons (上班/下班) fixed above bottom nav
- Recent trips with swipe gestures (right=copy, left=delete)
- Period info with animated day progress bar

### Quick Commute Buttons
- User-configurable routes via Settings page
- Fixed position at bottom for easy thumb access
- One-tap recording without navigation
- Up to 2 buttons displayed on Home page

### Add Trip
- Auto-fill last used stations for each transport type
- Swap button to reverse departure/arrival stations
- Auto fare calculation when both stations selected
- Full-height station picker modal (85vh)

### Trip History
- Group trips by date
- Duplicate button to copy trip with current timestamp
- Edit button to modify all fields including datetime
- Delete with confirmation

### Edit Trip Modal
- Modify transport type, amount, notes
- Edit datetime (datetime-local input)
- Type-specific fields (segments for bus, duration for YouBike)

### Periods Page
- Shows "省下" for positive savings, "虧損" for negative
- Absolute value display for clearer understanding

## Interactive Components

### AnimatedNumber
- Smooth number transitions with ease-out cubic easing
- Configurable duration and formatters

### SwipeableItem
- Touch-based swipe gestures
- Left/right action slots with customizable icons and colors
- 80px threshold for action trigger
- Visual feedback during swipe

### CircularProgress
- Animated fill from 0 to target percentage on mount
- 800ms animation duration with ease-out cubic

## Completed Features
- [x] PWA setup with offline support
- [x] Period CRUD + auto-expiration check
- [x] Trip CRUD with edit/duplicate/delete
- [x] Multi-line station picker + fare calculation
- [x] YouBike fee calculation (city-based free time)
- [x] Period detail with Recharts pie chart
- [x] Favorite routes management
- [x] Glassmorphism UI modernization
- [x] Custom SVG transport icons
- [x] Circular progress indicator with animation
- [x] Auto-fill last stations + swap button
- [x] Datetime editing in trip records
- [x] Duplicate trip feature
- [x] Configurable commute buttons (via Settings)
- [x] Swipeable list items (copy/delete)
- [x] Mobile-optimized layout (iPhone 15 Pro Max)

## TODO (Optional)
- [ ] Refund calculator
- [ ] Data backup/restore
- [ ] TPASS expiration reminder (Notification API)

## Reference
See `../TPASS-Calculator-Plan.md` for full specifications.

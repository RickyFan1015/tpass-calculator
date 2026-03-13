import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { Layout } from './components/common/Layout';
import { Home } from './pages/Home';
import { initializeSettings } from './utils/db';
import { usePeriodCheck } from './hooks/usePeriodCheck';

const AddTrip = lazy(() => import('./pages/AddTrip').then(m => ({ default: m.AddTrip })));
const TripHistory = lazy(() => import('./pages/TripHistory').then(m => ({ default: m.TripHistory })));
const Periods = lazy(() => import('./pages/Periods').then(m => ({ default: m.Periods })));
const PeriodDetail = lazy(() => import('./pages/PeriodDetail').then(m => ({ default: m.PeriodDetail })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));

/**
 * Apply dark mode class based on system preference.
 */
function applyDarkMode() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', isDark);
}

/**
 * Main App component with routing.
 *
 * @returns App element with router
 */
function App() {
  // Check and update expired periods on app start
  usePeriodCheck();

  useEffect(() => {
    // Initialize database settings on app start
    initializeSettings();

    // Apply dark mode based on system preference
    applyDarkMode();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyDarkMode();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddTrip />} />
            <Route path="/history" element={<TripHistory />} />
            <Route path="/periods" element={<Periods />} />
            <Route path="/periods/:id" element={<PeriodDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

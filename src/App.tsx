import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from './components/common/Layout';
import { Home, AddTrip, TripHistory, Periods, PeriodDetail, Settings } from './pages';
import { initializeSettings } from './utils/db';
import { usePeriodCheck } from './hooks';

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddTrip />} />
          <Route path="/history" element={<TripHistory />} />
          <Route path="/periods" element={<Periods />} />
          <Route path="/periods/:id" element={<PeriodDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

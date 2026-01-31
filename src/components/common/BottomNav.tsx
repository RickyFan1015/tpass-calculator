import { NavLink } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: (isActive: boolean) => React.ReactNode;
}

/**
 * Modern duotone icon components with gradient fill when active.
 */
const icons = {
  home: (isActive: boolean) => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="home-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      {isActive ? (
        <>
          <path
            d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6a1 1 0 00-1-1h-4a1 1 0 00-1 1v6H4a1 1 0 01-1-1V9.5z"
            fill="url(#home-gradient)"
          />
        </>
      ) : (
        <path
          d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6a1 1 0 00-1-1h-4a1 1 0 00-1 1v6H4a1 1 0 01-1-1V9.5z"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  ),

  add: (isActive: boolean) => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="add-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      {isActive ? (
        <>
          <circle cx="12" cy="12" r="9" fill="url(#add-gradient)" />
          <path d="M12 8v8m4-4H8" stroke="white" strokeWidth={2} strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.5} />
          <path d="M12 8v8m4-4H8" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </>
      )}
    </svg>
  ),

  history: (isActive: boolean) => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="history-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      {isActive ? (
        <>
          <rect x="4" y="4" width="16" height="17" rx="2" fill="url(#history-gradient)" />
          <path d="M8 2v3m8-3v3" stroke="url(#history-gradient)" strokeWidth={2} strokeLinecap="round" />
          <path d="M8 11h8m-8 4h5" stroke="white" strokeWidth={1.5} strokeLinecap="round" />
        </>
      ) : (
        <>
          <rect x="4" y="4" width="16" height="17" rx="2" stroke="currentColor" strokeWidth={1.5} />
          <path d="M8 2v3m8-3v3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
          <path d="M8 11h8m-8 4h5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </>
      )}
    </svg>
  ),

  periods: (isActive: boolean) => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="periods-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      {isActive ? (
        <>
          <circle cx="12" cy="12" r="9" fill="url(#periods-gradient)" />
          <path d="M12 7v5l3 3" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.5} />
          <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  ),

  settings: (isActive: boolean) => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="settings-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      {isActive ? (
        <>
          <path
            d="M12 15a3 3 0 100-6 3 3 0 000 6z"
            fill="white"
          />
          <path
            d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
            fill="url(#settings-gradient)"
          />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={1.5} />
          <path
            d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
            stroke="currentColor"
            strokeWidth={1.5}
          />
        </>
      )}
    </svg>
  )
};

const navItems: NavItem[] = [
  { path: '/', label: '首頁', icon: icons.home },
  { path: '/add', label: '新增', icon: icons.add },
  { path: '/history', label: '紀錄', icon: icons.history },
  { path: '/periods', label: '週期', icon: icons.periods },
  { path: '/settings', label: '設定', icon: icons.settings }
];

/**
 * Bottom navigation component with glassmorphism style.
 * Features gradient-filled icons when active.
 *
 * @returns BottomNav element
 */
export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-t border-white/20 dark:border-white/10 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                  {isActive && (
                    <div className="absolute inset-0 -m-2 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-xl blur-lg" />
                  )}
                  <div className="relative">
                    {item.icon(isActive)}
                  </div>
                </div>
                <span className={`text-xs mt-1 transition-all duration-200 ${
                  isActive ? 'font-semibold' : 'font-normal'
                }`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

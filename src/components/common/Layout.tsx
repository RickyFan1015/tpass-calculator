import { type ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout component with bottom navigation.
 *
 * @param props - Layout props including children
 * @returns Layout element with bottom navigation
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen pb-20">
      <main className="safe-area-top">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

/**
 * Page header component with title and optional action.
 *
 * @param props - PageHeader props
 * @returns PageHeader element
 */
export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-b border-white/20 dark:border-white/10 px-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

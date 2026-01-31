import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Reusable card component for content containers.
 *
 * @param props - Card props including children and className
 * @returns Card element
 */
export function Card({ children, className = '', onClick }: CardProps) {
  const baseStyles = 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-lg shadow-black/5';
  const clickableStyles = onClick ? 'cursor-pointer hover:shadow-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all' : '';

  return (
    <div
      className={`${baseStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card header component.
 *
 * @param props - CardHeader props
 * @returns CardHeader element
 */
export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-4 py-3 border-b border-white/10 dark:border-white/5 ${className}`}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card body component.
 *
 * @param props - CardBody props
 * @returns CardBody element
 */
export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card footer component.
 *
 * @param props - CardFooter props
 * @returns CardFooter element
 */
export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-4 py-3 border-t border-white/10 dark:border-white/5 ${className}`}>
      {children}
    </div>
  );
}

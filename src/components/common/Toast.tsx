import { useEffect } from 'react';

/**
 * Toast notification component for displaying brief success messages.
 * Automatically dismisses after the specified duration.
 *
 * @param message - The message to display in the toast
 * @param onClose - Callback function when toast should be dismissed
 * @param duration - Duration in milliseconds before auto-dismiss (default: 2000)
 * @returns Toast notification element or null if no message
 */
export function Toast({
  message,
  onClose,
  duration = 2000
}: {
  message: string | null;
  onClose: () => void;
  duration?: number;
}) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50
        bg-gray-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-full
        text-sm shadow-lg animate-fade-in flex items-center gap-2"
      role="status"
      aria-live="polite"
    >
      <svg
        className="w-4 h-4 text-green-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      {message}
    </div>
  );
}

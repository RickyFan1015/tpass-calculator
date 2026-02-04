/**
 * Common icon components used throughout the app.
 */

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * Checkmark icon for success states.
 *
 * @param size - Icon size in pixels (default: 20)
 * @param color - Icon color (default: currentColor)
 * @param className - Additional CSS classes
 * @returns CheckIcon element
 */
export function CheckIcon({ size = 20, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

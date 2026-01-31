import { useState, useEffect } from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  sublabel?: string;
}

/**
 * Circular progress indicator with SVG and animation.
 * Displays a ring-shaped progress bar with centered text.
 *
 * @param props - CircularProgress props
 * @param props.percentage - Progress percentage (0-100+, can exceed 100)
 * @param props.size - Diameter of the circle in pixels (default: 160)
 * @param props.strokeWidth - Width of the progress stroke (default: 12)
 * @param props.label - Main text displayed in center
 * @param props.sublabel - Secondary text below the label
 * @returns CircularProgress SVG element
 */
export function CircularProgress({
  percentage,
  size = 160,
  strokeWidth = 12,
  label,
  sublabel,
}: CircularProgressProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  // Animate percentage on mount and when value changes
  useEffect(() => {
    const targetPercentage = Math.min(Math.max(percentage, 0), 100);
    const duration = 800;
    const startTime = performance.now();
    const startValue = animatedPercentage;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (targetPercentage - startValue) * easeOut;

      setAnimatedPercentage(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedPercentage / 100) * circumference;

  const isComplete = percentage >= 100;
  const progressColor = isComplete
    ? 'url(#gradient-green)'
    : 'url(#gradient-orange)';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="gradient-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200/50 dark:text-gray-700/50"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${
          isComplete ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'
        }`}>
          {label}
        </span>
        {sublabel && (
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}

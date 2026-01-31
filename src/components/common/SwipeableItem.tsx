import { useState, useRef, type ReactNode } from 'react';

interface SwipeableItemProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: { icon: ReactNode; color: string; label: string };
  rightAction?: { icon: ReactNode; color: string; label: string };
}

const SWIPE_THRESHOLD = 80;

/**
 * Swipeable list item component with left/right actions.
 *
 * @param props - SwipeableItem props
 * @returns SwipeableItem element
 */
export function SwipeableItem({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction
}: SwipeableItemProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
    isDragging.current = true;
    setIsAnimating(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;

    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;

    // Limit swipe distance with resistance
    const maxSwipe = 100;
    const resistance = 0.5;
    let newTranslate = diff;

    if (Math.abs(diff) > maxSwipe) {
      const extra = Math.abs(diff) - maxSwipe;
      newTranslate = diff > 0
        ? maxSwipe + extra * resistance
        : -maxSwipe - extra * resistance;
    }

    // Only allow swipe in directions that have actions
    if (diff > 0 && !rightAction) return;
    if (diff < 0 && !leftAction) return;

    setTranslateX(newTranslate);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    setIsAnimating(true);

    if (translateX > SWIPE_THRESHOLD && onSwipeRight) {
      onSwipeRight();
    } else if (translateX < -SWIPE_THRESHOLD && onSwipeLeft) {
      onSwipeLeft();
    }

    setTranslateX(0);
  };

  const leftOpacity = Math.min(Math.abs(translateX) / SWIPE_THRESHOLD, 1);
  const rightOpacity = Math.min(translateX / SWIPE_THRESHOLD, 1);

  return (
    <div className="relative overflow-hidden">
      {/* Left action (shown when swiping right) */}
      {rightAction && (
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-start pl-4 w-24"
          style={{
            backgroundColor: rightAction.color,
            opacity: rightOpacity
          }}
        >
          <div className="flex flex-col items-center gap-0.5 text-white">
            {rightAction.icon}
            <span className="text-[10px]">{rightAction.label}</span>
          </div>
        </div>
      )}

      {/* Right action (shown when swiping left) */}
      {leftAction && (
        <div
          className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 w-24"
          style={{
            backgroundColor: leftAction.color,
            opacity: leftOpacity
          }}
        >
          <div className="flex flex-col items-center gap-0.5 text-white">
            {leftAction.icon}
            <span className="text-[10px]">{leftAction.label}</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        className={`relative bg-white/70 dark:bg-gray-800/70 ${isAnimating ? 'transition-transform duration-200' : ''}`}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}

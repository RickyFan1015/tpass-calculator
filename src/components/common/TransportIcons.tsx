import { type SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
};

/**
 * Base icon wrapper with common props.
 */
function IconBase({ size = 24, color, className = '', children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="transport-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      {children}
    </svg>
  );
}

/**
 * Metro/MRT icon - train front view.
 */
export function MetroIcon({ size = 24, color = 'currentColor', ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <rect x="4" y="4" width="16" height="14" rx="3" fill={color} />
      <rect x="6" y="6" width="5" height="4" rx="1" fill="white" fillOpacity="0.9" />
      <rect x="13" y="6" width="5" height="4" rx="1" fill="white" fillOpacity="0.9" />
      <circle cx="8" cy="14" r="1.5" fill="white" fillOpacity="0.9" />
      <circle cx="16" cy="14" r="1.5" fill="white" fillOpacity="0.9" />
      <rect x="7" y="18" width="3" height="2" rx="0.5" fill={color} />
      <rect x="14" y="18" width="3" height="2" rx="0.5" fill={color} />
    </IconBase>
  );
}

/**
 * Light Rail Transit icon.
 */
export function LightRailIcon({ size = 24, color = 'currentColor', ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <rect x="5" y="5" width="14" height="12" rx="2" fill={color} />
      <rect x="7" y="7" width="4" height="3" rx="0.5" fill="white" fillOpacity="0.9" />
      <rect x="13" y="7" width="4" height="3" rx="0.5" fill="white" fillOpacity="0.9" />
      <line x1="12" y1="11" x2="12" y2="15" stroke="white" strokeOpacity="0.9" strokeWidth="1.5" />
      <circle cx="8" cy="17" r="1.5" fill={color} />
      <circle cx="16" cy="17" r="1.5" fill={color} />
      <line x1="5" y1="20" x2="19" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

/**
 * Airport Express icon - sleek train.
 */
export function AirportExpressIcon({ size = 24, color = 'currentColor', ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M4 10L6 6h12l2 4v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6z" fill={color} />
      <rect x="6" y="8" width="4" height="3" rx="0.5" fill="white" fillOpacity="0.9" />
      <rect x="14" y="8" width="4" height="3" rx="0.5" fill="white" fillOpacity="0.9" />
      <circle cx="7.5" cy="15" r="1" fill="white" fillOpacity="0.9" />
      <circle cx="16.5" cy="15" r="1" fill="white" fillOpacity="0.9" />
      <rect x="7" y="18" width="2.5" height="2" rx="0.5" fill={color} />
      <rect x="14.5" y="18" width="2.5" height="2" rx="0.5" fill={color} />
      <path d="M10 4h4l1 2H9l1-2z" fill={color} fillOpacity="0.7" />
    </IconBase>
  );
}

/**
 * Taiwan Railway icon - classic train.
 */
export function TrainIcon({ size = 24, color = 'currentColor', ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <rect x="3" y="6" width="18" height="11" rx="2" fill={color} />
      <rect x="5" y="8" width="3" height="3" rx="0.5" fill="white" fillOpacity="0.9" />
      <rect x="10" y="8" width="4" height="3" rx="0.5" fill="white" fillOpacity="0.9" />
      <rect x="16" y="8" width="3" height="3" rx="0.5" fill="white" fillOpacity="0.9" />
      <line x1="3" y1="13" x2="21" y2="13" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      <circle cx="7" cy="17" r="1.5" fill={color} />
      <circle cx="12" cy="17" r="1.5" fill={color} />
      <circle cx="17" cy="17" r="1.5" fill={color} />
      <rect x="6" y="19" width="2" height="1.5" rx="0.25" fill={color} />
      <rect x="16" y="19" width="2" height="1.5" rx="0.25" fill={color} />
    </IconBase>
  );
}

/**
 * Bus icon.
 */
export function BusIcon({ size = 24, color = 'currentColor', ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <rect x="3" y="5" width="18" height="13" rx="2" fill={color} />
      <rect x="5" y="7" width="6" height="4" rx="1" fill="white" fillOpacity="0.9" />
      <rect x="13" y="7" width="6" height="4" rx="1" fill="white" fillOpacity="0.9" />
      <rect x="3" y="12" width="18" height="2" fill={color} fillOpacity="0.7" />
      <circle cx="7" cy="18" r="2" fill={color} />
      <circle cx="7" cy="18" r="1" fill="white" fillOpacity="0.5" />
      <circle cx="17" cy="18" r="2" fill={color} />
      <circle cx="17" cy="18" r="1" fill="white" fillOpacity="0.5" />
      <rect x="17" y="5" width="3" height="5" rx="1" fill={color} fillOpacity="0.8" />
    </IconBase>
  );
}

/**
 * Highway Bus / Coach icon.
 */
export function CoachIcon({ size = 24, color = 'currentColor', ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M2 8a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" fill={color} />
      <rect x="4" y="7" width="3" height="4" rx="0.5" fill="white" fillOpacity="0.9" />
      <rect x="8" y="7" width="3" height="4" rx="0.5" fill="white" fillOpacity="0.9" />
      <rect x="12" y="7" width="3" height="4" rx="0.5" fill="white" fillOpacity="0.9" />
      <rect x="16" y="7" width="4" height="4" rx="0.5" fill="white" fillOpacity="0.9" />
      <line x1="2" y1="13" x2="22" y2="13" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
      <circle cx="6" cy="18" r="2" fill={color} />
      <circle cx="6" cy="18" r="1" fill="white" fillOpacity="0.5" />
      <circle cx="18" cy="18" r="2" fill={color} />
      <circle cx="18" cy="18" r="1" fill="white" fillOpacity="0.5" />
    </IconBase>
  );
}

/**
 * YouBike bicycle icon.
 */
export function BikeIcon({ size = 24, color = 'currentColor', ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <circle cx="6" cy="16" r="4" stroke={color} strokeWidth="2" fill="none" />
      <circle cx="18" cy="16" r="4" stroke={color} strokeWidth="2" fill="none" />
      <path d="M6 16l4-8h4l2 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M14 12l4 4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M10 8l2-3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="4" r="1.5" fill={color} />
    </IconBase>
  );
}

/**
 * Ferry boat icon.
 */
export function FerryIcon({ size = 24, color = 'currentColor', ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M4 15l2-6h12l2 6" fill={color} />
      <rect x="8" y="6" width="8" height="5" rx="1" fill={color} fillOpacity="0.8" />
      <rect x="10" y="7" width="4" height="3" rx="0.5" fill="white" fillOpacity="0.9" />
      <rect x="11" y="3" width="2" height="4" fill={color} />
      <path d="M2 17c1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 2.5-1 4-1 2.5 1 4 1" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M2 20c1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 2.5-1 4-1 2.5 1 4 1" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
    </IconBase>
  );
}

/**
 * Transport icon components mapped by type.
 */
export const TransportIcons = {
  metro: MetroIcon,
  lightRail: LightRailIcon,
  airportExpress: AirportExpressIcon,
  train: TrainIcon,
  bus: BusIcon,
  coach: CoachIcon,
  bike: BikeIcon,
  ferry: FerryIcon,
} as const;

export type TransportIconName = keyof typeof TransportIcons;

interface TransportIconProps {
  iconType: TransportIconName;
  size?: number;
  color?: string;
  className?: string;
}

/**
 * Renders a transport icon by type name.
 *
 * @param props - TransportIcon props
 * @param props.iconType - The icon type name (e.g., 'metro', 'bus')
 * @param props.size - Icon size in pixels (default: 24)
 * @param props.color - Icon color (default: currentColor)
 * @param props.className - Additional CSS classes
 * @returns Transport icon SVG element
 */
export function TransportIcon({ iconType, size = 24, color, className }: TransportIconProps) {
  const IconComponent = TransportIcons[iconType];
  return <IconComponent size={size} color={color} className={className} />;
}

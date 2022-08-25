import { FunctionComponent, ReactNode } from 'react';

export interface BadgeProps {
  /** What should be displayed in the badge */
  children: ReactNode;
  /** Adds a custom class to the badge */
  className?: string;
  /** Sets the color of the badge */
  color?: 'default' | 'primary' | 'red';
  /** The size of the badge */
  size?: 'small' | 'medium';
}

/**
 * Renders a badge for showing notifications, etc
 * @example
 * <Badge color="red">3</Badge>
 */
export const Badge: FunctionComponent<BadgeProps>;
export default Badge;

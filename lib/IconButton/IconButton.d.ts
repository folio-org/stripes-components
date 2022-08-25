import {
  AriaAttributes,
  CSSProperties,
  ForwardRefExoticComponent,
  MouseEventHandler,
  PropsWithoutRef,
  RefAttributes,
} from 'react';
import { LinkProps } from 'react-router-dom';
import { AllOrNone, RequireOneOrNone } from '../../util/typeUtils';
import { BadgeProps } from '../Badge/Badge';
import { IconType } from '../Icon/Icon';

export interface IconButtonBaseProps extends AriaAttributes {
  /**
   * Indicates whether the element (or a grouping it controls) is expanded
   * @deprecated use `aria-label` instead
   */
  ariaExpanded?: AriaAttributes['aria-expanded'];
  /**
   * Indicates the availability and type of a popup element
   * @deprecated use `aria-haspopup` instead
   */
  ariaHasPopup?: AriaAttributes['aria-haspopup'];
  /**
   * Provides a custom label for the element
   * @deprecated use `aria-label` instead
   */
  ariaLabel?: AriaAttributes['aria-label'];
  /**
   * Identify the element which labels the current element
   * @deprecated use `aria-labelledby` instead
   */
  ariaLabelledby?: AriaAttributes['aria-labelledby'];
  /** If this button should be automatically focused */
  autoFocus?: boolean;
  /** Add a custom CSS class to the button */
  className?: string;
  /** The icon to display */
  icon: IconType;
  /** Adds a custom class name to the icon element */
  iconClassName?: string;
  /**
   * Defines the size of the icon inside the button
   * @see size for the size of the button itself
   */
  iconSize?: 'small' | 'medium';
  /** Adds a custom ID to the icon */
  id?: string;
  /**
   * Adds a custom class name to the middle element, between the outer
   * button/anchor element and the icon itself
   */
  innerClassName?: string;
  /** Handle an `onClick` event */
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  /** Handle an `onMouseDown` event */
  onMouseDown?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  /**
   * Defines the size of the button itself
   * @see iconSize for the size of the icon
   */
  size?: 'small' | 'medium';
  /** Set custom styles for the button */
  style?: CSSProperties;
  /** Control the tabIndex of the button */
  tabIndex?: number;
}

// these are mutually exclusive (and can be entirely omitted, if needed)
export interface IconButtonButtonLinkProps {
  /** Set the type of `<button>`.  Incompatible with `href` and `to` */
  type: JSX.IntrinsicElements['button']['type'];
  /** Adds a link to the button, like a normal <a>.  Incompatible with `type` and `to`. */
  href: string;
  /**
   * Controls where the link should go, like for a `<Link>`.
   * This prop is incompatible with `type` and `href`.
   * @see https://github.com/remix-run/react-router/blob/master/docs/components/link.md
   */
  to: LinkProps['to'];
}

// badgeColor may not be specified without badgeCount
export interface IconButtonBadgeProps {
  /**
   * Sets the badge color
   * @see badgeCount for the required content of the badge
   */
  badgeColor?: BadgeProps['color'];
  /** Adds a badge with the given contents */
  badgeCount: BadgeProps['children'];
}

export type IconButtonProps = IconButtonBaseProps &
  RequireOneOrNone<IconButtonButtonLinkProps, 'type' | 'href' | 'to'> &
  AllOrNone<IconButtonBadgeProps> &
  (JSX.IntrinsicElements['a'] | JSX.IntrinsicElements['button']);

/**
 * Renders a given icon
 * @example
 * <IconButton
 *   icon="comment"
 *   badgeCount="3"
 *   onClick={...}
 * />
 */
export const IconButton: ForwardRefExoticComponent<
  PropsWithoutRef<IconButtonProps> &
    RefAttributes<HTMLAnchorElement | HTMLButtonElement>
>;
export default IconButton;

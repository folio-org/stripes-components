import {
  AriaAttributes,
  ComponentType,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from 'react';

import { AllOrNone } from '../../util/typeUtils';

export type IconName =
  | 'allocate'
  | 'archive'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'bookmark'
  | 'calendar'
  | 'cancel'
  | 'caret-down'
  | 'caret-left'
  | 'caret-right'
  | 'caret-up'
  | 'cart'
  | 'check-circle'
  | 'check-in'
  | 'check-out'
  | 'chevron-double-left'
  | 'chevron-double-right'
  | 'chevron-left'
  | 'chevron-right'
  | 'clipboard'
  | 'clock'
  | 'combine'
  | 'comment'
  | 'default'
  | 'deselect-all'
  | 'diacritic'
  | 'document'
  | 'download'
  | 'drag-drop'
  | 'duplicate'
  | 'edit'
  | 'ellipsis'
  | 'end-mark'
  | 'envelope'
  | 'exclamation-circle'
  | 'external-link'
  | 'eye-closed'
  | 'eye-open'
  | 'flag'
  | 'gear'
  | 'house'
  | 'indexes'
  | 'info'
  | 'lightning'
  | 'link'
  | 'lock'
  | 'play'
  | 'plus-sign'
  | 'preview'
  | 'print'
  | 'profile'
  | 'question-mark'
  | 'receive'
  | 'refresh'
  | 'replace'
  | 'report'
  | 'save'
  | 'search'
  | 'select-all'
  | 'source'
  | 'spinner-ellipsis'
  | 'tag'
  | 'times-circle-solid'
  | 'times-circle'
  | 'times'
  | 'transfer'
  | 'trash'
  | 'triangle-down'
  | 'triangle-up'
  | 'unlink';

/**
 * Custom icons must accept the following props
 * (and pass them onto their `<svg>`)
 */
export interface CustomIconProps {
  className: string;
  viewBox: string;
  focusable: boolean | 'true' | 'false';
}

/**
 * An icon, to be rendered by `<Icon>`.  This supports a known icon name
 * (see {@link IconName}) or a custom component that takes SVG props and
 * returns a `<svg>`.
 */
export type IconType = IconName | ComponentType<CustomIconProps>;

export interface IconPropsWithoutChildren extends AriaAttributes {
  /**
   * Specify an accessible label for the icon
   * @deprecated use `aria-label` instead
   */
  ariaLabel?: AriaAttributes['aria-label'];
  /** The icon to render, or a component for custom icons */
  icon: IconType;
  /** Applies a custom class name to the icon directly */
  iconClassName?: string;
  /** Applies a class to the internal wrapper div around the icon; useful for hover effects */
  iconRootClass?: string;
  /** Apply a style to the icon -- currently, `"action"` is the only supported style */
  iconStyle?: 'action';
  /** Set the outer element's ID */
  id?: string;
  /** Control the size of the icon */
  size?: 'small' | 'medium' | 'large';
  /** Give the icon a specific coloration */
  status?: undefined | 'error' | 'warn' | 'success';
  /** Set a custom tabIndex of the element */
  tabIndex?: number;
}

// ensure iconPosition cannot exist without children
// either children exists (and iconPosition optionally does), or neither.
export interface IconChildrenProps {
  /** Adds content next to the icon, useful for adding a label */
  children: ReactNode;
  /** Sets the position of the icon, for use with children */
  iconPosition?: 'start' | 'end';
}

export type IconProps = IconPropsWithoutChildren & AllOrNone<IconChildrenProps>;

/**
 * Renders a given icon
 * @example <Icon icon="trash" />
 */
export const Icon: ForwardRefExoticComponent<
  PropsWithoutRef<IconProps> & RefAttributes<HTMLSpanElement>
>;
export default Icon;

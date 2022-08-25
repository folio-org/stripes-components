import {
  AriaAttributes,
  ForwardRefExoticComponent,
  MouseEventHandler,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from 'react';
import { LinkProps } from 'react-router-dom';
import { RequireOneOrNone } from '../../util/typeUtils';

export interface ButtonBaseProps extends AriaAttributes {
  /** Changes the (flexbox) alignment of the button */
  align?: 'start' | 'center' | 'end';
  /** Allows the anchor's default onClick */
  allowAnchorClick?: boolean;
  /** If this button should be automatically focused */
  autoFocus?: boolean;
  /** Remove the margin from the bottom */
  bottomMargin0?: boolean;
  /** Add a custom CSS class to the button */
  buttonClass?: string;
  /** Sets the style of the button */
  buttonStyle?:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'dropdownItem';
  /** The button for the label */
  children: ReactNode;
  /** Forces the button to 100% width */
  fullWidth?: boolean;
  /** Remove the margin from the bottom */
  marginBottom0?: boolean;
  /** Handle an `onClick` event */
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  /** Remove the padding from all sides */
  paddingSide0?: boolean;
  /** Adds a custom role to the button */
  role?: JSX.IntrinsicElements['button']['role'];
}

// these are mutually exclusive (and can be entirely omitted, if needed)
export interface ButtonLinkProps {
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

export type ButtonProps = ButtonBaseProps &
  RequireOneOrNone<ButtonLinkProps, 'type' | 'href' | 'to'> &
  (JSX.IntrinsicElements['button'] | JSX.IntrinsicElements['a']);

/**
 * Renders a given button
 * @example
 * <Button>Sample</Button>
 */
export const Button: ForwardRefExoticComponent<
  PropsWithoutRef<ButtonProps> &
    RefAttributes<HTMLAnchorElement | HTMLButtonElement>
>;
export default Button;

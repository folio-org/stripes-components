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

export interface NavListItemBaseProps extends AriaAttributes {
  /** What should be displayed for this nav item */
  children: ReactNode;
  /** Adds custom class(es) to the item */
  className?: string;
  /** If this navigation item is currently active */
  isActive?: boolean;
  /** Call a custom function when the item is clicked */
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}
export interface NavListItemInteractiveProps {
  /** Adds a link to the button, like a normal <a>.  Incompatible with `onClick` and `to`. */
  href: string;
  /**
   * Controls where the link should go, like for a `<Link>`.
   * This prop is incompatible with `type` and `href`.
   * @see
   * https://github.com/remix-run/react-router/blob/f9c4a0e8ec022545b2679d381dc41652f1694804/docs/components/link.md
   */
  to: LinkProps['to'];
}

export type NavListItemProps = NavListItemBaseProps &
  RequireOneOrNone<NavListItemInteractiveProps>;

/**
 * Renders an item in a nav list
 * @example
 * <NavListItem onClick={onClickHandler}>Users</NavListItem>
 * <NavListItem href="#organization">Organization</NavListItem>
 * <NavListItem to="circulation">Circulation</NavListItem>
 */
export const NavListItem: ForwardRefExoticComponent<
  PropsWithoutRef<NavListItemProps> & RefAttributes<HTMLAnchorElement>
>;
export default NavListItem;

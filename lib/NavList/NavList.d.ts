import {
  AriaAttributes,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from 'react';

export interface NavListProps extends AriaAttributes {
  /**
   * Specify an accessible label for the icon
   * @deprecated use `aria-label` instead
   */
  ariaLabel?: AriaAttributes['aria-label'];
  /** The contents of the nav list */
  children: ReactNode;
  /** Adds custom class(es) to the item */
  className?: string;
}

/**
 * Renders a navigation list
 * @example
 * <NavList>
 *   <NavListSection label="Some label (optional)" activeLink="/active-link-here" striped>
 *     <NavListItem onClick={onClickHandler}>Users</NavListItem>
 *     <NavListItem href="#organization">Organization</NavListItem>
 *     <NavListItem to="circulation">Circulation</NavListItem>
 *   </NavListSection>
 * </NavList>
 */
export const NavList: ForwardRefExoticComponent<
  PropsWithoutRef<NavListProps> & RefAttributes<HTMLElement>
>;
export default NavList;

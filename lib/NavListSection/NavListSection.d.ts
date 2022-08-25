import {
  AriaAttributes,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from 'react';
import { LinkProps } from 'react-router-dom';
import { HeadlineProps } from '../Headline/Headline';

export interface NavListSectionProps extends AriaAttributes {
  /** The link currently being displayed */
  activeLink?: LinkProps['to'] | string;
  /** {@link NavListItem}s to display */
  children: ReactNode;
  /** Adds custom class(es) to the section */
  className?: string;
  /** The label to display inside a {@link Headline} */
  label?: HeadlineProps['children'];
  /** If the items should alternate colors */
  striped?: boolean;
  /** The tag to render for the {@link Headline} */
  tag?: HeadlineProps['tag'];
}

/**
 * Renders a section of NavListItems
 * @example
 * <NavListSection label="Some label (optional)" activeLink="/active-link-here" striped>
 *   <NavListItem onClick={onClickHandler}>Users</NavListItem>
 *   <NavListItem href="#organization">Organization</NavListItem>
 *   <NavListItem to="circulation">Circulation</NavListItem>
 * </NavListSection>
 */
export const NavListSection: ForwardRefExoticComponent<
  PropsWithoutRef<NavListSectionProps> & RefAttributes<HTMLDivElement>
>;
export default NavListSection;

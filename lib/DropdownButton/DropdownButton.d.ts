import {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from 'react';
import { ButtonProps } from '../Button/Button';

export type DropdownButtonProps = ButtonProps & {
  /** Dropdown button contents */
  children: ReactNode;
};

/**
 * Renders a button for a dropdown menu
 * @example
 * <Dropdown
 *   open={this.state.isDropdownOpen}
 *   onToggle={this.onDropdownToggle}
 * >
 *   <DropdownButton data-role="toggle">
 *     Toggle dropdown
 *   </DropdownButton>
 *   <DropdownMenu data-role="menu">
 *     <span>This is our dropdown</span>
 *   </DropdownMenu>
 * </Dropdown>
 */
export const DropdownButton: ForwardRefExoticComponent<
  PropsWithoutRef<DropdownButtonProps> & RefAttributes<HTMLElement>
>;
export default DropdownButton;

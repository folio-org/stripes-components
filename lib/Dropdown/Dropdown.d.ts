import Popper from 'popper.js';
import React, {
  AriaAttributes,
  Component,
  ElementType,
  FocusEventHandler,
  KeyboardEventHandler,
  ReactNode,
  RefObject,
} from 'react';
import { AllOrNone } from '../../util/typeUtils';
import { ButtonProps } from '../Button/Button';

export interface DropdownBaseProps extends AriaAttributes {
  /** Adds additional classes to the wrapping element */
  className?: string;
  /** If the dropdown should be disabled/inactive */
  disabled?: boolean;
  /** Custom handlers for when the dropdown is opened or closed */
  focusHandlers?: {
    open?: (
      trigger?: React.RefObject<HTMLElement>,
      menu?: HTMLElement,
      firstItem?: HTMLElement
    ) => void;
    close?: (
      trigger?: React.RefObject<HTMLElement>,
      menu?: HTMLElement
    ) => void;
  };
  /** Overrides the ID for the dropdown */
  id?: string;
  /** Controls the addition of padding within the dropdown */
  hasPadding?: boolean;
  /** Custom modifiers for how the popper should render */
  modifiers?: Popper.Modifiers;
  /** Custom placement for the popper */
  placement?: Popper.Placement;
  /** If `position: relative` should be applied */
  relativePosition?: boolean;
  /** A custom tag for the main wrapping element */
  tag?: ElementType;
  /** If the dropdown should be rendered to overall `#OverlayContainer` div */
  usePortal?: boolean;
}

export interface DropdownTriggerBuiltinProps {
  /** Additional props to add to the builtin button trigger */
  buttonProps?: Partial<ButtonProps>;
  /** The label for the button trigger */
  label: ReactNode;
}

export interface DropdownTriggerCustomProps {
  /** A custom function to render the trigger */
  renderTrigger: (props: {
    getTriggerProps: (opts: {
      onFocus?: FocusEventHandler;
      onBlur?: FocusEventHandler;
    }) => void;
    open: boolean;
    triggerRef: RefObject<Element>;
    onToggle: (e: Event) => void;
    ariaProps: Partial<AriaAttributes>;
    keyHandler: KeyboardEventHandler;
    buttonProps: Partial<ButtonProps>;
    label: string;
  }) => ReactNode;
}

export interface DropdownMenuFunction {
  (props: {
    open: boolean;
    onToggle: () => void;
    keyHandler?: KeyboardEventHandler;
  }): ReactNode;
}

export interface DropdownMenuChildrenProps {
  /**
   * The dropdown's menu/contents, as children.
   * A custom function may also be passed here
   */
  children: ReactNode | DropdownMenuFunction;
}

export interface DropdownMenuPropFunctionProps {
  /** A custom function to render the menu/contents of the dropdown  */
  renderMenu: DropdownMenuFunction;
}

export interface DropdownControlledProps {
  /**
   * A function to be called when the dropdown should be toggled
   * (e.g. from the Escape key or a click outside the popper)
   */
  onToggle: () => void;
  /** If the dropdown should currently be open */
  open: boolean;
}

export type DropdownProps = DropdownBaseProps &
  (DropdownTriggerBuiltinProps | DropdownTriggerCustomProps) &
  (DropdownMenuChildrenProps | DropdownMenuPropFunctionProps) &
  AllOrNone<DropdownControlledProps>;

/**
 * Renders a dropdown for displaying links of lists and more
 * @example
 * The most straightforward use will cause the component to render its own
 * control button and handle its own state:
 * ```
 * <Dropdown label="Dropdown Example">
 *   <DropdownMenu>
 *     <ul>
 *       <li><a href="#">Example Link 1</a></li>
 *       <li><a href="#">Example Link 2</a></li>
 *     </ul>
 *   </DropdownMenu>
 * </Dropdown>
 * ```
 * @example
 * If more control is needed, state can be managed externally via `onToggle`
 * and `open` props.  Additionally, `renderMenu` and `renderTrigger` props
 * allow custom render functions which will receive status information,
 * handlers, and more:
 * ```
 * const trigger = ({ triggerRef, toggleMenu, ariaProps, keyHandler }) => (
 *   <Button autoFocus ref={triggerRef} onClick={toggleMenu} onKeyDown={keyHandler} {...ariaProps}>
 *     Trigger
 *   </Button>
 * );
 *
 * const menu = ({open, onToggle, keyHandler}) => {
 *   <DropdownMenu
 *     role="menu"
 *     aria-label="available permissions"
 *     onToggle={this.onToggleAddPermDD}
 *   >
 *     <Button
 *       buttonStyle="menuItem"
 *       role="menuitem"
 *       onClick={ () => {this.selectMethod(onToggle)}}
 *     >
 *       Select All
 *     </Button>
 *   </DropdownMenu>
 * }
 *
 * <Dropdown
 *   id="AddPermissionDropdown"
 *   renderTrigger={this.trigger}
 *   renderMenu={this.menu}
 *   open={this.state.open}
 *   onToggle={() => this.state.open = !this.state.open}
 * />
 * ```
 */
export class Dropdown extends Component<DropdownProps> {}
export default Dropdown;

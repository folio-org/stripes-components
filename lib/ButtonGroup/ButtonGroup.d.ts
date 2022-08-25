import {
  AriaAttributes,
  ElementType,
  FunctionComponent,
  ReactNode,
} from 'react';

export interface ButtonGroupProps extends AriaAttributes {
  /** Add a custom CSS class to the button group */
  className?: string;
  /** A set of `<Button>`s to render in the group */
  children: ReactNode;
  /** If the button group should be 100% wide */
  fullWidth?: boolean;
  /** Set a custom HTML tag/component for the group */
  tagName?: ElementType;
}

/**
 * Renders a group of buttons
 * @example
 * <ButtonGroup>
 *   <Button>test</Button>
 *   <Button>it</Button>
 *   <Button>out</Button>
 * </ButtonGroup>
 */
export const ButtonGroup: FunctionComponent<ButtonGroupProps>;
export default ButtonGroup;

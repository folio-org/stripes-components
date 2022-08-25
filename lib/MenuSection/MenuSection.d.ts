import { FunctionComponent, ReactNode } from 'react';
import { AllOrNone } from '../../util/typeUtils';
import { HeadlineProps } from '../Headline/Headline';

export interface MenuSectionBaseProps {
  /** What should be displayed in the section */
  children?: ReactNode;
  /** Adds a custom class to the section */
  className?: string;
  /** Specifies a custom ID for the component */
  id?: string;
}

export interface MenuSectionLabelProps {
  /** Renders a label */
  label: HeadlineProps['children'];
  /** Specifies a label's tag */
  labelTag?: HeadlineProps['tag'];
}

export type MenuSectionProps = MenuSectionBaseProps &
  AllOrNone<MenuSectionLabelProps>;

/**
 * Defines menu sections with labels, such as for dropdown menus
 * @example
 * <MenuSection id="menu-layout" label="Layout" labelTag="h3">
 *   <RadioButton name="layout" label="Automatic layout" />
 *   <RadioButton name="layout" label="Always use table layout" />
 *   <RadioButton name="layout" label="Always use cards layout" />
 * </MenuSection>
 * @example
 * <MenuSection id="menu-columns" label="Columns" labelTag="h3">
 *   <Checkbox label="Name" />
 *   <Checkbox label="Email" />
 *   <Checkbox label="Barcode" />
 * </MenuSection>
 * @example
 * <MenuSection id="menu-actions" label="Actions" labelTag="h3">
 *   <Button buttonStyle="dropdownItem">
 *     <Icon icon="trash">Delete</Icon>
 *   </Button>
 *   <Button buttonStyle="dropdownItem">
 *     <Icon icon="edit">Batch edit</Icon>
 *   </Button>
 *   <Button buttonStyle="dropdownItem">
 *     <Icon icon="bookmark">Bookmark</Icon>
 *   </Button>
 * </MenuSection>
 */
export const MenuSection: FunctionComponent<MenuSectionProps>;
export default MenuSection;

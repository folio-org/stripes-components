import { Component, CSSProperties, ReactNode, RefObject } from 'react';
import { HotKeysProps } from '../HotKeys';
import { DefaultAccordionHeaderProps } from './headers/DefaultAccordionHeader';

export interface AccordionProps extends Partial<DefaultAccordionHeaderProps> {
  /** The containing accordionSet */
  accordionSet?: ReactNode;
  /** The accordion's contents */
  children: ReactNode | ((open: boolean) => ReactNode);
  /** Add class(es) to the component */
  className?: string;
  /** If the accordion should be closed by default */
  closedByDefault?: boolean;
  /** Sets the height of the accordion */
  contentHeight?: CSSProperties['height'];
  /** The id of the content div */
  contentId?: string;
  /** A reference to the content div */
  contentRef?: RefObject<HTMLDivElement>;
  /** If the accordion should be disabled */
  disabled?: boolean;
  /** Supplies a custom header */
  header?: ReactNode;
  /** Adds props to the default header */
  headerProps?: Partial<DefaultAccordionHeaderProps>;
  /** The id of the accordion */
  id?: string;
  /** A label for the accordion */
  label: ReactNode;
  /** A callback for when the header is clicked to toggle open/closed */
  onClickToggle?: (args: { id: string; label: string; open: boolean }) => void;
  /** A callback for when the header is toggled (not just clicked, but external e.g. expand all) */
  onToggle?: (args: { id: string; label: string }) => void;
  /** If the accordion is currently open */
  open?: boolean;
  /** If the separator between header and contents should be drawn */
  separator?: boolean;
  toggleKeyHandlers?: HotKeysProps['handlers'];
  toggleKeyMap?: HotKeysProps['keyMap'];
}

/**
 * Displays information in an accordion
 * @example
 * <AccordionSet>
 *   <Accordion label="AccordionSet_one">
 *     <p>first content</p>
 *   </Accordion>
 *   <Accordion label="AccordionSet_two">
 *     <p>second content</p>
 *   </Accordion>
 * </AccordionSet>
 */
export class Accordion extends Component<AccordionProps> {}
export default Accordion;

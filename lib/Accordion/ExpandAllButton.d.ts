import { FunctionComponent } from 'react';
import { ButtonProps } from '../Button/Button';
import { AccordionStatusRecord } from './types';

export interface ExpandAllButtonProps {
  /** Manually specify the accordion's status */
  accordionStatus?: AccordionStatusRecord;
  /** The label to use for a button that will collapse */
  collapseLabel?: ButtonProps['children'];
  /** The label to use for a button that will expand */
  expandLabel?: ButtonProps['children'];
  /** Add a custom ID to the button */
  id?: string;
  /** Callback for when the status is changed */
  onToggle?: (status: AccordionStatusRecord) => void;
  /** Callback for when the status is changed */
  setStatus?: (status: AccordionStatusRecord) => void;
}

/**
 * Controls a stack of accordions all at once
 * @example
 * <AccordionStatus>
 *   <ExpandAllButton />
 *   <AccordionSet>
 *     <Accordion label="AccordionStatus_one">
 *       <p>first content</p>
 *     </Accordion>
 *     <Accordion label="AccordionStatus_two">
 *       <p>second content</p>
 *     </Accordion>
 *   </AccordionSet>
 * </AccordionStatus>
 */
export const ExpandAllButton: FunctionComponent<ExpandAllButtonProps>;
export default ExpandAllButton;

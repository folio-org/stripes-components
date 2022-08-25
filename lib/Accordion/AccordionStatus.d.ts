import { Component, ReactNode } from 'react';
import { AccordionStatusRecord } from './types';

export interface AccordionStatusProps {
  /** The accordions */
  children: ReactNode;
  /** The current accordion status */
  accordionStatus?: AccordionStatusRecord;
  /** The initial accordion status */
  initialStatus?: AccordionStatusRecord;
}

/**
 * Allows an uncontrolled accordion to exist; this contains state for status/toggles
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
export class AccordionStatus extends Component<AccordionStatusProps> {}
export default AccordionStatus;

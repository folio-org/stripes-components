import { Component, ReactNode } from 'react';
import { AccordionStatusRecord } from './types';

export interface AccordionSetBaseProps {
  /** The accordions */
  children: ReactNode;
  /** The initial accordion status */
  initialStatus?: AccordionStatusRecord;
  /** Callback for when an accordion is toggled */
  onToggle?: (accordion: { id: string; label: string }) => void;
  /** Callback for when the status is changed */
  setStatus?: (status: AccordionStatusRecord) => void;
}

export type AccordionSetStatusProps =
  | {
      /** The current accordion status */
      accordionStatus?: AccordionStatusRecord;
      inheritStatus: boolean;
    }
  | {
      accordionStatus?: never;
      inheritStatus?: false | never;
    };

export type AccordionSetProps = AccordionSetBaseProps & AccordionSetStatusProps;

/**
 * Contains a set of accordions
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
export class AccordionSet extends Component<AccordionSetProps> {}
export default AccordionSet;

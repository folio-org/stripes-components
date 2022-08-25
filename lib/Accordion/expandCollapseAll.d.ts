import { AccordionStatusRecord } from './types';

/**
 * Mark all values of `status` as `expand`, used for expanding or collapsing all accordions
 */
export default function ExpandCollapseAll(
  status: AccordionStatusRecord,
  expand: boolean
): AccordionStatusRecord;

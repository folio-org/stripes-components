import { FunctionComponent } from 'react';
import { DefaultAccordionHeaderProps } from './DefaultAccordionHeader';

export interface FilterAccordionHeaderProps
  extends DefaultAccordionHeaderProps {
  /** If the filter field should be disabled */
  disabled?: boolean;
  /** If the filter field should display a clear (x) button */
  displayClearButton?: boolean;
  /** A name for the header */
  name?: string;
  /** A callback for when the filter has been cleared */
  onClearFilter?: (name: string) => void;
}

/**
 * Renders a filtering header for an accordion
 * @example
 * <Accordion
 *   header={<FilterAccordionHeaderProps label="foo" />}
 * >
 *   <ul>
 *     <li>All</li>
 *     <li>The</li>
 *     <li>Items!</li>
 *   </ul>
 * </Accordion>
 */
export const FilterAccordionHeader: FunctionComponent<FilterAccordionHeaderProps>;
export default FilterAccordionHeader;

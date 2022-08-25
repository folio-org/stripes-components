import React, { FunctionComponent, ReactNode } from 'react';

export interface DefaultAccordionHeaderProps {
  /** If the header/button should autofocus on mount */
  autoFocus?: boolean;
  /** Specify the ID of the content being controlled */
  contentId?: JSX.IntrinsicElements['button']['aria-controls'];
  /** Extra text to display on the right side of the header when it is closed */
  displayWhenClosed?: ReactNode;
  /** Extra text to display on the right side of the header when it is open */
  displayWhenOpen?: ReactNode;
  /** Override header/button settings */
  headerProps?: {
    /** Use a custom size */
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  } & Partial<JSX.IntrinsicElements['button']>;
  /** Sets a custom id */
  id?: string;
  /** A label for the header */
  label: ReactNode;
  /** Callback for when an accordion is toggled */
  onToggle?: (accordion: { id: string; label: string }) => void;
  /** If the accordion is open */
  open?: boolean;
  /** A ref for the internal `<button>` */
  toggleRef?: React.RefObject<HTMLButtonElement>;
}

/**
 * Renders a header for an accordion; this header is rendered by default
 * @example
 * <Accordion
 *   label="Example Accordion"
 *   id="ex-1"
 *   displayWhenClosed={<em>3 items</em>}
 *   displayWhenOpen={<Button>Add item</Button>}
 * >
 *   <ul>
 *     <li>All</li>
 *     <li>The</li>
 *     <li>Items!</li>
 *   </ul>
 * </Accordion>
 */
export const DefaultAccordionHeader: FunctionComponent<DefaultAccordionHeaderProps>;
export default DefaultAccordionHeader;

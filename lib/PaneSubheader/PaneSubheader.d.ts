import { FunctionComponent, ReactNode } from 'react';

export interface PaneSubheaderProps {
  /** The contents of the subheader */
  children: ReactNode;
}

/**
 * Renders contents just below a pane's header but outside of the scrollable area
 * @example
 * const sbh = (
 *   <PaneSubheader>
 *     <SegmentedControl activeId="instanceLevel">
 *       <Button id="instanceLevel">Instance</Button>
 *       <Button id="holdingsLevel">Holdings</Button>
 *       <Button id="itemsLevel">Items</Button>
 *     </SegmentedControl>
 *   </PaneSubheader>
 * );
 * <Pane subheader={sbh} ...> ... </Pane>
 */
export const PaneSubheader: FunctionComponent<PaneSubheaderProps>;
export default PaneSubheader;

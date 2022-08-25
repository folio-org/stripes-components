import { FunctionComponent, ReactNode } from 'react';

export interface PaneMenuProps {
  /** The contents of the subheader */
  children: ReactNode;
}

/**
 * Wraps contents to prepare them for use as `firstMenu` or `lastMenu` on a `<Pane>`
 * @example
 * const firstMenu = (
 *   <PaneMenu>
 *     <PaneCloseLink />
 *   </PaneMenu>
 * );
 *
 * const lastMenu = (
 *   <PaneMenu>
 *     <PaneHeaderIconButton icon="bookmark" />
 *   </PaneMenu>
 * );
 *
 * <Pane
 *   lastMenu={lastMenu}
 *   firstMenu={firstMenu}
 * > ... </Pane>
 */
export const PaneMenu: FunctionComponent<PaneMenuProps>;
export default PaneMenu;

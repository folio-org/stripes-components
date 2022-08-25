import { FunctionComponent } from 'react';
import { Optional } from 'utility-types';
import { PaneHeaderIconButtonProps } from '../PaneHeaderIconButton/PaneHeaderIconButton';

// The icon is `arrow-left` or `times` by default
export type PaneCloseLinkProps = Optional<PaneHeaderIconButtonProps, 'icon'>;

/**
 * Renders a left arrow used to close panes on smaller screens and a `x` icon
 * on larger screens.  All props are passed to the internal `IconButton`.
 * @example
 * <Pane
 *   renderHeader={renderProps => (
 *     <PaneHeader
 *       {...renderProps}
 *       firstMenu={
 *         <PaneMenu>
 *           <PaneCloseLink to="/my-module-root" />
 *         </PaneMenu>
 *       }
 *     />
 *   )}
 * >
 * ...
 * </Pane>
 */
export const PaneCloseLink: FunctionComponent<PaneCloseLinkProps>;
export default PaneCloseLink;

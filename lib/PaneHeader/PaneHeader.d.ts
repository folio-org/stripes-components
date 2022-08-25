import { FunctionComponent, ReactNode, RefObject } from 'react';
import { DropdownMenuFunction } from '../Dropdown/Dropdown';

export interface PaneHeaderDefaultProps {
  /**
   * Activates the action menu dropdown; function must return a node/component
   * (probably a `<MenuSection>`)
   */
  actionMenu?: DropdownMenuFunction;
  /** Adds an icon to the header.  Expects an `<AppIcon>` from `stripes-core`. */
  // TODO: explicitly require an <AppIcon> once stripes-core specifies typings
  appIcon?: ReactNode;
  /**
   * If a close (x) button should be rendered in the pane's header:
   * - A `false` value will not render a button
   * - A `true` value will render a button in the firstMenu (left side in ltr languages)
   * - A `"last"` value will render a button in the lastMenu (right side in ltr languages)
   */
  dismissible?: boolean | 'last';
  /**
   * Component (probably a `<PaneMenu>`) to render at the beginning of the header
   * (top left in ltr languages)
   */
  firstMenu?: ReactNode;
  /** Specify an ID to use for the PaneHeader */
  id?: string;
  /**
   * Component (probably a `<PaneMenu>`) to render at the end of the header
   * (top right in ltr languages)
   */
  lastMenu?: ReactNode;
  /** Callback for when the pane is closed using its close button (see `dismissible` prop) */
  onClose?: () => void;
  /** Add a subtitle to the pane, as a node or string (recommended). */
  paneSub?: ReactNode;
  /**
   * Add a title to the pane, as a node or string (recommended).
   * This will be enclosed with a `<h2>` for accessibility
   */
  paneTitle?: ReactNode;
  /** If the title should be auto focused on mount */
  paneTitleAutoFocus?: boolean;
  /** A reference to the header of the pane */
  paneTitleRef?: RefObject<HTMLDivElement>;
}

export interface PaneHeaderOverriddenProps {
  /** Replace the entire builtin header with the provided node */
  header: ReactNode;
}

export type PaneHeaderProps =
  | PaneHeaderDefaultProps
  | PaneHeaderOverriddenProps;

/**
 * A pane's header
 * @example
 * const renderHeader = renderProps => (
 *   <PaneHeader
 *     {...renderProps}
 *     paneTitle="Pane header title"
 *     paneSub="Pane header sub"
 *     firstMenu={<PaneMenu />}
 *     lastMenu={<PaneMenu />}
 *     actionMenu={({ onToggle }) => { ... }}
 *     appIcon={<AppIcon app="inventory" iconKey="holdings" />}
 *   />
 * );
 *
 * <Pane renderHeader={renderHeader}>
 *   ...
 * </Pane>
 *
 * // Render a <Pane> with no header
 * <Pane renderHeader={null}>
 *   ...
 * </Pane>
 */
export const PaneHeader: FunctionComponent<PaneHeaderProps>;
export default PaneHeader;

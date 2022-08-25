import { Component, CSSProperties, ReactNode } from 'react';

/**
 * Maps a set of IDs (keys) to css widths (or `"fill"`)
 */
export type PanesetWidthSpecification = Record<
  string,
  CSSProperties['width'] | 'fill'
>;

export interface PanesetOnLayoutParameters {
  /**
   * The type of change that occurred.
   * - `'added'` when a pane is added to the set
   * - `'remove'` when a pane is removed from the set
   * - `'paneset-resized'` when the entire paneset is resized
   * - `'resize'` when an individual pane is resized
   */
  changeType: 'added' | 'removed' | 'paneset-resized' | 'resize';
  /** An object with keys pertaining to the panes being rendered */
  nextLayout: Record<string, 0>;
  /** Whether or not there is an existing layout already cached (which would be preferred) */
  layoutCached: boolean;
  /** Readonly copy of the paneset's layout cache */
  layoutCache: ReadonlyArray<PanesetWidthSpecification>;
  /** The contents of the cached layout for this situation */
  widths: PanesetWidthSpecification;
}

export interface PanesetOnResizeParameters {
  /** The current panes/sizes */
  currentLayout: PanesetWidthSpecification;
  /** Readonly copy of the paneset's layout cache */
  layoutCache: ReadonlyArray<PanesetWidthSpecification>;
}

export interface PanesetProps {
  /** The panes within the paneset */
  children?: ReactNode;
  /**
   * The initial size of the paneset, or `fill` to use all available space
   */
  defaultWidth?: `${number}%` | 'fill';
  /** Specify an ID to use for the paneset */
  id?: string;
  initialLayouts?: PanesetWidthSpecification[];
  /** If this paneset should not report to parent panesets, such as in a modal/layer */
  isRoot?: boolean;
  /** A custom function to determine pane widths */
  onLayout?: (
    params: PanesetOnLayoutParameters
  ) => PanesetWidthSpecification | null;
  /** A callback for when pane(s) are resized */
  onResize?: (params: PanesetOnResizeParameters) => void;
}

/** nested and static cannot both be true */
export type PanePositionProps =
  | {
      /** If a paneset is nested within another; applies relative positioning */
      nested?: false;
      /** Applies static positioning instead of absolute */
      static: boolean;
    }
  | {
      /** If a paneset is nested within another; applies relative positioning */
      nested: boolean;
      /** Applies static positioning instead of absolute */
      static?: false;
    }
  | {
      /** If a paneset is nested within another; applies relative positioning */
      nested?: false;
      /** Applies static positioning instead of absolute */
      static?: false;
    };

/**
 * A pane, central to FOLIO module layout.
 * @example
 * <Pane
 *   defaultWidth="20%"
 *   paneTitle="Filters"
 * >
 *   Pane Content
 * </Pane>
 * <Pane
 *   defaultWidth="fill"
 *   padContent={false} // prevent horizontal scrolling
 *   noOverflow         // at the pane level (useful in case the rendered content, like a results list, handles this.)
 *   // Render a custom header using the "renderHeader"-prop if needed
 *   renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle="Search Results" />}
 * >
 *   Pane Content
 * </Pane>
 */
export class Paneset extends Component<PanesetProps> {}
export default Paneset;

import { Component, ElementType, ReactNode } from 'react';

export interface LayerProps {
  /** Callback after the layer is closed */
  afterClose?: () => void;
  /** Callback after the layer is opened */
  afterOpen?: () => void;
  /** If the layer should be focused on mount */
  autoFocus?: boolean;
  /** The layer's contents */
  children?: ReactNode;
  /** The containing element where the layer's DOM nodes should go */
  container?: ElementType;
  /** A label for the content, for accessibility */
  contentLabel?: string;
  /** If the layer should forcibly contain focus within it (recommended for accessibility) */
  enforceFocus?: boolean;
  /**
   * If the layer should be rendered in the root-most paneset it can find (no effect if
   * {@link container} is supplied)
   */
  inRootSet?: boolean;
  /** If the layer is currently opened */
  isOpen: boolean;
}

/**
 * A new layer of panes, like a full-screen modal
 * @example
 * <Paneset>
 *   // Base Paneset contents ...
 *   <Layer isOpen={showLayer} contentLabel="demonstration layer">
 *       <Paneset isRoot>
 *           //...Layered Paneset contents...
 *       </Paneset>
 *   </Layer>
 * </Paneset>
 */
export class Layer extends Component<LayerProps> {}
export default Layer;

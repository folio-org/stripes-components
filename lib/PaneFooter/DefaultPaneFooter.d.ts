import { FunctionComponent, ReactNode } from 'react';

export interface PaneFooterBaseProps {
  /** Sets the class name of the main footer element */
  className?: string;
}

export interface PaneFooterChildrenContentsProps {
  /** The contents of the footer */
  children: ReactNode;
}

export interface DefaultPaneFooterProps {
  /** Adds class name(s) to the footer */
  className?: string;
  /** Node(s) to render at the start of the footer */
  renderStart?: ReactNode;
  /** Node(s) to render at the end of the footer */
  renderEnd?: ReactNode;
}

/**
 * Renders a pane footer with the given nodes at the start and end
 */
export const DefaultPaneFooter: FunctionComponent<DefaultPaneFooterProps>;
export default DefaultPaneFooter;

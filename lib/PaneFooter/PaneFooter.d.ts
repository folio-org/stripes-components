import {
  Component,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from 'react';
import { RenameByT } from '../../util/typeUtils';
import { DefaultPaneFooterProps } from './DefaultPaneFooter';

export interface PaneFooterBaseProps {
  /** Sets the class name of the main footer element */
  className?: string;
  /** Overrides the component/tag used for the footer */
  element?: Component;
}

export interface PaneFooterChildrenContentsProps {
  /** The contents of the footer */
  children: ReactNode;
}

export type PaneFooterBuiltinContentsProps = RenameByT<
  DefaultPaneFooterProps,
  {
    className: 'innerClassName';
  }
> & {
  /** Render at the start (left in LTR languages) of the footer */
  renderStart?: ReactNode;
  /** Render at the end (right in LTR languages) of the footer */
  renderEnd?: ReactNode;
};

export type PaneFooterProps = PaneFooterBaseProps &
  (PaneFooterChildrenContentsProps | PaneFooterBuiltinContentsProps);

/**
 * Renders a footer at the bottom of a pane.  Props may be used to render
 * at the start or end of the footer, or custom children can be passed.
 * @example
 * const footer = (
 *   <PaneFooter
 *     renderStart={<Button>Cancel</Button>}
 *     renderEnd={<Button>Save</Button>}
 *     className={css.paneFooterClass}
 *     innerClassName={css.paneFooterContentClass}
 *   />
 * );
 *
 * <Pane footer={footer} ... >
 *   Pane Content
 * </Pane>
 * @example
 * <PaneFooter footerClass={css.paneFooter}>
 *   <div className={css.paneFooterContent}>
 *     <Button onClick={() => {...}}>
 *       Cancel
 *     </Button>
 *     <Button
 *       buttonStyle="primary"
 *       type="submit"
 *     >
 *       Save
 *     </Button>
 *   </div>
 * </PaneFooter>
 */
export const PaneFooter: ForwardRefExoticComponent<
  PropsWithoutRef<PaneFooterProps> & RefAttributes<HTMLDivElement>
>;
export default PaneFooter;

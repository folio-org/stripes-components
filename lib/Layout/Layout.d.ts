import { ElementType, FunctionComponent, ReactNode } from 'react';

export interface LayoutProps {
  /** Adds children to the layout element */
  children?: ReactNode;
  /** Adds additional classes to the element */
  className?: string;
  /** Override the default element type of `div` */
  element?: ElementType;
}

/**
 * Helper component to easily add common layout-based CSS classes
 * @example
 * <Layout className="display-flex flex-align-items-start">
 *   <Layout element="span" className="padding-start-gutter">
 *     1st column
 *   </Layout>
 *   <Layout element="span" className=`padding-end-gutter ${css.myCustomClass}`>
 *     2nd column
 *   </Layout>
 * </Layout>
 */
export const Layout: FunctionComponent<LayoutProps>;
export default Layout;

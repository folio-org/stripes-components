import { FunctionComponent } from 'react';
import { LoadingPaneProps } from './LoadingPane';
import { PanesetProps } from '../Paneset/Paneset';

export type LoadingViewProps = LoadingPaneProps & {
  panesetProps: PanesetProps;
};

/**
 * Renders a paneset containing a loading spinner with the given props; accepts
 * the properties of LoadingPane as well as Paneset (under prop `panesetProps`)
 * @example
 * <LoadingView panesetProps={{isRoot: true}} />
 */
export const LoadingView: FunctionComponent<LoadingViewProps>;
export default LoadingView;

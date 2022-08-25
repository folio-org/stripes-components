import { FunctionComponent } from 'react';

export interface LoadingProps {
  /** The size of the loading icon (default medium) */
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  /** If the current element's CSS text `color` should be used instead of the default grey */
  useCurrentColor?: boolean;
}

/**
 * Renders a basic, standalone loading icon/spinner
 * @example
 * <Loading />
 */
export const Loading: FunctionComponent<LoadingProps>;
export default Loading;

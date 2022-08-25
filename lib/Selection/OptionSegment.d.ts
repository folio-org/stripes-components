import { FunctionComponent, ReactNode } from 'react';
import { RequireExactlyOne } from '../../util/typeUtils';

export interface OptionSegmentBaseProps {
  /** The text to render */
  children?: ReactNode;
  /** The text to render */
  innerText?: ReactNode;
  /** The text to highlight */
  searchTerm?: string;
}

export type OptionSegmentProps = RequireExactlyOne<
  OptionSegmentBaseProps,
  'children' | 'innerText'
>;

/**
 * Renders an option with optionally highlighted part
 * @example
 * <OptionSegment innerText="potential result" searchTerm="result" />
 * @example
 * <OptionSegment>sample</OptionSegment>
 */
export const OptionSegment: FunctionComponent<OptionSegmentProps>;
export default OptionSegment;

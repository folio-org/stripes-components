import { FunctionComponent, ReactNode } from 'react';
import { RequireExactlyOne } from '../../util/typeUtils';

export type KeyValueProps = {
  /** The label for the key/value pair */
  label: ReactNode;
  /** A value to show below the key */
  subValue?: ReactNode;
} & RequireExactlyOne<{
  /** The value to display */
  children: ReactNode;
  /** The value to display */
  value: ReactNode;
}>;

/**
 * Renders a given key/value pair
 * @example
 * <KeyValue
 *   label="Some label"
 *   value="Some value"
 *   subValue="Some sub value"
 * />
 * @example
 * <KeyValue label="Some label">
 *   <span data-test-id="my-test-string">Some node</span>
 * </KeyValue>
 */
export const KeyValue: FunctionComponent<KeyValueProps>;
export default KeyValue;

import { FunctionComponent, ReactNode } from 'react';

export interface ModalFooterProps {
  /** The buttons to render in the footer */
  children: ReactNode;
}

/**
 * Default modal footer for the `<Modal>` component
 * @example
 * <ModalFooter>
 *   <Button
 *     buttonStyle="primary"
 *     onClick={() => {...}}
 *   >
 *     Save
 *   </Button>
 *   <Button onClick={() => {...}}>
 *     Cancel
 *   </Button>
 * </ModalFooter>
 */
export const ModalFooter: FunctionComponent<ModalFooterProps>;
export default ModalFooter;

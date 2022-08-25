import {
  AriaAttributes,
  ElementType,
  FunctionComponent,
  ReactNode,
} from 'react';

export interface ModalProps extends AriaAttributes {
  /** The contents to render in the modal */
  children: ReactNode;
  /** If the modal should close if it's background is clicked */
  closeOnBackgroundClick?: boolean;
  /** Add custom classes to the content wrapper */
  contentClass?: string;
  /** If a `x` should render in the top left to dismiss the modal */
  dismissible?: boolean;
  /** Attempt to steal focus from children each time one is clicked */
  enforceFocus?: boolean;
  /** A `<ModalFooter>` */
  footer?: ReactNode;
  /** A custom ID for the modal's div */
  id?: string;
  /** A title for the top label */
  label: ReactNode;
  /** Callback for when the modal should be closed */
  onClose?: () => void;
  /** Callback for when the modal opens */
  onOpen?: () => void;
  /** If the modal is open */
  open: boolean;
  /** If the modal should return focus on close to where it was before it was opened */
  restoreFocus?: boolean;
  /** If the modal should cover the main pane area (`module`), or the whole window (`root`) */
  scope?: 'module' | 'root';
  /** The modal's size */
  size?: 'small' | 'medium' | 'large';
  /** Changes the wrapping element (useful to make forms) */
  wrappingElement?: ElementType;
}

/**
 * Default modal interface for FOLIO
 * @example
 * const footer = (
 *   <Fragment>
 *     <Button buttonStyle="primary" marginBottom0>Save</Button>
 *   </Fragment>
 * );
 *
 * <Modal dismissible closeOnBackgroundClick open label="example" footer={footer}>
 *   <button onClick={this.handleClose}>Close modal</button>
 * </Modal>
 */
export const Modal: FunctionComponent<ModalProps>;
export default Modal;

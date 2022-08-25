import { ElementType, FunctionComponent, ReactNode } from 'react';
import { ButtonProps } from '../Button/Button';

export interface ConfirmationModalProps {
  /** the top <h1> of the modal; doubles as the aria-label */
  heading: ReactNode;
  /** The message to display inside the modal */
  message?: ReactNode;
  /** If the modal is open */
  open: boolean;
  /** The cancel button's label */
  cancelLabel?: ReactNode;
  /** The confirm button's label */
  confirmLabel?: ReactNode;
  /** Callback for when the action is confirmed */
  onConfirm: () => void;
  /** Callback for when the action is cancelled */
  onCancel: () => void;
  /** Override the tag wrapping the modal's `message` */
  bodyTag?: ElementType;
  /** Change the style of the confirm button */
  buttonStyle?: ButtonProps['buttonStyle'];
  /** Change the style of the cancel button */
  cancelButtonStyle?: ButtonProps['buttonStyle'];
}

/**
 * A basic confirmation modal with props to support a heading (required),
 * a brief message, and customizable 'cancel' and 'submit' action labeling.
 * @example
 * <ConfirmationModal
 *   open={this.state.confirming}
 *   heading="Please confirm!"
 *   message="Description of the thing that needs confirming"
 *   onConfirm={this.handleSubmit}
 *   onCancel={this.hideConfirm}
 * />
 */
export const ConfirmationModal: FunctionComponent<ConfirmationModalProps>;
export default ConfirmationModal;

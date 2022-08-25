import {
  AriaAttributes,
  ChangeEventHandler,
  Component,
  FocusEventHandler,
  InputHTMLAttributes,
  ReactNode,
  RefObject,
} from 'react';
import { FieldRenderProps } from 'react-final-form';

export interface CheckboxProps
  extends AriaAttributes,
    InputHTMLAttributes<HTMLInputElement> {
  /** If the field should auto-focus on mount */
  autoFocus?: boolean;
  /** If the checkbox is checked */
  checked?: boolean;
  /** Apply class names to the root element */
  className?: string;
  /** Adds info text below the checkbox */
  labelInfo?: ReactNode;
  /** Adds a class to the info text */
  labelInfoClass?: string;
  /** Disables the input field */
  disabled?: boolean;
  /** An error to show for validation */
  error?: ReactNode;
  /** If the field should stretch to fill its container */
  fullWidth?: boolean;
  /** Adds a custom ID to the control */
  id?: string;
  /** If the field should `display: inline` */
  inline?: boolean;
  /** Add a class to the `<input>` directly */
  innerClass?: string;
  /** Ref to the internal field */
  inputRef?: RefObject<HTMLInputElement>;
  /** The input's label */
  label?: ReactNode;
  /** A custom class for the input's label */
  labelClass?: ReactNode;
  /** The input's name */
  name?: string;
  /** Fired when the user clicks out of/deselects the control */
  onBlur?: FocusEventHandler;
  /** Fired anytime internal state changes */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** Fired when the user clicks into the control */
  onFocus?: FocusEventHandler;
  /** If the control is readonly */
  readOnly?: boolean;
  /** If the field is required */
  required?: boolean;
  /** Renders the label above the checkbox */
  vertical?: boolean;
  /** The field's value, sent as part of a HTML submit event */
  value?: string | number | readonly string[];
  /** Inline feedback for the user indicating a validation warning */
  warning?: ReactNode;
}

export type CheckboxRenderProps<DataType extends boolean | readonly string[]> =
  FieldRenderProps<DataType>;

/**
 * Basic HTML checkbox.  If a value is provided, then `react-final-form`'s value
 * will be an array containing the value if and only if the checkbox is checked.
 * This allows for advanced usage with many checkboxes.  Otherwise, the value
 * is simply a boolean indicating if the box is checked
 * @example
 * <Checkbox
 *   label="My Checkbox"
 *   checked={true}
 *   value="bananas"
 *   onChange={(event) => {
 *     // consume event.target.value
 *   }}
 * />
 * @example
 * <Field
 *   component={Checkbox}
 *   type="checkbox"
 *   name="bananas"
 *   label="Bananas are green?"
 * />
 */
export default class Checkbox<
  DataType extends boolean | readonly string[] = boolean,
  AdditionalProps extends
    | CheckboxProps
    | CheckboxRenderProps<DataType> = CheckboxProps
> extends Component<CheckboxProps & AdditionalProps> {}

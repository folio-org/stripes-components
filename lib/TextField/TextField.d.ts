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

export interface TextFieldProps<FieldType extends string | number = string>
  extends AriaAttributes,
    InputHTMLAttributes<HTMLInputElement> {
  /**
   * Provides a custom label for the element
   * @deprecated use `aria-label` instead
   */
  ariaLabel?: AriaAttributes['aria-label'];
  /**
   * Identify the element which labels the current element
   * @deprecated use `aria-labelledby` instead
   */
  ariaLabelledby?: AriaAttributes['aria-labelledby'];
  /** If the browser should auto-capitalize the text */
  autoCapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';
  /** If the browser should attempt to autofill these fields, nonstandard */
  autoComplete?: 'off' | 'on';
  /** If automatic correction should be enabled for this field, nonstandard */
  autoCorrect?: 'off' | 'on';
  /** If the field should auto-focus on mount */
  autoFocus?: boolean;
  /** Apply class names to the root element */
  className?: string;
  /** Give a special ID to the clear field button */
  clearFieldId?: string;
  /** Marks the field as changed, for styling */
  dirty?: boolean;
  /** Disables the input field */
  disabled?: boolean;
  /** Control or Icon to display at the end of the field */
  endControl?: ReactNode;
  /** An error to show for validation */
  error?: ReactNode;
  /** Add class(es) on focus */
  focusedClass?: string;
  /** If the field should stretch to fill its container */
  fullWidth?: boolean;
  /** If a clear icon (x) should be shown */
  hasClearIcon?: boolean;
  /** Adds a custom ID to the control */
  id?: string;
  /** Add a class to the `<input>` directly */
  inputClass?: string;
  /** Ref to the internal text field */
  inputRef?: RefObject<HTMLInputElement>;
  /** The input's label */
  label?: ReactNode;
  /** Adds a loading spinner to the control */
  loading?: boolean;
  /** Remove bottom margin */
  marginBottom0?: boolean;
  /** The input's name */
  name?: string;
  /** Fired when the user clicks out of/deselects the control */
  onBlur?: FocusEventHandler;
  /** Fired anytime internal state changes */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** Callback for when the input is cleared */
  onClearField?: () => void;
  /** Fired when the user clicks into the control */
  onFocus?: FocusEventHandler;
  /** If the control is readonly */
  readOnly?: boolean;
  /** If the field is required */
  required?: boolean;
  /** Toggle browser spellchecking */
  spellCheck?: boolean;
  /** Control or Icon to display at the start of the field */
  startControl?: ReactNode;
  /** The field's type */
  type?: FieldType extends string ? 'text' : 'number';
  /** If true, adds valid styles to the field */
  valid?: boolean;
  /** If validation styles should be rendered */
  validationEnabled?: boolean;
  /** If styles should be shown for valid input */
  validStylesEnabled?: boolean;
  /** The field's value */
  value?: FieldType;
  /** Inline feedback for the user indicating a validation warning */
  warning?: ReactNode;
}

export type TextFieldRenderProps<FieldType> = FieldRenderProps<FieldType>;

/**
 * A text field for string input (or number input)
 * @example
 * <Field name="username" component={TextField} />
 * @example
 * <TextField
 *   label="Username"
 *   value={this.state.username}
 *   onChange={this.handleChange}
 * />
 */
// generic requires Component
export default class TextField<
  FieldType extends string | number = string,
  AdditionalProps extends
    | TextFieldProps<FieldType>
    | TextFieldRenderProps<FieldType> = TextFieldProps<FieldType>
> extends Component<TextFieldProps<FieldType> & AdditionalProps> {}

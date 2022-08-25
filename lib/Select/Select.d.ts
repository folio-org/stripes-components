import { Component, ReactNode, RefObject } from 'react';
import { FieldRenderProps } from 'react-final-form';
import { RequireExactlyOne } from '../../util/typeUtils';

/**
 * The default option type to be used, contains a label, potentially a value, and an option to disable
 */
export interface OptionType<ValueType = never> {
  label: string;
  value: ValueType;
  disabled?: boolean;
}

export interface SelectBaseProps<ValueType> {
  /** If the field should auto-focus on mount */
  autoFocus?: boolean;
  /**
   * Allows passing `<option>`s directly to the component
   * @deprecated use {@link dataOptions} instead
   */
  children?: ReactNode;
  /** The items to choose from.  If null or undefined, a loading spinner will be shown */
  dataOptions?: OptionType<ValueType>[];
  /** Marks the field as changed, for styling */
  dirty?: boolean;
  /** Disables the input field */
  disabled?: boolean;
  /** An error to show for validation */
  error?: ReactNode;
  /** If the field should take the full width of the container */
  fullWidth?: boolean;
  /** Adds a custom ID to the control */
  id?: string;
  /** Ref to the internal field */
  inputRef?: RefObject<HTMLSelectElement>;
  /** A label for the field */
  label?: ReactNode;
  /** Remove margin from the bottom of the field */
  marginBottom0?: boolean;
  /** Allow selection of multiple values */
  multiple?: boolean;
  /** Add a custom name to the field */
  name?: string;
  /** A placeholder for the control when there is no value (renders as a disabled option at the top of list) */
  placeholder?: string;
  /** If the field is readonly */
  readOnly?: boolean;
  /** If the field is required */
  required?: boolean;
  /** Add classes to the `<select>` */
  selectClass?: string;
  /** If the field is valid */
  valid?: boolean;
  /** If validation icon should be rendered */
  validationEnabled?: boolean;
  /** If the field being valid should add styles */
  validStylesEnabled?: boolean;
  /** The selected object */
  value?: ValueType;
  /** Inline feedback for the user indicating a validation warning */
  warning?: ReactNode;
}

export type SelectProps<ValueType> = RequireExactlyOne<
  SelectBaseProps<ValueType>,
  'children' | 'dataOptions'
> &
  JSX.IntrinsicElements['select'];

export type SelectFieldRenderProps<ValueType> = FieldRenderProps<
  OptionType<ValueType>
>;

/**
 * Selection control, allowing choice of option(s)
 * @example
 * <Select
 *   dataOptions={[
 *     {
 *       value: "foo",
 *       label: "Foo",
 *     },
 *     {
 *       value: "bar",
 *       label: "Foo",
 *     }
 *   ]}
 * />
 */
export default class Select<
  ValueType = never,
  AdditionalProps extends
    | SelectProps<ValueType>
    | SelectFieldRenderProps<ValueType> = SelectProps<ValueType>
> extends Component<SelectProps<ValueType> & AdditionalProps> {}

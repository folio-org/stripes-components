import Popper from 'popper.js';
import { AriaAttributes, Component, ReactNode, RefObject } from 'react';
import { FieldRenderProps } from 'react-final-form';

export interface TimepickerProps extends AriaAttributes {
  /** If the field should auto-focus on mount */
  autoFocus?: boolean;
  /** Disables the input field */
  disabled?: boolean;
  /** Adds a custom ID to the control */
  id?: string;
  /** Ref to the internal text field */
  inputRef?: RefObject<HTMLInputElement> | ((el: HTMLInputElement) => void);
  /** Label the Timepicker */
  label?: ReactNode;
  /** Set the locale for use */
  locale?: string;
  /** Remove bottom margin */
  marginBottom0?: boolean;
  /** Popper modifiers */
  modifiers?: Popper.Modifiers;
  /** Fired anytime internal state changes */
  onChange?: (e: Event, standardizedTime?: string) => void;
  /** Where the overlay should be placed in relation to the field */
  placement?: Popper.Placement;
  /** If the control is readonly */
  readOnly?: boolean;
  /** If the field is required */
  required?: boolean;
  /** Additional message to be read when the field is focused */
  screenReaderMessage?: boolean;
  /** If the picker should start off opened */
  showTimepicker?: boolean;
  /** Override the default timezone */
  timeZone?: string;
  /** Render to the global overlay, if the dropdown may be cut off due to some containing elements's overflow */
  usePortal?: boolean;
  /** The field's value */
  value?: string;
}

export type TimepickerFieldRenderProps = FieldRenderProps<string>;

/**
 * A picker for times with an optional picker popup
 * @example
 * <Timepicker />
 * // or pass as component within a form...
 * <Field component={Timepicker} />
 * @example
 * <Field
 *   name="exampleTimeReturned"
 *   label="Time returned"
 *   id="timeReturnTP"
 *   placeholder="Select Time"
 *   component={Timepicker}
 * />
 */
export default class Timepicker<
  AdditionalProps extends
    | TimepickerProps
    | TimepickerFieldRenderProps = TimepickerProps
> extends Component<TimepickerProps & AdditionalProps> {}

import { Moment } from 'moment';
import Popper from 'popper.js';
import {
  AriaAttributes,
  Component,
  FocusEventHandler,
  ReactNode,
  RefObject,
} from 'react';
import { FieldRenderProps } from 'react-final-form';

export interface DatepickerBaseProps extends AriaAttributes {
  /** If the field should auto-focus on mount */
  autoFocus?: boolean;
  /** How backend dates should be parsed, e.g. `"ISO 8601"` */
  backendDateStandard?: string;
  /** How the date should be formatted/localized, e.g. `YYYY.MM.DD` */
  dateFormat?: string;
  /** Disables the input field */
  disabled?: boolean;
  /** Disallows selection of dates that the function returns true */
  exclude?: (moment: Moment) => boolean;
  /** If the picker should close once a date is clicked */
  hideOnChoose?: boolean;
  /** Adds a custom ID to the control */
  id?: string;
  /** Ref to the internal text field */
  inputRef?: RefObject<HTMLInputElement> | ((el: HTMLInputElement) => void);
  /** Label the datepicker */
  label?: ReactNode;
  /** Set the locale for use */
  locale?: string;
  /** Remove bottom margin */
  marginBottom0?: boolean;
  /** Popper modifiers */
  modifiers?: Popper.Modifiers;
  /** Fired when the user clicks out of/deselects the control */
  onBlur?: FocusEventHandler;
  /** Fired anytime internal state changes */
  onChange?: (e: Event, formatted: string, dateString: string) => void;
  /** Fired when the user clicks into the control */
  onFocus?: FocusEventHandler;
  /** When a date is chosen on the calendar */
  onSetDate?: (date: Moment) => void;
  /** Parses a date for local display in the text field */
  parser?: (value: string) => string;
  /** Where the overlay should be placed in relation to the field */
  placement?: Popper.Placement;
  /** If the control is readonly */
  readOnly?: boolean;
  /** If the field is required */
  required?: boolean;
  /** Additional message to be read when the field is focused */
  screenReaderMessage?: boolean;
  /** If the calendar should start off opened */
  showCalendar?: boolean;
  /** Override the default timezone */
  timeZone?: string;
  /** If focusing the text field should open the calendar popup */
  useFocus?: boolean;
  /** If the field is being used within a final-form or similar */
  useInput?: boolean;
  /** Render to the global overlay, if the dropdown may be cut off due to some containing elements's overflow */
  usePortal?: boolean;
  /** The field's value */
  value?: string;
}

export type DatepickerOutputProps =
  | {
      // /** Determines if the datepicker's value will be the formatted local string or one ready for the backend */
      outputBackendValue?: false;
      outputFormatter?: never;
    }
  | {
      // /** Determines if the datepicker's value will be the formatted local string or one ready for the backend */
      outputBackendValue: true;
      // /** Formats a date for the backend */
      outputFormatter?: (date: Moment) => string;
    };

// only allow `outputFormatter` if `outputBackendValue` is true
export type DatepickerProps = DatepickerBaseProps & DatepickerOutputProps;

export type DatepickerFieldRenderProps = FieldRenderProps<string>;

/**
 * A picker for dates with an optional calendar popup
 * @example
 * <Datepicker />
 * // or pass as component within a form...
 * <Field component={Datepicker} />
 * @example
 * <Datepicker
 *   label="Date"
 *   value={this.state.day1}
 *   onChange={handleDateChange}
 * />
 */
export default class Datepicker<
  AdditionalProps extends
    | DatepickerProps
    | DatepickerFieldRenderProps = DatepickerProps
> extends Component<DatepickerProps & AdditionalProps> {}

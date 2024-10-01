/** AppValidatedDatepicker
 * Exports a pre-wrapped Datepicker instance that applies the datePickerAppValidationProps.
 */

import Datepicker from './Datepicker';
import {
  datePickerAppValidationProps
} from './datepicker-util';

export default (props) => (
  <Datepicker {...datePickerAppValidationProps} {...props} />
);

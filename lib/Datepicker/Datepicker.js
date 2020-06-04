import React, { useState, useRef, useEffect} from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { deprecated } from 'prop-types-extra';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import moment from 'moment-timezone';
import contains from 'dom-helpers/query/contains';
import debounce from 'lodash/debounce';
import uniqueId from 'lodash/uniqueId';
import noop from 'lodash/noop';
import formField from '../FormField';

import Popper, { AVAILABLE_PLACEMENTS } from '../Popper';
import IconButton from '../IconButton';
import TextField from '../TextField';
import Calendar from './Calendar';
import css from './Calendar.css';
import defaultRowFormatter from '../MultiColumnList/defaultRowFormatter';

// Programmatically change a field value and trigger the onChange event so that external state can be updated...
const nativeChangeField = (inputRef, focus= true, value = '') => {
  if (inputRef.current) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(inputRef.current, value);

    const ev = new Event('change', { bubbles: true });
    inputRef.current.dispatchEvent(ev);
    if (focus) {
      inputRef.current.focus();
    }
  }
}

// Controls the formatting from the value prop to what displays in the UI.
const defaultParser = ({ value, timeZone, dateFormat }) => {
  if (!value || value === '') { return value; }

  const offsetRegex = /T[\d.:]+[+-][\d]+$/;
  let inputMoment;
  // if date string contains a utc offset, we can parse it as utc time and convert it to selected timezone.
  if (offsetRegex.test(value)) {
    inputMoment = moment.tz(value, timeZone);
  } else {
    inputMoment = moment.tz(value, dateFormat, timeZone);
  }
  const inputValue = inputMoment.format(dateFormat);
  return inputValue;
}

// Controls the formatting from the value prop/input to what is relayed in the onChange event.
const defaultOutFormatter = ({ backendDateStandard, value, dateFormat, timeZone, }) => {
  const DATE_RFC2822 = 'ddd, MM MMM YYYY HH:mm:ss ZZ';
    const parsed = moment.tz(value, dateFormat, timeZone);

    if (/8601/.test(backendDateStandard)) {
      return parsed.toISOString();
    }

    if (/2822/.test(backendDateStandard)) {
      return parsed.format(DATE_RFC2822);
    }

    return parsed.format(backendDateStandard);
}

const propTypes = {
  autoFocus: PropTypes.bool,
  backendDateStandard: PropTypes.string,
  date: PropTypes.object,
  dateFormat: PropTypes.string,
  disabled: PropTypes.bool,
  exclude: PropTypes.func,
  hideOnChoose: PropTypes.bool,
  id: PropTypes.string,
  input: PropTypes.object,
  inputRef: PropTypes.object,
  intl: PropTypes.object,
  label: PropTypes.node,
  locale: PropTypes.string,
  meta: PropTypes.object,
  modifiers: PropTypes.object,
  onChange: PropTypes.func,
  onSetDate: PropTypes.func,
  parser: PropTypes.func,
  placement: PropTypes.oneOf(AVAILABLE_PLACEMENTS),
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  screenReaderMessage: PropTypes.string,
  showCalendar: PropTypes.bool,
  tether: deprecated(PropTypes.object, `
    For overlay placement you can use the 'placement'-prop'.
    For other modifications you use the 'modifiers'-prop.
    See the documentation for <Popper> for more information.
  `),
  timeZone: PropTypes.string,
  useFocus: PropTypes.bool,
  value: PropTypes.string,
};

const defaultProps = {
  autoFocus: false,
  backendDateStandard: 'ISO8601',
  hideOnChoose: true,
  modifiers: {},
  parser: defaultParser,
  placement: 'bottom',
  screenReaderMessage: '',
  useFocus: true,
};

const Datepicker = ({
  backendDateStandard,
  dateFormat,
  hideOnChoose,
  id,
  intl,
  modifiers,
  outFormat,
  parser,
  placement,
  readOnly,
  screenReaderMessage,
  showCalendar: showCalendarProp,
  tether,
  timeZone,
  useFocus,
  useInput,
  value: valueProp,
  ...props }) => {
  const [dateString, updateDateString] = useState(
    parser(valueProp, 'utc', 'MM/DD/YYYY')
  );
  const [formatted, updateFormatted] = useState(
    parser(valueProp, 'utc', 'MM/DD/YYYY')
  );
  const [valid, updateValid] = useState(true);
  const [showCalendar, setShowCalendar] = useState(showCalendarProp);

  const input = useRef(null);
  const hiddenInput = useRef(null);
  const testId = useRef(id || uniqueId('dp-')).current;
  
  // trigger change when formatted date changes...
  useEffect(() => {
    if (useInput) {
      nativeChangeField(hiddenInput, false, formatted);
    }
  }, [useInput, formatted])

  const maybeUpdateValue = (value) => {
    // use strict mode to check validity  - incomplete dates, anything not conforming to the format will be invalid
    const valueMoment = new moment(value, 'MM/DD/YYYY', true);
    const isValid = valueMoment.isValid();

    // for valid dates or externally cleared (''), we update the inputfield (datestring) AND the formattedDate
    if (isValid || value === '') {
      const parsed = parser(value, 'utc', 'MM/DD/YYYY');
      if (parsed !== dateString) {
        updateDateString(parsed);
        updateFormatted(moment(parsed).toISOString());
        updateValid(true)
      }
    } else if (value !== dateString) { // if the date's not valid, we just update the datestring...
      updateDateString(value);
      updateValid(false);
    }
  }

  // valueProp could come from backend, or could come from state...
  if (typeof valueProp !== 'undefined') {
    maybeUpdateValue(valueProp);
  }

  // for vanilla react/non-final-form implementations that just get the input value.
  const internalHandleChange = (e) => {
    maybeUpdateValue(e.target.value);
    if (!useInput || !outFormat) {
      onChange(e, formatted);
    }
  }

  // for final-form so it can have a native change event rather than a fabricated thing...
  const onChangeFormatted = (e) => {
    if (useInput) {
      onChange(e, dateString);
    }
  }

  const internalClearDate = () => {
    updateDateString('');
    updateFormatted('');
    updateValid(true);
    // way to programmatically change a value on the field and trigger
    // the onChange event:
    nativeChangeField(input);
  }

  const toggleCalendar = () => {
    setShowCalendar(cur => !cur);
  }

  // renders clear button and calendar button
  const renderEndElement = () => {
    if (readOnly) return null;
    return (
      <>
        { dateString !== '' && (
          <FormattedMessage id="stripes-components.clearFieldValue">
            {ariaLabel => (
              <IconButton
                data-test-clear
                key="clearButton"
                onClick={internalClearDate}
                aria-label={ariaLabel}
                id={`datepicker-clear-button-${testId}`}
                tabIndex="-1"
                icon="times-circle-solid"
              />
            )}
          </FormattedMessage>
        )}
        <FormattedMessage id="stripes-components.showOrHideDatepicker">
          {ariaLabel => (
            <IconButton
              data-test-calendar-button
              onClick={toggleCalendar}
              onFocus={(e) => { e.stopPropagation(); }}
              aria-label={ariaLabel}
              id={`datepicker-toggle-calendar-button-${testId}`}
              tabIndex="-1"
              icon="calendar"
            />
          )}
        </FormattedMessage>
      </>
    );
  }

  return (
    <div>
      <TextField
        {...props}
        readOnly={readOnly}
        value={dateString}
        onChange={internalHandleChange}
        endControl={renderEndElement()}
        onBlur = {(e) => {
         e.preventDefault(); }}
        hasClearIcon={false}
        inputRef={input}
      />
      <input type="hidden" hidden value={formatted} onChange={onChangeFormatted} ref={hiddenInput} />
    </div>
  );
};

Datepicker.defaultProps = {
  parser: defaultParser,
  outFormatter: defaultOutFormatter,
}

Datepicker.propTypes = propTypes;
Datepicker.defaultProps = defaultProps;

export default formField(
  injectIntl(Datepicker),
  ({input, meta}) => ({
    onBlur: input?.onBlur,
    error: meta?.error,
    useInput: true
  })
);

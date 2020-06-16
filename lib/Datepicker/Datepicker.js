import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { deprecated } from 'prop-types-extra';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import moment from 'moment-timezone';
import contains from 'dom-helpers/query/contains';
// import debounce from 'lodash/debounce';
import uniqueId from 'lodash/uniqueId';
// import noop from 'lodash/noop';
import formField from '../FormField';

import Popper, { AVAILABLE_PLACEMENTS } from '../Popper';
import IconButton from '../IconButton';
import TextField from '../TextField';
import Calendar from './Calendar';
import css from './Calendar.css';

// Programmatically change a field value and trigger the onChange event so that external state can be updated...
const nativeChangeField = (inputRef, focus, value = '') => {
  if (inputRef.current) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(inputRef.current, value);

    const ev = new Event('change', { bubbles: true });
    inputRef.current.dispatchEvent(ev);
    if (focus) {
      inputRef.current.focus();
    }
  }
};

// Returns a localized format.
const getLocalFormat = ({
  // intlLocale,
  // localeProp,
  intl }) => {
  // const locale = localeProp || intlLocale;
  // if (moment.locales().findIndex(l => l === locale) !== -1) {
  //   return moment.localeData()._longDateFormat.L;
  // } else {

  // create a basic date to use starting with a standardized format...
  const tempDate = new Date('Thu May 14 2020 14:39:25 GMT-0500');
  // set up a locally formatted array of parts...
  const formatted = intl.formatDateToParts(tempDate, {
    day: '2-digit',
    year: 'numeric',
    month: '2-digit'
  });
  // pull the localized format from the array of formatted parts.
  let format = '';
  formatted.forEach((p) => {
    switch (p.type) {
      case 'month':
        format += 'MM';
        break;
      case 'day':
        format += 'DD';
        break;
      case 'year':
        format += 'YYYY';
        break;
      case 'literal':
        format += p.value;
        break;
      default:
        break;
    }
  });
  return format;
  // }
};

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
};

// Controls the formatting from the value prop/input to what is relayed in the onChange event.
const defaultOutFormatter = ({ backendDateStandard, value, dateFormat, timeZone }) => {
  const DATE_RFC2822 = 'ddd, MM MMM YYYY HH:mm:ss ZZ';
  const parsed = moment.tz(value, dateFormat, timeZone);

  if (/8601/.test(backendDateStandard)) {
    return parsed.toISOString();
  }

  if (/2822/.test(backendDateStandard)) {
    return parsed.format(DATE_RFC2822);
  }

  return parsed.format(backendDateStandard);
};

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

const Datepicker = (
  { backendDateStandard, // eslint-disable-line no-unused-vars
    dateFormat,
    exclude,
    hideOnChoose,
    id,
    intl,
    locale,
    modifiers,
    onChange,
    outFormat,
    parser,
    placement,
    readOnly,
    screenReaderMessage, // eslint-disable-line no-unused-vars
    showCalendar: showCalendarProp,
    tether,
    timeZone, // eslint-disable-line no-unused-vars
    useFocus, // eslint-disable-line no-unused-vars
    useInput,
    value: valueProp,
    ...props }
) => {
  const format = useRef(dateFormat || getLocalFormat({ intlLocale: intl.locale, localeProp: locale, intl })).current;

  const [dateString, updateDateString] = useState(
    parser({ valueProp, timeZone: 'utc', dateFormat: format }) || ''
  );
  const [formatted, updateFormatted] = useState(
    parser({ valueProp, timeZone: 'utc', dateFormat: format }) || ''
  );
  const [valid, updateValid] = useState(true);
  const [showCalendar, setShowCalendar] = useState(showCalendarProp);

  const input = useRef(null);
  const hiddenInput = useRef(null);
  const testId = useRef(id || uniqueId('dp-')).current;
  const calendar = useRef(null);
  const calendarFirstField = useRef(null);
  const container = useRef(null);

  // trigger change when formatted date changes...
  useEffect(() => {
    if (useInput) {
      nativeChangeField(hiddenInput, false, formatted);
    }
  }, [useInput, formatted]);

  const maybeUpdateValue = (value) => {
    // use strict mode to check validity  - incomplete dates, anything not conforming to the format will be invalid
    const valueMoment = new moment(value, format, true); // eslint-disable-line new-cap
    const isValid = valueMoment.isValid();

    // for valid dates or externally cleared (''), we update the inputfield (datestring) AND the formattedDate
    if (isValid || value === '') {
      const parsed = parser({ value, timeZone: 'utc', dateFormat: format });
      if (parsed !== dateString) {
        updateDateString(parsed);
        updateFormatted(moment(parsed).toISOString());
        updateValid(true);
      }
    } else if (value !== dateString) { // if the date's not valid, we just update the datestring...
      updateDateString(value);
      updateValid(false);
    }
  };

  const setFromCalendar = (value) => {
    nativeChangeField(input, hideOnChoose, value);
    if (hideOnChoose) {
      setShowCalendar(false);
    }
  };

  // valueProp could come from backend, or could come from state...
  if (typeof valueProp !== 'undefined') {
    maybeUpdateValue(valueProp);
  }

  // for vanilla react/non-final-form implementations that just get the input value.
  const internalHandleChange = (e) => {
    maybeUpdateValue(e.target.value);
    if ((!useInput || !outFormat) && onChange) {
      onChange(e, formatted);
    }
  };

  // for final-form so it can have a native change event rather than a fabricated thing...
  const onChangeFormatted = (e) => {
    if (useInput && onChange) {
      onChange(e, dateString);
    }
  };

  const datePickerIsFocused = () => {
    if (contains(container.current, document.activeElement) &&
      document.activeElement !== document.body) {
      if (calendar.current) {
        return (contains(calendar.getDOMContainer(), document.activeElement));
      }
      return true;
    }
    return false;
  };

  const internalClearDate = () => {
    nativeChangeField(input, true, '');
  };

  const toggleCalendar = () => {
    setShowCalendar(cur => !cur);
  };

  const handleRootClose = (e) => {
    if (!contains(container.current, e.target)) {
      if (!datePickerIsFocused()) {
        setShowCalendar(false);
      }
    }
  };

  const handleRequestClose = () => {
    input.current?.focus(); // eslint-disable-line no-unused-expressions
    setShowCalendar(false);
  };

  const renderCalendar = () => (
    <RootCloseWrapper onRootClose={handleRootClose}>
      <Calendar
        onSetDate={setFromCalendar}
        selectedDate={dateString}
        dateFormat={format}
        firstFieldRef={calendarFirstField}
        onRequestClose={handleRequestClose}
        locale={locale || intl.locale}
        exclude={exclude}
        id={testId}
      />
    </RootCloseWrapper>
  );

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
              aria-label={ariaLabel}
              aria-haspopup="true"
              aria-expanded={showCalendar ? 'true' : 'false'}
              id={`datepicker-toggle-calendar-button-${testId}`}
              icon="calendar"
            />
          )}
        </FormattedMessage>
      </>
    );
  };

  const content = (
    <div className={css.container} ref={container}>
      <TextField
        {...props}
        id={testId}
        readOnly={readOnly}
        value={dateString}
        onChange={internalHandleChange}
        endControl={renderEndElement()}
        onBlur={(e) => { e.preventDefault(); }}
        hasClearIcon={false}
        inputRef={input}
        placeholder={format}
      />
      <input type="hidden" hidden value={formatted} onChange={onChangeFormatted} ref={hiddenInput} />
    </div>
  );

  /**
   * Legacy support – will be removed in a future release
   */
  if (tether) {
    const tetherProps = {
      attachment: 'top center',
      targetAttachment: 'bottom center',
      optimizations: {
        gpu: false,
      },
      constraints: [{
        to: 'window',
        attachment: 'together',
      },
      {
        to: 'scrollParent',
        pin: true,
      },
      ],
    };

    return (
      <TetherComponent {...tetherProps} {...tether}>
        {content}
        {showCalendar && renderCalendar()}
      </TetherComponent>
    );
  }
  // end legacy code

  return (
    <>
      {content}
      <Popper
        placement={placement}
        isOpen={showCalendar}
        anchorRef={container}
        onToggle={toggleCalendar}
        modifiers={{
          offset: {
            enabled: true,
            offset: '0,10',
          },
          ...modifiers
        }}
      >
        {renderCalendar()}
      </Popper>
    </>
  );
};

Datepicker.defaultProps = {
  parser: defaultParser,
  outFormatter: defaultOutFormatter,
};

Datepicker.propTypes = propTypes;
Datepicker.defaultProps = defaultProps;

export default formField(
  injectIntl(Datepicker),
  ({ input, meta }) => ({
    onBlur: input?.onBlur,
    error: meta?.error,
    useInput: true
  })
);

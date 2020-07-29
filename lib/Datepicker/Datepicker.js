import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { deprecated } from 'prop-types-extra';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import moment from 'moment-timezone';
import contains from 'dom-helpers/query/contains';
import uniqueId from 'lodash/uniqueId';
import pick from 'lodash/pick';
import formField from '../FormField';

import Popper, { AVAILABLE_PLACEMENTS } from '../Popper';
import IconButton from '../IconButton';
import TextField from '../TextField';
import Calendar from './Calendar';
import css from './Calendar.css';

const pickDataProps = (props) => pick(props, (v, key) => key.indexOf('data-test') !== -1);

// Programmatically change a field value and trigger the onChange event so that external state can be updated...
const nativeChangeField = (inputRef, focus, value = '', triggerChange = true) => {
  if (inputRef.current) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(inputRef.current, value);

    if (triggerChange) {
      const ev = new Event('change', { bubbles: true });
      inputRef.current.dispatchEvent(ev);
      if (focus) {
        inputRef.current.focus();
      }
    }
  }
};

// Returns a localized format.
export const getLocalFormat = ({ intl }) => {
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
};

// Controls the formatting from the value prop to what displays in the UI.
// need to judge the breakage factor in adopting a spread syntax for these parameters...
const defaultParser = (value, timeZone, uiFormat, outputFormats) => {
  if (!value || value === '') { return value; }

  const offsetRegex = /T[\d.:]+[+-][\d]+$/;
  let inputMoment;
  // if date string contains a utc offset, we can parse it as utc time and convert it to selected timezone.
  if (offsetRegex.test(value)) {
    inputMoment = moment.tz(value, timeZone);
  } else {
    inputMoment = moment.tz(value, [uiFormat, ...outputFormats], timeZone);
  }
  const inputValue = inputMoment.format(uiFormat);
  return inputValue;
};

// Controls the formatting from the value prop/input to what is relayed in the onChange event.
const defaultOutputFormatter = ({ backendDateStandard, value, uiFormat, outputFormats, timeZone }) => {
  if (!value || value === '') { return value; }
  const parsed = new moment.tz(value, [uiFormat, ...outputFormats], timeZone); // eslint-disable-line 

  if (/8601/.test(backendDateStandard)) {
    return parsed.toISOString();
  }

  // for support of the RFC2822 format (rare thus far and support may soon be deprecated.)
  if (/2822/.test(backendDateStandard)) {
    const DATE_RFC2822 = 'ddd, MM MMM YYYY HH:mm:ss ZZ';
    return parsed.format(DATE_RFC2822);
  }

  // if a localized string dateformat has been passed, normalize the date first...
  // otherwise, localized strings could be submitted to the backend.
  const normalizedDate = parsed.toISOString().substring(0, 10);
  return new moment(normalizedDate, 'YYYY-MM-DD').format(backendDateStandard); // eslint-disable-line new-cap
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
  outputBackendValue: PropTypes.bool,
  outputFormatter: PropTypes.func,
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
  useInput: PropTypes.bool,
  value: PropTypes.string,
};

const getBackendDateStandard = (standard, use) => {
  if (!use) return undefined;
  if (standard === 'ISO8601') return ['YYYY-MM-DDTHH:mm:ss.sssZ'];
  if (standard === 'RFC2822') return ['ddd, MM MMM YYYY HH:mm:ss ZZ'];
  return [standard, 'YYYY-MM-DDTHH:mm:ss.sssZ', 'ddd, MM MMM YYYY HH:mm:ss ZZ'];
};

const defaultProps = {
  autoFocus: false,
  backendDateStandard: 'ISO8601',
  hideOnChoose: true,
  modifiers: {},
  outputFormatter: defaultOutputFormatter,
  outputBackendValue: true,
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
    outputBackendValue,
    outputFormatter,
    parser,
    placement,
    readOnly,
    screenReaderMessage, // eslint-disable-line no-unused-vars
    showCalendar: showCalendarProp,
    tether,
    timeZone: timeZoneProp, // eslint-disable-line no-unused-vars
    useFocus, // eslint-disable-line no-unused-vars
    useInput,
    value: valueProp,
    ...props }
) => {
  const format = useRef(dateFormat || getLocalFormat({ intlLocale: intl.locale, localeProp: locale, intl })).current;
  const [datePair, updateDatePair] = useState({
    dateString: typeof valueProp !== 'undefined' ? parser(
      valueProp, // value
      timeZoneProp || intl.timeZone, // timezone
      format, // uiFormat
      getBackendDateStandard(backendDateStandard, true) // outputFormats
    ) : null,
    formatted: typeof valueProp !== 'undefined' ? outputFormatter({
      backendDateStandard,
      value: valueProp,
      timeZone: timeZoneProp || intl.timeZone,
      uiFormat: format,
      outputFormats: getBackendDateStandard(backendDateStandard, true)
    }) : null
  });
  // since updating the Datepair object isn't quite enough to prompt a re-render when its only partially
  // updated, need to maintain a 2nd field containing only the displayed value.
  // this resolves issue with the clearIcon not showing up.
  const [displayedValue, updateDisplayed] = useState(datePair.dateString);
  const [showCalendar, setShowCalendar] = useState(showCalendarProp);

  const input = useRef(null);
  const hiddenInput = useRef(null);
  const testId = useRef(id || uniqueId('dp-')).current;
  const calendar = useRef(null);
  const calendarFirstField = useRef(null);
  const container = useRef(null);
  const payload = useRef(datePair);

  let maybeUpdateValue;

  // handle value changes that originate outside of the component.
  useEffect(() => {
    if (typeof valueProp !== 'undefined' && valueProp !== datePair.dateString && valueProp !== datePair.formatted) {
      payload.current = Object.assign(payload.current, maybeUpdateValue(valueProp));
      nativeChangeField(input, false, payload.current.dateString);
    }
  }, [valueProp, maybeUpdateValue, datePair.dateString, datePair.formatted]);

  maybeUpdateValue = (value) => {
    if (value === '') {
      const blankDates = {
        dateString: '',
        formatted: ''
      };
      updateDatePair(blankDates);
      updateDisplayed('');
      return blankDates;
    }

    // use strict mode to check validity  - incomplete dates, anything not conforming to the format will be invalid
    const backendStandard = getBackendDateStandard(backendDateStandard, outputBackendValue);
    const valueMoment = new moment(// eslint-disable-line new-cap
      value,
      [format, ...backendStandard], // pass array of possible formats ()
      true
    );
    const isValid = valueMoment.isValid();

    let dates;

    // otherwise parse the value and update the datestring and the formatted date...
    if (isValid) {
      const parsed = parser(
        value,
        timeZoneProp || intl.timeZone,
        format, // uiFormat
        backendStandard, // outputFormat
      );
      if (parsed !== datePair.dateString) {
        const hiddenDate = outputFormatter({
          backendDateStandard,
          value: parsed,
          uiFormat: format,
          outputFormats: backendStandard,
          timeZone: timeZoneProp || intl.timeZone
        });
        dates = { dateString: parsed, formatted: hiddenDate };
        updateDatePair(current => {
          const newDatePair = Object.assign(current, dates);
          return newDatePair;
        });
        return dates;
      }
      return {};
    } else if (value !== datePair.dateString) { // if the date's not valid, we just update the datestring...
      dates = {
        dateString: value,
      };
      updateDatePair(current => {
        const newDatePair = Object.assign(current, dates);
        return newDatePair;
      });
      updateDisplayed(dates.dateString);
      return dates;
    }
    return {};
  };

  const setFromCalendar = (value) => {
    nativeChangeField(input, hideOnChoose, value);
    if (hideOnChoose) {
      setShowCalendar(false);
    }
  };


  // for vanilla react/non-final-form implementations that just get the input value.
  const internalHandleChange = (e) => {
    payload.current = Object.assign(payload.current, maybeUpdateValue(e.target.value));
    if ((!useInput || !outputBackendValue) && onChange) {
      onChange(e, e.target.value, payload.current.formatted);
    } else if (payload.current.formatted !== hiddenInput.current.value) {
      nativeChangeField(hiddenInput, false, payload.current.formatted);
    }
  };

  // for final-form so it can have a native change event rather than a fabricated thing...
  const onChangeFormatted = (e) => {
    if (useInput && outputBackendValue && onChange) {
      const { dateString, formatted } = payload.current;
      onChange(e, formatted, dateString);
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
    updateDatePair({ dateString: '', formatted: '' });
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
        selectedDate={datePair.dateString}
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
        { displayedValue && (
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
              aria-expanded={!!showCalendar}
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
        value={datePair.dateString}
        onChange={internalHandleChange}
        endControl={renderEndElement()}
        onBlur={(e) => { e.preventDefault(); }}
        hasClearIcon={false}
        inputRef={input}
        placeholder={format}
      />
      <input type="text" hidden value={datePair.formatted} onChange={onChangeFormatted} ref={hiddenInput} />
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
    <div className={css.container} {...pickDataProps(props)}>
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
    </div>
  );
};

Datepicker.propTypes = propTypes;
Datepicker.defaultProps = defaultProps;

export default formField(
  injectIntl(Datepicker),
  ({ input, meta }) => ({
    onBlur: input?.onBlur,
    error: meta?.touched && meta?.error,
    useInput: true
  })
);

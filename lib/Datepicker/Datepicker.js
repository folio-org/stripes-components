import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import contains from 'dom-helpers/query/contains';
import uniqueId from 'lodash/uniqueId';
import pick from 'lodash/pick';
import RootCloseWrapper from '../../util/RootCloseWrapper';
import nativeChangeField from '../../util/nativeChangeFieldValue';
import formField from '../FormField';
import Popper, { AVAILABLE_PLACEMENTS } from '../Popper';
import IconButton from '../IconButton';
import TextField from '../TextField';
import Calendar from './Calendar';
import css from './Calendar.css';
import { getLocaleDateFormat } from '../../util/dateTimeUtils';
import useDynamicLocale from '../../hooks/useDynamicLocale';

dayjs.extend(timezone);

const pickDataProps = (props) => pick(props, (v, key) => key.indexOf('data-test') !== -1);

// Controls the formatting from the value prop to what displays in the UI.
// need to judge the breakage factor in adopting a spread syntax for these parameters...
const defaultParser = (value, timeZone, uiFormat, outputFormats) => {
  if (!value || value === '') { return value; }

  const offsetRegex = /T[\d.:]+[+-][\d]+$/;
  const offsetRE2 = /T[\d:]+[-+][\d:]+\d{2}$/; // sans milliseconds
  let inputMoment;
  // if date string contains a utc offset, we can parse it as utc time and convert it to selected timezone.
  if (offsetRegex.test(value) || offsetRE2.test(value)) {
    inputMoment = dayjs.tz(value, timeZone);
  } else {
    inputMoment = dayjs.tz(value, [uiFormat, ...outputFormats], timeZone);
  }
  const inputValue = inputMoment.format(uiFormat);
  return inputValue;
};

/**
 * defaultOutputFormatter
 * Controls the formatting from the value prop/input to what is relayed in the onChange event.
 * This function has two responsibilities:
 *   1. use `backendDateStandard` to format `value`
 *   2. convert value to Arabic/Latn digits (0-9)
 *
 * The first responsibility is pretty obvious, but the second one is subtle,
 * implied but never clearly stated in API documentation. Dates are passed
 * as strings in API requests and are then interpreted by the backend as Dates.
 * To be so interpretable, they must conform to the expected formatted AND use
 * the expected numeral system.
 *
 * This function allows the format to be changed with `backendDateStandard`.
 * To change the numeral system, pass a function as `outputFormatter`, which
 * gives you control over both the format and the numeral system.
 *
 * @returns {string} 7-bit ASCII
 */
export const defaultOutputFormatter = ({ backendDateStandard, value, uiFormat, outputFormats, timeZone }) => {
  if (!value || value === '') { return value; }
  const parsed = new dayjs.tz(value, [uiFormat, ...outputFormats], timeZone); // eslint-disable-line

  if (/8601/.test(backendDateStandard)) {
    return parsed.toISOString();
  }

  // Use `.locale('en')` before `.format(...)` to get Arabic/"Latn" numerals.
  // otherwise, a locale like ar-SA or any locale with a "-u-nu-..." subtag
  // can give us non-Arabic (non-"Latn") numerals, and in such a locale the
  // formatter "YYYY-MM-DD" can give us output like this: ١٦‏/٠٧‏/٢٠٢١
  // i.e. we get year-month-day but in non-Arabic numerals.
  //
  // Additional details about numbering systems at
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/numberingSystem
  // and about how the locale string may be parsed at
  // https://www.rfc-editor.org/rfc/rfc5646.html

  // for support of the RFC2822 format (rare thus far and support may soon be deprecated.)
  if (/2822/.test(backendDateStandard)) {
    const DATE_RFC2822 = 'ddd, DD MMM YYYY HH:mm:ss ZZ';
    return parsed.locale('en').format(DATE_RFC2822);
  }

  // if a localized string dateformat has been passed, normalize the date first...
  // otherwise, localized strings could be submitted to the backend.
  const normalizedDate = dayjs.utc(value, [uiFormat, ...outputFormats]);

  return new dayjs(normalizedDate, 'YYYY-MM-DD').locale('en').format(backendDateStandard); // eslint-disable-line
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
  inputRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  intl: PropTypes.object,
  label: PropTypes.node,
  locale: PropTypes.string,
  meta: PropTypes.object,
  modifiers: PropTypes.object,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onSetDate: PropTypes.func,
  outputBackendValue: PropTypes.bool,
  outputFormatter: PropTypes.func,
  parser: PropTypes.func,
  placement: PropTypes.oneOf(AVAILABLE_PLACEMENTS),
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  screenReaderMessage: PropTypes.string,
  showCalendar: PropTypes.bool,
  timeZone: PropTypes.string,
  useFocus: PropTypes.bool,
  useInput: PropTypes.bool,
  usePortal: PropTypes.bool,
  value: PropTypes.string,
};

const getBackendDateStandard = (standard, use) => {
  if (!use) return undefined;
  if (standard === 'ISO8601') return ['YYYY-MM-DDTHH:mm:ss.sssZ', 'YYYY-MM-DDTHH:mm:ssZ'];
  if (standard === 'RFC2822') return ['ddd, DD MMM YYYY HH:mm:ss ZZ'];
  return [standard, 'YYYY-MM-DDTHH:mm:ss.sssZ', 'ddd, DD MMM YYYY HH:mm:ss ZZ'];
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
    disabled,
    dateFormat,
    exclude,
    hideOnChoose,
    id,
    intl,
    locale,
    modifiers,
    onBlur,
    onChange,
    onFocus,
    outputBackendValue,
    outputFormatter,
    parser,
    placement,
    readOnly,
    screenReaderMessage, // eslint-disable-line no-unused-vars
    showCalendar: showCalendarProp,
    timeZone: timeZoneProp, // eslint-disable-line no-unused-vars
    useFocus, // eslint-disable-line no-unused-vars
    useInput,
    usePortal,
    value: valueProp,
    inputRef,
    ...props }
) => {
  const format = useRef(
    dateFormat || getLocaleDateFormat({ intlLocale: intl.locale, localeProp: locale, intl })
  ).current;
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
  const localeLoaded = useDynamicLocale();
  // since updating the Datepair object isn't quite enough to prompt a re-render when its only partially
  // updated, need to maintain a 2nd field containing only the displayed value.
  // this resolves issue with the clearIcon not showing up.
  const [displayedValue, updateDisplayed] = useState(datePair.dateString);
  const [showCalendar, setShowCalendar] = useState(showCalendarProp);

  const input = useRef(null);
  const pickerRef = useRef(null);
  const blurTimeout = useRef(null);
  const hiddenInput = useRef(null);
  const testId = useRef(id || uniqueId('dp-')).current;
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
    const valueMoment = new dayjs(// eslint-disable-line new-cap
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
        updateDisplayed(dates.dateString);
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
      if (pickerRef.current) {
        return (contains(pickerRef.current, document.activeElement));
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


  const queueBlur = (e) => {
    blurTimeout.current = setTimeout(() => {
      if (onBlur) {
        if (useInput) {
          onBlur({
            target: outputBackendValue ? hiddenInput.current : input.current,
            stopPropagation: () => { },
            preventDefault: () => { },
            defaultPrevented: true,
          });
        } else {
          onBlur(e);
        }
      }
    });
  };

  const cancelBlur = () => {
    clearTimeout(blurTimeout.current);
  };

  const handleInternalBlur = (e) => {
    e.preventDefault();
    queueBlur(e);
  };

  const handleInternalFocus = (e) => {
    cancelBlur();
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleRootClose = (e) => {
    if (!contains(container.current, e.target) || !contains(pickerRef.current, e.target)) {
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
    <RootCloseWrapper
      onRootClose={handleRootClose}
      ref={pickerRef}
    >
      <Calendar
        onSetDate={setFromCalendar}
        selectedDate={datePair.dateString}
        dateFormat={format}
        firstFieldRef={calendarFirstField}
        onFocus={handleInternalFocus}
        onRequestClose={handleRequestClose}
        rootRef={pickerRef}
        locale={locale || intl.locale}
        exclude={exclude}
        id={testId}
      />
    </RootCloseWrapper>
  );

  // renders clear button and calendar button
  const renderEndElement = () => {
    if (readOnly || disabled) return null;
    return (
      <>
        {displayedValue && (
          <FormattedMessage id="stripes-components.clearFieldValue">
            {([ariaLabel]) => (
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
          {([ariaLabel]) => (
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

  const content = localeLoaded && (
    <div
      className={css.container}
      ref={container}
      data-test-datepicker-container
      onFocus={handleInternalFocus}
      onBlur={handleInternalBlur}
    >
      <TextField
        {...props}
        id={testId}
        readOnly={readOnly}
        disabled={disabled}
        value={datePair.dateString}
        onChange={internalHandleChange}
        endControl={renderEndElement()}
        hasClearIcon={false}
        inputRef={element => {
          input.current = element;
          if (typeof inputRef === 'object') inputRef.current = element;
          if (typeof inputRef === 'function') inputRef(element);
        }}
        placeholder={format}
      />
      <input
        data-test-datepicker-hidden-input
        type="text"
        hidden
        value={datePair.formatted}
        onChange={onChangeFormatted}
        ref={hiddenInput}
      />
    </div>
  );

  const portalElem = usePortal ? document.getElementById('OverlayContainer') : null;
  return (
    <div className={css.container} {...pickDataProps(props)}>
      {content}
      <Popper
        placement={placement}
        isOpen={showCalendar}
        anchorRef={container}
        onToggle={toggleCalendar}
        portal={usePortal && portalElem}
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
    onFocus: input?.onFocus,
    error: meta?.touched ? meta.error : undefined,
    useInput: true
  })
);

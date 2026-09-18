import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';

import FormField from '../FormField';
import TextField from '../TextField';
import SRStatus from '../SRStatus';
import Popper, { AVAILABLE_PLACEMENTS } from '../Popper';
import RootCloseWrapper from '../../util/RootCloseWrapper';
import IconButton from '../IconButton';
import TimeDropdown from './TimeDropdown';
import parseMeta from '../FormField/parseMeta';
import nativeChangeFieldValue from '../../util/nativeChangeFieldValue';
import {
  dayjs,
  formatLocalizedTime,
  getHourForLocalizedPeriod,
  getLocaleDateFormat,
  parseLocalizedTime
} from '../../util/dateTimeUtils';

// supplied a list of formats, dayjs will use the FIRST format in the list
// that can be successfully parsed.
const twelveHourFormats = ['h:mm A', 'h:mm ', 'h:mm', 'h'];
const twentyFourHourFormats = ['HH:mm', 'H:mm', 'H'];

/**
 * containsUTCOffset
 * Return true if this looks like an RFC-3339 compliant timestamp including
 * a timezone such as
 *   2026-09-17T15:41:12.123-0400
 *   2026-09-17T15:41:12-0400
 *   2026-09-17T19:41:12.123Z
 * Return false otherwise.
 *
 * @param {string} timestamp
 * @returns boolen
 */
const containsUTCOffset = (value) => {
  const expressions = [
    /T[\d.:]+[+-]\d+$/,
    /T[\d:]+[-+][\d:]+\d{2}$/, // sans milliseconds
    /Z$/i
  ];

  return expressions.some(regex => regex.test(value));
};

/**
 * defaultParser
 * Despite the name, this is a formatter. Given a value like 15:41:12.123, a
 * timezone, and a format-mask, return a full RFC-3339 value such as
 * 2026-09-17T15:41:12.123-0400.
 *
 * Not all the arguments are used here, but they are included in this reference
 * implementation to provide an example of the arguments that will be provided
 * to function given by props.parser.
 *
 * @param {string} timestamp, e.g. 15:41:12.123-0400, 15:41:12
 * @param {string} timezone
 * @param {string} timeFormat
 * @param {*} intl
 * @returns
 */
export const defaultParser = (value, timezone, timeFormat, intl) => { // eslint-disable-line no-unused-vars
  if (!value) return '';
  let time;
  const locale = intl?.locale || 'en-US';
  if (containsUTCOffset(value)) {
    // if it has an offset, it probably came from the backend and
    // can be expected to be utc (utc offset of 0) -
    // we contrive a date string to pass the value to dayjs
    // without having to get too specific about an expected format(s)...
    // if we didn't do this, it would need something like
    // dayjs.tz(value, 'HH:mm:ss.sssZ', timezone);
    // with expected format(s) as the 2nd parameter

    const dateString = dayjs().format('YYYY-MM-DD');
    time = dayjs.utc(`${dateString}T${value}`).tz(timezone);
  } else {
    time = parseLocalizedTime(value, timeFormat, locale);
  }

  // entered value that's fewer characters than the expected format will pass through..
  // e.g. '2' in an expected full string of '2:35 AM'
  return time.isValid() ? formatLocalizedTime(time, locale, timeFormat) : value;
};

// Not all parameter keys may be used in this function, but they are provided as a convenience for
// overrides to the props using this as default.
// eslint-disable-next-line no-unused-vars
export const defaultOutputFormatter = ({ value, formats, timezone = 'utc', intl }) => {
  const formatList = Array.isArray(formats) ? formats : [formats];
  const locale = intl?.locale || 'en-US';
  const parsedTime = parseLocalizedTime(value, formatList, locale);
  let isoTime;

  if (parsedTime.isValid()) {
    const normalizedValue = parsedTime.format('YYYY-MM-DD HH:mm');
    isoTime = timezone === 'utc'
      ? dayjs.utc(normalizedValue, 'YYYY-MM-DD HH:mm')
      : dayjs.tz(normalizedValue, 'YYYY-MM-DD HH:mm', timezone);
  } else {
    const format = formatList.find(candidate => dayjs(value, candidate, true).isValid()) || formatList[0];
    isoTime = timezone === 'utc'
      ? dayjs.utc(value, format)
      : dayjs.tz(value, format, timezone);
  }
  if (isoTime.isValid()) {
    isoTime = isoTime.toISOString();
    const timeSplit = isoTime.split('T');
    return timeSplit[1];
  }
  return '';
};

/**
 * convertTo24hr
 * Convert string-pairs, e.g. ["12", "am"] or ["11", "pm"], to corresponding
 * numeric values on a 24-hour clock, e.g. 0 or 23, respectively.
 *
 * @param {string} hour in the range 1-12, inclusive
 * @param {string} period string matching an entry from dayPeriods
 * @param {string[]} dayPeriods two-element array corresponding to am and pm
 * @returns
 */
export const convertTo24hr = (hour, period, dayPeriods, locale) => {
  if (locale) {
    const localizedHour = getHourForLocalizedPeriod(hour, period, locale);
    if (localizedHour !== undefined) return localizedHour;
  }

  const adjustedHour = Number.parseInt(hour, 10);
  if (period === dayPeriods[1] && adjustedHour !== 12) return adjustedHour + 12;
  else if (period === dayPeriods[0] && adjustedHour === 12) return 0;
  return adjustedHour;
};

const propTypes = {
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  inputRef: PropTypes.oneOfType([PropTypes.shape({ current: PropTypes.element }), PropTypes.func]),
  intl: PropTypes.object,
  label: PropTypes.node,
  locale: PropTypes.string,
  marginBottom0: PropTypes.bool,
  modifiers: PropTypes.object,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  outputBackendValue: PropTypes.bool,
  outputFormatter: PropTypes.func,
  parser: PropTypes.func,
  placement: PropTypes.oneOf(AVAILABLE_PLACEMENTS),
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  screenReaderMessage: PropTypes.string,
  showTimepicker: PropTypes.bool,
  timeFormat: PropTypes.string,
  timeZone: PropTypes.string,
  useInput: PropTypes.bool,
  usePortal: PropTypes.bool,
  value: PropTypes.string,
};

const Timepicker = ({
  inputRef,
  intl: intlProp,
  locale,
  modifiers,
  onChange,
  outputFormatter = defaultOutputFormatter,
  outputBackendValue = true,
  parser = defaultParser,
  placement,
  screenReaderMessage,
  showTimepicker,
  timeFormat: timeFormatProp,
  timeZone: timeZoneProp,
  useInput,
  usePortal,
  value: valueProp,
  onBlur,
  onFocus,
  ...inputProps
}) => {
  const input = useRef(null);
  const hiddenInput = useRef(null);
  const srStatus = useRef(null);
  const container = useRef(null);
  const blurTimeout = useRef(null);
  const dropdownRef = useRef(null);
  const testId = useRef(uniqueId('-timepicker')).current;
  const intlContext = useIntl();
  const intl = intlProp || intlContext;
  const timeLocale = locale || intl.locale;
  const timeIntl = locale ? { ...intl, locale } : intl;
  const [showDropdown, setShowDropdown] = useState(showTimepicker || false);
  const timezone = useRef(timeZoneProp || intl.timeZone).current;
  const timeFormat = useRef(
    timeFormatProp ||
    getLocaleDateFormat({
      intl: timeIntl,
      config: { hour: 'numeric', minute: '2-digit' }
    })
  ).current;
  const [timePair, updateTimePair] = useState({
    timeString: valueProp ? parser(
      valueProp, // value
      timezone,
      timeFormat, // uiFormat
      timeIntl
    ) : '',
    formatted: valueProp ? outputFormatter({
      value: valueProp,
      timezone,
      formats: timeFormat.includes('A') ? twelveHourFormats : twentyFourHourFormats,
      intl: timeIntl,
    }) : ''
  });
  const candidate = useRef(timePair);

  let maybeUpdateValue;

  // handle value changes form outside of the component via maybeUpdateValue...
  useEffect(() => {
    if (input.current
      && typeof valueProp !== 'undefined'
      && valueProp !== timePair.timeString
      && valueProp !== timePair.formatted) {
      candidate.current = Object.assign(candidate.current, maybeUpdateValue(valueProp));
      nativeChangeFieldValue(input, false, candidate.current.timeString);
    }
  }, [valueProp, maybeUpdateValue, timePair.timeString, timePair.formatted]);

  dayjs.locale(timeLocale);

  /*  maybeUpdateValue
  *   runs on all changes to the main input and value props to parse
  *   the supplied value and, if it's a valid time, call the onChange handler.
  */
  maybeUpdateValue = (value) => {
    // handle blank values...
    if (value === '') {
      const blankTime = {
        timeString: '',
        formatted: ''
      };
      updateTimePair(blankTime);
      return blankTime;
    }

    let valueTimeObject;

    /* values from the backend or values circulating from state will have an offset appended.
    *  date-time libraries should parse it without requiring any format hints.
    */
    const additionalTimeFormats = timeFormat.includes('A') ? twelveHourFormats : twentyFourHourFormats;
    if (containsUTCOffset(value)) {
      valueTimeObject = dayjs.utc(value, [timeFormat, ...additionalTimeFormats]).local();
    } else {
      // use strict mode to check validity  - incomplete dates, anything not conforming to the format will be invalid
      valueTimeObject = parseLocalizedTime(value, timeFormat, timeLocale);
    }

    let timeValues;

    // otherwise parse the value and update the timestring and the formatted time...
    if (valueTimeObject.isValid()) {
      const parsed = parser(
        value, // value
        timeZoneProp || intl.timeZone, // timezone
        timeFormat, // uiFormat
        timeIntl,
      );
      if (parsed !== timePair.timeString) {
        const hiddenValue = outputFormatter({
          value,
          timezone: timeZoneProp || intl.timeZone,
          formats: timeFormat.includes('A') ? twelveHourFormats : twentyFourHourFormats,
          intl: timeIntl,
        });
        timeValues = { timeString: parsed, formatted: hiddenValue };
        updateTimePair(current => {
          const newTimePair = Object.assign(current, timeValues);
          return newTimePair;
        });
        return timeValues;
      }
      return {};

      // if the date's not valid, we just update the timestring to reflect user input...
    } else if (value !== timePair.timeString) {
      timeValues = {
        timeString: value,
      };
      updateTimePair(current => {
        const newTimePair = Object.assign(current, timeValues);
        return newTimePair;
      });
      return timeValues;
    }
    return {};
  };

  const handleInputRef = (ref) => {
    if (typeof inputRef === 'function') {
      inputRef(ref);
    } else if (inputRef) {
      inputRef.current = ref;
    }
    input.current = ref;
  };

  const toggleTimepicker = () => {
    setShowDropdown(cur => !cur);
  };

  const hideTimepicker = () => {
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (!dropdownRef.current) {
      switch (e.key) {
        case 'Enter':
        case 'ArrowDown':
          e.preventDefault();
          setShowDropdown(true);
          break;
        default:
      }
    }
  };

  /* for vanilla react/non-final-form implementations that just get the input value.
  *  Handles user input from the text input.
  */
  const handleChange = (e) => {
    candidate.current = Object.assign(candidate.current, maybeUpdateValue(e.target.value));
    if ((!useInput || !outputBackendValue) && onChange) {
      onChange(e, e.target.value, candidate.current.timeString);
    } else if (typeof candidate.current.formatted === 'string' &&
      candidate.current.formatted !== hiddenInput.current.value) {
      nativeChangeFieldValue(hiddenInput, false, candidate.current.formatted);
    }
  };

  // for final-form so it can have a native change event rather than a fabricated thing...
  const onChangeFormatted = (e) => {
    if (useInput && onChange) {
      const { timeString, formatted } = candidate.current;
      onChange(e, formatted, timeString);
    }
  };

  // setting the time in the input from the values in the time dropdown
  const handlePickTime = ({ hour, minute, period, dayPeriods }) => {
    const adjustedHour = dayPeriods ? convertTo24hr(hour, period, dayPeriods, timeLocale) : hour;
    const displayTime = formatLocalizedTime(dayjs({ hour: adjustedHour, minute }), timeLocale, timeFormat);
    nativeChangeFieldValue(input, true, displayTime);
    setShowDropdown(false);
  };

  // the clear button on the text input...
  const handleClearTime = () => {
    updateTimePair({ timeString: '', formatted: '' });
    nativeChangeFieldValue(input, true, '');
  };

  const portalElem = usePortal
    ? document.getElementById('OverlayContainer')
    : null;

  const { readOnly, disabled, label } = inputProps;
  const screenReaderFormat = timeFormat.split('').join(' ');

  // the way that redux-form treats blurs is to trigger an onChange event on the target.
  // this holds onto the event until blur has passed out of the component/dropdown, controls.
  // without this treatment, the time can end up blank.
  // the timeout is used to ensure the hidden input's value is updated. This is candidate for refactor...
  const queueBlur = (e) => {
    blurTimeout.current = setTimeout(() => {
      if (onBlur) {
        if (useInput) {
          onBlur({
            target: outputBackendValue ? hiddenInput.current : input.current,
            stopPropagation: () => {},
            preventDefault: () => {},
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

  let ariaLabel;
  if (readOnly || disabled) {
    ariaLabel = `${label}`;
  } else {
    // eslint-disable-next-line
    ariaLabel = intl.formatMessage({ id: 'stripes-components.Timepicker.ScreenReaderLabel' }, { label, screenReaderFormat, screenReaderMessage });
  }

  const endElements = [
    <FormattedMessage key="pickButton" id="stripes-components.showOrHideTimepicker">
      {([showOrHideTimepickerAriaLabel]) => (
        <IconButton
          key="timepickerButton"
          onClick={toggleTimepicker}
          onKeyDown={handleKeyDown}
          aria-label={showOrHideTimepickerAriaLabel}
          id={`timepicker-toggle-button-${testId}`}
          icon="clock"
        />
      )}
    </FormattedMessage>
  ];

  return (
    <>
      <div
        style={{ position: 'relative', width: '100%' }}
        ref={container}
        onFocus={handleInternalFocus}
        onBlur={handleInternalBlur}
      >
        <SRStatus ref={srStatus} />
        <TextField
          id={testId}
          {...inputProps}
          value={timePair.timeString || ''}
          inputRef={handleInputRef}
          endControl={(inputProps.readOnly || inputProps.disabled) ? null : (<>{endElements}</>)}
          placeholder={timeFormat.toUpperCase()}
          onChange={handleChange}
          onClearField={handleClearTime}
          ariaLabel={ariaLabel}
        />
        <input
          hidden
          type="text"
          value={timePair.formatted || ''}
          onChange={onChangeFormatted}
          ref={hiddenInput}
        />
      </div>

      <Popper
        placement={placement}
        isOpen={showDropdown}
        anchorRef={container}
        onToggle={toggleTimepicker}
        portal={usePortal && portalElem}
        modifiers={{
          offset: {
            enabled: true,
            offset: '0,10',
          },
          ...modifiers
        }}
      >
        <RootCloseWrapper onRootClose={hideTimepicker} ref={dropdownRef}>
          <TimeDropdown
            hoursFormat={timeFormat.includes('A') ? '12' : '24'}
            onSetTime={handlePickTime}
            intl={timeIntl}
            onHide={hideTimepicker}
            selectedTime={timePair.timeString}
            timeFormat={timeFormat}
            onFocus={handleInternalFocus}
            rootRef={dropdownRef}
            id={testId}
            onClose={() => setShowDropdown(false)}
          />
        </RootCloseWrapper>
      </Popper>
    </>
  );
};

Timepicker.propTypes = propTypes;

export default FormField(
  Timepicker,
  ({ input, meta }) => ({
    onBlur: input?.onBlur,
    onFocus: input?.onFocus,
    dirty: meta?.dirty,
    error: (meta?.touched && meta?.error ? meta.error : ''),
    valid: meta?.valid,
    warning: (meta?.touched ? parseMeta(meta, 'warning') : ''),
    useInput: true,
  })
);

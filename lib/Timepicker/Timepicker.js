import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { uniqueId } from 'lodash';
import FormField from '../FormField';
import TextField from '../TextField';
import SRStatus from '../SRStatus';
import Popper, { AVAILABLE_PLACEMENTS } from '../Popper';
import RootCloseWrapper from '../util/RootCloseWrapper';
import IconButton from '../IconButton';
import TimeDropdown from './TimeDropdown';
import parseMeta from '../FormField/parseMeta';
import nativeChangeFieldValue from '../util/nativeChangeFieldValue';
import { getLocaleDateFormat } from '../util/dateTimeUtils';

// supplied a list of formats, moment will use the FIRST format in the list
// that can be successfully parsed.
const twelveHourFormats = ['h:mm A', 'h:mm ', 'h:mm', 'h'];
const twentyFourHourFormats = ['HH:mm', 'H:mm', 'H'];

const containsUTCOffset = (value) => {
  const offsetRegex = /T[\d.:]+[+-][\d]+$/;
  const offsetRE2 = /T[\d:]+[-+][\d:]+\d{2}$/; // sans milliseconds
  const offsetZRE = /Z$/i;
  return offsetRegex.test(value) || offsetRE2.test(value) || offsetZRE.test(value);
};

// Not all parameters may be used in this function, but they are provided as a convenience for
// overrides to the props using this as default.
const defaultParser = (value, timezone, timeFormat, intl) => { // eslint-disable-line no-unused-vars
  if (!value) return '';
  let time;
  if (containsUTCOffset(value)) {
    // if it has an offset, it probably came from the backend and
    // can be expected to be utc (utc offset of 0) -
    // we contrive a date string to pass the value to moment
    // without having to get too specific about an expected format(s)...
    // if we didn't do this, it would need something like
    // moment.tz(value, 'HH:mm:ss.sssZ', timezone);
    // with expected format(s) as the 2nd parameter

    const dateString = moment().format('YYYY-MM-DD');
    time = moment.tz(`${dateString}T${value}`, timezone);
  } else {
    time = moment(value, timeFormat, timezone);
  }

  // entered value that's fewer characters than the expected format will pass through..
  // e.g. '2' in an expected full string of '2:35 AM'
  return time.isValid() ? time.format(timeFormat) : value;
};

// Not all parameter keys may be used in this function, but they are provided as a convenience for
// overrides to the props using this as default.
const defaultOutputFormatter = ({ value, formats, timezone = 'utc', intl }) => { // eslint-disable-line no-unused-vars
  let isoTime = moment.utc(value, formats);
  if (timezone !== 'utc') {
    isoTime = moment.tz(value, formats, timezone);
  }
  if (isoTime.isValid()) {
    isoTime = isoTime.toISOString();
    const timeSplit = isoTime.split('T');
    return timeSplit[1];
  }
  return '';
};

export const convertTo24hr = (hour, period, dayPeriods) => {
  const adjustedHour = parseInt(hour, 10);
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
  const [showDropdown, setShowDropdown] = useState(showTimepicker || false);
  const timezone = useRef(timeZoneProp || intl.timeZone).current;
  const timeFormat = useRef(
    timeFormatProp ||
    getLocaleDateFormat({
      intl: locale ? { locale } : intl,
      config: { hour: 'numeric', minute: '2-digit' }
    })
  ).current;
  const [timePair, updateTimePair] = useState({
    timeString: valueProp ? parser(
      valueProp, // value
      timezone,
      timeFormat, // uiFormat
      intl
    ) : '',
    formatted: valueProp ? outputFormatter({
      value: valueProp,
      timezone,
      formats: timeFormat.includes('A') ? twelveHourFormats : twentyFourHourFormats,
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

  moment.locale(locale || intl.locale);

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
      valueTimeObject = moment.utc(value, [timeFormat, ...additionalTimeFormats]).local();
    } else {
      // use strict mode to check validity  - incomplete dates, anything not conforming to the format will be invalid
      valueTimeObject = moment(
        value,
        [timeFormat],
        true
      );
    }

    let timeValues;

    // otherwise parse the value and update the timestring and the formatted time...
    if (valueTimeObject.isValid()) {
      const parsed = parser(
        value, // value
        timeZoneProp || intl.timeZone, // timezone
        timeFormat, // uiFormat
        intl,
      );
      if (parsed !== timePair.timeString) {
        const hiddenValue = outputFormatter({
          value,
          timezone: timeZoneProp || intl.timeZone,
          formats: timeFormat.includes('A') ? twelveHourFormats : twentyFourHourFormats
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
    const adjustedHour = dayPeriods ? convertTo24hr(hour, period, dayPeriods) : hour;
    const displayTime = moment({ hour: adjustedHour, minute }).format(timeFormat);
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

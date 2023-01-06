import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { deprecated } from 'prop-types-extra';
import moment from 'moment-timezone';
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
import { getLocaleDateFormat, removeDST } from '../../util/dateTimeUtils';

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

const defaultParser = (value, timezone, timeFormat, passThroughValue, intl) => {
  if (!value) return '';
  if (value === passThroughValue) return passThroughValue;
  let time;
  if (containsUTCOffset(value)) {
    // if it has an offset, it probably came from the backend and
    // can be expected to be utc (utc offset of 0) -
    time = moment.utc(value, timeFormat).local();
  } else {
    time = moment(value, timeFormat);
  }

  // entered value that's fewer characters than the expected format will pass through..
  // e.g. '2' in an expected full string of '2:35 AM'
  return time.isValid() ? removeDST(time.toISOString(), timeFormat) : value;
};

const defaultOutputFormatter = ({ value, passThroughValue, formats, timezone, intl }) => {
  if (value === passThroughValue) return passThroughValue;
  let isoTime = moment.utc(value, formats);
  if (isoTime.isValid()) {
    isoTime = isoTime.toISOString();
    const timeSplit = isoTime.split('T');
    return timeSplit[1];
  }
  return '';
};

const convertTo24hr = (hour, period, dayPeriods) => {
  return period === dayPeriods[1] ? parseInt(hour, 10) + 12 : hour;
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
  onChange: PropTypes.func,
  outputFormatter: PropTypes.func,
  parser: PropTypes.func,
  passThroughValue: deprecated(PropTypes.string, 'Use alternative design'),
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
  locale: localeProp,
  modifiers,
  onChange,
  outputFormatter = defaultOutputFormatter,
  passThroughValue,
  parser = defaultParser,
  placement,
  screenReaderMessage,
  showTimepicker,
  timeFormat: timeFormatProp,
  timeZone: timeZoneProp,
  useInput,
  usePortal,
  value: valueProp,
  ...inputProps
}) => {
  const input = useRef(null);
  const hiddenInput = useRef(null);
  const srStatus = useRef(null);
  const container = useRef(null);
  const dropdownRef = useRef(null);
  const testId = useRef(uniqueId('-timepicker')).current;
  const intlContext = useIntl();
  const intl = intlProp || intlContext;
  const [showDropdown, setShowDropdown] = useState(showTimepicker || false);
  const timeFormat = useRef(
    timeFormatProp ||
    getLocaleDateFormat({ intl, config: { hour: 'numeric', minute: '2-digit' } })
  ).current;
  const [timePair, updateTimePair] = useState({
    timeString: valueProp ? parser(
      valueProp, // value
      timeZoneProp || intl.timeZone, // timezone
      timeFormat, // uiFormat
      passThroughValue,
      intl
    ) : '',
    formatted: valueProp ? outputFormatter({
      value: valueProp,
      timeZone: timeZoneProp || intl.timeZone,
      passThroughValue,
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

  moment.locale(intl.locale);

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
    const additionalTimeFormats = timeFormat.includes('A') ? twelveHourFormats : twentyFourHourFormats
    if (containsUTCOffset(value)) {
      valueTimeObject = moment.utc(value, [timeFormat, ...additionalTimeFormats]).local();
    } else {
      // use strict mode to check validity  - incomplete dates, anything not conforming to the format will be invalid
      valueTimeObject = moment(
        value,
        [timeFormat, ...additionalTimeFormats],
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
        passThroughValue,
        intl,
      );
      if (parsed !== timePair.timeString) {
        const hiddenValue = outputFormatter({
          value,
          timeZone: timeZoneProp || intl.timeZone,
          passThroughValue,
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

  const timeDropdownHandleKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        input.current?.focus();
        setShowDropdown(false);
        break;
      default:
    }
  };

  /* for vanilla react/non-final-form implementations that just get the input value.
  *  Handles user input from the text input.
  */
  const handleChange = (e) => {
    candidate.current = Object.assign(candidate.current, maybeUpdateValue(e.target.value));
    if (useInput && onChange) {
      onChange(e, e.target.value, candidate.current.timeString);
    } else if (typeof candidate.current.formatted === 'string' &&
      candidate.current.formatted !== hiddenInput.current.value) {
      nativeChangeFieldValue(hiddenInput, false, candidate.current.formatted);
    }
  };

  // for final-form so it can have a native change event rather than a fabricated thing...
  const onChangeFormatted = (e) => {
    if (!useInput && onChange) {
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
      <div style={{ position: 'relative', width: '100%' }} ref={container}>
        <SRStatus ref={srStatus} />
        <TextField
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
        overlayProps={{
          onKeyDown: timeDropdownHandleKeyDown,
        }}
      >
        <RootCloseWrapper onRootClose={hideTimepicker} ref={dropdownRef}>
          <TimeDropdown
            hoursFormat={timeFormat.includes('A') ? '12' : '24'}
            onSetTime={handlePickTime}
            onHide={hideTimepicker}
            selectedTime={timePair.timeString}
            timeFormat={timeFormat}
            rootRef={dropdownRef}
            locale={localeProp || intl.locale}
            onBlur={() => setShowDropdown(false)}
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
  ({ meta }) => ({
    dirty: meta?.dirty,
    error: (meta?.touched && meta?.error ? meta.error : ''),
    valid: meta?.valid,
    warning: (meta?.touched ? parseMeta(meta, 'warning') : ''),
  })
);

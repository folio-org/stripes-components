import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl, intl as rawIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { deprecated } from 'prop-types-extra';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import utc from 'dayjs/plugin/utc';
import timeZone from 'dayjs/plugin/timezone';
import objectSupport from 'dayjs/plugin/objectSupport';
import { uniqueId } from 'lodash';
import { useDynamicLocale } from '../../hooks/useDynamicLocale';
import FormField from '../FormField';
import TextField from '../TextField';
import SRStatus from '../SRStatus';
import Popper, { AVAILABLE_PLACEMENTS } from '../Popper';
import RootCloseWrapper from '../../util/RootCloseWrapper';
import IconButton from '../IconButton';
import TimeDropdown from './TimeDropdown';
import parseMeta from '../FormField/parseMeta';
import nativeChangeFieldValue from '../../util/nativeChangeFieldValue';
import { getLocaleDateFormat } from '../../util/dateTimeUtils';

dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timeZone);
dayjs.extend(objectSupport);

const twelveHourFormats = {
  '0': '',
  '1': 'h',
  '2': 'h:',
  '3': 'h:mm',
  '4': 'h:mm',
  '5': 'h:mm ',
  '6': ['h:mm A', 'h:mm a'],
  '7': ['h:mm A', 'h:mm a']
};

const containsUTCOffset = (value) => {
  const offsetRegex = /T[\d.:]+[+-][\d]+$/;
  const offsetRE2 = /T[\d:]+[-+][\d:]+\d{2}$/; // sans milliseconds
  const offsetZRE = /\.\d{3}Z$/i;
  return offsetRegex.test(value) || offsetRE2.test(value) || offsetZRE.test(value);
};

const defaultParser = (value, timezone, timeFormat, passThroughValue, intl) => {
  if (!value) return '';
  if (value === passThroughValue) return passThroughValue;
  let time;
  if (containsUTCOffset(value)) {
    // if it has an offset, it probably came from the backend and
    // can be expected to be utc (utc offset of 0) -
    time = dayjs.utc(value, timeFormat);
  } else {
    time = dayjs(value, timeFormat);
  }

  // entered value that's fewer characters than the expected format will pass through..
  // e.g. '2' in an expected full string of '2:35 AM'
  return time.isValid() ? time.format(timeFormat) : value;
};

const defaultOutputFormatter = ({ value, timezone, passThroughValue, formats, intl }) => {
  if (value === passThroughValue) return passThroughValue;
  let isoTime = dayjs.utc(value, formats);
  if (isoTime.isValid()) {
    isoTime = isoTime.toISOString();
    const timeSplit = isoTime.split('T');
    return timeSplit[1];
  }
  return '';
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
  const { localeLoaded } = useDynamicLocale();
  const intlContext = useIntl();
  const intl = intlProp || intlContext;
  const [showDropdown, setShowDropdown] = useState(showTimepicker || false);
  const [timeFormat] = useState(
    timeFormatProp ||
    getLocaleDateFormat({ intl, config: { hour: 'numeric', minute: '2-digit' } })
  );
  const [timePair, updateTimePair] = useState({
    timeString: valueProp ? parser(
      valueProp, // value
      timeZoneProp || intl.timeZone, // timezone
      timeFormat, // uiFormat
      passThroughValue,
      intl
    ) : null,
    formatted: valueProp ? outputFormatter({
      value: valueProp,
      timeZone: timeZoneProp || intl.timeZone,
      passThroughValue,
      formats: twelveHourFormats[valueProp.length]
    }) : null
  });
  const [displayed, updateDisplayed] = useState(timePair.timeString);
  const candidate = useRef(timePair);

  let maybeUpdateValue;

  // handle value changes form outside of the component via maybeUpdateValue...
  // useEffect(() => {
  //   if (input.current
  //     && typeof valueProp !== 'undefined'
  //     && valueProp !== timePair.timeString
  //     && valueProp !== timePair.formatted) {
  //     candidate.current = Object.assign(candidate.current, maybeUpdateValue(valueProp));
  //     nativeChangeFieldValue(input, false, candidate.dateString);
  //   }
  // }, [valueProp, maybeUpdateValue, timePair.timeString, timePair.formatted]);

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
      updateDisplayed('');
      return blankTime;
    }

    let valueTimeObject;

    if (containsUTCOffset(value)) {
      valueTimeObject = dayjs(value);
    } else {
      // use strict mode to check validity  - incomplete dates, anything not conforming to the format will be invalid
      valueTimeObject = dayjs(
        value,
        [timeFormat, twelveHourFormats[value.length]],
        true
      );
    }

    let timeValues;

    // otherwise parse the value and update the datestring and the formatted date...
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
          formats: twelveHourFormats[value.length]
        });
        timeValues = { timeString: parsed, formatted: hiddenValue };
        updateTimePair(current => {
          const newTimePair = Object.assign(current, timeValues);
          return newTimePair;
        });
        updateDisplayed(timeValues.timeString);
        return timeValues;
      }
      return {};
    } else if (value !== timePair.timeString) { // if the date's not valid, we just update the datestring...
      timeValues = {
        timeString: value,
      };
      updateTimePair(current => {
        const newTimePair = Object.assign(current, timeValues);
        return newTimePair;
      });
      updateDisplayed(timeValues.timeString);
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
    if (dropdownRef.current) {
      // const formattedDate = curDate.format(this._timeFormat);
      // let timeString;
      switch (e.keyCode) {
        case 40: // down
          e.preventDefault();
          break;
        case 38: // up
          e.preventDefault();
          break;
        case 37: // left
          break;
        case 39: // right
          break;
        case 27: // escape
          e.preventDefault();
          hideTimepicker();
          break;
        case 34: // pgDn
          e.preventDefault();
          break;
        case 33: // pgUp
          e.preventDefault();
          break;
        case 13: // enter
          e.preventDefault();
          if (showDropdown) {
            // this.handleSetTime(e, curDate, formattedDate);
          } else {
            setShowDropdown(true);
          }
          // timeString = `${formattedDate} selected`;
          break;
        case 9: // tab
          setShowDropdown(false);
          break;
        default:
      }
      // this.informScreenReader(`${timeString}`);
    } else {
      switch (e.keyCode) {
        case 13: // enter
        case 40: // down
          e.preventDefault();
          setShowDropdown(true);
          break;
        default:
      }
    }
  };

  // const handleSetTime = (e, hours, minutes, period) => {
  //   let standardizedTime;
  //   if (e === null || e.type === 'click' || e.type === 'keydown') {
  //     if (e) { e.preventDefault(); }
  //     if (onChange) { onChange(e); }
  //     input.current?.focus();

  //     let tString;
  //     if (deriveHoursFormat(timeFormat) === '12') {
  //       tString = `${hours}:${minutes} ${period}`;
  //     } else {
  //       tString = `${hours}:${minutes}`;
  //     }

  //     setTimeString(tString);
  //     standardizedTime = standardizeTime(`${hours}:${minutes} ${period}`);
  //     if (onChange) { onChange(e, standardizedTime); }
  //   } else if (e.type === 'change') {
  //     setTimeString(e.target.value);
  //     standardizedTime = standardizeTime(`${hours}:${minutes}${period && (' ' + period)}`);
  //     if (onChange) { onChange(e, standardizedTime); }
  //   }
  // };

  // for vanilla react/non-final-form implementations that just get the input value.
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

  // const setFromCalendar = (value) => {
  //   nativeChangeField(input, hideOnChoose, value);
  //   if (hideOnChoose) {
  //     setShowCalendar(false);
  //   }
  // };

  const handlePickTime = ({ hour, minute, period }) => {
    const displayTime = dayjs({ hour, minute, period }).format(timeFormat);
    nativeChangeFieldValue(input, true, displayTime);
    setShowDropdown(false);
  };

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
          tabIndex="-1"
          icon="clock"
        />
      )}
    </FormattedMessage>
  ];

  // if (displayed) {
  //   endElements.unshift(
  //     <FormattedMessage key="clearButton" id="stripes-components.clearFieldValue">
  //       {([clearFieldValueAriaLabel]) => (
  //         <IconButton
  //           key="clearButton"
  //           onClick={handleClearTime}
  //           aria-label={clearFieldValueAriaLabel}
  //           id={`timepicker-clear-button-${testId}`}
  //           tabIndex="-1"
  //           icon="times-circle-solid"
  //         />
  //       )}
  //     </FormattedMessage>
  //   );
  // }

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
          onClear={handleClearTime}
        />
        <input
          hidden
          type="text"
          value={timePair.formatted || ''}
          onChange={onChangeFormatted}
          ref={hiddenInput}
        />
      </div>
      {localeLoaded && (
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
              onHide={() => setShowDropdown(false)}
              selectedTime={timePair.timeString}
              timeFormat={timeFormat}
              rootRef={dropdownRef}
              mainControl={input.current}
              locale={localeProp || intl.locale}
              onKeyDown={handleKeyDown}
              onBlur={() => setShowDropdown(false)}
              id={testId}
              onClose={() => setShowDropdown(false)}
            />
          </RootCloseWrapper>
        </Popper>
      )}
    </>
  );
};

Timepicker.propTypes = propTypes;

export default FormField(
  Timepicker,
  ({ meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    valid: meta.valid,
    warning: (meta.touched ? parseMeta(meta, 'warning') : ''),
  })
);

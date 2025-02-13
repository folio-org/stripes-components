/*
* Display picker UI for Timepicker.
*/

import React, { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from '../Button';
import Select from '../Select';
import IconButton from '../IconButton';
import Layout from '../Layout';
import { Row, Col } from '../LayoutGrid';
import TextField from '../TextField';
import css from './TimeDropdown.css';
import FocusLink from '../FocusLink';

/**
* @description keepInRange - utility function for adjusting a supplied value to
* fit within a supplied range of numbers.
* @param {number} value - the current numerical value.
* @param {number} min - the minimum value allowed in the range.
* @param {number} max - the maximum value allowed in the range.
* @param {bool} [loop = false] controls the behavior of the function when reaching the ends of the range -
*   e.g. with loop set to 'true', once the value is greater than the max value, the min value will be returned.
* @returns {number}
*/
const keepInRange = (value, min, max, loop = false) => {
  if (value > max) {
    return loop ? min : max;
  } else if (value < min) {
    return loop ? max : min;
  }
  return value;
};

/**
* @description rangedIncrement - utility function for incrementing/decrementing a
* numeric value within a min/max range.
* @param {number} value - the current numerical value.
  @param {number} amount - the amount to increment the value by.
  @param {number} min - the minimum value allowed in the range.
  @param {number} max - the maximum value allowed in the range.
* @param {bool} add controls if the call adds (true) or subtracts (false) from the value.
* @param {bool} loop controls the behavior of the function when reaching the ends of the range -
*   e.g. with loop set to 'true', once the value is greater than the max value, the min value will be returned.
* @returns {number}
*/
const rangedIncrement = (value, amount, min, max, add, loop) => {
  let local = value;
  if (add) {
    local += amount;
    local = keepInRange(local, min, max, loop);
  } else {
    local -= amount;
    local = keepInRange(local, min, max, loop);
  }
  return local;
};

/**
* @description padZero - utility function use to obtain two-character values,
* adding a leading '0' to single number values.
* @param {number} value - the value to possibly prefix with leading 0's.
* @returns {string}
*/
const padZero = (value) => {
  if (typeof value === 'undefined') return undefined;
  return parseInt(value, 10) < 10 ?
    `0${value}` :
    value.toString();
};

/**
* @description getListofDayPeriods - given a locale, returns the list of possible
*   day periods as part of the locale's date format.
* @param {string} locale the 4 character locale code e.g. 'en-SE'.
* @returns {string[]}
*/
const getListofDayPeriods = (locale) => {
  // Build array of time stamps for convenience.
  const dateArray = [];
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDay();
  while (dateArray.length < 24) {
    dateArray.push(new Date(year, month, day, dateArray.length));
  }

  const options = { hour: 'numeric' };
  const dpOptions = new Set();
  const df = new Intl.DateTimeFormat(locale, options);

  dateArray.forEach((d) => {
    const dateFields = df.formatToParts(d);
    dateFields.forEach((f) => {
      if (f.type === 'dayPeriod') {
        dpOptions.add(f.value);
      }
    });
  });
  return [...dpOptions] || null;
};

/**
* @description deriveDefaultTimePeriod - given the parameters, provides a possible time period used
* to set the value of the timedropdown's period <Select>.
* @param {string} value - a time string matching the timeFormat.
* @param {string} hoursFormat - '12' or '24' matches the locale-based time format.
* @param {string[]} timeFormat - array of possible time formats, ex: ['h:mm', 'h:', 'h']
* @param {string[]} dayPeriods - array of possible day periods - am, pm, etc...
* @returns {string}
*/
const deriveDefaultTimePeriod = (value, hoursFormat, timeFormat, dayPeriods) => {
  if (hoursFormat === '24') return null;
  if (value) return moment(value, timeFormat).format('A');
  return dayPeriods[0];
};

const propTypes = {
  hoursFormat: PropTypes.oneOf(['12', '24']),
  id: PropTypes.string,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }),
  minuteIncrement: PropTypes.number,
  onFocus: PropTypes.func,
  onHide: PropTypes.func,
  onSetTime: PropTypes.func,
  rootRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.instanceOf(Element)
    })
  ]),
  selectedTime: PropTypes.string,
  timeFormat: PropTypes.string.isRequired,
};

const TimeDropdown = ({
  hoursFormat = '24',
  id,
  intl: intlProp,
  minuteIncrement = 1,
  onHide = () => {}, // eslint-disable-line
  onSetTime,
  rootRef,
  selectedTime,
  timeFormat,
  onFocus = () => {},
}) => {
  const intlContext = useIntl();
  const intl = intlProp || intlContext;
  const hourMax = useRef(hoursFormat === '24' ? 23 : 12).current;
  const hourMin = useRef(hoursFormat === '24' ? 0 : 1).current;
  const dayPeriods = hoursFormat === '12' && getListofDayPeriods(intl.locale);
  const hoursFormatCharacter = useRef(`${hoursFormat === '24' ? 'HH' : 'h'}`).current;
  const [hour, setHour] = useState(
    selectedTime ?
      moment(selectedTime, timeFormat).format(hoursFormatCharacter) :
      moment().format(hoursFormatCharacter)
  );
  const [minute, setMinute] = useState(
    selectedTime ?
      moment(selectedTime, timeFormat).format('mm') :
      moment().format('mm')
  );
  const [period, setPeriod] = useState(deriveDefaultTimePeriod(selectedTime, hoursFormat, timeFormat, dayPeriods));
  const hoursInput = useRef(null);
  const confirmButton = useRef(null);

  const modifyTime = useCallback((amount, unit, add) => {
    if (unit === 'hour') {
      setHour((curHour) => {
        let adjustedHour = curHour;
        if (!curHour) adjustedHour = '12';
        let newHour = parseInt(adjustedHour, 10);
        newHour = rangedIncrement(newHour, amount, hourMin, hourMax, add, true);
        newHour = hoursFormat === '24' ? padZero(newHour) : newHour;
        return newHour;
      });
    } else if (unit === 'minute') {
      setMinute((curMinute) => {
        let adjustedMinute = curMinute;
        if (!curMinute) adjustedMinute = '0';
        let newMinute = parseInt(adjustedMinute, 10);
        newMinute = rangedIncrement(newMinute, amount, 0, 59, add, true);
        newMinute = padZero(newMinute);
        return newMinute;
      });
    }
  }, [hourMax, hourMin, hoursFormat]);

  useEffect(() => () => onHide(), []); // eslint-disable-line

  const enterTime = (e, unit) => {
    if (unit === 'hour') {
      let parsedHour = parseInt(e.target.value, 10);
      parsedHour = keepInRange(parsedHour, hourMin, hourMax);
      setHour(parsedHour);
    } else if (unit === 'minute') {
      let parsedMinute = parseInt(e.target.value, 10);
      parsedMinute = keepInRange(parsedMinute, 0, 59);
      setMinute(parsedMinute);
    }
  };

  const handleBlur = (e, unit) => {
    let parsedValue = parseInt(e.target.value, 10);
    if (unit === 'hour') {
      if (hoursFormat === '24') parsedValue = padZero(parsedValue);
      setHour(parsedValue);
    } else {
      parsedValue = padZero(parsedValue);
      setMinute(parsedValue);
    }
  };

  const handleChangePeriod = (e) => {
    setPeriod(e.target.value);
  };

  const confirmTime = (e) => {
    e?.stopPropagation();
    if (!hour || !minute) {
      onHide();
      return;
    }
    if (onSetTime) onSetTime({ hour, minute, period, dayPeriods });
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        confirmTime(e);
        break;
      case 'Escape':
        onHide();
        break;
      default:
        break;
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={rootRef}
      className={css.timepickerContainer}
      id={`timeDD-${id}`}
      data-test-timepicker-dropdown
      onSubmit={confirmTime}
      onKeyDown={handleKeyDown}
      onFocus={onFocus}
    >
      <>
        <FocusLink
          sendOnFocus
          target={confirmButton.current}
        >
          <span className="sr-only">
            <FormattedMessage id="stripes-components.Timepicker.formStart" />
          </span>
        </FocusLink>
        <Row center={hoursFormat === '12' ? undefined : 'xs'}>
          <Col xs={4} className={css.center}>
            <IconButton
              data-test-timepicker-dropdown-increment-minutes-button
              tabIndex="-1"
              icon="arrow-up"
              id={`clickable-timeDD-${id}-next-hour`}
              onClick={() => { modifyTime(1, 'hour', true); }}
            />
          </Col>
          <Col xs={1}>&nbsp;</Col>
          <Col xs={4} className={css.center}>
            <IconButton
              data-test-timepicker-dropdown-increment-hours-button
              tabIndex="-1"
              icon="arrow-up"
              id={`clickable-timeDD-${id}-next-minute`}
              onClick={() => { modifyTime(minuteIncrement, 'minute', true); }}
            />
          </Col>
        </Row>
        <Row center={hoursFormat === '12' ? undefined : 'xs'}>
          <Col xs={4}>
            <FormattedMessage id="stripes-components.Timepicker.hoursLabel">
              {(ariaLabel) => (
                <TextField
                  data-test-timepicker-dropdown-hours-input
                  autoFocus
                  inputRef={hoursInput}
                  aria-label={ariaLabel}
                  placeholder="HH"
                  min={hourMin}
                  max={hourMax}
                  type="number"
                  value={hour}
                  onChange={(e) => { enterTime(e, 'hour'); }}
                  onBlur={(e) => { handleBlur(e, 'hour'); }}
                  id={`timeDD-${id}-hour-input`}
                  marginBottom0
                  hasClearIcon={false}
                />
              )}
            </FormattedMessage>
          </Col>
          <Col xs={1}>
            <Layout className={`display-flex flex-align-items-center ${css.colon}`}>:</Layout>
          </Col>
          <Col xs={4}>
            <FormattedMessage id="stripes-components.Timepicker.minutesLabel">
              {(ariaLabel) => (
                <TextField
                  data-test-timepicker-dropdown-minutes-input
                  aria-label={ariaLabel}
                  placeholder="MM"
                  type="number"
                  min="0"
                  max="59"
                  value={minute}
                  onChange={(e) => { enterTime(e, 'minute'); }}
                  onBlur={(e) => { handleBlur(e, 'minute'); }}
                  id={`timeDD-${id}-minute-input`}
                  marginBottom0
                  hasClearIcon={false}
                />
              )}
            </FormattedMessage>
          </Col>
          {hoursFormat === '12' &&
            <Col xs={3}>
              <Select
                aria-label={intlContext.formatMessage({ id: 'stripes-components.Timepicker.PeriodLabel' })}
                value={period}
                onChange={handleChangePeriod}
                marginBottom0
                id={`timeDD-${id}-period-toggle`}
              >
                {
                  dayPeriods.map((p) => <option key={p}>{p}</option>)
                }
              </Select>
            </Col>
          }
        </Row>
        <Row center={hoursFormat === '12' ? undefined : 'xs'}>
          <Col xs={4} className={css.center}>
            <IconButton
              data-test-timepicker-dropdown-decrement-hours-button
              tabIndex="-1"
              id={`clickable-timeDD-${id}-prev-hour`}
              icon="arrow-down"
              onClick={() => { modifyTime(1, 'hour', false); }}
            />
          </Col>
          <Col xs={1}>&nbsp;</Col>
          <Col xs={4} className={css.center}>
            <IconButton
              data-test-timepicker-dropdown-decrement-minutes-button
              tabIndex="-1"
              id={`clickable-timeDD-${id}-prev-minute`}
              icon="arrow-down"
              onClick={() => { modifyTime(minuteIncrement, 'minute', false); }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Button
              data-test-timepicker-dropdown-confirm-button
              buttonStyle="primary"
              buttonClass={css.submitButton}
              fullWidth
              marginBottom0
              ref={confirmButton}
              id={`clickable-timeDD-${id}-set-time`}
              onClick={confirmTime}
            >
              <FormattedMessage id="stripes-components.Timepicker.SetTimeLabel" />
            </Button>
          </Col>
        </Row>
        <FocusLink
          sendOnFocus
          target={hoursInput.current}
        >
          <span className="sr-only">
            <FormattedMessage id="stripes-components.Timepicker.formEnd" />
          </span>
        </FocusLink>
      </>
    </div>
  );
};

TimeDropdown.propTypes = propTypes;

export default TimeDropdown;

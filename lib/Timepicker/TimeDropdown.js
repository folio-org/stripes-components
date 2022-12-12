/*
* Display picker UI for Timepicker.
*/

import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from '../Button';
import IconButton from '../IconButton';
import Layout from '../Layout';
import { Row, Col } from '../LayoutGrid';
import TextField from '../TextField';
import css from './TimeDropdown.css';
import FocusLink from '../FocusLink';

dayjs.extend(customParseFormat);

const keepInRange = (value, min, max, loop) => {
  if (value > max) {
    return loop ? min : max;
  } else if (value < min) {
    return loop ? max : min;
  }
  return value;
};

const rangedIncrement = (value, amount, min, max, add) => {
  let local = value;
  if (add) {
    local += amount;
    keepInRange(local, min, max);
  } else {
    local -= amount;
    keepInRange(local, min, max);
  }
  return local;
};

const padZero = (value) => {
  return value < 10 ?
    `0${value}` :
    value.toString();
};

// examine the passed time format to determine 12 or 24 hour format.
function deriveHoursFormat(fmt) {
  const ampmRE = new RegExp(/A/);
  if (ampmRE.test(fmt)) {
    return '12';
  }
  return '24';
}

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

const deriveDefaultTimePeriod = (value, hoursFormat, timeFormat, dayPeriods) => {
  if (hoursFormat === '24') return null;
  if (value) return dayjs(value, timeFormat).format('A');
  return dayPeriods[0];
};

const propTypes = {
  hoursFormat: PropTypes.oneOf(['12', '24']),
  id: PropTypes.string,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }),
  locale: PropTypes.string,
  mainControl: PropTypes.object,
  minuteIncrement: PropTypes.number,
  onBlur: PropTypes.func,
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
  hoursFormat: hoursFormatProp = 24,
  id,
  intl: intlProp, // eslint-disable-line deprecated
  locale: localeProp = 'en', // eslint-disable-line deprecated
  mainControl, // eslint-disable-line deprecated
  minuteIncrement = 1,
  onBlur, // eslint-disable-line deprecated
  onHide, // eslint-disable-line deprecated
  onSetTime,
  rootRef,
  selectedTime,
  timeFormat,
}) => {
  const intlContext = useIntl();
  const intl = intlProp || intlContext;
  const hoursFormat = hoursFormatProp || deriveHoursFormat(timeFormat);
  const hourMax = useRef(hoursFormat === '24' ? 23 : 12).current;
  const hourMin = useRef(hoursFormat === '24' ? 0 : 1).current;
  const dayPeriods = hoursFormat === '12' && getListofDayPeriods(intl.locale);
  const [hour, setHour] = useState(selectedTime && dayjs(selectedTime, timeFormat)
    .format(`${hoursFormat === '24' ? 'HH' : 'h'}`));
  const [minute, setMinute] = useState(selectedTime && dayjs(selectedTime, timeFormat).format('mm'));
  const [period, setPeriod] = useState(deriveDefaultTimePeriod(selectedTime, hoursFormat, timeFormat, dayPeriods));
  const hoursInput = useRef(null);
  const confirmButton = useRef(null);

  const modifyTime = useCallback((amount, unit, add) => {
    if (unit === 'hour') {
      setHour((curHour) => {
        let newHour = parseInt(curHour, 10);
        newHour = rangedIncrement(newHour, amount, hourMax, hourMin, add);
        newHour = padZero(newHour);
        return newHour;
      });
    } else if (unit === 'minute') {
      setMinute((curMinute) => {
        let newMinute = parseInt(curMinute, 10);
        newMinute = rangedIncrement(newMinute, amount, 0, 59, add);
        newMinute = padZero(newMinute);
        return newMinute;
      });
    }
  }, [hourMax, hourMin]);

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
    const parsedValue = parseInt(e.target.value, 10);
    padZero(parsedValue);
    if (unit === 'hour') {
      setHour(parsedValue);
    } else {
      setMinute(parsedValue);
    }
  };

  const handleChangePeriod = () => {
    setPeriod(prev => { return prev === 'AM' ? 'PM' : 'AM'; });
  };

  const confirmTime = (e) => {
    e.preventDefault();
    if (onSetTime) onSetTime({ hour, minute, period, dayPeriods });
  };

  return (
    <form
      ref={rootRef}
      className={css.timepickerContainer}
      id={`timeDD-${id}`}
      data-test-timepicker-dropdown
      onSubmit={confirmTime}
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
              <Button
                aria-label={intlContext.formatMessage({ id: 'stripes-components.Timepicker.PeriodLabel' })}
                fullWidth
                marginBottom0
                onClick={handleChangePeriod}
                id={`timeDD-${id}-period-toggle`}
              >
                {period}
              </Button>
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
              type="submit"
              data-test-timepicker-dropdown-confirm-button
              buttonStyle="primary"
              buttonClass={css.submitButton}
              fullWidth
              marginBottom0
              ref={confirmButton}
              id={`clickable-timeDD-${id}-set-time`}
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
    </form>
  );
};

TimeDropdown.propTypes = propTypes;

export default TimeDropdown;

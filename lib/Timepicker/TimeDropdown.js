/*
* Display picker UI for Timepicker.
*/

import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import classNames from 'classnames';
import { extendMoment } from 'moment-range';
import Button from '../Button';
import IconButton from '../IconButton';
import Layout from '../Layout';
import { Row, Col } from '../LayoutGrid';
import TextField from '../TextField';
import css from './TimeDropdown.css';

const moment = extendMoment(Moment);

const propTypes = {
  hoursFormat: PropTypes.oneOf(['12', '24']),
  id: PropTypes.string,
  isOpen: PropTypes.bool,
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
  firstFieldRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.instanceOf(Element)
    })
  ]),
  selectedTime: PropTypes.string,
  timeFormat: PropTypes.string.isRequired,
};

const defaultProps = {
  hoursFormat: '24',
  locale: 'en',
  minuteIncrement: 1,
  onSetTime: () => null,
};

class TimeDropdown extends React.Component {
  constructor(props) {
    super(props);

    moment.locale(this.props.locale);

    // handle existing value...
    let initMoment;
    if (typeof props.selectedTime === 'undefined' || props.selectedTime === '') { // handle blank or cleared time...
      initMoment = moment();
    } else {
      initMoment = moment(props.selectedTime, props.timeFormat, true);
    }

    let initialPresentationFormat = 'hh';
    if (this.deriveHoursFormat(props.timeFormat) === '24') {
      initialPresentationFormat = 'HH';
    }

    this.state = {
      hoursFormat: this.deriveHoursFormat(),
      mo: initMoment,
      hour: initMoment.format(initialPresentationFormat),
      minute: initMoment.format('mm'),
      ampm: initMoment.format('A'),
    };

    this.enterTime = this.enterTime.bind(this);
    this.getDOMContainer = this.getDOMContainer.bind(this);
    this.incrementTime = this.incrementTime.bind(this);
    this.handleChangeAMPM = this.handleChangeAMPM.bind(this);
    this.deriveHoursFormat = this.deriveHoursFormat.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.getRootClass = this.getRootClass.bind(this);
    this.confirmTime = this.confirmTime.bind(this);
    this.setTimeHandleKeyDown = this.setTimeHandleKeyDown.bind(this);
    this.hoursHandleKeyDown = this.hoursHandleKeyDown.bind(this);
    this.buildState = this.buildState.bind(this);
    this.hourField = props.firstFieldRef;
  }

  // eslint-disable-next-line camelcase, react/no-deprecated
  UNSAFE_componentWillReceiveProps(nextProps) {
    // if timeFormat updates, update the state's hours format (12/24hr time)
    if (nextProps.timeFormat !== this.props.timeFormat) {
      this.setState({
        hoursFormat: this.deriveHoursFormat(nextProps.timeFormat),
      });
      this.buildState(nextProps);
    }

    if (nextProps.selectedTime !== this.props.selectedTime) {
      this.buildState(nextProps);
    }
  }

  componentWillUnmount() {
    // Re-focus the timepicker input when the dropdown closes
    this.props.mainControl?.focus();
  }

  buildState(props) {
    let initMoment;
    if (props.selectedTime === '') {
      initMoment = moment();
    } else if (moment(props.selectedTime, props.timeFormat).isValid()) {
      initMoment = moment(props.selectedTime, props.timeFormat, true);
    } else if (moment(props.selectedTime, 'hh', true).isValid()) {
      initMoment = moment(props.selectedTime, 'hh', true);
    } else if (moment(props.selectedTime, 'h', true).isValid()) {
      initMoment = moment(props.selectedTime, 'h', true);
    } else {
      initMoment = this.state.mo;
    }

    let initialPresentationFormat = 'hh';
    if (this.deriveHoursFormat(props.timeFormat) === '24') {
      initialPresentationFormat = 'HH';
    }

    this.setState({
      mo: initMoment,
      hour: initMoment.format(initialPresentationFormat),
      minute: initMoment.format('mm'),
      ampm: initMoment.format('A'),
    });
  }

  // examine the passed time format to determine 12 or 24 hour format.
  deriveHoursFormat(fmt) {
    let _fmt;
    if (!fmt) {
      _fmt = this.props.timeFormat;
    } else {
      _fmt = fmt;
    }
    const ampmRE = new RegExp(/A/);
    if (ampmRE.test(_fmt)) {
      return '12';
    }
    return '24';
  }

  enterTime(e, unit) {
    if (unit === 'hour') {
      let parsedHours = parseInt(e.target.value, 10);
      if (e.target.value.length > 1) {
        const twelveHour = (this.state.hoursFormat === '12');
        if (twelveHour) {
          if (parsedHours > 12) {
            parsedHours = 12;
          }
          if (parsedHours < 1) {
            parsedHours = 1;
          }
        } else {
          if (parsedHours > 23) {
            parsedHours = 23;
          }
          if (parsedHours < 0) {
            parsedHours = 0;
          }
        }
      }
      this.setState({
        hour: parsedHours,
      });
    }
    if (unit === 'minute') {
      let considered = e.target.value;
      if (e.target.value.length > 2) {
        /* only accept first 2 characters
        *  since maxlength doesn't work on number fields in chrome
        */
        considered = e.target.value.substring(0, 2);
      }

      let parsedMinutes = parseInt(considered, 10);
      if (parsedMinutes > 59) {
        parsedMinutes = 59;
      }
      if (parsedMinutes < 0) {
        parsedMinutes = 0;
      }
      this.setState({
        minute: parsedMinutes,
      });
    }
  }

  // format number with leading 0 if its less than 10...
  handleBlur(e, unit) {
    let value;
    const parsedValue = parseInt(e.target.value, 10);
    if (parsedValue < 10) {
      value = `0${parsedValue}`;
      this.setState({
        [unit]: value,
      });
    }
  }

  setTimeHandleKeyDown(e) {
    if (e.keyCode === 9 && !e.shiftKey) { // tab
      // refocus the datepicker textfield if it's tabbed out...
      this.props.onBlur(() => {
        setTimeout(() => {
          this.props.mainControl.focus();
        }, 20);
      });
    }
  }

  hoursHandleKeyDown(e) {
    if (e.keyCode === 9 && e.shiftKey) { // tab
      // refocus the datepicker textfield if the users shift-tabs out...
      this.props.onBlur(() => {
        setTimeout(() => {
          this.props.mainControl.focus();
        }, 20);
      });
    }
  }

  getDOMContainer() {
    return this.props.rootRef.current;
  }

  incrementTime(increment, unit, add) {
    if (unit === 'hour') {
      let maxHours;
      let minHours;
      if (this.deriveHoursFormat() === '12') {
        maxHours = 12;
        minHours = 1;
      } else {
        maxHours = 23;
        minHours = 0;
      }
      this.setState((curState) => {
        const newState = Object.assign({}, curState);
        let newHour = parseInt(newState.hour, 10);
        if (add) {
          newHour += increment;
          if (newHour > maxHours) {
            newHour = minHours;
          }
        } else {
          newHour -= increment;
          if (newHour < minHours) {
            newHour = maxHours;
          }
        }

        // take care of the leading 0...
        if (newHour < 10) {
          newState.hour = `0${newHour}`;
        } else {
          newState.hour = newHour.toString();
        }

        return newState;
      });
    }

    if (unit === 'minute') {
      this.setState((curState) => {
        const newState = Object.assign({}, curState);
        let newMinute = parseInt(newState.minute, 10);
        if (add) {
          newMinute += increment;
          if (newMinute > 59) {
            newMinute = 0;
          }
        } else {
          newMinute -= increment;
          if (newMinute < 0) {
            newMinute = 59;
          }
        }

        if (newMinute < 10) {
          newState.minute = `0${newMinute}`;
        } else {
          newState.minute = newMinute.toString();
        }

        return newState;
      });
    }
  }

  confirmTime() {
    this.props.onSetTime(this.state);
  }

  handleChangeAMPM() {
    this.setState(prevState => ({ ampm: prevState.ampm === 'AM' ? 'PM' : 'AM' }));
  }

  getRootClass() {
    return classNames(
      css.timepickerContainer,
    );
  }

  render() {
    const hourMin = this.deriveHoursFormat() === '12' ? 1 : 0;
    const hourMax = hourMin === 1 ? 12 : 23;

    return (
      <div
        role="form"
        onBlur={this.handleBlurDropdown}
        ref={this.props.rootRef}
        className={this.getRootClass()}
        id={`timeDD-${this.props.id}`}
        data-test-timepicker-dropdown
      >
        <Row center={this.state.hoursFormat === '12' ? undefined : 'xs'}>
          <Col xs={4} className={css.center}>
            <IconButton
              data-test-timepicker-dropdown-increment-minutes-button
              tabIndex="-1"
              icon="arrow-up"
              id={`clickable-timeDD-${this.props.id}-next-hour`}
              onClick={() => { this.incrementTime(1, 'hour', true); }}
            />
          </Col>
          <Col xs={1}>&nbsp;</Col>
          <Col xs={4} className={css.center}>
            <IconButton
              data-test-timepicker-dropdown-increment-hours-button
              tabIndex="-1"
              icon="arrow-up"
              id={`clickable-timeDD-${this.props.id}-next-minute`}
              onClick={() => { this.incrementTime(this.props.minuteIncrement, 'minute', true); }}
            />
          </Col>
        </Row>
        <Row center={this.props.hoursFormat === '12' ? undefined : 'xs'}>
          <Col xs={4}>
            <TextField
              data-test-timepicker-dropdown-hours-input
              autoFocus
              aria-label="hours"
              inputRef={this.hourField}
              placeholder="HH"
              onKeyDown={this.hoursHandleKeyDown}
              min={hourMin}
              max={hourMax}
              type="number"
              value={this.state.hour}
              onChange={(e) => { this.enterTime(e, 'hour'); }}
              onBlur={(e) => { this.handleBlur(e, 'hour'); }}
              id={`timeDD-${this.props.id}-hour-input`}
              marginBottom0
            />
          </Col>
          <Col xs={1}>
            <Layout className={`display-flex flex-align-items-center ${css.colon}`}>:</Layout>
          </Col>
          <Col xs={4}>
            <TextField
              data-test-timepicker-dropdown-minutes-input
              aria-label="minutes"
              inputRef={(m) => { this.minuteField = m; }}
              placeholder="MM"
              type="number"
              min="0"
              max="59"
              value={this.state.minute}
              onChange={(e) => { this.enterTime(e, 'minute'); }}
              onBlur={(e) => { this.handleBlur(e, 'minute'); }}
              id={`timeDD-${this.props.id}-minute-input`}
              marginBottom0
            />
          </Col>
          {this.state.hoursFormat === '12' &&
            <Col xs={3}>
              <Button
                aria-label="AM or PM"
                buttonRef={(a) => { this.aField = a; }}
                fullWidth
                marginBottom0
                onClick={this.handleChangeAMPM}
                id={`timeDD-${this.props.id}-AMPM-toggle`}
              >
                {this.state.ampm}
              </Button>
            </Col>
          }
        </Row>
        <Row center={this.state.hoursFormat === '12' ? undefined : 'xs'}>
          <Col xs={4} className={css.center}>
            <IconButton
              data-test-timepicker-dropdown-decrement-hours-button
              tabIndex="-1"
              id={`clickable-timeDD-${this.props.id}-prev-hour`}
              icon="arrow-down"
              onClick={() => { this.incrementTime(1, 'hour', false); }}
            />
          </Col>
          <Col xs={1}>&nbsp;</Col>
          <Col xs={4} className={css.center}>
            <IconButton
              data-test-timepicker-dropdown-decrement-minutes-button
              tabIndex="-1"
              id={`clickable-timeDD-${this.props.id}-prev-minute`}
              icon="arrow-down"
              onClick={() => { this.incrementTime(this.props.minuteIncrement, 'minute', false); }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Button
              data-test-timepicker-dropdown-confirm-button
              buttonStyle="primary"
              buttonClass={css.submitButton}
              onKeyDown={this.setTimeHandleKeyDown}
              fullWidth
              marginBottom0
              onClick={this.confirmTime}
              id={`clickable-timeDD-${this.props.id}-set-time`}
            >
              Set time
            </Button>
            <input className="sr-only" aria-hidden onFocus={this.props.onHide} />
          </Col>
        </Row>
      </div>
    );
  }
}

TimeDropdown.propTypes = propTypes;
TimeDropdown.defaultProps = defaultProps;

export default TimeDropdown;

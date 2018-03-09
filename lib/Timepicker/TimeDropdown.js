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
import { Row, Col } from '../LayoutGrid';
import css from './TimeDropdown.css';

const moment = extendMoment(Moment);

const propTypes = {
  minuteIncrement: PropTypes.number,
  timeFormat: PropTypes.string.isRequired,
  hoursFormat: PropTypes.oneOf(['12', '24']),
  onSetTime: PropTypes.func,
  mainControl: PropTypes.object,
  id: PropTypes.string,
  locale: PropTypes.string,
  visible: PropTypes.bool,
};

const defaultProps = {
  hoursFormat: '24',
  onSetTime: () => null,
  locale: 'en',
  minuteIncrement: 1,
};

class TimeDropdown extends React.Component {
  constructor(props) {
    super(props);

    moment.locale(this.props.locale);

    const initMoment = moment();
    this.state = {
      hoursFormat: this.deriveHoursFormat(),
      mo: initMoment,
      hour: initMoment.format('hh'),
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
  }

  componentWillReceiveProps(nextProps) {
    // if timeFormat updates, update the state's hours format (12/24hr time)
    if (nextProps.timeFormat !== this.props.timeFormat) {
      this.setState({
        hoursFormat: this.deriveHoursFormat(nextProps.timeFormat),
      });
    }

    if (!nextProps.visible && nextProps.visible !== this.props.visible) {
      this.props.mainControl.focus();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.hourField.focus();
    }
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
        }
      }
      this.setState({
        hour: parsedHours,
      });
    }
    if (unit === 'minute') {
      let parsedMinutes = parseInt(e.target.value, 10);
      if (parsedMinutes > 59) {
        parsedMinutes = 59;
      }
      if (parsedMinutes < 0) {
        parsedMinutes = 0;
      }
      this.setState({
        minute: e.target.value,
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
    switch (e.keyCode) {
      case 9: // tab
        if (!e.shiftKey) {
          // refocus the datepicker textfield if it's tabbed out... this will focus the next focusable element.
          this.props.mainControl.focus();
        }
        break;
      default:
    }
  }

  getDOMContainer() {
    return this._pickerContainer;
  }

  incrementTime(increment, unit, add) {
    if (unit === 'hour') {
      this.setState((curState) => {
        const newState = Object.assign({}, curState);
        if (add) {
          newState.mo.add(increment, 'hours');
        } else {
          newState.mo.subtract(increment, 'hours');
        }
        newState.hour = newState.mo.format('hh');
        return newState;
      });
    }

    if (unit === 'minute') {
      this.setState((curState) => {
        const newState = Object.assign({}, curState);
        if (add) {
          newState.mo.add(increment, 'minutes');
        } else {
          newState.mo.subtract(increment, 'minutes');
        }
        newState.minute = newState.mo.format('mm');
        return newState;
      });
    }
  }

  confirmTime() {
    this.props.onSetTime(this.state);
  }

  handleChangeAMPM() {
    this.setState({
      ampm: this.state.ampm === 'AM' ? 'PM' : 'AM',
    });
  }

  getRootClass() {
    return classNames(
      css.timepickerContainer,
      { [`${css.srOnly}`]: !this.props.visible },
    );
  }

  render() {
    const hourMin = this.deriveHoursFormat() === '12' ? 1 : 0;
    const hourMax = hourMin === 1 ? 12 : 23;

    return (
      <div role="form" onBlur={this.handleBlurDropdown} ref={(c) => { this._pickerContainer = c; }} className={this.getRootClass()} id={`timeDD-${this.props.id}`} aria-hidden={!this.props.visible}>
        <Row center={this.state.hoursFormat === '12' ? undefined : 'xs'}>
          <Col xs={4} className={css.center}><IconButton tabIndex="-1" icon="up-arrow" onClick={() => { this.incrementTime(1, 'hour', true); }} /></Col>
          <Col xs={1}>&nbsp;</Col>
          <Col xs={4} className={css.center}><IconButton tabIndex="-1" icon="up-arrow" onClick={() => { this.incrementTime(this.props.minuteIncrement, 'minute', true); }} /></Col>
        </Row>
        <Row center={this.props.hoursFormat === '12' ? undefined : 'xs'}>
          <Col xs={4}>
            <input
              aria-label="hours"
              ref={(h) => { this.hourField = h; }}
              placeholder="HH"
              maxLength="2"
              min={hourMin}
              max={hourMax}
              className={css.timepickerDropdownInput}
              type="number"
              value={this.state.hour}
              onChange={(e) => { this.enterTime(e, 'hour'); }}
              onBlur={(e) => { this.handleBlur(e, 'hour'); }}
            />
          </Col>
          <Col xs={1} className={css.center}><strong>:</strong></Col>
          <Col xs={4}>
            <input
              aria-label="minutes"
              ref={(m) => { this.minuteField = m; }}
              placeholder="MM"
              maxLength="2"
              className={css.timepickerDropdownInput}
              type="number"
              min="0"
              max="59"
              value={this.state.minute}
              onChange={(e) => { this.enterTime(e, 'minute'); }}
              onBlur={(e) => { this.handleBlur(e, 'minute'); }}
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
              >
                {this.state.ampm}
              </Button>
            </Col>
          }
        </Row>
        <Row center={this.state.hoursFormat === '12' ? undefined : 'xs'}>
          <Col xs={4} className={css.center}><IconButton tabIndex="-1" icon="down-arrow" onClick={() => { this.incrementTime(1, 'hour', false); }} /></Col>
          <Col xs={1}>&nbsp;</Col>
          <Col xs={4} className={css.center}><IconButton tabIndex="-1" icon="down-arrow" onClick={() => { this.incrementTime(this.props.minuteIncrement, 'minute', false); }} /></Col>
        </Row>
        <Row>
          <Col xs={12}><Button buttonStyle="primary" onKeyDown={this.setTimeHandleKeyDown} fullWidth onClick={this.confirmTime}>Set time</Button></Col>
        </Row>
      </div>
    );
  }
}

TimeDropdown.propTypes = propTypes;
TimeDropdown.defaultProps = defaultProps;

export default TimeDropdown;

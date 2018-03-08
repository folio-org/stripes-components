/*
* Display calendar UI for datepicker.
* Sync the cursor to the selected date or default to today.
* Month is rendered based on cursor date.
* Handles date math via moment.
*/

import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import Button from '../Button';
import IconButton from '../IconButton';
import { Row, Col } from '../LayoutGrid';
import { extendMoment } from 'moment-range';
import css from './TimeDropdown.css';

const moment = extendMoment(Moment);

const propTypes = {
  minuteIncrement: PropTypes.number,
  timeFormat: PropTypes.oneOf(['12', '24']),
  onSetTime: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  buttonFocus: PropTypes.func,
  id: PropTypes.string,
  locale: PropTypes.string,
  excludeTimes: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]),
};

const defaultProps = {
  timeFormat: '12',
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
      mo: initMoment,
      hours: initMoment.format('hh'),
      minutes: initMoment.format('mm'),
      ampm: initMoment.format('A'),
    };

    this.checkExcluded = this.checkExcluded.bind(this);
    this.enterTime = this.enterTime.bind(this);
    this.getDOMContainer = this.getDOMContainer.bind(this);
    this.incrementTime = this.incrementTime.bind(this);
  }

  checkExcluded(time) {
    let excluded = false;
    return excluded;
  }

  enterTime(unit) {

  }

  getDOMContainer() {
    return this._calendarContainer;
  }

  incrementTime(increment, unit, add) {

    const hourLimit = parseInt(this.props.timeFormat, 10);
    let newHour;
    let newMinute;

    if (unit === 'hour') {
      if (add) {
        newHour = this.state.hour;
        newHour += increment;
        if (newHour > hourLimit) {
          newHour = 1;
        }
      } else {

      }
    }

    if (unit === 'minute') {
      if (add) {

      } else {

      }
    }
  }

  render() {
    return (
      <div className={css.timepickerContainer} id={`timeDD-${this.props.id}`}>
        <Row>
          <Col xs={4}><IconButton icon="up-arrow" onClick={() => { this.incrementTime(1, 'hour', true); }} /></Col>
          <Col xs={4}><IconButton icon="up-arrow" onClick={() => { this.incrementTime(this.props.minuteIncrement, 'minute', true); }} /></Col>
        </Row>
        <Row>
          <Col xs={4}><input placeholder="HH" type="text" value={this.state.hours} onChange={(e) => { this.enterTime('hour', e); }} /></Col>
          <Col xs={4}><input placeholder="MM" type="text" value={this.state.minutes} onChange={(e) => { this.enterTime('minute', e); }} /></Col>
          <Col xs={4}><Button>{this.state.ampm}</Button></Col>
        </Row>
        <Row>
          <Col xs={4}><IconButton icon="down-arrow" onClick={() => { this.incrementTime(1, 'hour', false); }} /></Col>
          <Col xs={4}><IconButton icon="down-arrow" onClick={() => { this.incrementTime(this.props.minuteIncrement, 'minute', false); }} /></Col>
        </Row>
      </div>
    );
  }
}

TimeDropdown.propTypes = propTypes;
TimeDropdown.defaultProps = defaultProps;

export default TimeDropdown;

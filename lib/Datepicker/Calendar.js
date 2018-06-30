/*
* Display calendar UI for datepicker.
* Sync the cursor to the selected date or default to today.
* Month is rendered based on cursor date.
* Handles date math via moment.
*/

import React from 'react';
import { intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

import injectIntl from '../InjectIntl';
import DayButton from './DayButton';
import Icon from '../Icon';

import css from './Calendar.css';

const moment = extendMoment(Moment);

function getCalendar(year, month) {
  const startDate = moment([year, month]);
  const firstDay = moment(startDate).startOf('month');
  const endDay = moment(startDate).endOf('month');
  const monthRange = moment.range(firstDay, endDay);

  const weeks = [];
  const calendar = [];
  const rowStartArray = [];
  const rowEndArray = [];

  const weekdays = Array.from(monthRange.by('days'));
  weekdays.forEach((mo) => {
    const ref = mo.week();
    if (weeks.indexOf(ref) < 0) {
      weeks.push(mo.week());
      const endClone = moment(mo);
      rowStartArray.push(mo.weekday(0));
      rowEndArray.push(endClone.weekday(6));
    }
  });

  for (let i = 0; i < weeks.length; i += 1) {
    const weekRange = moment.range(rowStartArray[i], rowEndArray[i]);
    calendar.push(weekRange);
  }

  return calendar;
}


const propTypes = {
  buttonFocus: PropTypes.func,
  dateFormat: PropTypes.string,
  excludeDates: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]),
  id: PropTypes.string,
  intl: intlShape.isRequired,
  locale: PropTypes.string,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onSetDate: PropTypes.func,
  selectedDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

const defaultProps = {
  dateFormat: 'MM DD YYYY',
  locale: 'en',
  onSetDate: () => null,
};

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    moment.locale(this.props.locale);

    let inputDate; // initial date for state
    let cursorDate;
    if (this.props.selectedDate === '' || this.props.selectedDate === 'undefined') {
      inputDate = null;
      cursorDate = moment();
    } else if (moment(this.props.selectedDate, this.props.dateFormat, true).isValid()) {
      inputDate = moment(this.props.selectedDate, this.props.dateFormat, true);
      cursorDate = inputDate;
    } else {
      inputDate = moment();
      cursorDate = moment();
    }

    const base = moment(cursorDate);
    const month = base.month();
    const year = base.year();

    this.state = {
      cursorDate,
      date: inputDate,
      month,
      year,
      calendar: getCalendar(year, month),
    };

    this.handleDayClick = this.handleDayClick.bind(this);
    this.setDate = this.setDate.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.previousMonth = this.previousMonth.bind(this);
    this.nextYear = this.nextYear.bind(this);
    this.previousYear = this.previousYear.bind(this);
    this.checkExcluded = this.checkExcluded.bind(this);
    this.isDateSelected = this.isDateSelected.bind(this);
    this.updateCursorDate = this.updateCursorDate.bind(this);
    this.getDOMContainer = this.getDOMContainer.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // When the selected date has changed, update the state with it
    let stateUpdate;
    if (nextProps.selectedDate !== prevState.selectedDate) {
      const moDate = moment(nextProps.selectedDate, prevState.dateFormat, true);
      if (moDate.isValid()) {
        if (moDate !== prevState.date) {
          // const moDate = moment(nextProps.selectedDate);
          const month = moDate.month();
          const year = moDate.year();
          stateUpdate = {
            cursorDate: moDate,
            date: moDate,
            month,
            year,
            calendar: getCalendar(year, month),
            selectedDate: nextProps.selectedDate,
            dateFormat: nextProps.dateFormat,
          };
        }
      } else { // fix navigation issue on null or invalid date
        const fallbackDate = moment();
        const month = fallbackDate.month();
        const year = fallbackDate.year();
        stateUpdate = {
          date: fallbackDate,
          month,
          year,
          calendar: getCalendar(year, month),
          selectedDate: nextProps.selectedDate,
          dateFormat: nextProps.dateFormat,
        };
      }
    }

    if (stateUpdate) {
      const newState = prevState;
      Object.assign(newState, stateUpdate);
      newState.calendar = getCalendar(newState.year, newState.month);
      return newState;
    } else {
      return null;
    }
  }

  setDate(day) {
    this.setState({
      date: day,
    });
  }

  getDOMContainer() {
    return this._calendarContainer;
  }

  getMonth() {
    return this.state.month;
  }

  getCursorDate() {
    return this.state.cursorDate;
  }

  previousYear(e) {
    if (e) { e.preventDefault(); }
    const curDate = this.state.cursorDate;
    curDate.subtract(1, 'y');
    this.updateCursorDate(curDate);
    return moment(curDate).format(this.props.dateFormat);
  }

  nextYear(e) {
    if (e) { e.preventDefault(); }
    const curDate = this.state.cursorDate;
    curDate.add(1, 'y');
    this.updateCursorDate(curDate);
    return moment(curDate).format(this.props.dateFormat);
  }

  previousMonth(e) {
    if (e) { e.preventDefault(); }
    const curDate = this.state.cursorDate;
    curDate.subtract(1, 'M');
    this.updateCursorDate(curDate);
    return moment(curDate).format(this.props.dateFormat);
  }

  nextMonth(e) {
    if (e) { e.preventDefault(); }
    const curDate = this.state.cursorDate;
    curDate.add(1, 'M');
    this.updateCursorDate(curDate);
    return moment(curDate).format(this.props.dateFormat);
  }

  nextDay(e) {
    if (e) { e.preventDefault(); }
    const curDate = this.state.cursorDate;
    curDate.add(1, 'd');
    this.updateCursorDate(curDate);
    return moment(curDate).format(this.props.dateFormat);
  }

  previousDay(e) {
    if (e) { e.preventDefault(); }
    const curDate = this.state.cursorDate;
    curDate.subtract(1, 'd');
    this.updateCursorDate(curDate);
    return moment(curDate).format(this.props.dateFormat);
  }

  nextWeek(e) {
    if (e) { e.preventDefault(); }
    const curDate = this.state.cursorDate;
    curDate.add(7, 'd');
    this.updateCursorDate(curDate);
    return moment(curDate).format(this.props.dateFormat);
  }

  previousWeek(e) {
    if (e) { e.preventDefault(); }
    const curDate = this.state.cursorDate;
    curDate.subtract(7, 'days');
    this.updateCursorDate(curDate);
    return moment(curDate).format(this.props.dateFormat);
  }

  updateCursorDate(date) {
    this.setState((oldState) => {
      const newState = Object.assign({}, oldState);
      newState.cursorDate = date;
      newState.month = newState.cursorDate.month();
      newState.year = newState.cursorDate.year();
      if (newState.year !== oldState.year || newState.month !== oldState.month) {
        newState.calendar = getCalendar(newState.year, newState.month);
      }
      return newState;
    });
  }

  handleDayClick(day, e) {
    if (e) { e.preventDefault(); }
    this.setDate(day);
    this.props.onSetDate(e, day, day.format(this.props.dateFormat));
  }

  checkExcluded(date) {
    let excluded = false;
    if (!this.props.excludeDates) {
      return false;
    }

    const ex = this.props.excludeDates;
    switch (typeof (ex)) {
      case 'string':
        if (date.isSame(moment(ex), 'day')) {
          return true;
        }
        break;
      case 'object':
        if (moment.isMoment(ex)) {
          if (date.isSame(ex, 'day')) {
            return true;
          }
        } else { // excluded is an array...
          ex.forEach((exd) => {
            if (moment.isMoment(exd)) {
              if (date.isSame(exd, 'day')) {
                excluded = true;
              }
            } else if (date.isSame(moment(exd), 'day')) {
              excluded = true;
            }
          });
        }
        break;
      default:
        return false;
    }
    return excluded;
  }

  isDateSelected(day) {
    if (this.props.selectedDate) {
      return day.format(this.props.dateFormat) ===
        moment(this.props.selectedDate, this.props.dateFormat, true)
          .format(this.props.dateFormat);
    }
    if (this.state.date) {
      return day.format(this.props.dateFormat) ===
        moment(this.state.date, this.props.dateFormat, true)
          .format(this.props.dateFormat);
    }
    return false;
  }

  render() {
    const { id, intl } = this.props;

    let weekCount = 0;
    const weeks = this.state.calendar.map(
      (week) => {
        weekCount += 1;
        const dayList = [];
        const weekDays = Array.from(week.by('days'));
        weekDays.forEach((day) => { dayList.push(day); });

        const days = dayList.map(
          (day) => {
            const isCurrentMonth = day.month() === this.state.month;
            const isToday = day.isSame(moment(), 'day');
            const isSelected = this.isDateSelected(day);
            const isCursored = day.isSame(this.state.cursorDate, 'day');
            const isExcluded = this.checkExcluded(day);
            let dayClasses = css.dayButton;

            if (!isCurrentMonth) {
              dayClasses += ` ${css.muted}`;
            }
            if (isToday) {
              dayClasses += ` ${css.today}`;
            }
            if (isCursored) {
              dayClasses += ` ${css.cursor}`;
            }
            if (isSelected) {
              dayClasses += ` ${css.selected}`;
            }
            if (isExcluded) {
              dayClasses += ` ${css.excluded}`;
            }

            const titleDayString = day.format('dddd');
            const titleFormattedDay = day.format(this.props.dateFormat);

            return (
              <td key={day.format('D-MM')} >
                <DayButton
                  onFocus={this.props.buttonFocus}
                  className={dayClasses}
                  title={intl.formatMessage(
                    { id: 'stripes-components.selectDay' },
                    { dayOfWeek: titleDayString, date: titleFormattedDay }
                  )}
                  onDayClick={this.handleDayClick}
                  day={day}
                  onKeyDown={this.props.onKeyDown}
                  onBlur={this.props.onBlur}
                  id={`datepicker-choose-date-button-${day.format('D')}-${id}`}
                >
                  {day.format('D')}
                </DayButton>
              </td>
            );
          },
        );
        return <tr key={weekCount}>{days}</tr>;
      },
    );

    let k = moment.localeData()._week.dow;
    const daysOfWeek = [];
    while (daysOfWeek.length < 7) {
      daysOfWeek.push(
        <th key={k + k} className={css.weekday}>
          {moment().day(k).format('dd')}
        </th>
      );
      k = k < 6 ? k += 1 : 0;
    }

    const arrowStyle = { padding: '4px' };

    return (
      <div
        className={css.calendar}
        id={`datepicker-calendar-container-${id}`}
        ref={(r) => { this._calendarContainer = r; }}
        data-test-calendar
      >
        <div className={css.calendarInner}>
          <table role="presentation">
            <thead>
              <tr>
                <td>
                  <button
                    id={`datepicker-previous-year-button-${id}`}
                    className={css.nav}
                    type="button"
                    onClick={this.previousYear}
                    onKeyDown={this.props.onKeyDown}
                    tabIndex="-1"
                    style={arrowStyle}
                    title={intl.formatMessage(
                      { id: 'stripes-components.goToPreviousYear' }
                    )}
                  >
                    <Icon icon="left-double-chevron" />
                  </button>
                </td>
                <td>
                  <button
                    id={`datepicker-previous-month-button-${id}`}
                    href="#"
                    className={css.nav}
                    type="button"
                    onClick={this.previousMonth}
                    onKeyDown={this.props.onKeyDown}
                    tabIndex="-1"
                    style={arrowStyle}
                    title={intl.formatMessage(
                      { id: 'stripes-components.goToPreviousMonth' }
                    )}
                  >
                    <Icon icon="left-arrow" />
                  </button>
                </td>
                <td colSpan="3">
                  <span className={css.selectedMonth}>
                    {moment().month(this.state.month).format('MMMM')} {this.state.year}
                  </span>
                </td>
                <td>
                  <button
                    href="#"
                    id={`datepicker-next-month-button-${id}`}
                    className={css.nav}
                    type="button"
                    onClick={this.nextMonth}
                    onKeyDown={this.props.onKeyDown}
                    tabIndex="-1"
                    style={arrowStyle}
                    title={intl.formatMessage(
                      { id: 'stripes-components.goToNextMonth' }
                    )}
                  >
                    <Icon icon="right-arrow" />
                  </button>
                </td>
                <td>
                  <button
                    href="#"
                    id={`datepicker-next-year-button-${id}`}
                    className={css.nav}
                    type="button"
                    onClick={this.nextYear}
                    onKeyDown={this.props.onKeyDown}
                    tabIndex="-1"
                    style={arrowStyle}
                    title={intl.formatMessage(
                      { id: 'stripes-components.goToNextYear' }
                    )}
                  >
                    <Icon icon="right-double-chevron" />
                  </button>
                </td>
              </tr>
              <tr>
                {daysOfWeek}
              </tr>
            </thead>
            <tbody>
              {weeks}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

Calendar.propTypes = propTypes;
Calendar.defaultProps = defaultProps;

export default injectIntl(Calendar, { withRef: true });

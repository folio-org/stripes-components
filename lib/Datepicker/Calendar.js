/*
* Display calendar UI for datepicker.
* Sync the cursor to the selected date or default to today.
* Month is rendered based on cursor date.
* Handles date math via moment.
*/

import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

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
  let firstWeekDay;
  let lastWeekDay;
  let week;

  const weekdays = Array.from(monthRange.by('days'));
  weekdays.forEach((mo) => {
    const ref = mo.week();
    if (weeks.indexOf(ref) < 0) {
      weeks.push(mo.week());
    }
  });

  for (let i = 0, len = weeks.length; i < len; i += 1) {
    week = weeks[i];
    if (i > 0 && week < weeks[i - 1]) {
      // We have switched to the next year

      firstWeekDay = moment([year, month]).add(1, 'year')
        .week(week).day(moment.localeData()._week.dow); // eslint-disable-line
      lastWeekDay = moment([year, month]).add(1, 'year')
        .week(week).day(moment.localeData()._week.dow + 6); // eslint-disable-line
    } else {
      firstWeekDay = moment([year, month])
        .week(week).day(moment.localeData()._week.dow); // eslint-disable-line
      lastWeekDay = moment([year, month])
        .week(week).day(moment.localeData()._week.dow + 6); // eslint-disable-line
    }
    const weekRange = moment.range(firstWeekDay, lastWeekDay);
    calendar.push(weekRange);
  }

  return calendar;
}


const propTypes = {
  onSetDate: PropTypes.func,
  dateFormat: PropTypes.string,
  selectedDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  locale: PropTypes.string,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  buttonFocus: PropTypes.func,
  excludeDates: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]),
};

const defaultProps = {
  date: moment(),
  dateFormat: 'MM DD YYYY',
  onSetDate: () => null,
  locale: 'en',
  onNavigation: () => null,
};

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    moment.locale(this.props.locale);

    let inputDate;  // initial date for state
    let cursorDate;
    if (this.props.selectedDate === '' || this.props.selectedDate === 'undefined') {
      inputDate = null;
      cursorDate = moment();
    } else if (moment(this.props.selectedDate, this.props.dateFormat, true).isValid()) {
      inputDate = moment(this.props.selectedDate, this.props.dateFormat);
      cursorDate = moment(this.props.selectedDate);
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
  }

  componentWillReceiveProps(nextProps) {
    let stateUpdate;
    if (nextProps.selectedDate !== this.props.selectedDate) {
      if (moment(nextProps.selectedDate, this.props.dateFormat, true).isValid()) {
        if (moment(nextProps.selectedDate) !== this.state.date) {
          const moDate = moment(nextProps.selectedDate);
          const month = moDate.month();
          const year = moDate.year();
          stateUpdate = {
            cursorDate: moDate,
            date: moDate,
            month,
            year,
            calendar: getCalendar(year, month),
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
        };
      }
    }

    if (stateUpdate) {
      this.setState((oldState) => {
        const newState = oldState;
        Object.assign(newState, stateUpdate);
        newState.calendar = getCalendar(newState.year, newState.month);
        return newState;
      });
    }
  }

  setDate(day) {
    this.setState({
      date: day,
    });
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
          },
          );
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
        moment(this.props.selectedDate, this.props.dateFormat, true).format(this.props.dateFormat);
    }
    if (this.state.date) {
      return day.format(this.props.dateFormat) ===
        moment(this.state.date, this.props.dateFormat, true).format(this.props.dateFormat);
    }
    return false;
  }

  render() {
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
                <button
                  onFocus={this.props.buttonFocus}
                  type="button"
                  className={dayClasses}
                  title={`Select ${titleDayString}, ${titleFormattedDay}`}
                  onClick={(e) => { this.handleDayClick(day, e); }}
                  onKeyDown={this.props.onKeyDown}
                  onBlur={this.props.onBlur}
                  tabIndex="-1"
                >
                  {day.format('D')}
                </button>
              </td>
            );
          },
        );
        return <tr key={weekCount}>{days}</tr>;
      },
    );

    let k = moment.localeData()._week.dow; // eslint-disable-line no-underscore-dangle
    const daysOfWeek = [];
    while (daysOfWeek.length < 7) {
      daysOfWeek.push(<th key={k + k} className={css.weekday}>{moment().day(k).format('dd')}</th>);
      k = k < 6 ? k += 1 : 0;
    }

    const arrowStyle = { padding: '4px' };

    return (
      <div className={css.root}>
        <div className={css.calendar}>
          <table role="presentation">
            <thead>

              <tr>
                <td>
                  <button className={css.nav} type="button" onClick={this.previousYear} onKeyDown={this.props.onKeyDown} tabIndex="-1" style={arrowStyle} title="Go to previous year"><Icon icon="left-double-chevron" /></button>
                </td>
                <td>
                  <button href="#" className={css.nav} type="button" onClick={this.previousMonth} onKeyDown={this.props.onKeyDown} tabIndex="-1" style={arrowStyle} title="Go to previous month"><Icon icon="left-arrow" /></button>
                </td>
                <td colSpan="3"><span className={css.selectedMonth}>{moment().month(this.state.month).format('MMMM')} {this.state.year}</span></td>
                <td>
                  <button href="#" className={css.nav} type="button" onClick={this.nextMonth} onKeyDown={this.props.onKeyDown} tabIndex="-1" style={arrowStyle} title="Go to next month" ><Icon icon="right-arrow" /></button>
                </td>
                <td>
                  <button href="#" className={css.nav} type="button" onClick={this.nextYear} onKeyDown={this.props.onKeyDown} tabIndex="-1" style={arrowStyle} title="Go to next year"><Icon icon="right-double-chevron" /></button>
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

export default Calendar;

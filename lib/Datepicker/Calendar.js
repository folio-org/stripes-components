/*
* Display calendar UI for datepicker.
* Sync the cursor to the selected date or default to today.
* Month is rendered based on cursor date.
* Handles date math via moment.
*/

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

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
  exclude: PropTypes.func,
  id: PropTypes.string,
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
  exclude: () => false
};

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    moment.locale(this.props.locale);

    let inputDate; // initial date for state
    let cursorDate;
    if (!this.props.selectedDate) {
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
      calendar: getCalendar(year, month)
    };

    this.handleDayClick = this.handleDayClick.bind(this);
    this.setDate = this.setDate.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.previousMonth = this.previousMonth.bind(this);
    this.nextYear = this.nextYear.bind(this);
    this.previousYear = this.previousYear.bind(this);
    this.isDateSelected = this.isDateSelected.bind(this);
    this.updateCursorDate = this.updateCursorDate.bind(this);
    this.getDOMContainer = this.getDOMContainer.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // When the selected date has changed, update the state with it
    let stateUpdate;
    if (nextProps.selectedDate !== prevState.selectedDate) {
      const moDate = moment(nextProps.selectedDate, nextProps.dateFormat, true);
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

  // previousYear(e) {
  //   if (e) { e.preventDefault(); }
  //   const curDate = this.state.cursorDate;
  //   curDate.subtract(1, 'y');
  //   this.updateCursorDate(curDate);
  //   return moment(curDate).format(this.props.dateFormat);
  // }

  // nextYear(e) {
  //   if (e) { e.preventDefault(); }
  //   const curDate = this.state.cursorDate;
  //   curDate.add(1, 'y');
  //   this.updateCursorDate(curDate);
  //   return moment(curDate).format(this.props.dateFormat);
  // }

  // previousMonth(e) {
  //   if (e) { e.preventDefault(); }
  //   const curDate = this.state.cursorDate;
  //   curDate.subtract(1, 'M');
  //   this.updateCursorDate(curDate);
  //   return moment(curDate).format(this.props.dateFormat);
  // }

  // nextMonth(e) {
  //   if (e) { e.preventDefault(); }
  //   const curDate = this.state.cursorDate;
  //   curDate.add(1, 'M');
  //   this.updateCursorDate(curDate);
  //   return moment(curDate).format(this.props.dateFormat);
  // }

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

  keyDownOnExcluded = e => {
    // when keydown is pressed on excluded event
    // we only want to prevent selection (ie enter key press)
    // all other keypresses should contrinue to allow navigation
    if (e.keyCode !== 13) {
      this.props.onKeyDown(e);
    }
  }

  updateYear = (e) => {
    if (e.target.value) {
      if (new moment(e.target.value, 'YYYY', true).isValid()) {
        // do internal update stuff...
        // year = moment(e.target.value).format("YYYY");
      }
      this.setState({ year: e.target.value });
    }
  }

  render() {
    const { id } = this.props;

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
            const isExcluded = this.props.exclude(day);
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
              <td key={day.format('D-MM')}>
                <FormattedMessage
                  id="stripes-components.selectDay"
                  values={{ dayOfWeek: titleDayString, date: titleFormattedDay }}
                >
                  {ariaLabel => (
                    <DayButton
                      data-test-date={titleFormattedDay}
                      onFocus={this.props.buttonFocus}
                      className={dayClasses}
                      aria-label={ariaLabel}
                      onDayClick={this.handleDayClick}
                      day={day}
                      onKeyDown={isExcluded ? this.keyDownOnExcluded : this.props.onKeyDown}
                      onBlur={this.props.onBlur}
                      disabled={isExcluded}
                      id={`datepicker-choose-date-button-${day.format('D')}-${id}`}
                    >
                      {day.format('D')}
                    </DayButton>
                  )}
                </FormattedMessage>
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

    // const arrowStyle = { padding: '4px' };

    return (
      <div
        className={css.calendar}
        id={`datepicker-calendar-container-${id}`}
        ref={(r) => { this._calendarContainer = r; }}
        data-test-calendar
      >
        <div className={css.calendarInner}>
          <div style={{ display: 'flex', justifyContent:'space-between', fontSize: '14px', marginBottom:'8px' }}>
            <div>
              <select aria-label="month" style={{ borderStyle: 'dashed', borderWidth: '0 0 1px 0', padding:'4px' }}>
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
              </select>
            </div>
            <div>
              <input
                aria-label="year"
                style={{
                  borderStyle: 'dashed',
                  borderWidth: '0 0 1px 0',
                  minWidth:'0',
                  flex: '0 1 auto',
                  padding:'4px',
                  width: '8em'
                }}
                type="number"
                value={this.state.year}
                onChange={this.updateYear}
              />
            </div>
          </div>
          <table role="presentation">
            <thead>
              {/* <tr>
                <td>
                  <FormattedMessage id="stripes-components.goToPreviousYear">
                    {ariaLabel => (
                      <button
                        data-test-calendar-previous-year
                        id={`datepicker-previous-year-button-${id}`}
                        className={css.nav}
                        type="button"
                        onClick={this.previousYear}
                        onKeyDown={this.props.onKeyDown}
                        tabIndex="-1"
                        style={arrowStyle}
                        aria-label={ariaLabel}
                      >
                        <Icon icon="chevron-double-left" />
                      </button>
                    )}
                  </FormattedMessage>
                </td>

                <td>
                  <FormattedMessage id="stripes-components.goToPreviousMonth">
                    {ariaLabel => (
                      <button
                        data-test-calendar-previous-month
                        id={`datepicker-previous-month-button-${id}`}
                        href="#"
                        className={css.nav}
                        type="button"
                        onClick={this.previousMonth}
                        onKeyDown={this.props.onKeyDown}
                        tabIndex="-1"
                        style={arrowStyle}
                        aria-label={ariaLabel}
                      >
                        <Icon icon="arrow-left" />
                      </button>
                    )}
                  </FormattedMessage>
                </td>
                <td colSpan="3">
                  <span className={css.selectedMonth} data-test-calendar-header>
                    {this.state.cursorDate.format('MMMM YYYY')}
                  </span>
                </td>
                <td>
                  <FormattedMessage id="stripes-components.goToNextMonth">
                    {ariaLabel => (
                      <button
                        data-test-calendar-next-month
                        href="#"
                        id={`datepicker-next-month-button-${id}`}
                        className={css.nav}
                        type="button"
                        onClick={this.nextMonth}
                        onKeyDown={this.props.onKeyDown}
                        tabIndex="-1"
                        style={arrowStyle}
                        aria-label={ariaLabel}
                      >
                        <Icon icon="arrow-right" />
                      </button>
                    )}
                  </FormattedMessage>
                </td>
                <td>
                  <FormattedMessage id="stripes-components.goToNextYear">
                    {ariaLabel => (
                      <button
                        data-test-calendar-next-year
                        href="#"
                        id={`datepicker-next-year-button-${id}`}
                        className={css.nav}
                        type="button"
                        onClick={this.nextYear}
                        onKeyDown={this.props.onKeyDown}
                        tabIndex="-1"
                        style={arrowStyle}
                        aria-label={ariaLabel}
                      >
                        <Icon icon="chevron-double-right" />
                      </button>
                    )}
                  </FormattedMessage>
                </td>
              </tr> */}
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

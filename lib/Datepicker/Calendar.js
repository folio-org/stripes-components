/*
* Display calendar UI for datepicker.
* Sync the cursor to the selected date or default to today.
* Month is rendered based on cursor date.
* Handles date math via moment.
*/

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import IconButton from '../IconButton';
import MonthSelect from './MonthSelect';

import css from './Calendar.css';

import staticFirstWeekday from './staticFirstWeekDay';

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

function getMonths(intl) {
  const months = [];
  for (let i = 1; i <= 12; i++) {
    months.push(intl.formatDateToParts(`${i}/01/${new Date().getFullYear()}`, { month: 'long' })[0].value);
  }
  return months;
}

function getWeekDays(intl) {
  const weekDays = [];
  for (let i = 1; i <= 7; i++) {
    weekDays.push(intl.formatDateToParts(`03/0${i}/${new Date().getFullYear()}`, { weekday: 'short' })[0].value);
  }
  return weekDays;
}

function getFirstWeekday(locale) {
  const dayMap = { 'sun': 0, 'sat': 6, 'mon': 1 };
  const region = locale.split('-')[1] || 'US';
  let firstDay;
  Object.keys(staticFirstWeekday).forEach(d => {
    if (staticFirstWeekday[d].findIndex(re => re === region) !== -1) {
      firstDay = d;
    }
  });
  return dayMap[firstDay];
}

const propTypes = {
  dateFormat: PropTypes.string,
  exclude: PropTypes.func,
  firstFieldRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  id: PropTypes.string,
  intl: PropTypes.object,
  locale: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onRequestClose: PropTypes.func,
  onSetDate: PropTypes.func,
  rootRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.instanceOf(Element)
    })
  ]),
  selectedDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

const defaultProps = {
  dateFormat: 'MM DD YYYY',
  locale: 'en',
  onSetDate: () => null,
  exclude: () => false,
  onFocus: () => {},
};

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    moment.locale(this.props.locale);

    const { selectedDate, dateFormat } = this.props;

    this.selectedMoment = null; // initial date for state
    let cursorDate;
    if (!selectedDate) {
      cursorDate = new moment(); // eslint-disable-line new-cap
    } else if (moment(selectedDate, dateFormat, true).isValid()) {
      this.selectedMoment = new moment(selectedDate, dateFormat, true); // eslint-disable-line new-cap
      cursorDate = this.selectedMoment;
    } else { // no pre-selected date, datestring invalid, init as 'today'.
      this.selectedMoment = new moment(); // eslint-disable-line new-cap
      cursorDate = new moment(); // eslint-disable-line new-cap
    }

    const base = new moment(cursorDate); // eslint-disable-line new-cap
    const month = base.month();
    const year = base.year();

    this.calendarLabel = props.intl.formatMessage({ id: 'stripes-components.Datepicker.calendar' });
    this.calendarRoledescription = props.intl.formatMessage({ id: 'stripes-components.Datepicker.calenderRole' });

    this.state = {
      cursorDate,
      date: this.selectedMoment,
      month,
      year,
      calendar: getCalendar(year, month)
    };

    this.weekDays = getWeekDays(props.intl);
    this.months = getMonths(props.intl);
    this.firstWeekDay = getFirstWeekday(props.intl.locale);
    this.firstField = props.firstFieldRef;
    this.calendarGrid = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // When the selected date has changed, update the state with it
    let stateUpdate;
    if (nextProps.selectedDate !== prevState.selectedDate) {
      const moDate = new moment(nextProps.selectedDate, nextProps.dateFormat, true); // eslint-disable-line new-cap
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
        const fallbackDate = new moment(); // eslint-disable-line new-cap
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

  setDate = (day) => {
    this.setState({
      date: day,
    });
  }

  handleCalendarKeyDown = (e) => {
    e.stopPropagation();
    if (e.key !== 'Tab') e.preventDefault();
    switch (e.key) {
      case 'Enter':
      case 'Spacebar':
        if (e.target.dataset.excluded === 'false') {
          this.setPickerDate(e);
        }
        break;
      case 'ArrowDown':
        this.moveCursor(cur => cur.add(7, 'd'));
        break;
      case 'ArrowUp':
        this.moveCursor(cur => cur.subtract(7, 'd'));
        break;
      case 'ArrowLeft':
        this.moveCursor(cur => cur.subtract(1, 'd'));
        break;
      case 'ArrowRight':
        this.moveCursor(cur => cur.add(1, 'd'));
        break;
      case 'PageDown':
        if (e.altKey) {
          this.moveCursor(cur => cur.add(1, 'y'));
        } else {
          this.moveCursor(cur => cur.add(1, 'M'));
        }
        break;
      case 'PageUp':
        if (e.altKey) {
          this.moveCursor(cur => cur.subtract(1, 'y'));
        } else {
          this.moveCursor(cur => cur.subtract(1, 'M'));
        }
        break;
      case 'Escape':
        this.props.onRequestClose();
        break;
      default:
    }
  }

  moveCursor = (op) => {
    const curDate = this.state.cursorDate;
    op(curDate);
    this.updateCursorDate(curDate);
  }

  focusTrap = {
    toStart: () => { this.firstField.current?.focus(); }, // eslint-disable-line no-unused-expressions
    toLast: () => {
      this.calendarGrid.current?.querySelector('[tabindex="0"]').focus(); // eslint-disable-line no-unused-expressions
    }
  }

  updateCursorDate = (date) => {
    this.setState((oldState) => {
      const newState = Object.assign({}, oldState);
      newState.cursorDate = date;
      newState.month = newState.cursorDate.month();
      newState.year = newState.cursorDate.year();
      if (newState.year !== oldState.year || newState.month !== oldState.month) {
        newState.calendar = getCalendar(newState.year, newState.month);
      }
      return newState;
    }, () => {
      const { id, dateFormat } = this.props;
      const { cursorDate } = this.state;
      const cursorString = cursorDate.format(dateFormat);
      const nextButtonElem = document.getElementById(`datepicker-choose-date-button-${cursorString}-${id}`);
      nextButtonElem?.focus(); // eslint-disable-line no-unused-expressions
    });
  }

  setPickerDate = (e) => {
    // const date = e.currentTarget.dataset.date;
    const day = e.currentTarget.dataset.day;

    this.setDate(day);
    this.props.onSetDate(day);
  }

  handleDayClick = (e) => {
    if (e.target.dataset.excluded === 'false') {
      this.setPickerDate(e);
    }
  }

  isDateSelected = (day) => {
    if (this.props.selectedDate) {
      return day.format(this.props.dateFormat) ===
        new moment(this.props.selectedDate, this.props.dateFormat, true) // eslint-disable-line new-cap
          .format(this.props.dateFormat);
    }
    if (this.state.date) {
      return day.format(this.props.dateFormat) ===
        new moment(this.state.date, this.props.dateFormat, true) // eslint-disable-line new-cap
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

  updateMonth = (e) => {
    // state.month is a moment month (0-based)
    const month = parseInt(e.target.value, 10);

    this.setState(curState => {
      let cursorDate = '';
      if (month === this.selectedMoment?.month()) {
        cursorDate = this.selectedMoment;
      } else {
        cursorDate = new moment().month(month).date(1).year(curState.year); // eslint-disable-line new-cap
      }
      return {
        month,
        calendar: getCalendar(curState.year, month),
        cursorDate,
      };
    });
  }

  updateYear = (e) => {
    if (e.target.value) {
      const year = e.target.value;
      if (new moment(year, 'YYYY', true).isValid()) { // eslint-disable-line new-cap
        this.setState(curState => ({
          year,
          calendar: getCalendar(year, curState.month),
        }));
      }
    }
  }

  handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      this.props.onRequestClose();
    }
  }

  moveDate = (op, unit) => {
    this.setState(curState => {
      const newDate = curState.date[op](1, unit);
      const month = newDate.month();
      const year = newDate.year();
      return {
        date: newDate,
        month,
        year,
        calendar: getCalendar(year, month)
      };
    });
  }

  render() {
    const { id, rootRef } = this.props;

    let weekCount = 0;

    const weeks = this.state.calendar.map(
      (week) => {
        weekCount += 1;
        const dayList = [];
        const weekDays = Array.from(week.by('days'));
        weekDays.forEach((day) => { dayList.push(day); });

        const days = dayList.map(
          (day) => {
            const { month, cursorDate } = this.state;
            const { intl, exclude, dateFormat } = this.props;
            const dayMonth = day.month() + 1;
            const isCurrentMonth = dayMonth === month + 1;
            const isToday = day.isSame(moment(), 'day');
            const isSelected = this.isDateSelected(day);

            const isCursored = day.isSame(cursorDate, 'day');
            const isExcluded = exclude(day);
            let dayClasses = css.dayLabel;

            if (!isCurrentMonth) {
              dayClasses += ` ${css.muted}`;
            }
            if (isToday) {
              dayClasses += ` ${css.today}`;
            }

            if (isSelected) {
              dayClasses += ` ${css.selected}`;
            }
            if (isExcluded) {
              dayClasses += ` ${css.excluded}`;
            }

            const titleDayString = day.format('dddd');
            const titleFormattedDay = day.format(dateFormat);
            let numericDay = dateFormat;
            numericDay = numericDay.replace('MM', new Intl.NumberFormat(
              intl.locale,
              { minimumIntegerDigits: 2 }
            ).format(dayMonth))
              .replace('YYYY',
                new Intl.NumberFormat(intl.locale,
                  { style: 'decimal', useGrouping: false })
                  .format(day.year()))
              .replace('DD', new Intl.NumberFormat(
                intl.locale,
                { minimumIntegerDigits: 2 }
              )
                .format(day.date()));

            const dayString = new Intl.NumberFormat(intl.locale).format(day.date());

            const excludedAria = isExcluded ?
              intl.formatMessage({ id: 'stripes-components.Datepicker.unavailable' }) + ' ' : '';

            return (
              <FormattedMessage
                key={day.format('D-MM')}
                id="stripes-components.selectDay"
                values={{ dayOfWeek: titleDayString, date: titleFormattedDay }}
              >
                {ariaLabel => (
                  <td
                    role="button" // eslint-disable-line
                    data-test-date={titleFormattedDay}
                    data-date={titleFormattedDay}
                    data-excluded={!!isExcluded}
                    data-day={numericDay}
                    className={css.dayButton}
                    aria-label={`${excludedAria}${ariaLabel}`}
                    aria-describedby={`${id}-cal-description`}
                    onClick={this.handleDayClick}
                    onKeyDown={this.handleCalendarKeyDown}
                    tabIndex={isCursored ? '0' : '-1'}
                    onBlur={this.props.onBlur}
                    id={`datepicker-choose-date-button-${titleFormattedDay}-${id}`}
                  >
                    <div data-excluded={!!isExcluded} className={dayClasses}>
                      {dayString}
                    </div>
                  </td>
                )}
              </FormattedMessage>
            );
          }
        );

        return <tr key={weekCount}>{days}</tr>;
      },
    );

    let k = this.firstWeekDay;
    const daysOfWeek = [];
    while (daysOfWeek.length < 7) {
      daysOfWeek.push(
        <li key={k + k} className={css.weekday}>
          {this.weekDays[k]}
        </li>
      );
      k = k < 6 ? k += 1 : 0;
    }

    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <div
        role="application"
        aria-roledescription={this.calendarRoledescription}
        aria-label={this.calendarLabel}
        className={css.calendar}
        id={`datepicker-calendar-container-${id}`}
        ref={rootRef}
        tabIndex="-1"
        onFocus={this.props.onFocus}
        onKeyDown={this.handleKeyDown}
        data-test-calendar
      >{/* eslint-disable jsx-a11y/no-noninteractive-tabindex */}
        <div
          onFocus={this.focusTrap.toLast}
          tabIndex="0"
        />
        <div className={css.calendarInner}>
          <div
            className={css.calendarHeader}
            data-test-calendar-header
          >
            <FormattedMessage id="stripes-components.goToPreviousYear">
              { ariaLabel => (
                <IconButton
                  icon="chevron-double-left"
                  tabIndex="-1"
                  onClick={() => this.moveDate('subtract', 'year')}
                  data-test-calendar-previous-year
                  aria-label={ariaLabel}
                />
              )}
            </FormattedMessage>
            <FormattedMessage id="stripes-components.goToPreviousMonth">
              { ariaLabel => (
                <IconButton
                  icon="caret-left"
                  tabIndex="-1"
                  onClick={() => this.moveDate('subtract', 'month')}
                  data-test-calendar-previous-month
                  aria-label={ariaLabel}
                />
              )}
            </FormattedMessage>
            <FormattedMessage id="stripes-components.Datepicker.monthControl">
              { ariaLabel => (
                <MonthSelect
                  autoFocus
                  aria-label={ariaLabel}
                  month={this.state.month}
                  months={this.months}
                  onChange={this.updateMonth}
                  inputRef={this.firstField}
                />
              )}
            </FormattedMessage>
            <FormattedMessage id="stripes-components.Datepicker.yearControl">
              { ariaLabel => (
                <input
                  data-test-year-input
                  aria-label={ariaLabel}
                  className={css.yearInput}
                  type="number"
                  value={this.state.year}
                  onChange={this.updateYear}
                />
              )}
            </FormattedMessage>
            <FormattedMessage id="stripes-components.goToNextMonth">
              { ariaLabel => (
                <IconButton
                  icon="caret-right"
                  tabIndex="-1"
                  onClick={() => this.moveDate('add', 'month')}
                  data-test-calendar-next-month
                  aria-label={ariaLabel}
                />
              )}
            </FormattedMessage>
            <FormattedMessage id="stripes-components.goToNextYear">
              { ariaLabel => (
                <IconButton
                  icon="chevron-double-right"
                  tabIndex="-1"
                  onClick={() => this.moveDate('add', 'year')}
                  data-test-calendar-next-year
                  aria-label={ariaLabel}
                />
              )}
            </FormattedMessage>
          </div>
          <ul className={css.daysOfWeek}>
            {daysOfWeek}
          </ul>
          <FormattedMessage id="stripes-components.Datepicker.calendarDaysListDescription">
            { description => <div className="sr-only" id={`${id}-cal-description`}>{description}</div>}
          </FormattedMessage>
          <table role="presentation" ref={this.calendarGrid} onKeyDown={this.handleCalendarKeyDown}>
            <tbody>
              {weeks}
            </tbody>
          </table>
        </div>
        <div onFocus={this.focusTrap.toStart} tabIndex="0" />
        {/* eslint-enable jsx-a11y/no-noninteractive-tabindex */}
      </div>
    );
  }
}

Calendar.propTypes = propTypes;
Calendar.defaultProps = defaultProps;

export default injectIntl(Calendar);

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
  date: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onSetDate: PropTypes.func,
  cursorDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  dateFormat: PropTypes.string,
  selected: PropTypes.object,
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
};

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    moment.locale(this.props.locale);

    let initDate;   // date to initialize calendar
    let inputDate;  // initial date for state
    if (this.props.date === '' || this.props.date === 'undefined') {
      initDate = moment();
      inputDate = moment();
    } else if (moment(this.props.date, this.props.dateFormat).isValid()) {
      initDate = moment(this.props.date, this.props.dateFormat);
      inputDate = moment(this.props.date, this.props.dateFormat);
    } else {
      initDate = moment();
      inputDate = moment();
    }

    const base = moment(initDate);
    const month = base.month();
    const year = base.year();

    this.state = {
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
  }

  componentWillReceiveProps(nextProps) {
    if (moment(nextProps.date, this.props.dateFormat, true).isValid()) {
      let newState;
      let willUpdate = false;
      if (moment(nextProps.date) !== this.state.date) {
        const moDate = moment(nextProps.date);
        const month = moDate.month();
        const year = moDate.year();
        newState = {
          date: moDate,
          month,
          year,
          calendar: getCalendar(year, month),
        };
        willUpdate = true;
      }

      if (nextProps.cursorDate !== this.props.cursorDate) {
        const month = nextProps.cursorDate.month();
        const year = nextProps.cursorDate.year();
        newState = {
          month,
          year,
          calendar: getCalendar(year, month),
        };
        willUpdate = true;
      }

      if (willUpdate) { this.setState({ ...newState }); }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // fix null date month navigation issue...
    if(nextProps.date === ''){
      if (nextState.month != this.state.month || nextState.year != this.state.year){
        return true;
      }
    }
    if (!moment(nextProps.date, this.props.dateFormat, true).isValid()) {
        return false
    }
    
    return true;
  }

  setDate(day) {
    this.setState({
      date: day,
    });
  }

  getMonth() {
    return this.state.month;
  }

  previousYear(e) {
    if (e) { e.preventDefault(); }
    const year = this.state.year - 1;
    const month = this.state.month;
    this.setState({
      month,
      year,
      calendar: getCalendar(year, month),
    });
  }

  nextYear(e) {
    if (e) { e.preventDefault(); }
    const year = this.state.year + 1;
    const month = this.state.month;
    this.setState({
      month,
      year,
      calendar: getCalendar(year, month),
    });
  }

  previousMonth(e) {
    if (e) { e.preventDefault(); }
    let month;
    let year;
    if (this.state.month === 0) {
      month = 11;
      year = this.state.year - 1;
    } else {
      month = this.state.month - 1;
      year = this.state.year;
    }

    this.setState({
      month,
      year,
      calendar: getCalendar(year, month),
    });
  }

  nextMonth(e) {
    if (e) { e.preventDefault(); }
    let month;
    let year;
    if (this.state.month === 11) {
      month = 0;
      year = this.state.year + 1;
    } else {
      month = this.state.month + 1;
      year = this.state.year;
    }

    this.setState({
      month,
      year,
      calendar: getCalendar(year, month),
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
    if (this.props.selected) {
      return day.format('DD-MM-YYYY') === this.props.selected.format('DD-MM-YYYY');
    }
    if (this.state.date) {
      return day.format('DD-MM-YYYY') === this.state.date.format('DD-MM-YYYY');
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
            const isCursored = day.isSame(this.props.cursorDate, 'day');
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
                  <button className={css.nav} onClick={this.previousYear} tabIndex="-1" style={arrowStyle} title="Go to previous year"><Icon icon="left-double-chevron" /></button>
                </td>
                <td>
                  <button href="#" className={css.nav} onClick={this.previousMonth} tabIndex="-1" style={arrowStyle} title="Go to previous month"><Icon icon="left-arrow" /></button>
                </td>
                <td colSpan="3"><span className={css.selectedMonth}>{moment().month(this.state.month).format('MMMM')} {this.state.year}</span></td>
                <td>
                  <button href="#" className={css.nav} onClick={this.nextMonth} tabIndex="-1" style={arrowStyle} title="Go to next month" ><Icon icon="right-arrow" /></button>
                </td>
                <td>
                  <button href="#" className={css.nav} onClick={this.nextYear} tabIndex="-1" style={arrowStyle} title="Go to next year"><Icon icon="right-double-chevron" /></button>
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
        <div>
          {/* Selection: { this.state.date ? this.state.date.format('D MMMM YYYY') : '' } */}
        </div>
      </div>
    );
  }

}

Calendar.propTypes = propTypes;
Calendar.defaultProps = defaultProps;

export default Calendar;

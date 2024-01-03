/*
* Display calendar UI for datepicker.
* Sync the cursor to the selected date or default to today.
* Month is rendered based on cursor date.
* Handles date math via dayjs.
*/

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { isArray } from 'lodash';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import arraySupport from 'dayjs/plugin/arraySupport';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import IconButton from '../IconButton';
import MonthSelect from './MonthSelect';
import DynamicLocaleRenderer from '../../hooks/useDynamicLocale/DynamicLocaleRenderer';
import css from './Calendar.css';

import staticFirstWeekday from './staticFirstWeekDay';
import staticRegions from './staticLangCountryCodes';


dayjs.extend(isoWeek);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(arraySupport);
dayjs.extend(customParseFormat);

const getRange = (start, end) => {
  const range = [];
  let current = typeof start === 'string' ? dayjs(start) : start;
  while (current.isBefore(end)) {
    range.push(current.clone());
    current = current.add(1, 'day');
  }
  return range;
};

function getCalendar(year, month, offset = 0) {
  const startDate = dayjs([year, month]);
  const firstDay = startDate.startOf('month');
  const endDay = startDate.endOf('month');
  const monthRange = getRange(firstDay, endDay);

  const weeks = [];
  const calendar = [];
  const rowStartArray = [];
  const rowEndArray = [];

  monthRange.forEach((mo) => {
    const ref = mo.week();
    if (weeks.indexOf(ref) < 0) {
      weeks.push(mo.week());
      const endClone = dayjs(mo);
      rowStartArray.push(mo.day(offset).toISOString());
      rowEndArray.push(endClone.day(offset + 6).add(1, 'day'));
    }
  });

  for (let i = 0; i < weeks.length; i += 1) {
    const weekRange = getRange(rowStartArray[i], rowEndArray[i]);
    calendar.push(weekRange);
  }

  return calendar;
}

function getMonths(intl) {
  const months = [];
  for (let i = 1; i <= 12; i++) {
    const monthString = i >= 10 ? i.toString() : `0${i}`;
    months.push(intl.formatDateToParts(
      `${monthString}/13/${new Date().getFullYear()}`,
      { month: 'long', timeZone: 'UTC' }
    )[0].value);
  }
  return months;
}

function getWeekDays(intl) {
  const weekDays = [];
  // a static week that will give us Sunday - Saturday as an array[7]
  // The supplied static value is a UTC date so no localizing offset would occur - this
  // would result in offset weekdays...
  for (let i = 15; i <= 22; i++) {
    weekDays.push(intl.formatDateToParts(new Date(Date.UTC(2020, 2, i)), {
      weekday: 'short', timeZone: 'UTC'
    })[0].value);
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

function getAdjustedLocale(locale) {
  let adjustedLocale = locale;
  if (adjustedLocale.length === 2) {
    const regionDefault = staticRegions[adjustedLocale];
    adjustedLocale = `${adjustedLocale}-${regionDefault}`;
  }
  return adjustedLocale;
}

const propTypes = {
  dateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  exclude: PropTypes.func,
  fillParent: PropTypes.bool,
  firstFieldRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
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
  trapFocus: PropTypes.bool
};

const defaultProps = {
  dateFormat: 'MM DD YYYY',
  locale: 'en',
  onSetDate: () => null,
  exclude: () => false,
  onFocus: () => {},
  fillParent: false,
  trapFocus: true,
};

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    const { selectedDate, dateFormat } = this.props;

    this.selectedDate = dayjs();
    let cursorDate;
    if (!selectedDate) {
      cursorDate = dayjs();
    } else if (dayjs(selectedDate, dateFormat, true).isValid()) {
      if (selectedDate.isMoment) {
        this.selectedDate = dayjs(selectedDate.toISOString(), dateFormat, true);
        console.warn('Calendar component passed a MomentJS object for selected date. Migration to Dayjs is required!')
      } else {
        this.selectedDate = dayjs(selectedDate, dateFormat, true);
      }
      cursorDate = this.selectedDate;
    } else { // no pre-selected date, datestring invalid, init as 'today'.
      cursorDate = dayjs();
    }

    // if the stripes locale has no region (only 2 letters), it needs to be normalized to a
    // common form of {language}-{region} ex: "en-SE" (english spoken in Sweden)
    // We adjust it by mapping from a set of common default regions (staticRegions);
    // the first weekday in calendar rendering is derived from region.
    // Hopefully it will be implemented in browser Intl API soon..
    // but until then...

    const adjustedLocale = getAdjustedLocale(props.intl.locale || props.locale);

    this.weekDays = getWeekDays(props.intl);
    const dayOffset = getFirstWeekday(adjustedLocale);

    const base = dayjs(cursorDate);
    const month = base.month();
    const year = base.year();

    this.calendarLabel = props.intl.formatMessage({ id: 'stripes-components.Datepicker.calendar' });
    this.calendarRoledescription = props.intl.formatMessage({ id: 'stripes-components.Datepicker.calenderRole' });

    this.state = {
      cursorDate,
      date: this.selectedDate,
      month,
      year,
      calendar: getCalendar(year, month, dayOffset),
      dayOffset
    };

    this.months = getMonths(props.intl);
    this.firstWeekDay = getFirstWeekday(adjustedLocale);
    this.firstField = props.firstFieldRef || React.createRef();
    this.calendarGrid = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      dayOffset
    } = prevState;

    // When the selected date has changed, update the state with it
    let stateUpdate;
    if (nextProps.selectedDate &&
      nextProps.selectedDate !== prevState.selectedDate) {
      const moDate = dayjs(nextProps.selectedDate, nextProps.dateFormat, true);
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
            calendar: getCalendar(year, month, dayOffset),
            selectedDate: nextProps.selectedDate,
            dateFormat: nextProps.dateFormat,
          };
        }
      } else { // fix navigation issue on null or invalid date
        const fallbackDate = dayjs();
        const month = fallbackDate.month();
        const year = fallbackDate.year();
        stateUpdate = {
          date: fallbackDate,
          month,
          year,
          calendar: getCalendar(year, month, dayOffset),
          selectedDate: nextProps.selectedDate,
          dateFormat: nextProps.dateFormat,
        };
      }
    }

    if (stateUpdate) {
      const newState = prevState;
      Object.assign(newState, stateUpdate);
      newState.calendar = getCalendar(newState.year, newState.month, dayOffset);
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
    const newDate = op(curDate);
    this.updateCursorDate(newDate);
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
        newState.calendar = getCalendar(newState.year, newState.month, oldState.dayOffset);
      }
      return newState;
    }, () => {
      const { id, dateFormat: dateFormatProp } = this.props;
      const { cursorDate } = this.state;
      let dateFormat = dateFormatProp;
      if (isArray(dateFormatProp)) {
        dateFormat = dateFormatProp[0];
      }
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
    const {
      dateFormat
    } = this.props;
    const format = isArray(dateFormat) ? dateFormat[0] : dateFormat;
    if (this.props.selectedDate) {
      return day.format(format) === dayjs(this.props.selectedDate, dateFormat, true)
        .format(format);
    }
    if (this.state.date) {
      return day.format(format) ===
        dayjs(this.state.date, dateFormat, true) // eslint-disable-line new-cap
          .format(format);
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
      const { dayOffset } = curState;
      let cursorDate = '';
      if (month === this.selectedDate?.month()) {
        cursorDate = this.selectedDate;
      } else {
        cursorDate = dayjs().month(month).date(1).year(curState.year); // eslint-disable-line new-cap
      }
      return {
        month,
        calendar: getCalendar(curState.year, month, dayOffset),
        cursorDate,
      };
    });
  }

  updateYear = (e) => {
    if (e.target.value) {
      const year = e.target.value;
      if (dayjs(year, 'YYYY', true).isValid()) { // eslint-disable-line new-cap
        this.setState(curState => ({
          year,
          calendar: getCalendar(year, curState.month, curState.dayOffset),
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
      const { dayOffset } = curState;
      const newDate = curState.date[op](1, unit);
      const month = newDate.month();
      const year = newDate.year();
      return {
        date: newDate,
        month,
        year,
        calendar: getCalendar(year, month, dayOffset)
      };
    });
  }

  handleLocaleLoaded = ({ isEnglish }) => {
    const { intl, locale } = this.props;
    if (!isEnglish) {
      this.setState(cur => {
        const adjustedLocale = getAdjustedLocale(intl.locale || locale);
        const dayOffset = getFirstWeekday(adjustedLocale);
        return {
          calendar: getCalendar(cur.year, cur.month, dayOffset),
          dayOffset
        };
      });
    }
  }

  render() {
    const { id, rootRef, fillParent, trapFocus } = this.props;

    let weekCount = 0;

    const weeks = this.state.calendar.map(
      (week) => {
        weekCount += 1;
        const dayList = [];
        week.forEach((day) => { dayList.push(day); });

        const days = dayList.map(
          (day) => {
            const { month, cursorDate } = this.state;
            const { intl, exclude, dateFormat: dateFormatProp } = this.props;
            const dateFormat = isArray(dateFormatProp) ? dateFormatProp[0] : dateFormatProp;
            const dayMonth = day.month();
            const isCurrentMonth = dayMonth === month;
            const isToday = day.isSame(dayjs(), 'day');
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
              // JS months are a 0-based index, so for correctly ISO-parseable dates, 1 needs to be added.
            ).format(dayMonth + 1))
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
                {([ariaLabel]) => (
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
      <DynamicLocaleRenderer onLoaded={this.handleLocaleLoaded}>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <div
          role="application"
          aria-roledescription={this.calendarRoledescription}
          aria-label={this.calendarLabel}
          className={`${css.calendar}${fillParent ? '' : ' ' + css.maxWidth}`}
          id={`datepicker-calendar-container-${id}`}
          ref={rootRef}
          tabIndex="-1"
          onFocus={this.props.onFocus}
          onKeyDown={this.handleKeyDown}
          data-test-calendar
        >{/* eslint-disable jsx-a11y/no-noninteractive-tabindex */}
          {trapFocus && <div
            onFocus={this.focusTrap.toLast}
            tabIndex="0"
          />}
          <div className={css.calendarInner}>
            <div
              className={css.calendarHeader}
              data-test-calendar-header
            >
              <FormattedMessage id="stripes-components.goToPreviousYear">
                {([ariaLabel]) => (
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
                {([ariaLabel]) => (
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
                {([ariaLabel]) => (
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
                {([ariaLabel]) => (
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
                {([ariaLabel]) => (
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
                {([ariaLabel]) => (
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
              {([description]) => <div className="sr-only" id={`${id}-cal-description`}>{description}</div>}
            </FormattedMessage>
            <table role="presentation" ref={this.calendarGrid} onKeyDown={this.handleCalendarKeyDown}>
              <tbody>
                {weeks}
              </tbody>
            </table>
          </div>
          {trapFocus && <div onFocus={this.focusTrap.toStart} tabIndex="0" />}
          {/* eslint-enable jsx-a11y/no-noninteractive-tabindex */}
        </div>
      </DynamicLocaleRenderer>
    );
  }
}

Calendar.propTypes = propTypes;
Calendar.defaultProps = defaultProps;

export default injectIntl(Calendar);

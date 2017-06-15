import React from 'react';
import PropTypes from 'prop-types';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import moment from 'moment';
import contains from 'dom-helpers/query/contains';
import debounce from 'lodash/debounce';

import Button from '../Button';
import TextField from '../TextField';
import Calendar from './Calendar';
import Icon from '../Icon';

import css from './Calendar.css';

const propTypes = {
  onSetDate: PropTypes.func,
  screenReaderMessage: PropTypes.string,
  value: PropTypes.string,
  date: PropTypes.object,
  dateFormat: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  input: PropTypes.object,
  meta: PropTypes.object,
  id: PropTypes.string,
  onChange: PropTypes.func,
  useFocus: PropTypes.bool,
  hideOnChoose: PropTypes.bool,
  locale: PropTypes.string,
  readOnly: PropTypes.bool,
  backendDateStandard: PropTypes.string,
  showCalendar: PropTypes.bool,
  excludeDates: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]),

};

const defaultProps = {
  screenReaderMessage: '',
  hideOnChoose: true,
  useFocus: true,
  locale: 'en',
  backendDateStandard: 'ISO8601',
};

const contextTypes = {
  stripes: PropTypes.shape({
    locale: PropTypes.string.isRequired,
  }).isRequired,
}

class Datepicker extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.textfield = null;
    this.picker = null;
    this.container = null;
    this.srSpace = null;
    this.calendarButton = null;

    this.handleSetDate = this.handleSetDate.bind(this);
    this.handleFieldFocus = this.handleFieldFocus.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.clearDate = this.clearDate.bind(this);
    this.showCalendar = this.showCalendar.bind(this);
    this.handleFieldClick = this.handleFieldClick.bind(this);
    this.hideCalendar = this.hideCalendar.bind(this);
    this.dbhideCalendar = debounce(this.hideCalendar, 10);
    this.toggleCalendar = this.toggleCalendar.bind(this);
    this.handleRootClose = this.handleRootClose.bind(this);
    this.hideOnBlur = this.hideOnBlur.bind(this);
    this.standardizeDate = this.standardizeDate.bind(this);

    moment.locale(this.context.stripes.locale);
    this._dateFormat = moment.localeData()._longDateFormat.L;

    let initDate;
    let inputValue = '';
    if (!this.props.input) {
      if (this.props.value === 'today' && this.props.date === 'undefined') {
        initDate = moment();
      } else {
        initDate = this.props.date;
      }
    } else if (this.props.input.value === '') {
      initDate = '';
    } else {
      initDate = moment(this.props.input.value, this._dateFormat);
      inputValue = moment(this.props.input.value).format(this._dateFormat);
    }

    this.state = {
      date: initDate,
      dateString: inputValue,
      showCalendar: this.props.showCalendar || false,
      srMessage: '',
    };
  }

  static defaultProps = {
    screenReaderMessage: '',
    hideOnChoose: true,
    useFocus: true,
    locale: 'en',
    backendDateStandard: 'ISO8601',
  }

  handleFieldFocus() {
    if (this.props.useFocus) {
      this.showCalendar();
    }
  }

  handleFieldClick() {
    if (this.props.useFocus) {
      if (!this.state.showCalendar) {
        this.showCalendar();
      }
    }
  }

  handleRootClose() {
    // be sure that nothing in the datepicker is in focus before closing the calendar.
    if (!contains(this.container, document.activeElement)) {
      this.hideCalendar();
    }
  }

  showCalendar() {
    this.setState({
      showCalendar: true,
    });
  }

  hideCalendar() {
    this.setState({
      showCalendar: false,
    });
  }

  toggleCalendar() {
    const current = this.state.showCalendar;
    this.setState({
      showCalendar: !current,
    });
  }

  handleKeyDown(e) {
    if (this.picker) {
      const curDate = this.picker.getCursorDate();
      const formattedDate = curDate.format(this._dateFormat);
      let dateString;
      switch (e.keyCode) {
        case 40: // down
          e.preventDefault();
          dateString = this.picker.nextWeek();
          break;
        case 38: // up
          e.preventDefault();
          dateString = this.picker.previousWeek();
          break;
        case 37: // left
          dateString = this.picker.previousDay();
          break;
        case 39: // right
          dateString = this.picker.nextDay();
          break;
        case 27: // escape
          e.preventDefault();
          this.hideCalendar();
          break;
        case 34: // pgDn
          e.preventDefault();
          if (!this.state.showCalendar) { return; }
          if (!e.altKey) {
            dateString = this.picker.nextMonth();
          } else {
            dateString = this.picker.nextYear();
          }
          break;
        case 33: // pgUp
          e.preventDefault();
          if (!this.state.showCalendar) { return; }
          if (!e.altKey) {
            dateString = this.picker.previousMonth();
          } else {
            dateString = this.picker.previousYear();
          }
          break;
        case 13: // enter
          e.preventDefault();
          if (this.state.showCalendar) {
            this.handleSetDate(e, curDate, formattedDate);
          } else {
            this.showCalendar();
          }
          dateString = `${formattedDate} selected`;
          break;
        case 9: // tab
          this.hideCalendar();
          break;
        default:
      }
      this.informScreenReader(`${dateString}`);
    } else {
      switch (e.keyCode) {
        case 13: // enter
        case 40: // down
          e.preventDefault();
          this.showCalendar();
          break;
        default:
      }
    }
  }

  handleSetDate(e, date, stringDate) {
    if (e.type === 'click' || e.type === 'keydown') {
      e.preventDefault();

      if (this.props.onChange) { this.props.onChange(e); }
      this.textfield.getInput().focus();

      if (this.props.input) {
        if (moment(stringDate, this._dateFormat, true).isValid()) {
          // convert date to ISO 8601 format for backend
          const standardizedDate = this.standardizeDate(stringDate);

          // redux-form handlers take the value rather than the event...
          this.props.input.onChange(standardizedDate);
          this.props.input.onBlur(standardizedDate);
        }
      }
      if (this.props.hideOnChoose) {
        // hiding calendar is debounced to wait for focus to properly catch up.
        this.dbhideCalendar();
      }

      this.setState({ dateString: stringDate, cursorDate: date, date });
    }
    if (e.type === 'change') {
      const tempString = e.target.value;
      // be sure that value is parseable as a date in the required format...
      // the boolean parameter suppresses moment's deprecation warning,
      // preventing it from attempting a parse using independable js Date object.
      if (moment(tempString, this._dateFormat, true).isValid()) {
        const tempDate = moment(tempString, this._dateFormat);
        this.setState({
          date: tempDate,
          cursorDate: tempDate,
          dateString: e.target.value,
        });
      } else {
        // if it's not a valid date, update field value only so that
        // we can still see what we typed in the field...
        this.setState({
          dateString: e.target.value,
        });
      }
      if (this.props.onChange) { this.props.onChange(e); }
      if (this.props.input) {
        if (moment(e.target.value, this._dateFormat, true).isValid()) {
          // convert date to ISO 8601 format for backend
          const standardizedDate = this.standardizeDate(e.target.value);

          // redux-form handlers take the value rather than the event...
          this.props.input.onChange(standardizedDate);
        }
      }
      if (this.props.onSetDate) { this.props.onSetDate(); }
    }
  }

  handleFieldChange(e) {
    this.handleSetDate(e, e.target.value, e.target.value);
  }

  clearDate(e) {
    this.setState({
      dateString: '',
    });
    if (this.props.onChange) { this.props.onChange(e); }
    if (this.props.input) {
      this.props.input.onChange('');
    }
  }

  cleanForScreenReader(str) { // eslint-disable-line class-methods-use-this
    return str.replace(/Y/g, 'Y ');
  }

  informScreenReader(str) {
    this.setState({ srMessage: str });
  }

  hideOnBlur(e) {
    if (!contains(this.container, document.activeElement) &&
      document.activeElement !== document.body) {
      if (this.props.input) {
        this.props.input.onBlur(e);
      }
      this.hideCalendar();
      this.setState({ srMessage: '' });
    }
  }

  standardizeDate(date) {
    const DATE_RFC2822 = 'ddd, MM MMM YYYY HH:mm:ss ZZ';
    switch (this.props.backendDateStandard) {
      case 'ISO 8601':
      case 'ISO8601':
      case 'ISO-8601':
        return moment(date).toISOString();
      case 'RFC 2822':
      case 'RFC2822':
      case 'RFC-2822':
        return moment(date).format(DATE_RFC2822);
      default:
        return moment(date).format(this.props.backendDateStandard);
    }
  }


  render() {
    const {
      input,
      screenReaderMessage,
      label, id, readOnly,
      required,
      excludeDates,
      disabled,
    } = this.props;

    const screenReaderFormat = this.cleanForScreenReader(this._dateFormat);
    let ariaLabel;
    if (readOnly) {
      ariaLabel = `${label}`;
    } else {
      ariaLabel = `${label} format is ${screenReaderFormat} use arrow keys to navigate dates. Enter key to confirm. ${screenReaderMessage}`;
    }

    let endElement;
    if (this.state.dateString !== '') {
      endElement = (
        <div style={{ display: 'flex' }}>
          <Button
            key="clearButton"
            buttonStyle="fieldControl"
            onClick={this.clearDate}
            title="Clear field value" tabIndex="-1"
          >
            <Icon icon="closeX" />
          </Button>
          <Button
            key="calendarButton"
            buttonStyle="fieldControl"
            onClick={this.toggleCalendar}
            onKeyDown={this.handleKeyDown}
            title="Show/hide datepicker"
            ref={(ref) => { this.calendarButton = ref; }}
            tabIndex="-1"
          >
            <Icon icon="calendar" />
          </Button>
        </div>

      );
    } else {
      endElement = (
        <Button
          key="calendarButton"
          buttonStyle="fieldControl"
          onClick={this.toggleCalendar}
          onKeyDown={this.handleKeyDown}
          title="Show/hide datepicker"
          ref={(ref) => { this.calendarButton = ref; }}
          tabIndex="-1"
        >
          <Icon icon="calendar" />
        </Button>
      );
    }

    let textfield;
    if (this.props.input && this.props.meta) {
      textfield = (
        <TextField
          ref={(ref) => { this.textfield = ref; }}
          input={input}
          value={this.state.dateString}
          label={label}
          aria-label={ariaLabel}
          endControl={!readOnly ? endElement : null}
          placeholder={` ${this._dateFormat}`}
          onKeyDown={!readOnly ? this.handleKeyDown : null}
          onClick={!readOnly ? this.handleFieldClick : null}
          onFocus={!readOnly ? this.handleFieldFocus : null}
          onBlur={this.hideOnBlur}
          meta={this.props.meta}
          onChange={this.handleFieldChange}
          readOnly={readOnly}
          disabled={disabled}
          id={id}
          required={required}
        />
      );
    } else {
      textfield = (
        <TextField
          ref={(ref) => { this.textfield = ref; }}
          label={label}
          value={this.state.dateString}
          onChange={this.handleSetDate}
          aria-label={ariaLabel}
          endControl={!readOnly ? endElement : null}
          placeholder={` ${this._dateFormat}`}
          onKeyDown={!readOnly ? this.handleKeyDown : null}
          onBlur={this.hideCalendar}
          onClick={!readOnly ? this.handleFieldClick : null}
          onFocus={!readOnly ? this.handleFieldFocus : null}
          readOnly={readOnly}
          disabled={disabled}
          id={id}
          required={required}
        />
      );
    }


    return (
      <div style={{ position: 'relative', width: '100%' }} ref={(ref) => { this.container = ref; }}>

        <div aria-live="assertive" aria-relevant="additions" className={css.srOnly} ref={(ref) => { this.srSpace = ref; }}>
          <div>{this.state.srMessage}</div>
        </div>


        {textfield}

        {this.state.showCalendar &&
          <RootCloseWrapper onRootClose={this.handleRootClose} >
            <Calendar
              onSetDate={this.handleSetDate}
              selectedDate={this.state.dateString}
              dateFormat={this._dateFormat}
              ref={(ref) => { this.picker = ref; }}
              onKeyDown={this.handleKeyDown}
              onBlur={this.hideCalendar}
              locale={this.props.locale}
              excludeDates={excludeDates}
              buttonFocus={this.focusTextfield}
              onNavigation={this.handleDateNavigation}
            />
          </RootCloseWrapper>
        }

      </div>

    );
  }
}

Datepicker.propTypes = propTypes;
Datepicker.contextTypes = contextTypes;
Datepicker.defaultProps = defaultProps;

export default Datepicker;

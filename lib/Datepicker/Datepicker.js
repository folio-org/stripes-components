import React from 'react';
import { intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import moment from 'moment-timezone';
import contains from 'dom-helpers/query/contains';
import debounce from 'lodash/debounce';
import uniqueId from 'lodash/uniqueId';
import { withStripes } from '@folio/stripes-core/src/StripesContext';

import injectIntl from '../InjectIntl';
import Button from '../Button';
import TextField from '../TextField';
import Calendar from './Calendar';
import Icon from '../Icon';
import css from './Calendar.css';

const propTypes = {
  autoFocus: PropTypes.bool,
  backendDateStandard: PropTypes.string,
  date: PropTypes.object,
  dateFormat: PropTypes.string,
  disabled: PropTypes.bool,
  excludeDates: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]),
  hideOnChoose: PropTypes.bool,
  id: PropTypes.string,
  ignoreLocalOffset: PropTypes.bool,
  input: PropTypes.object,
  intl: intlShape.isRequired,
  label: PropTypes.string,
  locale: PropTypes.string,
  meta: PropTypes.object,
  onChange: PropTypes.func,
  onSetDate: PropTypes.func,
  passThroughValue: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  screenReaderMessage: PropTypes.string,
  showCalendar: PropTypes.bool,
  stripes: PropTypes.shape({
    timezone: PropTypes.string
  }),
  tether: PropTypes.object,
  timeZone: PropTypes.string,
  useFocus: PropTypes.bool,
  value: PropTypes.string,
};

const defaultProps = {
  autoFocus: false,
  backendDateStandard: 'ISO8601',
  hideOnChoose: true,
  screenReaderMessage: '',
  tether: {
    attachment: 'top center',
    renderElementTo: null,
    targetAttachment: 'bottom center',
    optimizations: {
      gpu: false,
    },
    constraints: [{
      to: 'window',
      attachment: 'together',
    },
    {
      to: 'scrollParent',
      pin: true,
    },
    ],
  },
  useFocus: true,
};

class Datepicker extends React.Component {
  constructor(props) {
    super(props);

    this.textfield = React.createRef();
    this.picker = null;
    this.container = null;
    this.srSpace = null;

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
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.datePickerIsFocused = this.datePickerIsFocused.bind(this);
    this.getPresentedValue = this.getPresentedValue.bind(this);

    // Set time zone
    if (props.timeZone) {
      this.timeZone = props.timeZone;
    } else if (props.stripes) {
      this.timeZone = props.stripes.timezone;
    } else {
      this.timeZone = 'UTC';
    }
    const parseTimeZone = props.ignoreLocalOffset ? 'UTC' : this.timeZone;

    // Set locale
    if (props.locale) {
      this.locale = props.locale;
    } else {
      this.locale = props.intl.locale;
    }
    moment.locale(this.locale);
    this._dateFormat = moment.localeData()._longDateFormat.L;

    // non-null presentedValue will eventually be rendered as the value of the TextField.
    let inputValue = '';
    let presentedValue = null;

    // if we aren't using redux form...
    if (typeof this.props.input === 'undefined') {
      if (this.props.value === this.props.passThroughValue && typeof this.props.date === 'undefined') {
        presentedValue = this.props.passThroughValue;
        inputValue = moment.tz(parseTimeZone).format(this._dateFormat);
      }
      // if we are using redux-form...
    } else if (this.props.input.value === this.props.passThroughValue) {
      presentedValue = this.props.passThroughValue;
      inputValue = moment.tz(parseTimeZone).format(this._dateFormat);
    } else if (this.props.input.value !== '') {
      inputValue = moment.tz(this.props.input.value, parseTimeZone).format(this._dateFormat);
    }

    this.state = {
      presentedValue,
      dateString: inputValue,
      showCalendar: this.props.showCalendar || false,
      srMessage: '',
      parseTimeZone,
      _dateFormat: this._dateFormat,
      input: this.props.input,
    };

    if (props.id) {
      this.testId = props.id;
    } else {
      this.testId = uniqueId('dp-');
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // When the selected date has changed, update the state with it
    let inputValue;
    let presentedValue = null;
    const _dateFormat = prevState._dateFormat;
    if (nextProps.input) {
      if (nextProps.input.value !== '' && nextProps.input.value !== prevState.input.value) {
        const passRE = new RegExp(`^${nextProps.input.value}`, 'i');
        if (nextProps.input.value === prevState.passThroughValue || passRE.test(prevState.passThroughValue)) {
          presentedValue = nextProps.input.value;
          inputValue = moment.tz(prevState.parseTimeZone).format(_dateFormat);
        } else {
          inputValue = moment.tz(nextProps.input.value, prevState.parseTimeZone).format(_dateFormat);
        }
        return {
          presentedValue,
          dateString: inputValue,
          input: nextProps.input,
          passThroughValue: nextProps.passThroughValue,
        };
      } else if (nextProps.input.value === '' && nextProps.input.value !== prevState.input.value) {
        inputValue = '';
        return {
          presentedValue,
          dateString: inputValue,
          input: nextProps.input,
          passThroughValue: nextProps.passThroughValue,
        };
      }
    } else if (prevState.value !== '' && prevState.date !== nextProps.date) {
      if (nextProps.value === this.props.passThroughValue && nextProps.date === 'undefined') {
        inputValue = moment.tz(prevState.parseTimeZone).format(_dateFormat);
        presentedValue = this.props.passThroughValue;
      } else {
        inputValue = moment.tz(prevState.parseTimeZone).format(_dateFormat);
      }
      return {
        presentedValue,
        dateString: inputValue,
        value: nextProps.value,
        date: nextProps.date,
      };
    }
    return null;
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

  handleRootClose(e) {
    // used by <RootCloseWrapper> to determine whether or not it should hide the picker.
    // it should determine that the element that's focused is outside of the datepicker's containing div and
    // the calendar widget (this.picker).
    if (!contains(this.container, e.target)) {
      if (!this.datePickerIsFocused()) {
        this.hideCalendar();
      }
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
          dateString = this.props.intl.formatMessage(
            { id: 'stripes-components.dateSelected' },
            { date: formattedDate }
          );
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
      this.textfield.current.getInput().focus();

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

      this.setState({ dateString: stringDate });
    }
    if (e.type === 'change') {
      const tempString = e.target.value;
      // be sure that value is parseable as a date in the required format...
      // the boolean parameter suppresses moment's deprecation warning,
      // preventing it from attempting a parse using independable js Date object.
      if (moment(tempString, this._dateFormat, true).isValid()) {
        this.setState({
          presentedValue: null,
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
    if (e.target.value === '') {
      this.clearDate();
    } else {
      const ptREx = new RegExp(`^${e.target.value}`, 'i');
      if (ptREx.test(this.props.passThroughValue)) {
        if (this.props.onChange) { this.props.onChange(e); }
        if (this.props.input) {
          this.props.input.onChange(e.target.value);
        }
        this.setState({
          presentedValue: e.target.value,
        });
      } else {
        this.handleSetDate(e, e.target.value, e.target.value);
      }
    }
  }

  clearDate(e) {
    this.setState({
      presentedValue: null,
      dateString: '',
    });
    if (this.props.onChange) { this.props.onChange(e); }
    if (this.props.input) {
      this.props.input.onChange('');
    }
  }

  cleanForScreenReader(str) {
    return str.replace(/Y/g, 'Y ');
  }

  informScreenReader(str) {
    this.setState({ srMessage: str });
  }

  datePickerIsFocused() {
    if (contains(this.container, document.activeElement) &&
      document.activeElement !== document.body) {
      if (this.picker) {
        if (contains(this.picker.getDOMContainer(), document.activeElement)) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  hideOnBlur(e) {
    if (this.datePickerIsFocused()) {
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
        return moment.tz(date, this._dateFormat, true, this.timeZone).toISOString();
      case 'RFC 2822':
      case 'RFC2822':
      case 'RFC-2822':
        return moment.tz(date, this._dateFormat, true, this.timeZone).format(DATE_RFC2822);
      default:
        return moment.tz(date, this._dateFormat, true, this.timeZone).format(this.props.backendDateStandard);
    }
  }

  getPresentedValue() {
    if (this.state.presentedValue !== null) {
      return this.state.presentedValue;
    }
    return this.state.dateString;
  }

  render() {
    const {
      input,
      screenReaderMessage,
      label, id, readOnly,
      required,
      excludeDates,
      disabled,
      autoFocus,
      tether,
      intl
    } = this.props;

    const screenReaderFormat = this.cleanForScreenReader(this._dateFormat);
    const mergedTetherProps = Object.assign({}, Datepicker.defaultProps.tether, tether);

    let ariaLabel;
    if (readOnly) {
      ariaLabel = `${label}`;
    } else {
      ariaLabel = intl.formatMessage(
        { id: 'stripes-components.screenReaderLabel' },
        { label, screenReaderFormat, screenReaderMessage }
      );
    }

    let endElement;
    if (this.state.dateString !== '') {
      endElement = (
        <div style={{ display: 'flex' }}>
          <Button
            key="clearButton"
            buttonStyle="fieldControl"
            onClick={this.clearDate}
            aria-label={intl.formatMessage({ id: 'stripes-components.clearFieldValue' })}
            id={`datepicker-clear-button-${id}`}
            tabIndex="-1"
          >
            <Icon icon="clearX" />
          </Button>
          <Button
            key="calendarButton"
            buttonStyle="fieldControl"
            onClick={this.toggleCalendar}
            onKeyDown={this.handleKeyDown}
            aria-label={intl.formatMessage({ id: 'stripes-components.showOrHideDatepicker' })}
            id={`datepicker-toggle-calendar-button-${id}`}
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
          aria-label={intl.formatMessage({ id: 'stripes-components.showOrHideDatepicker' })}
          id={`datepicker-toggle-calendar-button-${id}`}
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
          ref={this.textfield}
          input={input}
          value={this.getPresentedValue()}
          label={label}
          aria-label={ariaLabel}
          endControl={!readOnly ? endElement : null}
          placeholder={`${this._dateFormat}`}
          onKeyDown={!readOnly ? this.handleKeyDown : null}
          onClick={!readOnly ? this.handleFieldClick : null}
          onFocus={!readOnly ? this.handleFieldFocus : null}
          onBlur={this.hideOnBlur}
          meta={this.props.meta}
          onChange={this.handleFieldChange}
          readOnly={readOnly}
          disabled={disabled}
          id={this.testId}
          required={required}
          hasClearIcon={false}
          autoComplete="off"
          autoFocus={autoFocus}
        />
      );
    } else {
      textfield = (
        <TextField
          ref={this.textfield}
          label={label}
          value={this.getPresentedValue()}
          onChange={this.handleSetDate}
          aria-label={ariaLabel}
          endControl={!readOnly ? endElement : null}
          placeholder={`${this._dateFormat}`}
          onKeyDown={!readOnly ? this.handleKeyDown : null}
          onBlur={this.hideOnBlur}
          onClick={!readOnly ? this.handleFieldClick : null}
          onFocus={!readOnly ? this.handleFieldFocus : null}
          readOnly={readOnly}
          disabled={disabled}
          id={this.testId}
          required={required}
          hasClearIcon={false}
          autoComplete="off"
          autoFocus={autoFocus}
        />
      );
    }

    return (
      <TetherComponent {...mergedTetherProps}>
        <div style={{ position: 'relative', width: '100%' }} ref={(ref) => { this.container = ref; }}>
          <div
            aria-live="assertive"
            aria-relevant="additions"
            className={css.srOnly}
            ref={(ref) => { this.srSpace = ref; }}
          >
            <div>{this.state.srMessage}</div>
          </div>
          {textfield}
        </div>

        {this.state.showCalendar &&
          <RootCloseWrapper onRootClose={this.handleRootClose} >
            <Calendar
              onSetDate={this.handleSetDate}
              selectedDate={this.state.dateString}
              dateFormat={this._dateFormat}
              ref={(ref) => { this.picker = ref; }}
              onKeyDown={this.handleKeyDown}
              onBlur={this.hideCalendar}
              locale={this.locale}
              excludeDates={excludeDates}
              onNavigation={this.handleDateNavigation}
              id={this.testId}
            />
          </RootCloseWrapper>
        }
      </TetherComponent>
    );
  }
}

Datepicker.propTypes = propTypes;
Datepicker.defaultProps = defaultProps;

export default withStripes(injectIntl(Datepicker));

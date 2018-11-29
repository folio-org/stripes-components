import React, { Fragment } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import moment from 'moment-timezone';
import contains from 'dom-helpers/query/contains';
import debounce from 'lodash/debounce';
import uniqueId from 'lodash/uniqueId';

import IconButton from '../IconButton';
import TextField from '../TextField';
import Calendar from './Calendar';
import css from './Calendar.css';

const propTypes = {
  autoFocus: PropTypes.bool,
  backendDateStandard: PropTypes.string,
  date: PropTypes.object,
  dateFormat: PropTypes.string,
  disabled: PropTypes.bool,
  exclude: PropTypes.func,
  hideOnChoose: PropTypes.bool,
  id: PropTypes.string,
  input: PropTypes.object,
  label: PropTypes.node,
  locale: PropTypes.string,
  meta: PropTypes.object,
  onChange: PropTypes.func,
  onSetDate: PropTypes.func,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  screenReaderMessage: PropTypes.string,
  showCalendar: PropTypes.bool,
  tether: PropTypes.object,
  timeZone: PropTypes.string,
  useFocus: PropTypes.bool,
  value: PropTypes.string,
};

const contextTypes = {
  intl: intlShape
};

const defaultProps = {
  autoFocus: false,
  backendDateStandard: 'ISO8601',
  hideOnChoose: true,
  screenReaderMessage: '',
  tether: {
    attachment: 'top center',
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
  static propTypes = propTypes;
  static contextTypes = contextTypes;
  static defaultProps = defaultProps;

  constructor(props, context) {
    super(props);

    this.picker = null;
    this.container = null;
    this.srSpace = null;

    this.dbhideCalendar = debounce(this.hideCalendar, 10);

    // Set time zone
    this.timeZone = props.timeZone || context.intl.timeZone;
    const parseTimeZone = this.timeZone;

    this.locale = props.locale || context.intl.locale;

    moment.locale(this.locale);

    if (this.props.dateFormat) {
      this._dateFormat = this.props.dateFormat;
    } else {
      this._dateFormat = moment.localeData()._longDateFormat.L;
    }

    // non-null presentedValue will eventually be rendered as the value of the TextField.
    let inputValue = '';
    let presentedValue = null;

    // if we aren't using redux form...
    if ((typeof this.props.input === 'undefined' && typeof this.props.date === 'undefined')
      || this.props.input.value === '') {
      presentedValue = '';
      inputValue = moment.tz(parseTimeZone).format(this._dateFormat);
    } else if (this.props.input.value !== '') {
      inputValue = moment(this.props.input.value, this._dateFormat)
        .tz(parseTimeZone)
        .format(this._dateFormat);
      presentedValue = inputValue;
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
    const _dateFormat = prevState._dateFormat;
    if (nextProps.input) {
      if (nextProps.input.value !== '' && nextProps.input.value !== prevState.input.value) {
        inputValue = moment.tz(nextProps.input.value, prevState.parseTimeZone).format(_dateFormat);
        return {
          presentedValue: inputValue,
          dateString: inputValue,
          input: nextProps.input
        };
      } else if (nextProps.input.value === '' && nextProps.input.value !== prevState.input.value) {
        inputValue = '';
        return {
          presentedValue: '',
          dateString: inputValue,
          input: nextProps.input
        };
      }
    } else if (prevState.value !== '' && prevState.date !== nextProps.date) {
      inputValue = moment.tz(prevState.parseTimeZone).format(_dateFormat);
      return {
        dateString: inputValue,
        value: nextProps.value,
        date: nextProps.date,
      };
    }
    return null;
  }

  textfield = React.createRef();

  handleFieldFocus = () => {
    if (this.props.useFocus && !this.props.disabled) {
      this.showCalendar();
    }
  }

  handleFieldClick = () => {
    if (this.props.useFocus) {
      if (!this.state.showCalendar) {
        this.showCalendar();
      }
    }
  }

  handleRootClose = (e) => {
    // used by <RootCloseWrapper> to determine whether or not it should hide the picker.
    // it should determine that the element that's focused is outside of the datepicker's containing div and
    // the calendar widget (this.picker).
    if (!contains(this.container, e.target)) {
      if (!this.datePickerIsFocused()) {
        this.hideCalendar();
      }
    }
  }

  showCalendar = () => {
    this.setState({
      showCalendar: true,
    });
  }

  hideCalendar = () => {
    this.setState({
      showCalendar: false,
    });
  }

  toggleCalendar = () => {
    const current = this.state.showCalendar;
    this.setState({
      showCalendar: !current,
    });
  }

  handleKeyDown = (e) => {
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
          dateString = (
            <FormattedMessage
              id="stripes-components.dateSelected"
              values={{ date: formattedDate }}
            />
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

  handleSetDate = (e, date, stringDate) => {
    if (e.type === 'click' || e.type === 'keydown') {
      e.preventDefault();

      if (this.props.onChange) { this.props.onChange(e); }
      this.textfield.current.getInput().focus();

      if (this.props.input) {
        if (moment(stringDate, this._dateFormat, true).isValid()) {
          // convert date to ISO 8601 format for backend
          const standardizedDate = this.standardizeDate(stringDate);
          // redux-form handlers take the value rather than the event...
          if (this.props.input.onChange) {
            this.props.input.onChange(standardizedDate);
          }
          if (this.props.input.onBlur) {
            this.props.input.onBlur(standardizedDate);
          }
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
          if (this.props.input.onChange) {
            this.props.input.onChange(standardizedDate);
          }
        }
      }
      if (this.props.onSetDate) { this.props.onSetDate(); }
    }
  }

  handleFieldChange = (e) => {
    if (e.target.value === '') {
      this.clearDate();
    } else {
      this.handleSetDate(e, e.target.value, e.target.value);
    }
  }

  clearDate = (e) => {
    this.setState({
      presentedValue: null,
      dateString: '',
    });
    if (this.props.onChange) { this.props.onChange(e); }
    if (this.props.input.onChange) {
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
        return (contains(this.picker.getDOMContainer(), document.activeElement));
      }
      return true;
    }
    return false;
  }

  hideOnBlur = (e) => {
    if (this.datePickerIsFocused()) {
      if (this.props.input.onBlur) {
        this.props.input.onBlur(e);
      }
      this.hideCalendar();
      this.setState({ srMessage: '' });
    }
  }

  standardizeDate(date) {
    const DATE_RFC2822 = 'ddd, MM MMM YYYY HH:mm:ss ZZ';
    const { backendDateStandard } = this.props;
    const parsed = moment.tz(date, this._dateFormat, true, this.timeZone);

    if (/8601/.test(backendDateStandard)) {
      return parsed.toISOString();
    }

    if (/2822/.test(backendDateStandard)) {
      return parsed.format(DATE_RFC2822);
    }

    return parsed.format(this.props.backendDateStandard);
  }

  getPresentedValue() {
    if (this.state.presentedValue !== null) {
      return this.state.presentedValue;
    }
    return this.state.dateString;
  }

  renderCalendar() {
    const { exclude } = this.props;

    return (
      <RootCloseWrapper onRootClose={this.handleRootClose}>
        <Calendar
          onSetDate={this.handleSetDate}
          selectedDate={this.state.dateString}
          dateFormat={this._dateFormat}
          ref={(ref) => { this.picker = ref; }}
          onKeyDown={this.handleKeyDown}
          onBlur={this.hideCalendar}
          locale={this.locale}
          exclude={exclude}
          id={this.testId}
        />
      </RootCloseWrapper>
    );
  }

  renderEndElement() {
    return (
      <Fragment>
        { this.state.dateString !== '' && (
          <FormattedMessage id="stripes-components.clearFieldValue">
            {ariaLabel => (
              <IconButton
                data-test-clear
                key="clearButton"
                onClick={this.clearDate}
                aria-label={ariaLabel}
                id={`datepicker-clear-button-${this.testId}`}
                tabIndex="-1"
                icon="times-circle-solid"
              />
            )}
          </FormattedMessage>
        )}
        <FormattedMessage id="stripes-components.showOrHideDatepicker">
          {ariaLabel => (
            <IconButton
              data-test-calendar-button
              onClick={this.toggleCalendar}
              onKeyDown={this.handleKeyDown}
              aria-label={ariaLabel}
              id={`datepicker-toggle-calendar-button-${this.testId}`}
              tabIndex="-1"
              icon="calendar"
            />
          )}
        </FormattedMessage>
      </Fragment>
    );
  }

  renderInput() {
    const {
      input,
      screenReaderMessage,
      label,
      readOnly,
      required,
      disabled,
      autoFocus
    } = this.props;

    const screenReaderFormat = this.cleanForScreenReader(this._dateFormat);

    let ariaLabel;
    if (readOnly || disabled) {
      ariaLabel = `${label}`;
    } else {
      ariaLabel = (
        <FormattedMessage
          id="stripes-components.screenReaderLabel"
          values={{ label, screenReaderFormat, screenReaderMessage }}
        />
      );
    }

    let textfieldProps = {
      label,
      readOnly,
      disabled,
      required,
      autoFocus,
      'id': this.testId,
      'ref': this.textfield,
      'onChange': this.handleSetDate,
      'value': this.getPresentedValue(),
      'aria-label': ariaLabel,
      'placeholder': `${this._dateFormat}`,
      'onBlur': this.hideOnBlur,
      'hasClearIcon': false,
      'autoComplete': 'off',
    };

    if (!readOnly && !disabled) {
      textfieldProps = {
        ...textfieldProps,
        endControl: this.renderEndElement(),
        onKeyDown: this.handleKeyDown,
        onClick: this.handleFieldClick,
        onFocus: this.handleFieldFocus
      };
    }

    if (this.props.input && this.props.meta) {
      textfieldProps = {
        ...textfieldProps,
        meta: this.props.meta,
        input : { ...input, value: this.getPresentedValue() },
        onChange: this.handleFieldChange
      };
    }

    return <TextField {...textfieldProps} />;
  }

  render() {
    return (
      <TetherComponent {...defaultProps.tether} {...this.props.tether}>
        <div style={{ position: 'relative', width: '100%' }} ref={(ref) => { this.container = ref; }}>
          <div
            aria-live="assertive"
            aria-relevant="additions"
            className={css.srOnly}
            ref={(ref) => { this.srSpace = ref; }}
          >
            <div>{this.state.srMessage}</div>
          </div>
          {this.renderInput()}
        </div>
        {this.state.showCalendar && this.renderCalendar()}
      </TetherComponent>
    );
  }
}

export default Datepicker;

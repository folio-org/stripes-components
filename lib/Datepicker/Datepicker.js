import React, { Fragment } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import moment from 'moment-timezone';
import contains from 'dom-helpers/query/contains';
import debounce from 'lodash/debounce';
import uniqueId from 'lodash/uniqueId';
import noop from 'lodash/noop';

import IconButton from '../IconButton';
import TextField from '../TextField';
import Calendar from './Calendar';
import css from './Calendar.css';

const defaultParser = (value, timeZone, dateFormat) => {
  if (!value || value === '') { return value; }

  const offsetRegex = /T[\d.:]+[+-][\d]+$/;
  let inputMoment;
  // if date string contains a utc offset, we can parse it as utc time and convert it to selected timezone.
  if (offsetRegex.test(value)) {
    inputMoment = moment.tz(value, timeZone);
  } else {
    inputMoment = moment.tz(value, dateFormat, timeZone);
  }
  const inputValue = inputMoment.format(dateFormat);
  return inputValue;
};

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
  inputRef: PropTypes.object,
  label: PropTypes.node,
  locale: PropTypes.string,
  meta: PropTypes.object,
  onChange: PropTypes.func,
  onSetDate: PropTypes.func,
  parser: PropTypes.func,
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
  parser: defaultParser,
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
    this.textfield = props.inputRef || React.createRef();
    this.hiddenInput = React.createRef();

    this.dbhideCalendar = debounce(this.hideCalendar, 10);

    const timeZone = props.timeZone || context.intl.timeZone;
    const locale = props.locale || context.intl.locale;
    moment.locale(locale);

    const dateFormat = props.dateFormat || moment.localeData()._longDateFormat.L;

    this.state = {
      dateString: '',
      showCalendar: this.props.showCalendar || false,
      srMessage: '',
      dateFormat,
      timeZone,
      prevValue: '',
      locale,
    };

    if (props.id) {
      this.testId = props.id;
    } else {
      this.testId = uniqueId('dp-');
    }
  }

  /* gDSFP handles instances where the value is transitioning from an empty string
  * to some value.
  */
  static getDerivedStateFromProps(props, state) {
    if (!state.prevValue) {
      const timeZone = props.timeZone || state.timeZone;
      const dateFormat = props.dateFormat || state.dateFormat;

      let inputValue = '';
      if (!props.input && !props.date) {
        inputValue = props.parser(props.value, timeZone, dateFormat, state.locale);
      } else {
        inputValue = props.parser(props.input.value, timeZone, dateFormat, state.locale);
      }
      return {
        dateString: inputValue,
        prevValue: props.input ? props.input.value : props.value,
        hiddenValue: props.input ? props.input.value : '',
      };
    }

    return null;
  }

  componentDidUpdate() {
    const {
      input,
      onChange
    } = this.props;

    const {
      changeType,
    } = this.state;

    if (changeType && changeType !== 'invalid') {
      const baseEvent = {
        stopPropagation: noop,
        preventDefault: noop
      };

      if (input && this.hiddenInput.current) {
        input.onChange(
          Object.assign({}, baseEvent, { target: this.hiddenInput.current })
        );
      } else if (onChange && this.textfield.current) {
        onChange(
          Object.assign({}, baseEvent, { target: this.textfield.current })
        );
      }
      this.internalSetState({ changeType: undefined });
    }
  }

  textfield = React.createRef();

  handleFieldFocus = () => {
    console.log('field focus');
    if (this.props.useFocus && !this.props.disabled) {
      this.showCalendar();
    }
  }

  handleFieldClick = () => {
    console.log('field click');
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
    this.setState(current => ({
      showCalendar: !current.showCalendar,
    }));
  }

  handleKeyDown = (e) => {
    if (this.picker) {
      const curDate = this.picker.getCursorDate();
      const formattedDate = curDate.format(this.state.dateFormat);
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

  internalSetState = (state, changeType, callbacks) => {
    this.setState(curState => {
      return Object.assign({}, curState, state, { changeType });
    },
    () => {
      if (callbacks) {
        callbacks.forEach((cb) => {
          cb(this.state);
        });
      }
    });
  }

  handleSetDate = (e, date, stringDate) => {
    const isValidDate = moment(stringDate, this.state.dateFormat, true).isValid();
    let standardizedDate;

    if (e.type === 'click' || e.type === 'keydown') {
      e.preventDefault();
      this.textfield.current.focus();

      if (isValidDate) {
        // convert date to ISO 8601 format for backend
        standardizedDate = this.standardizeDate(stringDate);

        // handlers take the value rather than the event...
        this.internalSetState(
          {
            dateString: stringDate,
            hiddenValue: standardizedDate,
            prevValue: stringDate,
          },
          'calendar',
          [this.dbhideCalendar]
        );
      }
    } else if (e.type === 'change') {
      const tempString = e.target.value;
      // be sure that value is parseable as a date in the required format...
      // the boolean parameter suppresses moment's deprecation warning,
      // preventing it from attempting a parse using independable js Date object.
      if (moment(tempString, this.state.dateFormat, true).isValid()) {
        standardizedDate = this.standardizeDate(e.target.value);
        this.internalSetState(
          {
            dateString: e.target.value,
            hiddenValue: standardizedDate,
            prevValue: e.target.value,
          },
          'validEntry',
        );
      } else {
        // if it's not a valid date, update field value only so that
        // we can still see what we typed in the field...
        this.internalSetState(
          {
            dateString: e.target.value,
            hiddenValue: '',
          },
          'invalid'
        );
      }
    }
  }

  handleFieldChange = (e) => {
    if (e.target.value === '') {
      this.clearDate();
    } else {
      this.handleSetDate(e, e.target.value, e.target.value);
    }
  }

  clearDate = () => {
    this.internalSetState(
      {
        dateString: '',
        hiddenValue: '',
      },
      'clear',
    );
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
    const {
      input
    } = this.props;

    if (this.datePickerIsFocused()) {
      if (input && input.onBlur) {
        input.onBlur(e);
      }
      this.hideCalendar();
      this.setState({ srMessage: '' });
    }
  }

  standardizeDate(date) {
    const DATE_RFC2822 = 'ddd, MM MMM YYYY HH:mm:ss ZZ';
    const { backendDateStandard } = this.props;
    const parsed = moment.tz(date, this.state.dateFormat, this.state.timeZone);

    if (/8601/.test(backendDateStandard)) {
      return parsed.toISOString();
    }

    if (/2822/.test(backendDateStandard)) {
      return parsed.format(DATE_RFC2822);
    }

    return parsed.format(this.props.backendDateStandard);
  }

  renderCalendar() {
    const { exclude } = this.props;

    return (
      <RootCloseWrapper onRootClose={this.handleRootClose}>
        <Calendar
          onSetDate={this.handleSetDate}
          selectedDate={this.state.dateString}
          dateFormat={this.state.dateFormat}
          ref={(ref) => { this.picker = ref; }}
          onKeyDown={this.handleKeyDown}
          onBlur={this.hideCalendar}
          locale={this.state.locale}
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
              onKeyDown={this.handleKeyDown}
              onClick={this.toggleCalendar}
              onFocus={(e) => { e.stopPropagation(); }}
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

    const {
      dateFormat,
    } = this.state;

    const screenReaderFormat = this.cleanForScreenReader(this.state.dateFormat);

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
      'inputRef': this.textfield,
      'onChange': this.handleSetDate,
      'value': this.state.dateString,
      'aria-label': ariaLabel,
      'placeholder': `${dateFormat}`,
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
        input : { ...input, value: this.state.dateString },
        onChange: this.handleFieldChange,
        onBlur: (e) => { input.onBlur(); e.preventDefault(); }
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
          <input type="hidden" hidden value={this.state.hiddenValue} ref={this.hiddenInput} />
        </div>
        {this.state.showCalendar && this.renderCalendar()}
      </TetherComponent>
    );
  }
}

export default Datepicker;

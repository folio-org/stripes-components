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
import TimeDropdown from './TimeDropdown';
import Icon from '../Icon';
import css from './TimeDropdown.css';

const propTypes = {
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  input: PropTypes.object,
  intl: intlShape.isRequired,
  label: PropTypes.string,
  locale: PropTypes.string,
  meta: PropTypes.object,
  onChange: PropTypes.func,
  passThroughValue: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  screenReaderMessage: PropTypes.string,
  showTimepicker: PropTypes.bool,
  stripes: PropTypes.shape({
    timezone: PropTypes.string,
  }),
  tether: PropTypes.object,
  timeZone: PropTypes.string,
  value: PropTypes.string,
};

const defaultProps = {
  autoFocus: false,
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
};

class Timepicker extends React.Component {
  constructor(props) {
    super(props);

    this.textfield = React.createRef();
    this.picker = null;
    this.container = null;
    this.srSpace = null;

    this.handleSetTime = this.handleSetTime.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.clearTime = this.clearTime.bind(this);
    this.showTimepicker = this.showTimepicker.bind(this);
    this.handleFieldClick = this.handleFieldClick.bind(this);
    this.hideTimepicker = this.hideTimepicker.bind(this);
    this.dbhideTimepicker = debounce(this.hideTimepicker, 10);
    this.toggleTimepicker = this.toggleTimepicker.bind(this);
    this.handleRootClose = this.handleRootClose.bind(this);
    this.hideOnBlur = this.hideOnBlur.bind(this);
    this.standardizeTime = this.standardizeTime.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.pickerIsFocused = this.pickerIsFocused.bind(this);
    this.handlePickTime = this.handlePickTime.bind(this);
    this.deriveHoursFormat = this.deriveHoursFormat.bind(this);
    this.getPresentationValue = this.getPresentationValue.bind(this);
    this.getLocalTime = this.getLocalTime.bind(this);

    // Set time zone
    if (props.timeZone) {
      this.timeZone = props.timeZone;
    } else if (props.stripes) {
      this.timeZone = props.stripes.timezone;
    } else {
      this.timeZone = 'UTC';
    }

    // Set locale
    if (props.locale) {
      this.locale = props.locale;
    } else {
      this.locale = props.intl.locale;
    }
    moment.locale(this.locale);
    this._timeFormat = moment.localeData()._longDateFormat.LT;

    // inputValue will eventually be rendered as the value of the TextField.
    let inputValue = '';
    let presentedValue = null;
    // if we aren't using redux form...
    if (typeof this.props.input !== 'undefined') {
      if (this.props.input.value !== '') {
        if (this.props.input.value === this.props.passThroughValue) {
          presentedValue = this.props.passThroughValue;
          inputValue = moment.tz(this.timeZone).format(this._timeFormat);
        } else {
          inputValue = moment.tz(this.props.input.value, this._timeFormat, this.timeZone).format(this._timeFormat);
        }
      }
    } else if (this.props.value === this.props.passThroughValue) {
      presentedValue = this.props.passThroughValue;
      inputValue = moment.tz(this.timeZone).format(this._timeFormat);
    } else {
      inputValue = moment(this.props.value, this._timeFormat, this.timeZone).format(this._timeFormat);
    }

    this.state = {
      presentedValue,
      timeString: inputValue,
      showTimepicker: this.props.showTimepicker || false,
      timeFormat: this._timeFormat,
      srMessage: '',
    };

    if (props.id) {
      this.testId = props.id;
    } else {
      this.testId = uniqueId('timepick-');
    }
  }

  componentWillReceiveProps(nextProps) { // eslint-disable-line react/no-deprecated
    let inputValue;
    let presentedValue = null;
    if (nextProps.input) { // if we're using redux-form....
      // if value has changed....
      if (nextProps.input.value !== '' && nextProps.input.value !== this.props.input.value) {
        if (nextProps.input.value === nextProps.passThroughValue) {
          presentedValue = nextProps.passThroughValue;
          inputValue = moment.tz(this.timeZone).format(this._timeFormat);
          this.setState({
            presentedValue,
            timeString: inputValue,
          });
        }
        // if value is blank....
      } else if (nextProps.input.value === '' && nextProps.input.value !== this.props.input.value) {
        inputValue = '';
        this.setState({
          presentedValue,
          timeString: inputValue,
        });
      }
    } else if (this.props.value !== '' && this.props.value !== nextProps.value) {
      if (nextProps.value === this.props.passThroughValue) {
        inputValue = moment.tz(this.timeZone).format(this._timeFormat);
        presentedValue = this.props.passThroughValue;
      } else {
        inputValue = moment.tz(this.timeZone).format(this._timeFormat);
      }
      this.setState({
        presentedValue,
        timeString: inputValue,
      });
    }

    // adjust displayed time format for a change in locale
    if (nextProps.intl.locale !== this.props.intl.locale) {
      moment.locale(nextProps.intl.locale);
      this.setState(prevState => {
        let newTimeString = prevState.timeString;
        if (newTimeString !== '') {
          newTimeString = moment.tz(newTimeString, prevState.timeFormat, this.timeZone).format(this._timeFormat);
        }

        return {
          presentedValue: null,
          timeFormat: this._timeFormat,
          timeString: newTimeString,
        };
      });
    }
  }

  // examine the passed time format to determine 12 or 24 hour format.
  deriveHoursFormat(fmt) {
    let _fmt;
    if (!fmt) {
      _fmt = this.state.timeFormat;
    } else {
      _fmt = fmt;
    }
    const ampmRE = new RegExp(/A/);
    if (ampmRE.test(_fmt)) {
      return '12';
    }
    return '24';
  }

  getLocalTime(t, f) {
    if (t) {
      return moment(t).format(f);
    }
    return moment().format(this._timeFormat);
  }

  handleFieldClick() {
    this.toggleTimepicker();
  }

  handleRootClose(e) {
    // used by <RootCloseWrapper> to determine whether or not it should hide the picker.
    // it should determine that the element that's focused is outside of the datepicker's containing div and
    // the calendar widget (this.picker).
    if (this.state.showTimepicker) {
      if (!contains(this.container, e.target)) {
        if (!this.pickerIsFocused()) {
          this.hideTimepicker();
        }
      }
    }
  }

  showTimepicker() {
    this.setState({
      showTimepicker: true,
    });
  }

  hideTimepicker(cb) {
    this.setState({
      showTimepicker: false,
    }, cb);
  }

  toggleTimepicker() {
    const current = this.state.showTimepicker;
    this.setState({
      showTimepicker: !current,
    });
  }

  handleKeyDown(e) {
    if (this.picker) {
      // const formattedDate = curDate.format(this._timeFormat);
      // let timeString;
      switch (e.keyCode) {
        case 40: // down
          e.preventDefault();
          break;
        case 38: // up
          e.preventDefault();
          break;
        case 37: // left
          break;
        case 39: // right
          break;
        case 27: // escape
          e.preventDefault();
          this.hideTimepicker();
          break;
        case 34: // pgDn
          e.preventDefault();
          break;
        case 33: // pgUp
          e.preventDefault();
          break;
        case 13: // enter
          e.preventDefault();
          if (this.state.showTimepicker) {
            // this.handleSetTime(e, curDate, formattedDate);
          } else {
            this.showTimepicker();
          }
          // timeString = `${formattedDate} selected`;
          break;
        case 9: // tab
          this.hideTimepicker();
          break;
        default:
      }
      // this.informScreenReader(`${timeString}`);
    } else {
      switch (e.keyCode) {
        case 13: // enter
        case 40: // down
          e.preventDefault();
          this.showTimepicker();
          break;
        default:
      }
    }
  }

  handleSetTime(e, hours, minutes, ampm) {
    let standardizedTime;
    if (e === null || e.type === 'click' || e.type === 'keydown') {
      if (e) { e.preventDefault(); }

      if (this.props.onChange) { this.props.onChange(e); }
      this.textfield.current.getInput().focus();

      let tString;
      if (this.deriveHoursFormat() === '12') {
        tString = `${hours}:${minutes} ${ampm}`;
      } else {
        tString = `${hours}:${minutes}`;
      }

      this.setState({
        presentedValue: null,
        timeString: tString,
      });

      standardizedTime = this.standardizeTime(`${hours}:${minutes} ${ampm}`);
      if (this.props.input) {
        this.props.input.onChange(standardizedTime);
        if (this.props.onChange) {
          this.props.onChange(e, standardizedTime);
        }
      } else if (this.props.onChange) {
        this.props.onChange(e, standardizedTime);
      }
    } else if (e.type === 'change') {
      // if e.target.value is even a substring of props.passThroughValue, pass it through...


      // be sure that value is parseable as a date in the required format...
      // the boolean parameter suppresses moment's deprecation warning,
      // preventing it from attempting a parse using independable js Date object.
      this.setState({
        timeString: e.target.value,
      });

      if (this.props.onChange) { this.props.onChange(e); }
      if (this.props.input) {
        if (moment(e.target.value, this._timeFormat, true).isValid()) {
          this.setState({
            timeString: e.target.value,
          });
          // convert date to ISO 8601-ish format for backend (everything after the 'T')
          if (!ampm) {
            standardizedTime = this.standardizeTime(`${hours}:${minutes}`);
          } else {
            standardizedTime = this.standardizeTime(`${hours}:${minutes} ${ampm}`);
          }
          // redux-form handlers take the value rather than the event...
          this.props.input.onChange(standardizedTime);
          if (this.props.onChange) {
            this.props.onChange(e, standardizedTime);
          }
        }
      }
    }
  }

  handleFieldChange(e) {
    if (e.target.value === '') {
      this.clearTime();
      return;
    }
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
      let hoursMins = e.target.value.split(/[:\s]/g);
      hoursMins = hoursMins.filter(val => val); // remove any blank items...
      if (hoursMins.length > 0) {
        let hours = hoursMins[0];
        const intHours = parseInt(hours, 10);
        if (intHours < 10) {
          hours = `0${intHours}`;
        }

        if (hoursMins.length < 2) {
          this.handleSetTime(e, hours, '00');
          return;
        }
        let mins = hoursMins[1];
        let ampm;
        if (hoursMins.length < 3) {
          if (mins.length > 2) { // handle 3:00PM (no space between minutes and meridiem)
            if (this.deriveHoursFormat() === '12') {
              ampm = 'PM';
              if (/[aA]/.test(mins)) {
                ampm = 'AM';
              }
              const intMins = parseInt(mins, 10);
              if (intMins < 10) {
                mins = `0${intMins}`;
              } else {
                mins = intMins.toString();
              }
              this.handleSetTime(e, hours, mins, ampm);
            }
          }
          this.handleSetTime(e, hours, mins);
          return;
        }
        ampm = hoursMins[2];
        this.handleSetTime(e, hours, mins, ampm);
      }
    }
  }

  clearTime(e) {
    this.setState({
      presentedValue: null,
      timeString: '',
    });
    if (this.props.onChange) { this.props.onChange(e); }
    if (this.props.input) {
      this.props.input.onChange('');
    }
    this.textfield.current.getInput().focus();
  }

  cleanForScreenReader(str) {
    const newString = str.replace(/H/g, 'H ').replace(/m/g, 'm ').replace(/s/g, 's ');
    return newString;
  }

  informScreenReader(str) {
    this.setState({ srMessage: str });
  }

  pickerIsFocused() {
    if (contains(this.container, document.activeElement) &&
      document.activeElement !== document.body) {
      if (contains(this.picker.getDOMContainer(), document.activeElement)) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  hideOnBlur(e) {
    if (this.pickerIsFocused()) {
      if (this.props.input) {
        this.props.input.onBlur(e);
      }
      this.hideTimepicker();
      this.setState({ srMessage: '' });
    }
  }

  standardizeTime(time) {
    const isoTime = moment.tz(time, 'HH:mm A', this.timeZone).toISOString();
    const timeSplit = isoTime.split('T');
    return timeSplit[1];
  }

  handlePickTime(timeObject) {
    this.handleSetTime(null, timeObject.hour, timeObject.minute, timeObject.ampm);
    this.hideTimepicker();
  }

  getPresentationValue() {
    if (this.state.presentedValue !== null) {
      return this.state.presentedValue;
    }
    return this.state.timeString;
  }

  render() {
    const {
      input,
      screenReaderMessage,
      label, id, readOnly,
      required,
      disabled,
      tether,
      intl
    } = this.props;

    const screenReaderFormat = this.cleanForScreenReader(this._timeFormat);
    const mergedTetherProps = Object.assign({}, Timepicker.defaultProps.tether, tether);

    let ariaLabel;
    if (readOnly) {
      ariaLabel = `${label}`;
    } else {
      // eslint-disable-next-line max-len
      ariaLabel = `${label} format is ${screenReaderFormat} use arrow keys to navigate dates. Enter key to confirm. ${screenReaderMessage}`;
    }

    let endElement;
    if (this.state.timeString !== '' || this.state.presentedValue !== null) {
      endElement = (
        <div style={{ display: 'flex' }}>
          <Button
            key="clearButton"
            buttonStyle="fieldControl"
            onClick={this.clearTime}
            aria-label={intl.formatMessage({ id: 'stripes-components.clearFieldValue' })}
            id={`timepicker-clear-button-${id}`}
            tabIndex="-1"
          >
            <Icon icon="clearX" />
          </Button>
          <Button
            key="timepickerButton"
            buttonStyle="fieldControl"
            onClick={this.toggleTimepicker}
            onKeyDown={this.handleKeyDown}
            aria-label={intl.formatMessage({ id: 'stripes-components.showOrHideTimepicker' })}
            id={`timepicker-toggle-button-${id}`}
            tabIndex="-1"
          >
            <Icon icon="clock" />
          </Button>
        </div>

      );
    } else {
      endElement = (
        <Button
          key="timepickerButton"
          buttonStyle="fieldControl"
          onClick={this.toggleTimepicker}
          onKeyDown={this.handleKeyDown}
          aria-label={intl.formatMessage({ id: 'stripes-components.showOrHideTimepicker' })}
          id={`timepicker-toggle-button-${id}`}
          tabIndex="-1"
        >
          <Icon icon="clock" />
        </Button>
      );
    }

    let textfield;
    if (this.props.input && this.props.meta) {
      textfield = (
        <TextField
          ref={this.textfield}
          input={input}
          value={this.getPresentationValue()}
          label={label}
          aria-label={ariaLabel}
          endControl={!readOnly ? endElement : null}
          placeholder={` ${this._timeFormat}`}
          onKeyDown={!readOnly ? this.handleKeyDown : null}
          onClick={!readOnly ? this.handleFieldClick : null}
          onBlur={this.hideOnBlur}
          meta={this.props.meta}
          onChange={this.handleFieldChange}
          readOnly={readOnly}
          disabled={disabled}
          id={this.testId}
          required={required}
          hasClearIcon={false}
          aria-haspopup="true"
          aria-expanded={this.state.showTimepicker}
          autoFocus={this.props.autoFocus}
        />
      );
    } else {
      textfield = (
        <TextField
          ref={this.textfield}
          label={label}
          value={this.getPresentationValue()}
          aria-label={ariaLabel}
          endControl={!readOnly ? endElement : null}
          placeholder={this._timeFormat.toUpperCase()}
          onKeyDown={!readOnly ? this.handleKeyDown : null}
          onBlur={this.hideOnBlur}
          onClick={!readOnly ? this.handleFieldClick : null}
          onChange={this.handleFieldChange}
          readOnly={readOnly}
          disabled={disabled}
          id={this.testId}
          required={required}
          hasClearIcon={false}
          aria-haspopup="true"
          aria-expanded={this.state.showTimepicker}
          autoFocus={this.props.autoFocus}
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
        <RootCloseWrapper onRootClose={this.handleRootClose}>
          <TimeDropdown
            visible={this.state.showTimepicker}
            onSetTime={this.handlePickTime}
            selectedTime={this.state.timeString}
            timeFormat={this.state.timeFormat}
            ref={(ref) => { this.picker = ref; }}
            mainControl={this.textfield.current}
            onKeyDown={this.handleKeyDown}
            onBlur={this.hideTimepicker}
            locale={this.locale}
            onNavigation={this.handleDateNavigation}
            id={this.testId}
            onClose={this.hideTimepicker}
          />
        </RootCloseWrapper>
      </TetherComponent>
    );
  }
}

Timepicker.propTypes = propTypes;
Timepicker.defaultProps = defaultProps;

export default withStripes(injectIntl(Timepicker));

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { deprecated } from 'prop-types-extra';
import TetherComponent from 'react-tether';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import moment from 'moment-timezone';
import contains from 'dom-helpers/query/contains';
import debounce from 'lodash/debounce';
import uniqueId from 'lodash/uniqueId';

import Popper, { AVAILABLE_PLACEMENTS } from '../Popper';
import IconButton from '../IconButton';
import TextField from '../TextField';
import TimeDropdown from './TimeDropdown';
import css from './TimeDropdown.css';

const propTypes = {
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  input: PropTypes.object,
  label: PropTypes.node,
  locale: PropTypes.string,
  meta: PropTypes.object,
  modifiers: PropTypes.object,
  onChange: PropTypes.func,
  passThroughValue: deprecated(PropTypes.string, 'Use alternative design'),
  placement: PropTypes.oneOf(AVAILABLE_PLACEMENTS),
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  screenReaderMessage: PropTypes.string,
  showTimepicker: PropTypes.bool,
  tether: deprecated(PropTypes.object, `
    For overlay placement you can use the 'placement'-prop'. 
    For other modifications you use the 'modifiers'-prop. 
    See the documentation for <Popper> for more information.
  `),
  timeZone: PropTypes.string,
  value: PropTypes.string,
};

const contextTypes = {
  intl: PropTypes.object
};

const defaultProps = {
  autoFocus: false,
  modifiers: {},
  placement: 'bottom',
  screenReaderMessage: '',
};

class Timepicker extends React.Component {
  constructor(props, context) {
    super(props);

    this.textfield = React.createRef();
    this.containerRef = React.createRef();
    this.picker = null;
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
    this.timeZone = props.timeZone || context.intl.timeZone;

    // Set locale
    this.locale = props.locale || context.intl.locale;
    moment.locale(this.locale);
    this._timeFormat = moment.localeData()._longDateFormat.LT;
    this.formats = [moment.ISO_8601, 'YYYY-MM-DD LT', 'YYYY-MM-DD h:mm:ss A',
      'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm'];
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
          const dateTime = `${moment().format('YYYY-MM-DD')}T${this.props.input.value}`;
          // handle case where input value could be utc time or ISO formatted datetime
          inputValue = moment(this.props.input.value, this.formats, true).isValid() ?
            moment.tz(this.props.input.value, this._timeFormat, this.timeZone).format(this._timeFormat) :
            moment.tz(dateTime, this.timeZone).format(this._timeFormat);
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

  componentWillReceiveProps(nextProps, nextContext) { // eslint-disable-line react/no-deprecated
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
    if (nextContext.intl.locale !== this.context.intl.locale) {
      moment.locale(nextContext.intl.locale);
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
      if (!contains(this.containerRef.current, e.target)) {
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
    if (contains(this.containerRef.current, document.activeElement) &&
      document.activeElement !== document.body) {
      return contains(this.picker.getDOMContainer(), document.activeElement);
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
      disabled,
      input,
      label,
      modifiers,
      placement,
      readOnly,
      required,
      screenReaderMessage,
      tether,
      ...rest
    } = this.props;

    const screenReaderFormat = this.cleanForScreenReader(this._timeFormat);

    let ariaLabel;
    if (readOnly || disabled) {
      ariaLabel = `${label}`;
    } else {
      // eslint-disable-next-line max-len
      ariaLabel = `${label} format is ${screenReaderFormat} use arrow keys to navigate dates. Enter key to confirm. ${screenReaderMessage}`;
    }

    let endElement;
    if (this.state.timeString !== '' || this.state.presentedValue !== null) {
      endElement = (
        <>
          <FormattedMessage id="stripes-components.clearFieldValue">
            {clearFieldValueAriaLabel => (
              <IconButton
                key="clearButton"
                onClick={this.clearTime}
                aria-label={clearFieldValueAriaLabel}
                id={`timepicker-clear-button-${this.testId}`}
                tabIndex="-1"
                icon="times-circle-solid"
              />
            )}
          </FormattedMessage>
          <FormattedMessage id="stripes-components.showOrHideTimepicker">
            {showOrHideTimepickerAriaLabel => (
              <IconButton
                key="timepickerButton"
                onClick={this.toggleTimepicker}
                onKeyDown={this.handleKeyDown}
                aria-label={showOrHideTimepickerAriaLabel}
                id={`timepicker-toggle-button-${this.testId}`}
                tabIndex="-1"
                icon="clock"
              />
            )}
          </FormattedMessage>
        </>
      );
    } else {
      endElement = (
        <FormattedMessage id="stripes-components.showOrHideTimepicker">
          {showOrHideTimepickerAriaLabel => (
            <IconButton
              key="timepickerButton"
              onClick={this.toggleTimepicker}
              onKeyDown={this.handleKeyDown}
              aria-label={showOrHideTimepickerAriaLabel}
              id={`timepicker-toggle-button-${this.testId}`}
              tabIndex="-1"
              icon="clock"
            />
          )}
        </FormattedMessage>
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
          aria-label={rest['aria-label'] || ariaLabel}
          endControl={(readOnly || disabled) ? null : endElement}
          placeholder={` ${this._timeFormat}`}
          onKeyDown={(readOnly || disabled) ? null : this.handleKeyDown}
          onClick={(readOnly || disabled) ? null : this.handleFieldClick}
          onBlur={this.hideOnBlur}
          meta={this.props.meta}
          onChange={this.handleFieldChange}
          readOnly={readOnly}
          disabled={disabled}
          id={this.testId}
          required={required}
          hasClearIcon={false}
          autoFocus={this.props.autoFocus}
        />
      );
    } else {
      textfield = (
        <TextField
          ref={this.textfield}
          label={label}
          value={this.getPresentationValue()}
          aria-label={rest['aria-label'] || ariaLabel}
          endControl={(readOnly || disabled) ? null : endElement}
          placeholder={this._timeFormat.toUpperCase()}
          onKeyDown={(readOnly || disabled) ? null : this.handleKeyDown}
          onBlur={this.hideOnBlur}
          onClick={(readOnly || disabled) ? null : this.handleFieldClick}
          onChange={this.handleFieldChange}
          readOnly={readOnly}
          disabled={disabled}
          id={this.testId}
          required={required}
          hasClearIcon={false}
          autoFocus={this.props.autoFocus}
        />
      );
    }

    const renderTextField = (
      <div style={{ position: 'relative', width: '100%' }} ref={this.containerRef}>
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
    );

    const renderDropdown = (
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
    );

    /**
     * Legacy support – will be removed in a future release
     */
    if (tether) {
      const tetherProps = Object.assign({
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
      }, tether);

      return (
        <TetherComponent {...tetherProps}>
          {renderTextField}
          {renderDropdown}
        </TetherComponent>
      );
    }


    return (
      <>
        {renderTextField}
        <Popper
          placement={placement}
          isOpen={this.state.showTimepicker}
          anchorRef={this.containerRef}
          onToggle={this.toggleTimepicker}
          modifiers={{
            offset: {
              enabled: true,
              offset: '0,10',
            },
            ...modifiers
          }}
        >
          {renderDropdown}
        </Popper>
      </>
    );
  }
}

Timepicker.propTypes = propTypes;
Timepicker.contextTypes = contextTypes;
Timepicker.defaultProps = defaultProps;

export default Timepicker;

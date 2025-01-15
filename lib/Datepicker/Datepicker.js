import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import pick from 'lodash/pick';
import RootCloseWrapper from '../util/RootCloseWrapper';
import nativeChangeField from '../util/nativeChangeFieldValue';
import formField from '../FormField';
import Popper, { AVAILABLE_PLACEMENTS } from '../Popper';
import IconButton from '../IconButton';
import TextField from '../TextField';
import Calendar from './Calendar';
import css from './Calendar.css';
import {
  defaultParser,
  defaultInputValidator,
  defaultOutputFormatter,
  getBackendDateStandard
} from './datepicker-util';
import { getLocaleDateFormat } from '../util/dateTimeUtils';

const pickDataProps = (props) => pick(props, (v, key) => key.indexOf('data-test') !== -1);

const propTypes = {
  autoFocus: PropTypes.bool,
  backendDateStandard: PropTypes.string,
  date: PropTypes.object,
  dateFormat: PropTypes.string,
  disabled: PropTypes.bool,
  exclude: PropTypes.func,
  hideCalendarButton: PropTypes.bool,
  hideOnChoose: PropTypes.bool,
  id: PropTypes.string,
  input: PropTypes.object,
  inputRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  inputValidator: PropTypes.func,
  intl: PropTypes.object,
  label: PropTypes.node,
  locale: PropTypes.string,
  meta: PropTypes.object,
  modifiers: PropTypes.object,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onSetDate: PropTypes.func,
  outputBackendValue: PropTypes.bool,
  outputFormatter: PropTypes.func,
  parser: PropTypes.func,
  placement: PropTypes.oneOf(AVAILABLE_PLACEMENTS),
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  screenReaderMessage: PropTypes.string,
  showCalendar: PropTypes.bool,
  timeZone: PropTypes.string,
  useFocus: PropTypes.bool,
  useInput: PropTypes.bool,
  usePortal: PropTypes.bool,
  value: PropTypes.string,
};

const Datepicker = (
  { autoFocus = false,
    backendDateStandard = 'ISO8601',
    disabled,
    dateFormat,
    exclude,
    hideCalendarButton = false,
    hideOnChoose = true,
    id,
    inputValidator = defaultInputValidator,
    intl,
    locale,
    modifiers = {},
    onBlur,
    onChange,
    onFocus,
    outputBackendValue = true,
    outputFormatter = defaultOutputFormatter,
    parser = defaultParser,
    placement = 'bottom',
    readOnly,
    screenReaderMessage = '',
    showCalendar: showCalendarProp,
    timeZone: timeZoneProp, // eslint-disable-line no-unused-vars
    useFocus = true,
    useInput,
    usePortal,
    value: valueProp,
    inputRef,
    ...props }
) => {
  const format = useRef(
    dateFormat || getLocaleDateFormat({ intlLocale: intl.locale, localeProp: locale, intl })
  ).current;
  const [datePair, updateDatePair] = useState({
    dateString: typeof valueProp !== 'undefined' ? parser(
      valueProp, // value
      timeZoneProp || intl.timeZone, // timezone
      format, // uiFormat
      getBackendDateStandard(backendDateStandard, true) // outputFormats
    ) : null,
    formatted: typeof valueProp !== 'undefined' ? outputFormatter({
      backendDateStandard,
      value: valueProp,
      timeZone: timeZoneProp || intl.timeZone,
      uiFormat: format,
      outputFormats: getBackendDateStandard(backendDateStandard, true)
    }) : null
  });
  // since updating the Datepair object isn't quite enough to prompt a re-render when its only partially
  // updated, need to maintain a 2nd field containing only the displayed value.
  // this resolves issue with the clearIcon not showing up.
  const [displayedValue, updateDisplayed] = useState(datePair.dateString);
  const [showCalendar, setShowCalendar] = useState(showCalendarProp);

  const input = useRef(null);
  const pickerRef = useRef(null);
  const blurTimeout = useRef(null);
  const hiddenInput = useRef(null);
  const testId = useRef(id || uniqueId('dp-')).current;
  const calendarFirstField = useRef(null);
  const container = useRef(null);
  const payload = useRef(datePair);

  let maybeUpdateValue;

  // handle value changes that originate outside of the component.
  useEffect(() => {
    if (typeof valueProp !== 'undefined' && valueProp !== datePair.dateString && valueProp !== datePair.formatted) {
      payload.current = Object.assign(payload.current, maybeUpdateValue(valueProp));
      nativeChangeField(input, false, payload.current.dateString);
    }
  }, [valueProp, maybeUpdateValue, datePair.dateString, datePair.formatted]);

  maybeUpdateValue = (value) => {
    if (value === '') {
      const blankDates = {
        dateString: '',
        formatted: ''
      };
      updateDatePair(blankDates);
      updateDisplayed('');
      return blankDates;
    }

    // if we output the value according to backendDateStandard, we will probably get it back
    // in that format, so include that format in validation.
    const backendStandard = getBackendDateStandard(backendDateStandard, outputBackendValue);
    const isValid = inputValidator({ value, format, backendStandard });
    let dates;

    // otherwise parse the value and update the datestring and the formatted date...
    if (isValid) {
      const parsed = parser(
        value,
        timeZoneProp || intl.timeZone,
        format, // uiFormat
        backendStandard, // outputFormat
      );
      if (parsed !== datePair.dateString) {
        const hiddenDate = outputFormatter({
          backendDateStandard,
          value: parsed,
          uiFormat: format,
          outputFormats: backendStandard,
          timeZone: timeZoneProp || intl.timeZone
        });
        dates = { dateString: parsed, formatted: hiddenDate };
        updateDatePair(current => {
          const newDatePair = Object.assign(current, dates);
          return newDatePair;
        });
        updateDisplayed(dates.dateString);
        return dates;
      }
      return {};
    } else if (value !== datePair.dateString) {
      dates = {
        dateString: value,
        formatted: ''
      };
      updateDatePair(current => {
        const newDatePair = Object.assign(current, dates);
        return newDatePair;
      });
      updateDisplayed(dates.dateString);
      return dates;
    }
    return {};
  };

  const setFromCalendar = (value) => {
    nativeChangeField(input, hideOnChoose, value);
    if (hideOnChoose) {
      setShowCalendar(false);
    }
  };


  // for vanilla react/non-final-form implementations that just get the input value.
  const internalHandleChange = (e) => {
    payload.current = Object.assign(payload.current, maybeUpdateValue(e.target.value));
    if ((!useInput || !outputBackendValue) && onChange) {
      onChange(e, e.target.value, payload.current.formatted);
    } else if (payload.current.formatted !== hiddenInput.current.value) {
      nativeChangeField(hiddenInput, false, payload.current.formatted);
    }
  };

  // for final-form so it can have a native change event rather than a fabricated thing...
  const onChangeFormatted = (e) => {
    if (useInput && outputBackendValue && onChange) {
      const { dateString, formatted } = payload.current;
      onChange(e, formatted, dateString);
    }
  };

  const datePickerIsFocused = () => {
    if (container.current.contains(document.activeElement) &&
      document.activeElement !== document.body) {
      if (pickerRef.current) {
        return (pickerRef.current.contains(document.activeElement));
      }
      return true;
    }
    return false;
  };

  const internalClearDate = () => {
    updateDatePair({ dateString: '', formatted: '' });
    nativeChangeField(input, true, '');
  };

  const toggleCalendar = () => {
    setShowCalendar(cur => !cur);
  };


  const queueBlur = (e) => {
    blurTimeout.current = setTimeout(() => {
      if (onBlur) {
        if (useInput) {
          onBlur({
            target: outputBackendValue ? hiddenInput.current : input.current,
            stopPropagation: () => {},
            preventDefault: () => {},
            defaultPrevented: true,
          });
        } else {
          onBlur(e);
        }
      }
    });
  };

  const cancelBlur = () => {
    clearTimeout(blurTimeout.current);
  };

  const handleInternalBlur = (e) => {
    e.preventDefault();
    queueBlur(e);
  };

  const handleInternalFocus = (e) => {
    cancelBlur();
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleRootClose = (e) => {
    if (!container.current.contains(e.target) || !pickerRef.current.contains(e.target)) {
      if (!datePickerIsFocused()) {
        setShowCalendar(false);
      }
    }
  };

  const handleRequestClose = () => {
    input.current?.focus(); // eslint-disable-line no-unused-expressions
    setShowCalendar(false);
  };

  const renderCalendar = () => (
    <RootCloseWrapper
      onRootClose={handleRootClose}
      ref={pickerRef}
    >
      <Calendar
        onSetDate={setFromCalendar}
        selectedDate={datePair.dateString}
        dateFormat={format}
        firstFieldRef={calendarFirstField}
        onFocus={handleInternalFocus}
        onRequestClose={handleRequestClose}
        rootRef={pickerRef}
        locale={locale || intl.locale}
        exclude={exclude}
        id={testId}
      />
    </RootCloseWrapper>
  );

  // renders clear button and calendar button
  const renderEndElement = () => {
    if (readOnly || disabled) return null;
    return (
      <>
        { displayedValue && (
          <FormattedMessage id="stripes-components.clearFieldValue">
            {([ariaLabel]) => (
              <IconButton
                data-test-clear
                key="clearButton"
                onClick={internalClearDate}
                aria-label={ariaLabel}
                id={`datepicker-clear-button-${testId}`}
                icon="times-circle-solid"
              />
            )}
          </FormattedMessage>
        )}
        {!hideCalendarButton && (
          <FormattedMessage id="stripes-components.showOrHideDatepicker">
            {([ariaLabel]) => (
              <IconButton
                data-test-calendar-button
                onClick={toggleCalendar}
                aria-label={ariaLabel}
                aria-haspopup="true"
                aria-expanded={!!showCalendar}
                id={`datepicker-toggle-calendar-button-${testId}`}
                icon="calendar"
              />
            )}
          </FormattedMessage>
        )}
      </>
    );
  };

  const content = (
    <div
      className={css.container}
      ref={container}
      data-test-datepicker-container
      onFocus={handleInternalFocus}
      onBlur={handleInternalBlur}
    >
      <TextField
        {...props}
        id={testId}
        readOnly={readOnly}
        disabled={disabled}
        value={datePair.dateString}
        onChange={internalHandleChange}
        endControl={renderEndElement()}
        hasClearIcon={false}
        inputRef={element => {
          input.current = element;
          if (typeof inputRef === 'object') inputRef.current = element;
          if (typeof inputRef === 'function') inputRef(element);
        }}
        placeholder={format}
      />
      <input
        data-test-datepicker-hidden-input
        type="text"
        hidden
        value={datePair.formatted}
        onChange={onChangeFormatted}
        ref={hiddenInput}
      />
    </div>
  );

  const portalElem = usePortal ? document.getElementById('OverlayContainer') : null;
  return (
    <div className={css.container} {...pickDataProps(props)}>
      {content}
      <Popper
        placement={placement}
        isOpen={showCalendar}
        anchorRef={container}
        onToggle={toggleCalendar}
        portal={usePortal && portalElem}
        modifiers={{
          offset: {
            enabled: true,
            offset: '0,10',
          },
          ...modifiers
        }}
      >
        {renderCalendar()}
      </Popper>
    </div>
  );
};

Datepicker.propTypes = propTypes;

export default formField(
  injectIntl(Datepicker),
  ({ input, meta }) => ({
    onBlur: input?.onBlur,
    onFocus: input?.onFocus,
    error: meta?.touched ? meta.error : undefined,
    useInput: true
  })
);

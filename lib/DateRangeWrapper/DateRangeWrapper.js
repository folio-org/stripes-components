import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

const callAll = (...funcs) => (...args) => funcs.forEach(fn => fn && fn(...args));
const ISOFormat = 'YYYY-MM-DDTHH:mm:ss.sssZ';

class DateRangeWrapper extends React.Component {
  static propTypes = {
    children: PropTypes.func,
    endExcluder: PropTypes.func,
    endValueGetter: PropTypes.func,
    initialEndDate: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    initialStartDate: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    startExcluder: PropTypes.func,
    startValueGetter: PropTypes.func,
  }

  static defaultProps = {
    endExcluder: (day, startDate) => day.isBefore(startDate, ISOFormat),
    startExcluder: (day, endDate) => day.isAfter(endDate, ISOFormat),
    startValueGetter: (value) => value,
    endValueGetter: (value) => value,
  }

  constructor(props) {
    super(props);

    this.state = {
      startDate: this.props.initialStartDate || null,
      endDate: this.props.initialEndDate || null,
    };

    this.endDateExclude = this.endDateExclude.bind(this);
    this.startDateExclude = this.startDateExclude.bind(this);
    this.startDateOnChange = this.startDateOnChange.bind(this);
    this.endDateOnChange = this.endDateOnChange.bind(this);
    this.getStartInputProps = this.getStartInputProps.bind(this);
    this.getEndInputProps = this.getEndInputProps.bind(this);
  }

  startDateOnChange(value) {
    const newStartDateValue = this.props.startValueGetter(value);
    this.setState({ startDate: newStartDateValue });
  }

  endDateOnChange(value) {
    const newEndDateValue = this.props.endValueGetter(value);
    this.setState({ endDate: newEndDateValue });
  }

  endDateExclude(day) {
    const isExcluded = this.props.endExcluder(day, this.state.startDate);
    return isExcluded;
  }

  startDateExclude(day) {
    const isExcluded = this.props.startExcluder(day, this.state.endDate);
    return isExcluded;
  }

  getStartInputProps(props = {}) {
    return {
      ...props,
      onChange: callAll(props.onChange, this.startDateOnChange),
    };
  }

  getEndInputProps(props = {}) {
    return {
      ...props,
      onChange: callAll(props.onChange, this.endDateOnChange),
    };
  }

  render() {
    const {
      getStartInputProps,
      getEndInputProps,
      endDateExclude,
      startDateExclude,
    } = this;

    return this.props.children({
      getStartInputProps,
      getEndInputProps,
      endDateExclude,
      startDateExclude,
    });
  }
}

export default DateRangeWrapper;

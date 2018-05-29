import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import DateTimePickerForm from './DateTimePickerForm';

class DateTimePicker extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      timezone: PropTypes.string.isRequired,
    }).isRequired,
    dateProps: PropTypes.object,
    timeProps: PropTypes.object,
    onChange: PropTypes.func,
    initialValues: PropTypes.shape({
      date: PropTypes.string,
      time: PropTypes.string,
    })
  }

  static defaultProps = {
    dateProps: {
      label: 'Date:',
    },
    timeProps: {
      label: 'Time:',
    },
    onChange: () => {},
    initialValues: {
      date: new Date().toISOString(),
      time: '12:00:00.000Z',
    },
  }

  constructor(props) {
    super(props);

    this.handleChange(props.initialValues);
  }

  handleChange = (values) => {
    // Values are received in the following form: { date: "2018-10-20T00:00:00.000Z", time: "22:59:00.000Z" }
    const date = values.date.split('T')[0];
    const time = values.time.split(/[Z+-]/)[0];

    const localDatetime = moment.tz(`${date}T${time}`, this.props.stripes.timezone);
    const utcDatetime = localDatetime.tz('UTC').format();

    this.props.onChange(utcDatetime);
  }

  render() {
    const { onChange, ...rest } = this.props; // eslint-disable-line no-unused-vars

    return (
      <DateTimePickerForm
        onChange={this.handleChange}
        {...rest}
      />
    );
  }
}

export default DateTimePicker;

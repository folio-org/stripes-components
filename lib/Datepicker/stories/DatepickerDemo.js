import React from 'react';
import moment from 'moment';
import Datepicker from '../Datepicker';

class DatepickerDemo extends React.Component {
  state = {
    day1: '12/10/1980',
    day2: '11/03/1982',
    day3: '02/09/2019',
  }

  onChangeDate = (value, name) => {
    let nextDate;
    if (value !== '') {
      nextDate = moment.utc(value).format('MM/DD/YYYY');
    } else {
      nextDate = value;
    }

    this.setState({
      [name]: nextDate,
    });
  }

  render() {
    return (
      <div>
        <Datepicker
          label="Date"
          value={this.state.day1}
          onChange={(e) => { this.onChangeDate(e.target.value, 'day1'); }}
        />
        <br />
        <Datepicker
          label="Date (read only)"
          value={this.state.day3}
          onChange={(e) => { this.onChangeDate(e.target.value, 'day3'); }}
          readOnly
        />
        <br />
        <Datepicker
          label="Date (disabled)"
          disabled
        />
        <br />
        <Datepicker
          label="Date (required)"
          value={this.state.day2}
          onChange={(e) => { this.onChangeDate(e.target.value, 'day2'); }}
          required
        />
      </div>
    );
  }
}

export default DatepickerDemo;

import React from 'react';
import moment from 'moment';
import Datepicker from '../Datepicker';

class DatepickerDemo extends React.Component {
  state = {
    day1: '12/10/1980',
    day2: '11/03/1982',
    day3: '02/09/2019',
    rfd1: '',
  }

  onChangeDate = (value, name) => {
    let nextDate;
    if (value !== '') {
      nextDate = moment.utc(value).format('MM/DD/YYYY');
    } else {
      nextDate = value;
    }

    this.setState({
      // [name]: nextDate,
      [name]: value
    });
  }

  rfUpdate = (e) => {
    this.setState({
      rfd1: e.target.value,
    });
  }

  clearDate = () => {
    const newState = {};
    for(const p in this.state) {
      newState[p] = '';
    }
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <button onClick={this.clearDate} type="button">Clear dates</button>
        <Datepicker
          label="Date"
          value={this.state.day1}
          onChange={(e) => { this.onChangeDate(e.target.value, 'day1'); }}
        />
        <Datepicker
          label="RFF-style-Date"
          input={{
            value: this.state.rfd1,
            onChange: this.rfUpdate
          }}
        />
        <br />
        <Datepicker
          label="Date (read only)"
          value={this.state.day3}
          onChange={(e) => { this.onChangeDate(e.target.value, 'day3'); }}
          readOnly
        />
        <br />
        {/* <label >HTML5 date input</label>
        <input id="html5date" type="date" /> */}
        {/*  <br />
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
        /> */}
      </div>
    );
  }
}

export default DatepickerDemo;

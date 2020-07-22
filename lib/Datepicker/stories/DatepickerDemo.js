import React from 'react';
import moment from 'moment';
import Datepicker from '../Datepicker';

class DatepickerDemo extends React.Component {
  state = {
    day1: '12/10/1980',
    day2: '11/03/1982',
    day3: '04/01/2018',
    rfd1: '2018-04-01T00:00:00.000Z',
  }

  onChangeDate = (value, name) => {
    this.setState({
      [name]: value
    });
  }

  rfUpdate = (e) => {
    this.setState({
      rfd1: e.target.value,
    });
  }

  rfUpdate2 = (e) => {
    this.setState({
      day3: e.target.value,
    });
  }

  clearDate = () => {
    const newState = {};
    for (const p in this.state) {
      if (this.state[p]) {
        newState[p] = '';
      }
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
        <Datepicker
          label="Backend Date Standard"
          backendDateStandard={'MM/DD/YYYY'}
          input={{
            value: this.state.day3,
            onChange: this.rfUpdate2
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
        <Datepicker
          label="Date Excluded dates"
          value={this.state.day2}
          onChange={(e) => { this.onChangeDate(e.target.value, 'day2'); }}
          exclude={(d) => d.format('MM/DD/YYYY') === '11/01/1982'}
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

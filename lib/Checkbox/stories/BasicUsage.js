/**
 * Checkbox: Basic Usage
 */

import React from 'react';
import Checkbox from '../Checkbox';

export default class CheckboxExample extends React.Component {
  constructor() {
    super();
    this.state = {
      checkbox_1: false,
      checkbox_2: false,
    };
  }

  render() {
    return (
      <div style={{ padding: '15px' }}>
        <Checkbox
          id="checkbox_1"
          name="checkbox_1"
          label="Checkbox with label"
          onChange={() => { this.setState({ checkbox_1: !this.state.checkbox_1 }); }}
          inline
          input={{
            value: this.state.checkbox_1,
          }}
        />
        <br />
        <hr />
        <br />
        This is an <Checkbox
                      onChange={() => { this.setState({ checkbox_2: !this.state.checkbox_2 }); }}
                      input={{ value: this.state.checkbox_2 }}
                      inline
                      /> inline checkbox..
      </div>
    );
  }
}

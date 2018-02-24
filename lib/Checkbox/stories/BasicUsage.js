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
      checkbox_3: false,
      checkbox_4: false,
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
          input={{
            value: this.state.checkbox_1,
          }}
        />
        <Checkbox
          name="checkbox_2"
          label="Checkbox with label"
          onChange={() => { this.setState({ checkbox_2: !this.state.checkbox_2 }); }}
          input={{
            value: this.state.checkbox_2,
          }}
        />
        <br />
        <br />
        <Checkbox
          name="checkbox_3"
          label="Inline Checkbox with label"
          onChange={() => { this.setState({ checkbox_3: !this.state.checkbox_3 }); }}
          input={{
            value: this.state.checkbox_3,
          }}
          inline
        />
        <br />
        <br />
        <br />
        This is an
        <Checkbox
          onChange={() => { this.setState({ checkbox_4: !this.state.checkbox_4 }); }}
          input={{ value: this.state.checkbox_4 }}
          inline
        /> inline checkbox with no label.
      </div>
    );
  }
}

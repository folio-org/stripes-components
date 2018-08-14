/**
 * Checkbox: Basic Usage
 */

import React from 'react';
import Checkbox from '../Checkbox';

export default class CheckboxExample extends React.Component {
  constructor() {
    super();
    this.state = {
      checkbox_2: false,
      checkbox_3: false,
      checkbox_4: false,
    };
  }

  render() {
    return (
      <div>
        <Checkbox
          name="checkbox_2"
          label="Checkbox with label (full width)"
          onChange={() => { this.setState(prevState => ({ checkbox_2: !prevState.checkbox_2 })); }}
          value={this.state.checkbox_2}
        />
        <br />
        <br />
        <Checkbox
          name="checkbox_3"
          label="Inline Checkbox with label"
          onChange={() => { this.setState(prevState => ({ checkbox_3: !prevState.checkbox_3 })); }}
          value={this.state.checkbox_3}
          inline
        />
        <br />
        <br />
        <br />
        This is an
        <Checkbox
          onChange={() => { this.setState(prevState => ({ checkbox_4: !prevState.checkbox_4 })); }}
          value={this.state.checkbox_4}
          inline
        />
        {' '}
inline checkbox with no label.
      </div>
    );
  }
}

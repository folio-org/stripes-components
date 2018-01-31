import React from 'react';
import { storiesOf } from '@storybook/react';
import Checkbox from './Checkbox';

class CheckboxExample extends React.Component {
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
          input={{
            value: this.state.checkbox_1,
          }}
        />
        <br />
        <hr />
        <br />
        This is an <Checkbox
          id="checkbox_2"
          name="checkbox_2"
          onChange={() => { this.setState({ checkbox_2: !this.state.checkbox_2 }); }}
          input={{
            value: this.state.checkbox_2,
          }}
          inline
        /> inline checkbox..
      </div>
    );
  }
}

storiesOf('Checkbox', module)
  .add('Basic Usage', () => (<CheckboxExample />));

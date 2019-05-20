/**
 * Checkbox: Basic Usage
 */

import React from 'react';
import Checkbox from '../Checkbox';
import Label from '../../Label';

export default class CheckboxExample extends React.Component {
  constructor() {
    super();
    this.state = {
      checked: ['checkbox_4'],
    };
  }

  onChange = e => {
    const { checked } = this.state;
    const { value } = e.target;
    const newChecked = checked.indexOf(value) >= 0 ?
      checked.filter(val => val !== value) :
      [...checked, value];

    this.setState({
      checked: newChecked,
    });
  }

  isChecked = (val) => {
    return this.state.checked.indexOf(val) >= 0;
  }

  render() {
    return (
      <div>
        <Checkbox
          name="checkbox"
          label="Checkbox with label (full width)"
          onChange={this.onChange}
          value="checkbox_1"
          checked={this.isChecked('checkbox_1')}
        />
        <br aria-hidden="true" />
        <Checkbox
          name="checkbox"
          label="Inline Checkbox with label"
          onChange={this.onChange}
          value="checkbox_2"
          checked={this.isChecked('checkbox_2')}
          inline
        />
        <br aria-hidden="true" />
        <br aria-hidden="true" />
        <Checkbox
          name="checkbox"
          label="Inline Checkbox with label (disabled)"
          onChange={this.onChange}
          value="checkbox_3"
          checked={this.isChecked('checkbox_3')}
          inline
          disabled
        />
        <br aria-hidden="true" />
        <br aria-hidden="true" />
        <Checkbox
          name="checkbox"
          label="Inline Checkbox with label (read only)"
          onChange={this.onChange}
          value="checkbox_4"
          checked={this.isChecked('checkbox_4')}
          inline
          readOnly
        />
        <br aria-hidden="true" />
        <br aria-hidden="true" />
        <Checkbox
          name="checkbox"
          label="Required checkbox"
          onChange={this.onChange}
          value="checkbox_5"
          checked={this.isChecked('checkbox_5')}
          inline
          required
        />
        <br aria-hidden="true" />
        <br aria-hidden="true" />
        <Checkbox
          name="checkbox"
          onChange={this.onChange}
          value="checkbox_6"
          checked={this.isChecked('checkbox_6')}
          inline
        />
        <br aria-hidden="true" />
        <br aria-hidden="true" />
        <Label>Stacked inline checkboxes</Label>
        <Checkbox label="JavaScript" inline />
        <Checkbox label="PHP" inline />
        <Checkbox label="C++" inline />
        <Checkbox label="ASP.net" inline />
        <br />
        <br />
        <Checkbox
          vertical
          label="Vertical label"
        />
        <br />
        <br />
        <Label for="external-label">Checkbox with external label</Label>
        <Checkbox id="external-label" name="external-label" inline />
      </div>
    );
  }
}

/**
 * Radio Button Group example
 */

import React from 'react';
import RadioButtonGroup from '../RadioButtonGroup';
import RadioButton from '../../RadioButton';

export default class BasicUsage extends React.Component {
  render() {
    return (
      <RadioButtonGroup>
        <RadioButton label="Inline Radio Button 1" name="fruit" value="apples" />
        <RadioButton label="Inline Radio Button 2" name="fruit" value="oranges" />
        <RadioButton label="Inline Radio Button 3" name="fruit" value="bananas" />
      </RadioButtonGroup>
    );
  }
}

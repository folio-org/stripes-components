/**
 * Checkbox: Basic Usage
 */

import React from 'react';
import Checkbox from '../Checkbox';
import Label from '../../Label';
import Headline from '../../Headline';

const CheckboxExample = () => (
  <div>
    <Checkbox
      label="Checkbox with label (full width)"
    />
    <br />
    <Checkbox
      checked
      label="Checked state"
    />
    <br />
    <Checkbox
      label="Inline Checkbox with label (disabled)"
      inline
      disabled
    />
    <br />
    <br />
    <Checkbox
      label="Read only, inline and checked"
      checked
      inline
      readOnly
    />
    <br />
    <br />
    <Checkbox
      label="Required checkbox"
      inline
      required
    />
    <br />
    <br />
    <hr />
    <br />
    <Headline size="large" margin="none">No label</Headline>
    <Checkbox
      aria-label="My label"
      inline
    />
    <br />
    <br />
    <Label htmlFor="external-label">Checkbox with external label</Label>
    <Checkbox id="external-label" name="external-label" inline />
    <br />
    <br />
    <hr />
    <br />
    <Headline size="large">Vertical label</Headline>
    <Checkbox
      vertical
      label="My label"
    />
    <br />
    <br />
    <hr />
    <br />
    <Headline size="large">Inline</Headline>
    <Checkbox
      label="Inline Checkbox with label"
      inline
    />
    <br />
    <br />
    <Label>Stacked inline checkboxes</Label>
    <Checkbox label="JavaScript" inline />
    <Checkbox label="PHP" inline />
    <Checkbox label="C++" inline />
    <Checkbox label="ASP.net" inline />
    <br />
    <br />
    <hr />
    <br />
    <Headline size="large">With error</Headline>
    <Checkbox
      label="Checkbox with error"
      error="This field is required"
      required
    />
    <br />
    <hr />
    <br />
    <Headline size="large">With warning</Headline>
    <Checkbox
      label="Checkbox with warning"
      warning="This is a warning"
      required
    />
    <br />
    <br />
  </div>
);

export default CheckboxExample;

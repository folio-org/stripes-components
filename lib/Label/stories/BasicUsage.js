/**
 * Label: Basic Usage
 */

import React from 'react';
import Label from '../Label';

export default () => (
  <>
    <Label>
      Simple label
    </Label>
    <br />
    <br />
    <Label required>
      Required label
    </Label>
    <br />
    <br />
    <Label readOnly>
      Read-only label
    </Label>
  </>
);

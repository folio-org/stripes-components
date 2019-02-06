/**
 * Label: Basic Usage
 */

import React, { Fragment } from 'react';
import Label from '../Label';

export default () => (
  <Fragment>
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
  </Fragment>
);

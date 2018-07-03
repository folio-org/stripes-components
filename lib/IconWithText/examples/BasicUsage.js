/**
 * IconWithText basic usage example
 */

import React, { Fragment } from 'react';
import IconWithText from '../IconWithText';

export default () => (
  <Fragment>
    <IconWithText
      text="With regular icon"
      icon="clearX"
    />
    <IconWithText
      text="With app icon"
      app="users"
    />
  </Fragment>
);

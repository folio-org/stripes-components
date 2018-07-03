/**
 * IconWithText basic usage example
 */

import React, { Fragment } from 'react';
import IconWithText from '../IconWithText';

export default () => (
  <Fragment>
    I need to be inline
    <IconWithText
      text="Hello World"
      icon="clearX"
    />
    <IconWithText
      text="Hello World"
      app="users"
    />
    <IconWithText
      text="Hello World"
      app="users"
    />
    <IconWithText
      text="Hello World"
      icon="clearX"
    />
  </Fragment>
);

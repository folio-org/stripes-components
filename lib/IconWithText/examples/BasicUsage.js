/**
 * IconWithText basic usage example
 */

import React, { Fragment } from 'react';
import IconWithText from '../IconWithText';
import Headline from '../../Headline';
import Button from '../../Button';

export default () => (
  <Fragment>
    <Headline block>Icon position: start (default)</Headline>
    <IconWithText
      text="With regular icon"
      icon="clearX"
      padding="end"
    />
    <IconWithText
      text="With app icon"
      app="users"
      padding="both"
    />
    <br /><br /><br />
    <Headline block>Icon position: end</Headline>
    <IconWithText
      text="With regular icon"
      icon="clearX"
      iconPlacement="end"
      padding="end"
    />
    <IconWithText
      text="With app icon"
      app="users"
      iconPlacement="end"
      padding="end"
    />
    <br /><br /><br />
    <Headline block>Used inside a Button</Headline>
    <Button marginBottom0>
      <IconWithText
        text="Icon position 'start'"
        icon="clearX"
      />
    </Button>
    <Button marginBottom0>
      <IconWithText
        text="Icon position 'end'"
        icon="clearX"
        iconPlacement="end"
      />
    </Button>
    <br /><br /><br />
    <Headline block>Used inside an anchor tag</Headline>
    <a href="https://www.google.com">
      <IconWithText
        text="This is a regular link"
        icon="eye-open"
      />
    </a>
  </Fragment>
);

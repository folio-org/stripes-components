/**
 * IconWithText basic usage example
 */

import React, { Fragment } from 'react';
import IconWithText from '../IconWithText';
import Headline from '../../Headline';
import Button from '../../Button';

export default () => (
  <Fragment>
    <Headline block>Icon position "start" (default)</Headline>
    <IconWithText
      text="With regular icon"
      icon="clearX"
      paddingEnd
    />
    <IconWithText
      text="With app icon"
      app="users"
      paddingEnd
    />
    <br /><br /><br />
    <Headline block>Icon position "end"</Headline>
    <IconWithText
      text="With regular icon"
      icon="clearX"
      iconPlacement="end"
      paddingEnd
    />
    <IconWithText
      text="With app icon"
      app="users"
      iconPlacement="end"
      paddingEnd
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
  </Fragment>
);

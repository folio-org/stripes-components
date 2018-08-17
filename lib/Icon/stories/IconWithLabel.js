/**
 * Icon Story: Basic Usage
 */

import React, { Fragment } from 'react';
import { select } from '@storybook/addon-knobs';
import Icon from '../Icon';
import Headline from '../../Headline';

export default () => {
  const status = select('Status', { warn: 'Warning', error: 'Error', success: 'Success', none: 'None' }, 'none');

  return (
    <Fragment>
      <Headline size="small">iconPosition: start (default)</Headline>
      <Icon
        icon="trashBin"
        status={status === 'none' ? undefined : status}
      >
        Delete
      </Icon>
      <br />
      <br />
      <Headline size="small">iconPosition: end</Headline>
      <Icon
        icon="trashBin"
        status={status === 'none' ? undefined : status}
        iconPosition="end"
      >
        Delete
      </Icon>
    </Fragment>
  );
};

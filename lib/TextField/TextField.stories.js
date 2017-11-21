import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import TextField from './TextField';

storiesOf('TextField', module)
  .add('with defaults', () => (
    <TextField />
  ))
  .add('with type', () => (
    <TextField type="email" />
  ))
  .add('no border input style', () => (
    <TextField inputStyle="noBorder" />
  ))
  .add('rounded input style', () => (
    <TextField inputStyle="rounded" />
  ))
  .add('with startControl', () => (
    <TextField startControl="" />
  ))
  .add('with endControl', () => (
    <TextField endControl="" />
  ))
  .add('with value', () => (
    <TextField value="Input value" />
  ))
  .add('with onChange handler', () => (
    <TextField onChange={() => alert('onChange')} /> // eslint-disable-line no-alert
  ))
  .add('read only', () => (
    <TextField readOnly value="Input value" />
  ))
  .add('async validating', () => (
    <TextField asyncValidating="Validating" />
  ))
  .add('with error', () => (
    <TextField error="Error" />
  ))
  .add('with warning', () => (
    <TextField warning="Warning" />
  ))
  .add('no border', () => (
    <TextField noBorder />
  ))
  .add('rounded', () => (
    <TextField rounded />
  ))
  .add('with label', () => (
    <TextField label="I am an input" />
  ))
  .add('required', () => (
    <TextField required label="I am an input" />
  ))
  .add('validation enabled', () => (
    <TextField validationEnabled label="I am an input" />
  ));

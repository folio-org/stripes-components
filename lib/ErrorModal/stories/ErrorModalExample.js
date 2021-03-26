import React from 'react';
import { action } from '@storybook/addon-actions';
import ErrorModal from '..';

export default () => (
  <ErrorModal
    open
    label="Something went wrong"
    content="Here is a detailed message that explains why the error occurred."
    bodyTag="div"
    onClose={action('Closed')}
  />
);

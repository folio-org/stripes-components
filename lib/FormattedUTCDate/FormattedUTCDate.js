import React from 'react';
import FormattedDate from '../FormattedDate';

export default function FormattedUTCDate(props) {
  return <FormattedDate timeZone="UTC" {...props} />;
}

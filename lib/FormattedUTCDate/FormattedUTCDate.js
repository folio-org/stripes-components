import React from 'react';
import { FormattedDate } from 'react-intl';

export default function FormattedUTCDate(props) {
  return <FormattedDate timeZone="UTC" {...props} />;
}

import React from 'react';
import { useIntl } from 'react-intl';
import countries from '../util/countries';

import Selection from '../Selection';

const CountrySelection = props => {
  const intl = useIntl();

  const sortedCountries = countries
    .map(c => ({
      label: intl.formatDisplayName(c.alpha2, { type: 'region' }),
      value: c.alpha2,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return <Selection {...props} dataOptions={sortedCountries} />;
};

export default CountrySelection;

import React from 'react';
import { useIntl } from 'react-intl';
import { filteredCurrencies } from '../../util/currencies';

import Select from '../Select';

const CurrencySelect = props => {
  const intl = useIntl();

  const currenciesOptions = filteredCurrencies.map(c => {
    return {
      label: `${intl.formatDisplayName(c.code, { type: 'currency' })} (${c.code})`,
      value: c.code,
    };
  }).sort((a, b) => a.label.localeCompare(b.label));

  return <Select {...props} dataOptions={currenciesOptions} />;
};

export default CurrencySelect;

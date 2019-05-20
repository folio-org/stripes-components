import React from 'react';
import * as currencies from 'currency-codes/data';

import Select from '../Select';

const CurrencySelect = props => {
  const currencyList = currencies.map(currency => (
    {
      value: currency.code,
      label: `${currency.currency} (${currency.code})`,
    }
  )).sort((a, b) => a.label.localeCompare(b.label));

  return (
    <Select
      {...props}
      dataOptions={currencyList}
    />
  );
};

export default CurrencySelect;

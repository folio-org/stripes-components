import React from 'react';

import useCurrencyOptions from '../hooks/useCurrencyOptions';

import Select from '../Select';

const CurrencySelect = props => {
  const currenciesOptions = useCurrencyOptions();

  return <Select {...props} dataOptions={currenciesOptions} />;
};

export default CurrencySelect;

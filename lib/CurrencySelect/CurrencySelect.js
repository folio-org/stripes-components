import React from 'react';
import { currenciesOptions } from '../../util/currencies';

import Select from '../Select';

const CurrencySelect = props => (
  <Select {...props} dataOptions={currenciesOptions} />
);

export default CurrencySelect;

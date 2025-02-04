import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { filteredCurrencies } from '../../util/currencies';

const useCurrencyOptions = () => {
  const intl = useIntl();

  const currenciesOptions = useMemo(() => {
    return filteredCurrencies.map(c => {
      return {
        label: `${intl.formatDisplayName(c.code, { type: 'currency' })} (${c.code})`,
        value: c.code,
      };
    }).sort((a, b) => a.label.localeCompare(b.label));
  }, [intl]);

  return currenciesOptions;
};

export default useCurrencyOptions;

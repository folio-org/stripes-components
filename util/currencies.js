import * as currencies from 'currency-codes/data';

export const currenciesByCode = currencies.reduce((map, c) => (Object.assign(map, { [c.code]: c })), {});

export const currenciesByName = currencies.reduce((map, c) => (Object.assign(map, { [c.currency]: c })), {});

export const currenciesByNumber = currencies.reduce((map, c) => (Object.assign(map, { [c.number]: c })), {});

export const currenciesOptions = currencies.map(c => ({
  label: `${c.currency} (${c.code})`,
  value: c.code,
})).sort((a, b) => a.label.localeCompare(b.label));

export default currencies;

import currencies from 'currency-codes/data';

// filter out uncommon values like currency-baskets and precious metals:
const hiddenCurrencies = [
  'XUA', // ADB Unit of Account
  'XBA', // Bond Markets Unit European Composite Unit (EURCO)
  'XBB', // Bond Markets Unit European Monetary Unit (E.M.U.-6)
  'XBD', // Bond Markets Unit European Unit of Account 17 (E.U.A.-17)
  'XBC', // Bond Markets Unit European Unit of Account 9 (E.U.A.-9)
  'XTS', // Codes specifically reserved for testing purposes
  'XAU', // Gold
  'XPD', // Palladium
  'XPT', // Platinum
  'XDR', // SDR (Special Drawing Right)
  'XAG', // Silver
  'XSU', // Sucre
  'XXX', // The codes assigned for transactions where no currency is involved
  'MXV', // Mexican Unidad de Inversion (UDI)
  'CUC', // Peso Convertible
  'USN', // US Dollar (Next Day)
  'CHE', // WIR Euro
  'CHW', // WIR Franc
  'UYI', // Uruguay Peso en Unidades Indexadas
  'UYW', // Uruguayan Unidad Previsional
];

export const filteredCurrencies = currencies.filter(c => hiddenCurrencies.indexOf(c.code) === -1);

export const currenciesByCode = filteredCurrencies.reduce((map, c) => (Object.assign(map, { [c.code]: c })), {});

export const currenciesByName = filteredCurrencies.reduce((map, c) => (Object.assign(map, { [c.currency]: c })), {});

export const currenciesByNumber = filteredCurrencies.reduce((map, c) => (Object.assign(map, { [c.number]: c })), {});

export const currenciesOptions = filteredCurrencies.map(c => ({
  label: `${c.currency} (${c.code})`,
  value: c.code,
})).sort((a, b) => a.label.localeCompare(b.label));

export default currencies;

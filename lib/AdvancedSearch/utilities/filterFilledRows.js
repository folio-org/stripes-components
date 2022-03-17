import { FIELD_NAMES } from '../constants';

const filterFilledRows = (rows) => {
  return rows.filter(row => !!row[FIELD_NAMES.QUERY]);
};

export default filterFilledRows;



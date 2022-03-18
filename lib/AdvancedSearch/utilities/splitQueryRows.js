import {
  BOOLEAN_OPERATORS,
  FIELD_NAMES,
  QUERY_OPTION_VALUE,
} from '../constants';

const splitRow = (row) => {
  const queryString = row[FIELD_NAMES.QUERY];

  const splitIntoRowsRegex = /((?:or|and|not)\s+)?([\w]+==[^\s]+)/g;

  const matches = [...queryString.matchAll(splitIntoRowsRegex)];

  return matches.map((match) => {
    const [, operator = '', query] = match;

    const [option, value] = query.split('==').map(i => i.trim());

    return {
      [FIELD_NAMES.QUERY]: value,
      [FIELD_NAMES.BOOL]: operator.trim(),
      [FIELD_NAMES.SEARCH_OPTION]: option.trim(),
    };
  });
};

const splitQueryRows = (rows) => {
  return rows.reduce((finalRows, row) => {
    if (row[FIELD_NAMES.SEARCH_OPTION] === QUERY_OPTION_VALUE) {
      // split row with multiple search options into array of rows

      const splittedRow = splitRow(row);
      const defaultRow = [{
        bool: BOOLEAN_OPERATORS.AND,
        search: '',
        searchOption: 'keyword',
      }];

      return [
        ...finalRows,
        ...(splittedRow.length ? splittedRow : defaultRow)];
    }

    return [...finalRows, row];
  }, []);
};

export default splitQueryRows;

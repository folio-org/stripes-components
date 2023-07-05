import {
  BOOLEAN_OPERATORS,
  FIELD_NAMES,
  MATCH_OPTIONS,
  QUERY_OPTION_VALUE,
} from '../constants';

const splitQueryRows = (rows, splitRow) => {
  return rows.reduce((finalRows, row) => {
    if (row[FIELD_NAMES.SEARCH_OPTION] === QUERY_OPTION_VALUE) {
      // split row with multiple search options into array of rows

      const splittedRow = splitRow(row);
      const defaultRow = [{
        bool: BOOLEAN_OPERATORS.AND,
        search: '',
        searchOption: 'keyword',
        match: MATCH_OPTIONS.EXACT_PHRASE,
      }];

      return [
        ...finalRows,
        ...(splittedRow.length ? splittedRow : defaultRow)];
    }

    return [...finalRows, row];
  }, []);
};

export default splitQueryRows;

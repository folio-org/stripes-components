import {
  BOOLEAN_OPERATORS,
  FIELD_NAMES,
  QUERY_OPTION_VALUE,
} from '../constants';

const splitRow = (row) => {
  const queryString = row[FIELD_NAMES.QUERY];

  // let's split this regex into smaller parts:
  // - ((?:or|and|not)\s+)? - this will match boolean operator at the beginning of a row.
  // - ([\w.]+==.+?(?=(or|not|and)\s[\w.]+==[^\s]+) - will match a structure like "keyword==Something something"
  // it will match any character until it finds a string: "or", "and" or "not" with a new search option.
  // - [\w.]+==.+ - this will also match a structure like "keyword==Something something".
  // this part of regex is OR'd with previous because you can't use lookahead conditionally
  const splitIntoRowsRegex = /((?:or|and|not)\s+)?([\w.]+==.+?(?=(or|not|and)\s[\w.]+==[^\s]+)|[\w.]+==.+)/g;

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

import {
  FIELD_NAMES,
  MATCH_OPTIONS
} from '../constants';

const defaultSplitRow = (row) => {
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
      [FIELD_NAMES.MATCH]: MATCH_OPTIONS.CONTAINS_ALL,
    };
  });
};

export default defaultSplitRow;

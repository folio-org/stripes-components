import {
  FIELD_NAMES,
  QUERY_OPTION_VALUE,
} from '../constants';

const defaultQueryBuilder = (rows, rowFormatter) => {
  const formatRowCondition = (row) => {
    const comparator = '==';

    // query string is already formatted, else it would result in smthn like query==subject==Music
    if (row[FIELD_NAMES.SEARCH_OPTION] === QUERY_OPTION_VALUE) {
      return row[FIELD_NAMES.QUERY];
    }

    return rowFormatter(
      row[FIELD_NAMES.SEARCH_OPTION],
      row[FIELD_NAMES.QUERY],
      comparator,
      row[FIELD_NAMES.BOOL],
    );
  };

  return rows.reduce((formattedQuery, row, index) => {
    const rowCondition = formatRowCondition(row);

    if (index === 0) {
      return rowCondition;
    }

    return `${formattedQuery} ${row[FIELD_NAMES.BOOL]} ${rowCondition}`.trim();
  }, '');
};

export default defaultQueryBuilder;

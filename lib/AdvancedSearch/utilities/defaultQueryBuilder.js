import { FIELD_NAMES } from '../constants';

const defaultQueryBuilder = (rows, rowFormatter) => {
  const formatRowCondition = (row) => {
    const comparator = '==';

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

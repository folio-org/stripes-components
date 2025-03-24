import {
  useCallback,
  useState,
  useMemo,
} from 'react';
import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import { useIntl } from 'react-intl';

import useActiveRow from '../useActiveQuery';
import splitQueryRows from '../../utilities/splitQueryRows';
import filterFilledRows from '../../utilities/filterFilledRows';
import defaultQueryBuilder from '../../utilities/defaultQueryBuilder';
import defaultRowFormatter from '../../utilities/defaultRowFormatter';
import defaultQueryToRow from '../../utilities/defaultQueryToRow';
import {
  ROW_COUNT,
  FIELD_NAMES,
  BOOLEAN_OPERATORS,
  QUERY_OPTION_VALUE,
  MATCH_OPTIONS,
} from '../../constants';

const createInitialRowState = (firstRowInitialSearch, defaultSearchOptionValue) => {
  return new Array(ROW_COUNT).fill(null).map((_, index) => ({
    [FIELD_NAMES.BOOL]: BOOLEAN_OPERATORS.AND,
    [FIELD_NAMES.QUERY]: index === 0
      ? firstRowInitialSearch?.query || ''
      : '',
    [FIELD_NAMES.SEARCH_OPTION]: index === 0
      ? firstRowInitialSearch?.option || defaultSearchOptionValue
      : defaultSearchOptionValue,
    [FIELD_NAMES.MATCH]: MATCH_OPTIONS.CONTAINS_ALL,
  }));
};

const replaceUnsupportedOptions = (row, searchOptions, defaultSearchOptionValue, hasQueryOption, open) => {
  if (!open) {
    return row;
  }

  const hasSupportedSearchOption = searchOptions.some(option => option.value === row.searchOption);

  if (hasQueryOption || hasSupportedSearchOption) {
    return row;
  }

  return {
    ...row,
    searchOption: defaultSearchOptionValue,
  };
};

const useAdvancedSearch = ({
  defaultSearchOptionValue,
  firstRowInitialSearch,
  onCancel = noop,
  onSearch = noop,
  queryBuilder = defaultQueryBuilder,
  rowFormatter = defaultRowFormatter,
  queryToRow = defaultQueryToRow,
  searchOptions = [],
  hasQueryOption,
  open,
}) => {
  const initialRowState = useMemo(() => {
    const initialRows = createInitialRowState(firstRowInitialSearch, defaultSearchOptionValue);
    return splitQueryRows(initialRows, queryToRow);
  }, [firstRowInitialSearch, defaultSearchOptionValue, queryToRow]);

  const intl = useIntl();
  const [rowState, setRowState] = useState(initialRowState);
  const [showEmptyFirstRowMessage, setShowEmptyFirstRowMessage] = useState(false);
  const [prevFirstRowInitialSearch, setPrevFirstRowInitialSearch] = useState(firstRowInitialSearch);
  const filledRows = useMemo(() => {
    const rows = splitQueryRows(rowState, queryToRow)
      .map(row => replaceUnsupportedOptions(row, searchOptions, defaultSearchOptionValue, hasQueryOption, open));

    return filterFilledRows(rows)
  }, [rowState, queryToRow, searchOptions, defaultSearchOptionValue, hasQueryOption, open]);

  const isPristine = useMemo(() => isEqual(rowState, initialRowState), [rowState, initialRowState]);

  const searchOptionsWithQuery = useMemo(() => (
    [{
      label: intl.formatMessage({ id: 'stripes-components.advancedSearch.searchOptions.query' }),
      value: QUERY_OPTION_VALUE,
    }, ...searchOptions]
  ), [intl, searchOptions]);

  const {
    resetActiveRow,
    changeActiveRow,
    updateActiveRow,
    activeQueryIndex,
  } = useActiveRow({ initialRowState });

  const resetRows = () => {
    resetActiveRow();
    setRowState(createInitialRowState(firstRowInitialSearch, defaultSearchOptionValue));
  };

  const onChange = (rowIndex, key, value) => {
    setRowState((currentRowState) => {
      const newRowState = [...currentRowState];

      newRowState[rowIndex][key] = value;
      changeActiveRow(rowIndex, key, newRowState);

      return newRowState;
    });
  };

  const handleSearch = useCallback(() => {
    if (!filledRows.length) {
      setShowEmptyFirstRowMessage(true);

      return;
    }

    setShowEmptyFirstRowMessage(false);

    const query = queryBuilder(filledRows, rowFormatter);

    onSearch(query, filledRows);
  }, [filledRows, queryBuilder, onSearch, rowFormatter]);

  const handleCancel = useCallback(onCancel, [onCancel]);

  // if the firstRowInitialSearch is updated, go ahead and update state
  // before the state is committed to the DOM...
  if (!isEqual(firstRowInitialSearch, prevFirstRowInitialSearch)) {
    const splitRows = splitQueryRows(initialRowState, queryToRow);
    setPrevFirstRowInitialSearch(firstRowInitialSearch);
    updateActiveRow(splitRows);
    setRowState(splitRows);
  }

  return {
    handleCancel,
    handleSearch,
    onChange,
    resetRows,
    rowState,
    searchOptionsWithQuery,
    showEmptyFirstRowMessage,
    filledRows,
    query: queryBuilder(filledRows, rowFormatter),
    activeQueryIndex,
    isPristine,
  };
};

export default useAdvancedSearch;

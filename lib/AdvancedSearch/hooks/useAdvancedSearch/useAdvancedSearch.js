import {
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { useIntl } from 'react-intl';

import splitQueryRows from '../../utilities/splitQueryRows';
import filterFilledRows from '../../utilities/filterFilledRows';
import {
  ROW_COUNT,
  FIELD_NAMES,
  BOOLEAN_OPERATORS,
  QUERY_OPTION_VALUE,
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
  }));
};

const useAdvancedSearch = ({
  defaultSearchOptionValue,
  firstRowInitialSearch,
  onCancel,
  onSearch,
  queryBuilder,
  rowFormatter,
  searchOptions,
}) => {
  const initialRowState = useMemo(() => {
    return createInitialRowState(firstRowInitialSearch, defaultSearchOptionValue);
  }, [firstRowInitialSearch, defaultSearchOptionValue]);

  const intl = useIntl();
  const [rowState, setRowState] = useState(initialRowState);
  const [showEmptyFirstRowMessage, setShowEmptyFirstRowMessage] = useState(false);

  const searchOptionsWithQuery = useMemo(() => (
    [{
      label: intl.formatMessage({ id: 'stripes-components.advancedSearch.searchOptions.query' }),
      value: QUERY_OPTION_VALUE,
    }, ...searchOptions]
  ), [intl, searchOptions]);

  const resetRows = () => {
    setRowState(createInitialRowState(firstRowInitialSearch, defaultSearchOptionValue));
  };

  const onChange = (rowIndex, key, value) => {
    setRowState((currentRowState) => {
      const newRowState = [...currentRowState];

      newRowState[rowIndex][key] = value;

      return newRowState;
    });
  };

  const handleSearch = useCallback(() => {
    const splitRows = filterFilledRows(splitQueryRows(rowState));

    if (!splitRows.length) {
      setShowEmptyFirstRowMessage(true);

      return;
    }

    setShowEmptyFirstRowMessage(false);

    const query = queryBuilder(splitRows, rowFormatter);

    onSearch(query, splitRows);
  }, [queryBuilder, onSearch, rowState, rowFormatter]);

  const handleCancel = useCallback(onCancel, [onCancel]);

  const handleInitialSearchChange = () => {
    const splitRows = splitQueryRows(initialRowState);

    setRowState(splitRows);
  };

  useEffect(() => {
    handleInitialSearchChange();
  }, [firstRowInitialSearch]);

  return {
    handleCancel,
    handleSearch,
    onChange,
    resetRows,
    rowState,
    searchOptionsWithQuery,
    showEmptyFirstRowMessage,
  };
};

export default useAdvancedSearch;

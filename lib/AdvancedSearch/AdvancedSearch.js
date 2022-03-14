import {
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { HotKeys } from '../HotKeys';
import AdvancedSearchModal from './components/AdvancedSearchModal';
import AdvancedSearchRow from './components/AdvancedSearchRow';
import defaultQueryBuilder from './utilities/defaultQueryBuilder';
import {
  ROW_COUNT,
  FIELD_NAMES,
  QUERY_OPTION_VALUE,
  BOOLEAN_OPERATORS,
} from './constants';

const defaultRowFormatter = (searchOption, query, comparator) => {
  return `${searchOption}${comparator}${query}`;
};

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

const propTypes = {
  children: PropTypes.func.isRequired,
  defaultSearchOptionValue: PropTypes.string,
  firstRowInitialSearch: PropTypes.shape({
    option: PropTypes.string,
    query: PropTypes.string.isRequired,
  }),
  onCancel: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  queryBuilder: PropTypes.func,
  rowFormatter: PropTypes.func,
  searchOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
};

const AdvancedSearch = ({
  open,
  searchOptions,
  onSearch,
  onCancel,
  queryBuilder,
  rowFormatter,
  defaultSearchOptionValue,
  firstRowInitialSearch,
  children,
}) => {
  const intl = useIntl();

  const initialRowState = useMemo(() => {
    return createInitialRowState(firstRowInitialSearch, defaultSearchOptionValue);
  }, [firstRowInitialSearch, defaultSearchOptionValue]);

  const [rowState, setRowState] = useState(initialRowState);

  const searchOptionsWithQuery = useMemo(() => (
    [{
      label: intl.formatMessage({ id: 'stripes-components.advancedSearch.searchOptions.query' }),
      value: QUERY_OPTION_VALUE,
    }, ...searchOptions]
  ), [intl, searchOptions]);

  const [showEmptyFirstRowMessage, setShowEmptyFirstRowMessage] = useState(false);

  const resetRows = () => {
    setRowState(createInitialRowState(firstRowInitialSearch, defaultSearchOptionValue));
  };

  const filterFilledRows = (rows) => {
    return rows.filter(row => !!row[FIELD_NAMES.QUERY]);
  };

  const onChange = (rowIndex, key, value) => {
    setRowState((currentRowState) => {
      const newRowState = [...currentRowState];

      newRowState[rowIndex][key] = value;

      return newRowState;
    });
  };

  const splitQueryRows = (rows) => {
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

    return rows.reduce((finalRows, row) => {
      if (row[FIELD_NAMES.SEARCH_OPTION] === QUERY_OPTION_VALUE) {
        // split row with multiple search options into array of rows

        return [...finalRows, ...splitRow(row)];
      }

      return [...finalRows, row];
    }, []);
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

  const handleInitialSearchChange = () => {
    const splitRows = splitQueryRows(initialRowState);

    setRowState(splitRows);
  };

  useEffect(() => {
    handleInitialSearchChange();
  }, [firstRowInitialSearch]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const hotKeys = useMemo(() => ({
    search: ['enter'],
  }), []);

  const handlers = useMemo(() => ({
    search: handleSearch,
  }), [handleSearch]);

  const renderRows = () => {
    return new Array(ROW_COUNT).fill(null).map((_, index) => (
      <AdvancedSearchRow
        key={`$advanced-search-row-${index}`}
        index={index}
        rowState={rowState[index]}
        searchOptions={searchOptionsWithQuery}
        onChange={onChange}
        errorMessage={index === 0 && showEmptyFirstRowMessage
          ? intl.formatMessage({ id: 'stripes-components.advancedSearch.emptyFirstRowError' })
          : null
        }
      />
    ));
  };

  const filledRows = filterFilledRows(rowState);

  return (
    <HotKeys
      keyMap={hotKeys}
      handlers={handlers}
    >
      <AdvancedSearchModal
        open={open}
        searchOptions={searchOptionsWithQuery}
        onCancel={handleCancel}
        onSearch={handleSearch}
      >
        {renderRows()}
      </AdvancedSearchModal>
      {children ? children({ resetRows, rowState: filledRows }) : null}
    </HotKeys>
  );
};

AdvancedSearch.propTypes = propTypes;
AdvancedSearch.defaultProps = {
  queryBuilder: defaultQueryBuilder,
  defaultSearchOptionValue: '',
  rowFormatter: defaultRowFormatter,
  firstRowInitialSearch: null,
};

export default AdvancedSearch;

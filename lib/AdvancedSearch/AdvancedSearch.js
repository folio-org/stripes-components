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

const defaultRowFormatter = (searchOption, query, comparator, bool) => {
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
  onRowsChange: PropTypes.func.isRequired,
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
  onRowsChange,
  queryBuilder,
  rowFormatter,
  defaultSearchOptionValue,
  firstRowInitialSearch,
  children,
}) => {
  const intl = useIntl();
  const initialRowState = useMemo(() => {
    return createInitialRowState(firstRowInitialSearch, defaultSearchOptionValue);
  }, [firstRowInitialSearch]);
  const [rowState, setRowState] = useState(initialRowState);
  const searchOptionsWithQuery = useMemo(() => ([{
    label: intl.formatMessage({ id: 'stripes-components.advancedSearch.searchOptions.query' }),
    value: QUERY_OPTION_VALUE,
  }, ...searchOptions]), [intl, searchOptions]);
  const [showEmptyFirstRowMessage, setShowEmptyFirstRowMessage] = useState(false);

  useEffect(() => {
    setRowState(initialRowState);
  }, [firstRowInitialSearch]);

  const resetRows = () => {
    setRowState(createInitialRowState(firstRowInitialSearch, defaultSearchOptionValue));
  };

  const filterFilledRows = (rows) => {
    return rows.filter(row => !!row[FIELD_NAMES.QUERY]);
  };

  useEffect(() => {
    const filledRows = filterFilledRows(initialRowState);
    const query = queryBuilder(filledRows, rowFormatter);
    onRowsChange(query, filledRows);
    setRowState(initialRowState);
  }, [firstRowInitialSearch]);

  const onChange = (rowIndex, key, value) => {
    setRowState((currentRowState) => {
      const newRowState = [...currentRowState];

      newRowState[rowIndex][key] = value;

      return newRowState;
    });
  };

  const splitQueryRow = (queryRow) => {
    const queryString = queryRow[FIELD_NAMES.QUERY];

    const splitIntoRowsRegex = /((?:or|and|not)\s+)?([\w]+==[^\s]+)/g;

    const matches = [...queryString.matchAll(splitIntoRowsRegex)];

    return matches.map((match) => {
      const [_, operator = '', query] = match;

      const [option, value] = query.split('==').map(i => i.trim());

      return {
        [FIELD_NAMES.QUERY]: value,
        [FIELD_NAMES.BOOL]: operator.trim(),
        [FIELD_NAMES.SEARCH_OPTION]: option.trim(),
      };
    });
  };

  const buildFinalRows = (rows) => {
    const filledRows = filterFilledRows(rows);

    return filledRows.reduce((finalRows, row) => {
      if (row[FIELD_NAMES.SEARCH_OPTION] === QUERY_OPTION_VALUE) {
        // split row with multiple search options into array of rows

        return [...finalRows, ...splitQueryRow(row)];
      }

      return [...finalRows, row];
    }, []);
  };

  const handleSearch = useCallback(() => {
    const finalRows = buildFinalRows(rowState);

    if (!finalRows.length) {
      setShowEmptyFirstRowMessage(true);

      return;
    }

    setShowEmptyFirstRowMessage(false);

    const query = queryBuilder(finalRows, rowFormatter);

    onSearch(query, finalRows);
  }, [queryBuilder, onSearch, rowState]);

  const handleInitialSearchChange = () => {
    const finalRows = buildFinalRows(initialRowState);
    const query = queryBuilder(finalRows, rowFormatter);

    setRowState(initialRowState);
    onRowsChange(query, finalRows);
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
      {children ? children({ resetRows }) : null}
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

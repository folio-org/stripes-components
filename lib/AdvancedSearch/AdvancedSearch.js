import {
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import Button from '../Button';
import AdvancedSearchModal from './components/AdvancedSearchModal';
import AdvancedSearchRow from './components/AdvancedSearchRow';
import { defaultQueryBuilder } from './utilities';
import {
  ROW_COUNT,
  FIELD_NAMES,
  QUERY_OPTION_VALUE,
} from './constants';

const propTypes = {
  defaultSearchOptionValue: PropTypes.string,
  firstRowInitialSearch: PropTypes.shape({
    option: PropTypes.string,
    query: PropTypes.string.isRequired,
  }),
  onSearch: PropTypes.func.isRequired,
  queryBuilder: PropTypes.func,
  rowFormatter: PropTypes.func,
  searchOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
};

const defaultRowFormatter = (name, query, comparator) => {
  return `${name}${comparator}${query}`;
};

const AdvancedSearch = ({
  searchOptions,
  onSearch,
  queryBuilder,
  rowFormatter,
  defaultSearchOptionValue,
  firstRowInitialSearch,
}) => {
  const intl = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialRowState = useMemo(() => {
    return new Array(ROW_COUNT).fill(null).map((_, index) => ({
      [FIELD_NAMES.BOOL]: '',
      [FIELD_NAMES.QUERY]: index === 0
        ? firstRowInitialSearch?.query || ''
        : '',
      [FIELD_NAMES.SEARCH_OPTION]: index === 0
        ? firstRowInitialSearch?.option || defaultSearchOptionValue
        : defaultSearchOptionValue,
    }));
  }, [firstRowInitialSearch]);
  const [rowState, setRowState] = useState(initialRowState);
  const searchOptionsWithQuery = useMemo(() => ([{
    label: intl.formatMessage({ id: 'stripes-components.advancedSearch.searchOptions.query' }),
    value: QUERY_OPTION_VALUE,
  }, ...searchOptions]), [searchOptions]);

  useEffect(() => {
    setRowState(initialRowState);
  }, [firstRowInitialSearch]);

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

  const handleSearch = useCallback(() => {
    const filledRows = filterFilledRows(rowState);
    const query = queryBuilder(filledRows, rowFormatter);

    onSearch(query, filledRows);
    setIsModalOpen(false);
  }, [queryBuilder, onSearch, rowState]);
  const onCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const renderRows = () => {
    return new Array(ROW_COUNT).fill(null).map((_, index) => ((
      <AdvancedSearchRow
        index={index}
        rowState={rowState[index]}
        searchOptions={searchOptionsWithQuery}
        onChange={onChange}
      />
    )));
  };

  return (
    <>
      <Button
        fullWidth
        onClick={() => setIsModalOpen(true)}
      >
        {intl.formatMessage({ id: 'stripes-components.advancedSearch.button' })}
      </Button>
      <AdvancedSearchModal
        open={isModalOpen}
        searchOptions={searchOptionsWithQuery}
        onCancel={onCancel}
        onSearch={handleSearch}
      >
        {renderRows()}
      </AdvancedSearchModal>
    </>
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

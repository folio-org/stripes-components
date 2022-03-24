import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { ROW_COUNT } from './constants';
import AdvancedSearchModal from './components/AdvancedSearchModal';
import AdvancedSearchRow from './components/AdvancedSearchRow';
import useAdvancedSearch from './hooks/useAdvancedSearch';
import defaultQueryBuilder from './utilities/defaultQueryBuilder';
import filterFilledRows from './utilities/filterFilledRows';

const defaultRowFormatter = (searchOption, query, comparator) => {
  return `${searchOption}${comparator}${query}`;
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

  const {
    handleCancel,
    handleSearch,
    onChange,
    resetRows,
    rowState,
    searchOptionsWithQuery,
    showEmptyFirstRowMessage,
  } = useAdvancedSearch({
    defaultSearchOptionValue,
    firstRowInitialSearch,
    onCancel,
    onSearch,
    queryBuilder,
    rowFormatter,
    searchOptions,
  });

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
    <>
      <AdvancedSearchModal
        open={open}
        searchOptions={searchOptionsWithQuery}
        onCancel={handleCancel}
        onSearch={handleSearch}
      >
        {renderRows()}
      </AdvancedSearchModal>
      { children ? children({ resetRows, rowState: filterFilledRows(rowState) }) : null }
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

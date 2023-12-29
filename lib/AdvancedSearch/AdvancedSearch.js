import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import AdvancedSearchModal from './components/AdvancedSearchModal';
import AdvancedSearchRow from './components/AdvancedSearchRow';
import useAdvancedSearch from './hooks/useAdvancedSearch';
import defaultQueryBuilder from './utilities/defaultQueryBuilder';
import filterFilledRows from './utilities/filterFilledRows';
import defaultRowFormatter from './utilities/defaultRowFormatter';
import { ROW_COUNT } from './constants';

const propTypes = {
  children: PropTypes.func.isRequired,
  defaultSearchOptionValue: PropTypes.string,
  firstRowInitialSearch: PropTypes.shape({
    option: PropTypes.string,
    query: PropTypes.string.isRequired,
  }),
  hasMatchSelection: PropTypes.bool,
  hasQueryOption: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  queryBuilder: PropTypes.func,
  queryToRow: PropTypes.func,
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
  hasQueryOption,
  hasMatchSelection,
  defaultSearchOptionValue,
  firstRowInitialSearch,
  queryToRow,
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
    queryToRow,
    hasQueryOption,
    open,
  });

  const renderRows = () => {
    return new Array(ROW_COUNT).fill(null).map((_, index) => (
      <AdvancedSearchRow
        key={`$advanced-search-row-${index}`}
        index={index}
        rowState={rowState[index]}
        searchOptions={hasQueryOption ? searchOptionsWithQuery : searchOptions}
        onChange={onChange}
        errorMessage={index === 0 && showEmptyFirstRowMessage
          ? intl.formatMessage({ id: 'stripes-components.advancedSearch.emptyFirstRowError' })
          : null
        }
        hasMatchSelection={hasMatchSelection}
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
  hasQueryOption: true,
  hasMatchSelection: true,
};

export default AdvancedSearch;

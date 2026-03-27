// @ts-nocheck
import { useIntl } from "react-intl";

import AdvancedSearchModal from "./components/AdvancedSearchModal";
import AdvancedSearchRow from "./components/AdvancedSearchRow";
import useAdvancedSearch from "./hooks/useAdvancedSearch";
import defaultQueryBuilder from "./utilities/defaultQueryBuilder";
import filterFilledRows from "./utilities/filterFilledRows";
import defaultRowFormatter from "./utilities/defaultRowFormatter";
import { ROW_COUNT } from "./constants";
type AdvancedSearchProps = {
  children?: (...args: any[]) => any;
  defaultSearchOptionValue?: string;
  firstRowInitialSearch?: { option?: string; query: string };
  hasMatchSelection?: boolean;
  hasQueryOption?: boolean;
  onCancel: (...args: any[]) => any;
  onSearch: (...args: any[]) => any;
  open: boolean;
  queryBuilder?: (...args: any[]) => any;
  queryToRow?: (...args: any[]) => any;
  rowFormatter?: (...args: any[]) => any;
  searchOptions: { id?: string; label: string; value: string }[];
};

const AdvancedSearch = ({
  open,
  searchOptions,
  onSearch,
  onCancel,
  queryBuilder = defaultQueryBuilder,
  rowFormatter = defaultRowFormatter,
  hasQueryOption = true,
  hasMatchSelection = true,
  defaultSearchOptionValue = "",
  firstRowInitialSearch = null,
  queryToRow,
  children,
}: AdvancedSearchProps) => {
  const intl = useIntl();

  const {
    handleCancel,
    handleSearch,
    onChange,
    resetRows,
    rowState,
    searchOptionsWithQuery,
    showEmptyFirstRowMessage,
    activeQueryIndex,
    isPristine,
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
    return new Array(ROW_COUNT)
      .fill(null)
      .map((_, index) => (
        <AdvancedSearchRow
          key={`$advanced-search-row-${index}`}
          index={index}
          rowState={rowState[index]}
          isActive={index === activeQueryIndex}
          searchOptions={
            hasQueryOption ? searchOptionsWithQuery : searchOptions
          }
          onChange={onChange}
          errorMessage={
            index === 0 && showEmptyFirstRowMessage
              ? intl.formatMessage({
                  id: "stripes-components.advancedSearch.emptyFirstRowError",
                })
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
        isPristine={isPristine}
        onCancel={handleCancel}
        onResetAll={resetRows}
        onSearch={handleSearch}
      >
        {renderRows()}
      </AdvancedSearchModal>
      {children
        ? children({ resetRows, rowState: filterFilledRows(rowState) })
        : null}
    </>
  );
};

export default AdvancedSearch;

import {
  useCallback,
  useState,
} from 'react';
import isEqual from 'lodash/isEqual';

import { FIELD_NAMES } from '../../constants';

const useActiveQuery = ({ initialRowState }) => {
  const getActiveQueryIndex = (rowState) => {
    const lastQueryIndex = rowState.findLastIndex(row => row.query);
    return lastQueryIndex === -1 ? 0 : lastQueryIndex;
  };

  const [activeQueryIndex, setActiveQueryIndex] = useState(getActiveQueryIndex(initialRowState));
  const [activeRow, setActiveRow] = useState(initialRowState[activeQueryIndex]);

  const resetActiveRow = () => {
    setActiveQueryIndex(0);
    setActiveRow(initialRowState[0]);
  };

  const changeActiveRow = useCallback((rowIndex, key, newRowState) => {
    // if the query field has been changed, then set its index, if not,
    // then set the index of the last field with a non-empty query.
    const activeIndex = key === FIELD_NAMES.QUERY
      ? rowIndex
      : getActiveQueryIndex(newRowState);

    setActiveRow(newRowState[activeIndex]);
    setActiveQueryIndex(activeIndex);
  }, []);

  // It will change `activeFieldIndex` to the index of the last non-empty query field:
  // 1. if the user changes the input value outside of the modal window and this affects the previously active row.
  // 2. if the user deletes the entire value of the query field and then preforms a search.
  const updateActiveRow = useCallback((splitRows) => {
    const arePrevAndCurRowEqual = isEqual(activeRow, splitRows[activeQueryIndex]);
    const isEmptyQuery = !splitRows[activeQueryIndex][FIELD_NAMES.QUERY];

    if (!arePrevAndCurRowEqual || arePrevAndCurRowEqual && isEmptyQuery) {
      const activeFieldIndex = getActiveQueryIndex(splitRows);

      setActiveRow(splitRows[activeFieldIndex]);
      setActiveQueryIndex(activeFieldIndex);
    }
  }, [activeRow, activeQueryIndex]);

  return {
    resetActiveRow,
    changeActiveRow,
    updateActiveRow,
    activeQueryIndex,
  };
};

export default useActiveQuery;

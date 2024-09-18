import React from 'react';
import PropTypes from 'prop-types';
import css from './Selection.css';

const SelectionList = ({
  getMenuProps,
  labelId,
  listMaxHeight,
  renderOptions,
  isOpen,
}) => (
  <ul
    {...getMenuProps({
      'aria-labelledby': labelId,
    })}
    style={{ maxHeight: listMaxHeight }}
    className={css.selectionList}
  >
    { isOpen && renderOptions()}
  </ul>
);

SelectionList.propTypes = {
  getMenuProps: PropTypes.func,
  isOpen: PropTypes.bool,
  labelId: PropTypes.string,
  listMaxHeight: PropTypes.string,
  renderOptions: PropTypes.func,
}

export default SelectionList;

import React from 'react';
import PropTypes from 'prop-types';
import css from './Selection.css';

const SelectionList = ({
  getMenuProps,
  listMaxHeight,
  renderOptions,
}) => (
  <ul
    {...getMenuProps()}
    style={{ maxHeight: listMaxHeight }}
    className={css.selectionList}
  >
    {renderOptions()}
  </ul>
);

SelectionList.propTypes = {
  getMenuProps: PropTypes.func,
  listMaxHeight: PropTypes.string,
  renderOptions: PropTypes.func,
}

export default SelectionList;

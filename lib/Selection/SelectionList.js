import React from 'react';
import PropTypes from 'prop-types';
import css from './Selection.css';

const SelectionList = ({
  getMenuProps,
  labelId,
  listMaxHeight,
  renderOptions,
}) => (
  <ul
    {...getMenuProps({
      'aria-labelledBy': labelId,
    })}
    style={{ maxHeight: listMaxHeight }}
    className={css.selectionList}
  >
    {renderOptions()}
  </ul>
);

SelectionList.propTypes = {
  getMenuProps: PropTypes.func,
  labelId: PropTypes.string,
  listMaxHeight: PropTypes.string,
  renderOptions: PropTypes.func,
}

export default SelectionList;

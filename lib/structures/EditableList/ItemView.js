import React from 'react';
import PropTypes from 'prop-types';
import css from './EditableList.css';

const ItemView = ({ cells }) => (
  <div className={css.editListRow}>
    {cells}
  </div>
);

ItemView.propTypes = {
  cells: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ItemView;

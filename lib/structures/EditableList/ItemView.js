import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '../../Button';
import css from './EditableList.css';

const ItemView = (props) => {
  const { item, error, actionSuppression, visibleFields, cells, additionalFields } = props;

  // const fields = visibleFields.map(name => (<Col key={name} xs>{item[name]}</Col>));



  return (
    <div className={css.editListRow}>
      {cells}
    </div>
  );
};

ItemView.propTypes = {
  item: PropTypes.object.isRequired,
  actionSuppression: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  visibleFields: PropTypes.arrayOf(PropTypes.string),
  additionalFields: PropTypes.object,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default ItemView;

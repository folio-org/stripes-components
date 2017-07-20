import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '../../Button';

function EditableItemRow(props) {
  const { id, item, fields, actionSuppression } = props;

  const row = fields.map(field =>
    (<Col xs key={field || 'e'}>{item[field]}</Col>));
  const actions = (
    <Row end="xs" around="xs">
      <Col xs>
        { !actionSuppression.edit(item) &&
          <Button bottomMargin0 onClick={e => props.onEditClick(id)} aria-label="Edit Item">Edit</Button>
        }
        { actionSuppression.delete(item) &&
          <Button bottomMargin0 onClick={e => props.onDeleteClick(id)} aria-label="Delete Item">Delete</Button>
        }
      </Col>
    </Row>
  );

  return (
    <form>
      <Row around="xs">
        {row}
        <Col xs>{actions}</Col>
      </Row>
    </form>
  );
}

EditableItemRow.propTypes = {
  id: PropTypes.string.isRequired,
  fields: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  item: PropTypes.object.isRequired,
  actionSuppression: PropTypes.object.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default EditableItemRow;

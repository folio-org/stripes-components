import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '../../Button';

const ItemView = (props) => {
  const { item, actionSuppression, visibleFields } = props;

  const fields = visibleFields.map(name => (<Col key={name} xs>{item[name]}</Col>));

  const actions = (
    <Row end="xs" around="xs" middle="xs">
      <Col xs>
        { !actionSuppression.edit(item) &&
          <Button bottomMargin0 onClick={props.onEdit} aria-label="Edit Item">Edit</Button>
        }
        { actionSuppression.delete(item) &&
          <Button bottomMargin0 onClick={props.onDelete} aria-label="Delete Item">Delete</Button>
        }
      </Col>
    </Row>
  );

  if(props.additionalFields) {
    for(let field of props.additionalFields) {
      fields.push((
        <field.component
          {...props}
          key={field.gloss}
        />
      ));
    }
  }

  return (
    <Row around="xs" middle="xs">
      {fields}
      <Col xs>{actions}</Col>
    </Row>
  );
};

ItemView.propTypes = {
  item: PropTypes.object.isRequired,
  actionSuppression: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  visibleFields: PropTypes.arrayOf(PropTypes.string),
};

export default ItemView;

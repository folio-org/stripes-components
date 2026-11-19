import React, { useState } from 'react';
import Label from '../../../lib/Label';
import RepeatableField from '../../../lib/RepeatableField';
import TextField from '../../../lib/TextField';
import { Row, Col } from '../../../lib/LayoutGrid';

export default function MiniRepeatableFieldExample() {
  const [fields, setFields] = useState([]);

  const handleAdd = () => {
    setFields((prev) => prev.concat({}));
  };

  const handleRemove = (index) => {
    setFields((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
  };

  return (
    <RepeatableField
      id="mini-repeatable-field"
      legend="Contributors"
      addLabel="Add contributor"
      fields={fields}
      onAdd={handleAdd}
      onRemove={handleRemove}
      hasRemoveButtonMargin={false}
      headLabels={(
        <Row>
          <Col xs={6}>
            <Label id="mini-contributor-first-name-label">First name</Label>
          </Col>
          <Col xs={6}>
            <Label id="mini-contributor-last-name-label">Last name</Label>
          </Col>
        </Row>
      )}
      renderField={(field, index) => (
        <Row>
          <Col xs={6}>
            <TextField
              aria-labelledby="mini-contributor-first-name-label"
              name={`contributors[${index}].firstName`}
            />
          </Col>
          <Col xs={6}>
            <TextField
              aria-labelledby="mini-contributor-last-name-label"
              name={`contributors[${index}].lastName`}
            />
          </Col>
        </Row>
      )}
    />
  );
}

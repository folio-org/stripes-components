import React, { Component } from 'react';
import RepeatableField from '../RepeatableField';
import Label from '../../Label';
import TextField from '../../TextField';
import { Row, Col } from '../../LayoutGrid';

export default class BasicUsage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: []
    };
  }

  handleAdd = () => {
    this.setState(({ fields }) => ({
      fields: fields.concat({})
    }));
  }

  handleRemove = (index) => {
    this.setState(({ fields }) => ({
      fields: [...fields.slice(0, index), ...fields.slice(index + 1)]
    }));
  }

  render() {
    const { fields } = this.state;
    return (
      <RepeatableField
        id="author-form"
        legend="Authors"
        addLabel="Add author"
        fields={fields}
        onAdd={this.handleAdd}
        onRemove={this.handleRemove}
        hasRemoveButtonMargin={false}
        headLabels={(
          <Row>
            <Col xs={6}>
              <Label id="author-first-name-label">First name</Label>
            </Col>
            <Col xs={6}>
              <Label id="author-last-name-label">Last name</Label>
            </Col>
          </Row>
        )}
        renderField={(field, index) => (
          <Row>
            <Col xs={6}>
              <TextField
                aria-labelledby="author-first-name-label"
                name={`authors[${index}].firstName`}
              />
            </Col>
            <Col xs={6}>
              <TextField
                aria-labelledby="author-last-name-label"
                name={`authors[${index}].lastName`}
              />
            </Col>
          </Row>
        )}
      />
    );
  }
}

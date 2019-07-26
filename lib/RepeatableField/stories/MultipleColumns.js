/**
 * RepeatableField -> Multiple columns/inputs example
 */
import React, { Component } from 'react';
import RepeatableField from '../RepeatableField';
import TextField from '../../TextField';
import { Row, Col } from '../../LayoutGrid';

export default class MultipleCoumnsExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [
        {
          name: 'John Doe',
          occupation: 'Programmer',
          age: 42,
        }
      ]
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

  handleChange = (key, index) => ({ target: { value } }) => {
    this.setState(({ fields }) => ({
      fields: fields.map((field, i) => {
        if (i === index) {
          return Object.assign(field, {
            [key]: value,
          });
        }

        return field;
      })
    }));
  }

  render() {
    const { fields } = this.state;
    return (
      <div>
        <pre>
          {JSON.stringify(fields, null, 2)}
        </pre>
        <br />
        <RepeatableField
          legend="People"
          addLabel="Add person"
          fields={fields}
          onAdd={this.handleAdd}
          onRemove={this.handleRemove}
          renderField={(field, index) => (
            <Row>
              <Col xs={6} sm={4}>
                <TextField
                  autoFocus
                  label="Name"
                  name={`people[${index}].name`}
                  id={`people-input-name-${index}`}
                  onChange={this.handleChange('name', index)}
                  value={field.name}
                />
              </Col>
              <Col xs={6} sm={4}>
                <TextField
                  label="Age"
                  name={`people[${index}].age`}
                  id={`people-input-age-${index}`}
                  onChange={this.handleChange('age', index)}
                  value={field.age}
                />
              </Col>
              <Col xs={12} sm={4}>
                <TextField
                  label="Occupation"
                  name={`people[${index}].occupation`}
                  id={`people-input-occupation-${index}`}
                  onChange={this.handleChange('occupation', index)}
                  value={field.occupation}
                />
              </Col>
            </Row>
          )}
        />
      </div>
    );
  }
}

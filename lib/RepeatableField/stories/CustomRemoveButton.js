/**
 * RepeatableField -> Custom remove button
 */
import React, { Component } from 'react';
import RepeatableField from '../RepeatableField';
import TextField from '../../TextField';
import Button from '../../Button';

export default class CustomRemoveButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [
        {
          author: 'William Shakespeare'
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
      <RepeatableField
        addLabel="Add author"
        fields={fields}
        onAdd={this.handleAdd}
        // onRemove={this.handleRemove} <- Removing this prop will remove the default delete button
        renderField={(field, index) => (
          <>
            <TextField
              label="Author"
              name="author"
              value={field.author}
              onChange={this.handleChange('author', index)}
            />
            <Button buttonStyle="danger" onClick={() => this.handleRemove(index)}>
              {`Remove ${field.author ? field.author : ''}`}
            </Button>
          </>
        )}
      />
    );
  }
}

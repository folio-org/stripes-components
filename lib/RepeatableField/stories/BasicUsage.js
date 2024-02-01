import React, { Component } from 'react';
import RepeatableField from '../RepeatableField';
import TextField from '../../TextField';

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
        emptyMessage="No authors yet."
        addLabel="Add author"
        fields={fields}
        onAdd={this.handleAdd}
        onRemove={this.handleRemove}
        renderField={() => (
          <TextField
            label="Author"
            name="author"
          />
        )}
      />
    );
  }
}

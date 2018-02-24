import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import { FieldArray } from 'redux-form';
import FieldRow from './FieldRow';

const RepeatableFieldPropTypes = {
  template: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
  ]),
  label: PropTypes.string,
  newItemTemplate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  name: PropTypes.string.isRequired,
  addLabel: PropTypes.string,
  addDefaultItem: PropTypes.bool,
  addButtonId: PropTypes.string,
};

const contextTypes = {
  _reduxForm: PropTypes.object,
};

class RepeatableField extends React.Component {
  constructor(props) {
    super(props);

    this.lastField = null;

    this.state = {
      length: 0, // eslint-disable-line react/no-unused-state
    };

    this._added = false;
    this._arrayId = `${this.props.label}-fields`;
    this.buildComponentFromTemplate = this.buildComponentFromTemplate.bind(this);
    this.addDefaultField = this.addDefaultField.bind(this);
    this.handleAddField = this.handleAddField.bind(this);
  }

  componentDidUpdate() {
    if (this._added && this.lastRow) {
      const firstInput = this.lastRow.querySelector('input, select');
      if (firstInput) {
        firstInput.focus();
        this._added = false;
      }
    }
  }

  buildComponentFromTemplate = ({ templateIndex, input, meta, ...rest }) => {
    const Component = this.props.template[templateIndex].component;
    return (
      <Component input={input} meta={meta} {...rest} />
    );
  }

  addDefaultField(fields) {
    if (this.props.newItemTemplate) {
      fields.push(cloneDeep(this.props.newItemTemplate));
    } else {
      fields.push();
    }
    this.setState({ length: fields.length }); // eslint-disable-line react/no-unused-state
  }

  handleAddField(fields) {
    if (this.props.newItemTemplate) {
      fields.push(cloneDeep(this.props.newItemTemplate));
    } else {
      fields.push();
    }
    this._added = true;
    this.setState({ length: fields.length }); // eslint-disable-line react/no-unused-state
  }

  render() {
    return (
      <FieldArray
        name={this.props.name}
        component={FieldRow}
        onAddField={this.handleAddField}
        formatter={this.buildComponentFromTemplate}
        template={this.props.template}
        containerRef={(ref) => { this.container = ref; }}
        label={this.props.label}
        newItemTemplate={this.props.newItemTemplate}
        addDefault={this.addDefaultField}
        addDefaultItem={this.props.addDefaultItem}
        addLabel={this.props.addLabel}
        addButtonId={this.props.addButtonId}
        lastRowRef={(ref) => { this.lastRow = ref; }}
      />
    );
  }
}

RepeatableField.propTypes = RepeatableFieldPropTypes;
RepeatableField.contextTypes = contextTypes;

export default RepeatableField;

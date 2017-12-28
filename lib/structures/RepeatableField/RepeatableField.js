import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { FieldArray, Field } from 'redux-form';
import Button from '../../Button';
import IconButton from '../../IconButton';
import Icon from '../../Icon';
import { Row, Col } from '../../LayoutGrid';
import omit from '../../../util/omitProps';

const propTypes = {
  template: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
  ]),
  label: PropTypes.string,
  newItemTemplate: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  addLabel: PropTypes.string,
};

class RepeatableField extends React.Component {
  constructor(props) {
    super(props);

    this.lastField = null;

    this.state = {
      length: 0,
    };

    this._added = false;
    this._arrayId = `${this.props.label}-fields`;
    this.renderFields = this.renderFields.bind(this);
    this.buildComponentFromTemplate = this.buildComponentFromTemplate.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this._added && prevState.length < this.state.length) {
      const lastInput = this.container.querySelector(`[data-key="${this.state.length}"]`);
      if (lastInput) {
        lastInput.focus();
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
  renderFields({ fields }) {
    // ensure there's always one field
    if (fields.length === 0) {
      fields.push(this.props.newItemTemplate);
    }

    // changing the last field adds an additional.
    const addField = () => {
      fields.push(this.props.newItemTemplate);
      this._added = true;
      this.setState({ length: fields.length });
    };

    const displayRemove = (field, index) => {
      // if there's only one field, don't display remove button...
      if (fields.length < 2) {
        return false;
      }

      const item = fields.get(index);

      // if it's the last value, and it's un-filled, don't show remove button...
      if (index === fields.length - 1) {
        const itemClone = cloneDeep(this.props.newItemTemplate);
        // redux-form likes to remove blank keys... so we need to do that too for our comparison...
        Object.keys(itemClone).forEach(key => (itemClone[key] === '') && delete itemClone[key]);
        if (isEqual(item, itemClone) || isEqual(item, this.props.newItemTemplate)) {
          return false;
        }
      }

      return (
        <Button
          buttonStyle="transparent"
          style={{padding: 0}}
          onClick={() => { fields.remove(index); }}
          title="remove field"
        >
          <Icon icon="trashBin" />
        </Button>
      );
    };

    return (
      <div ref={(ref) => { this.container = ref; }}>
        <h5 id={this._arrayId}>{this.props.label}</h5>
        <Row bottom="xs">
          <Col xs={8}>
            {fields.map((f, index) => (
              <Row key={`${this.props.label}-${index}`}>
                {this.props.template.map((t, i) => {
                  const { name, ...rest } = omit(t, ['component']);
                  return (
                    <Col xs key={`field-${i}`}>
                      <Field
                        name={`${this.props.name}[${index}].${name}`}
                        component={this.buildComponentFromTemplate}
                        templateIndex={i}
                        aria-labelledby={this._arrayId}
                        fullWidth
                        data-key={index}
                        {...rest}
                      />
                    </Col>
                  );
                })
                }
                <Col xs={1} >
                  {displayRemove(f, index)}
                </Col>
              </Row>
            ))}
          </Col>
          <Col xs >
            <Button
              buttonStyle="secondary"
              style={{ marginBottom: '12px' }}
              onClick={addField}
            >
              {this.props.addLabel || `+ Add ${this.props.label}`}
            </Button>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    return (
      <FieldArray
        name={this.props.name}
        component={this.renderFields}
      />
    );
  }
}

RepeatableField.propTypes = propTypes;
export default RepeatableField;

import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import uniqueId from 'lodash/uniqueId';
import { Field } from 'redux-form';
import Button from '../../Button';
import Icon from '../../Icon';
import { Row, Col } from '../../LayoutGrid';
import css from './RepeatableField.css';
import omit from '../../../util/omitProps';
import SRStatus from '../../SRStatus';

const FieldRowPropTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  fields: PropTypes.object,
  addDefaultItem: PropTypes.bool,
  addDefault: PropTypes.func,
  newItemTemplate: PropTypes.object,
  lastRowRef: PropTypes.func,
  formatter: PropTypes.func,
  template: PropTypes.arrayOf(PropTypes.object),
  addLabel: PropTypes.string,
  containerRef: PropTypes.func,
  onAddField: PropTypes.func,
  addButtonId: PropTypes.string,
};

class FieldRow extends React.Component {
  constructor(props) {
    super(props);

    this.displayRemoveButton = this.displayRemoveButton.bind(this);
    this.refIfLastRow = this.refIfLastRow.bind(this);
    this.renderControl = this.renderControl.bind(this);
    this.addButton = null;
    this.srstatus = null;
    this.action = null;

    this.addButtonId = this.props.addButtonId || uniqueId(`${this.props.label}AddButton`);
  }

  componentDidMount() {
    if (this.props.fields.length === 0 && this.props.addDefaultItem) {
      setTimeout(() => { this.props.addDefault(this.props.fields); }, 5);
    }
  }

  componentDidUpdate() {
    if (this.action) {
      if (this.action.type === 'add') {
        this.srstatus.sendMessage(`added new ${this.props.label} field. ${this.props.fields.length} ${this.props.label} total`);
        this.action = null;
      }
      if (this.action.type === 'remove') {
        const { item } = this.action;
        let contextualSpeech;
        if (typeof item === 'string') {
          contextualSpeech = this.action.item;
        } else if (typeof item === 'object') {
          const valueArray = [];
          for (const key in item) {
            if (typeof item[key] === 'string' && item[key].length < 25) {
              valueArray.push(item[key]);
            }
          }
          if (valueArray.length > 0) {
            contextualSpeech = valueArray.join(' ');
          } else {
            contextualSpeech = this.action.index;
          }
        }
        this.srstatus.sendMessage(`${this.props.label} ${contextualSpeech} has been removed. ${this.props.fields.length} ${this.props.label} total`);
        this.action = null;
        document.getElementById(this.addButtonId).focus();
      }
    }
  }

  handleRemove(index, item) {
    this.action = { type: 'remove', item, index };
    this.props.fields.remove(index);
  }

  handleAdd() {
    this.action = { type: 'add' };
  }

  displayRemoveButton = (field, index) => {
    const { fields } = this.props;
    const item = fields.get(index);

    // if there's only one field, don't display remove button...
    if (fields.length < 2 && (item === undefined || item === '')) {
      return false;
    }
    // if it's the last value, and it's un-filled, don't show remove button...
    if (index === fields.length - 1) {
      if (this.props.newItemTemplate) {
        const itemClone = cloneDeep(this.props.newItemTemplate);
        // redux-form likes to remove blank keys... so we need to do that too for our comparison...
        Object.keys(itemClone).forEach(key => (itemClone[key] === '') && delete itemClone[key]);
        if (isEqual(item, itemClone) || isEqual(item, this.props.newItemTemplate)) {
          return false;
        }
      } else if (item === undefined) {
        return false;
      }
    }

    return (
      <Button
        buttonStyle="link"
        style={{ padding: 0, marginBottom: '12px' }}
        onClick={() => { this.handleRemove(index, item); }}
        title={`remove fields for ${this.props.label} ${index + 1}`}
      >
        <Icon icon="trashBin" />
      </Button>
    );
  };

  refIfLastRow(ref, index) {
    const { fields } = this.props;
    if (index === fields.length - 1) {
      this.lastRow = ref;
      this.props.lastRowRef(ref);
    }
  }

  renderControl(fields, field, fieldIndex, template, templateIndex) {
    if (template.render) {
      return template.render({ fields, field, fieldIndex, templateIndex });
    }

    const { name, label, ...rest } = omit(template, ['component', 'render']);
    const labelProps = {};
    if (fieldIndex === 0) {
      labelProps.label = label;
    } else {
      labelProps['aria-label'] = `${label} ${fieldIndex}`;
    }
    return (
      <Field
        name={name ? `${fields.name}[${fieldIndex}].${name}` : `${fields.name}[${fieldIndex}]`}
        component={this.props.formatter}
        templateIndex={templateIndex}
        id={uniqueId(field)}
        fullWidth
        {...labelProps}
        data-key={fieldIndex}
        {...rest}
      />
    );
  }

  render() {
    const { fields } = this.props;
    let addLabel = `+ Add ${this.props.label}`;
    if (this.props.addLabel) {
      addLabel = this.props.addLabel;
    }

    if (this.props.fields.length === 0 && !this.props.addDefaultItem) {
      return (
        <div ref={this.props.containerRef}>
          <SRStatus ref={(ref) => { this.srstatus = ref; }} />
          <fieldset>
            <legend id={this._arrayId} className={css.RFLegend}>{this.props.label}</legend>
            <Row>
              <Col xs={11} sm={8}>
                <Button
                  buttonStyle="fullWidth"
                  style={{ marginBottom: '12px' }}
                  onClick={() => { this.props.onAddField(fields); }}
                  ref={(ref) => { this.addButton = ref; }}
                  id={this.addButtonId}
                >
                  {this.props.addLabel ? this.props.addLabel : `+ Add ${this.props.label}`}
                </Button>
              </Col>
            </Row>
          </fieldset>
        </div>
      );
    }
    return (
      <div ref={this.props.containerRef}>
        <SRStatus ref={(ref) => { this.srstatus = ref; }} />
        <fieldset>
          <legend id={this._arrayId} className={css.RFLegend}>{this.props.label}</legend>

          {fields.map((f, fieldIndex) => (
            <div key={`${this.props.label}-${fieldIndex}`} style={{ width: '100%' }} ref={(ref) => { this.refIfLastRow(ref, fieldIndex); }}>
              <Row bottom="xs">
                <Col xs={11} sm={8}>
                  <Row>
                    {this.props.template.map((t, i) => (
                      <Col xs key={`field-${i}`}>
                        {this.renderControl(fields, f, fieldIndex, t, i, this._arrayId)}
                      </Col>
                    ))}
                  </Row>
                </Col>
                <Col xs={1}>
                  {this.displayRemoveButton(f, fieldIndex)}
                </Col>
                <Col xs={12} sm={3}>
                  {fieldIndex === fields.length - 1 &&
                    <Button
                      buttonStyle="fullWidth"
                      style={{ marginBottom: '12px' }}
                      onClick={() => { this.props.onAddField(fields); }}
                      ref={(ref) => { this.addButton = ref; }}
                      id={this.addButtonId}
                    >
                      {addLabel}
                    </Button>
                  }
                </Col>
              </Row>
            </div>
          ))}
        </fieldset>
      </div >
    );
  }
}

FieldRow.propTypes = FieldRowPropTypes;

export default FieldRow;

import React from 'react'
import PropTypes from 'prop-types';
import Button from '@folio/stripes-components/lib/Button';
import Icon from '@folio/stripes-components/lib/Icon';
import { FieldArray, Field } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';

const propTypes = {
  template: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.object,
  ]),
  newItemTemplate: PropTypes.object.isRequired,
  name: PropTypes.string,
  addLabel: PropTypes.string,
};

class RepeatableField extends React.Component {
  constructor(props) {
    super(props);

    this.lastField = null;

    this.state = {
      added: false,
      length: 0,
    };

    this._arrayId = `${this.props.label}-fields`;
    this.renderFields = this.renderFields.bind(this);
    this.buildComponentFromTemplate = this.buildComponentFromTemplate.bind(this);
  }

  buildComponentFromTemplate = ({templateIndex, input, meta, ...rest}) => {
    const Component = this.props.template[templateIndex].component;
    return (
      <Component input={input} meta={meta} {...rest}/> 
    );
  }
  
  componentDidUpdate(prevProps, prevState) {
    if(this.state.added && prevState.length < this.state.length){
      const lastInput = this.container.querySelector(`[data-key="${this.state.length}"]`);
      if (lastInput) {
        lastInput.focus();
        this.setState({ added: false });
      }
    }
  }

  renderFields({fields}) {
    //ensure there's always one field
    if(fields.length === 0) {
      fields.push(this.props.newItemTemplate);
    }

    //changing the last field adds an additional.
    const addField = () => {
      fields.push(this.props.newItemTemplate);
      this.setState({added:true, length:fields.length});      
    }

    const displayRemove = (field, index) => {
      // if there's only one field, don't display remove button...
      if (fields.length < 2 ) {
        return false;
      }

      const item = fields.get(index);
      
      // if it's the last value, and it's un-filled, don't show remove button...
      if ( index === fields.length-1 ) {
        let itemClone = cloneDeep(this.props.newItemTemplate);
        // redux-form likes to remove blank keys... so we need to do that too for our comparison...
        Object.keys(itemClone).forEach((key) => (itemClone[key] == "") && delete itemClone[key]);
        if ( isEqual(item, itemClone) || isEqual(item, this.props.newItemTemplate) ) {
          return false;
        }
      }

      return (
          <Button 
            buttonStyle="transparent"
            onClick={() => {fields.remove(index);}}
            title="remove field"
          >
            <Icon icon="trashBin"/>
          </Button>
      );
    }

    return (
      <div ref={(ref) => { this.container = ref;}}>
        <h5 id={this._arrayId}>{this.props.label}</h5>
        <Row bottom="xs">
          <Col xs={8}>
          {fields.map((f, index) => (
            <Row key={`${this.props.label}-${index}`}>
              { this.props.template.map((t, i) => {
                  const {name, component, ...rest} = t;
                  return (
                    <Col xs key={`field-${i}`}>
                      <Field 
                        name={`${this.props.name}[${index}].${name}`}
                        component={this.buildComponentFromTemplate}
                        templateIndex = {i}
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
                { displayRemove(f, index) }
              </Col>
            </Row>
          ))}
          </Col>
          <Col xs >
            <Button buttonStyle="secondary" style={{marginBottom: '8px'}}
              onClick={addField}
            >
             { this.props.addLabel || `+ Add ${this.props.label}`}
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

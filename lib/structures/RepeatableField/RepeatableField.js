import React from 'react'
import PropTypes from 'prop-types';
import Button from '@folio/stripes-components/lib/Button';
import Icon from '@folio/stripes-components/lib/Icon';
import { FieldArray, Field } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';

const propTypes = {
  template: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.object,
  ]),
  name: PropTypes.string,
};


class RepeatableField extends React.Component {
  constructor(props) {
    super(props);

    this._arrayId = `${this.props.label}-fields`;
    this.renderFields = this.renderFields.bind(this);
    // this.generateFieldComponents = this.generateFieldComponents.bind(this);
    this.buildComponentFromTemplate = this.buildComponentFromTemplate.bind(this);
  }

  buildComponentFromTemplate = ({templateIndex, input, meta, ...rest}) => {
    const Component = this.props.template[templateIndex].component;
    return (
      <Component input={input} meta={meta} {...rest}/> 
    );
  }
  
  // create components based 
  // generateFieldComponents(fields, index, cbOnChange) {
  //   return (
      
  //   );
  // }

  renderFields({fields}) {

    //ensure there's always one field
    if(fields.length === 0) {
      fields.push({name:"", type:"Yes"});
    }

    //changing the last field adds an additional.
    const addFieldIfLast = (i) => {
      if(i === fields.length-1){
        fields.push({name:"", type:"Yes"});
      }
    }

    return (
      <div>
        <h5 id={this._arrayId}>{this.props.label}</h5>
        {fields.map((f, index) => (
          <Row key={index}>
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
                      validationEnabled={false}
                      {...rest}
                      onChange={() => { addFieldIfLast(index); }}
                    />
                  </Col>
                );
              }) 
            }
            <Col xs>
              {fields.length > 1 &&
                <Button buttonStyle="transparent"
                  onClick={() => {fields.remove(index);}}
                  title="remove field"
                ><Icon icon="trashBin"/></Button>
              }
            </Col>
          </Row>
        ))}
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
RepeatableField.contextTypes = propTypes;
export default RepeatableField;

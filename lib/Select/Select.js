import React from 'react';
import css from './Select.css'

const propTypes = {
  dataOptions: React.PropTypes.arrayOf(React.PropTypes.object),
  meta: React.PropTypes.object
};

const defaultProps = {
  meta: {},
}

class Select extends React.Component{
  constructor(props){
    super(props);
  }
  
  getRootClass(){
    let rootClass = css.root;
    rootClass += this.props.fullWidth? ' ' + css.fullWidth: '';
    return rootClass;
  }
  
  getLabelClass(){
    let labelClass = css.selectLabel;
    labelClass += this.props.required? ' '+ css.required : '';
    return labelClass;
  }
  
  getSelectClass(){
    let selectClass = css.selectControl;
    selectClass += this.props.fullWidth? ' '+ css.fullWidth : '';
    selectClass += this.props.error? ' '+ css.error : '';
    return selectClass;
  }
  
  render(){
    const {input, meta:{error, warning, touched}, ...rest} = this.props;
    const {...selectAttr} = input;
    const {label, placeholder, dataOptions, children, fullWidth, marginBottom0, ...selectCustom} = {...rest};
    
    let options = [];
    
    this.props.placeholder? options.push(<option value="placeholder" key="x" disabled selected>{placeholder}</option>):null;
    
    if(dataOptions) {
      dataOptions.map(function(option, i){
        options.push(<option value={option.value} key={option.id || 'option'+i}>{option.label}</option>);
      }, this);
    }
    
    const component = <select className={this.getSelectClass()} {...selectAttr} {...selectCustom} >
                        {options}
                        {children}
                      </select>
    const errorElem = touched && error? <div className={css.selectError}>{error}</div> : null;
    const warningElem = touched && warning? <div className={css.selectWarning}>{warning}</div> : null;
    
    if(label){
      return(
        <div className={this.getRootClass()}>
          <label htmlFor={this.props.id} className={this.getLabelClass()}>{label}</label>
          {component}
          {warningElem}
          {errorElem}
        </div>
      );
    }
    else{
      return component;
    }
  }
}

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

export default Select;



import React from 'react';
import css from './Select.css'

const propTypes = {
  dataOptions: React.PropTypes.arrayOf(React.PropTypes.object)
};

class Select extends React.Component{
  constructor(props){
    super(props);
  }
  
  getRootClass(){
    let rootClass = css.root;
    rootClass += this.props.fullWidth? ' ' + css.fullWidth: '';
    return rootClass;
  }
  
  getSelectClass(){
    let selectClass = css.selectControl;
    selectClass += this.props.fullWidth? ' '+ css.fullWidth : '';
    selectClass += this.props.error? ' '+ css.error : '';
    return selectClass;
  }
  
  render(){
    const {label, placeholder, dataOptions, children, ...selectProps} = this.props;
    
    let options = [];
    
    this.props.placeholder? options.push(<option selected disabled>{this.props.placeholder}</option>):null;
    
    if(this.props.dataOptions) {
      this.props.dataOptions.map(function(option, i){
        options.push(<option value={option.value} key={option.id}>{option.labelText}</option>);
      }, this);
    }
    
    const component = <select className={this.getSelectClass()} {...selectProps}>
                        {options}
                        {this.props.children}
                      </select>
    if(this.props.label){
      return(
        <div className={this.getRootClass()}>
          <label htmlFor={this.props.id}>{this.props.label}</label>
          {component}
        </div>
      );
    }
    else{
      return component;
    }
  }
}

Select.propTypes = propTypes;

export default Select;



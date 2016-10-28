import React from 'react'
import css from './TextField.css'

const propTypes = {
  type: React.PropTypes.string,
  rounded: React.PropTypes.bool,
  endControl: React.PropTypes.element,
  startControl: React.PropTypes.element
};

const defaultProps = {
  type: "text"
};

class TextField extends React.Component{
  constructor(props){
    super(props);
  }
  
  getRootStyle(){
    let rootStyle = css.root;
    rootStyle += this.props.fullWidth? ' ' + css.rootFull : '';
    return rootStyle;
  }
  
  getInputStyle(){
    let inputStyle = css.textField;
    inputStyle += this.props.fullWidth? ' ' + css.textFieldFull : '';
    inputStyle += this.props.error? ' ' + css.textFieldError : '';
    inputStyle += this.props.rounded? ' ' + css.rounded : '';
    inputStyle += this.props.endControl? ' ' + css.hasEndControl: '';
    inputStyle += this.props.startControl? ' ' + css.hasStartControl: '';
    inputStyle += this.props.marginBottom0? ' marginBottom0': '';
    return inputStyle;
  }
  
  render(){
    const {label, endControl, startControl, rounded, ...inputProps} = this.props;
    const component = <input className={this.getInputStyle()} {...inputProps} />
    
    const endControlElement = <div className={css.endControl}>{endControl}</div>;
    const startControlElement = <div className={css.startControl}>{startControl}</div>;
    if(label || endControl){
      return(
        <div className={this.getRootStyle()}>
          <label htmlFor={this.props.id}>{label}</label>
          {startControlElement}
          {component}
          {endControlElement}
        </div>
      );
    }
    else
    {
      return component;
    }
  }
}

TextField.propTypes = propTypes;
TextField.defaultProps = defaultProps;

export default TextField;


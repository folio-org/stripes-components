import React from 'react'
import css from './TextField.css'

const propTypes = {
  /**
   * Can be "type" or "number". Standard html attribute.
   */
  type: React.PropTypes.string,
  /**
   * Apply border radius to input.
   */
  rounded: React.PropTypes.bool,
  /**
   * Control or Icon to display at the start of the textfield.
   */
  startControl: React.PropTypes.element,
  /**
   * Control or Icon to display at the start of the textfield.
   */
  endControl: React.PropTypes.element,
  /**
   * String of text to display.
   */
  value: React.PropTypes.string,
  /**
   * Event handler for text input. Required if a value is supplied.
   */
  onChange: React.PropTypes.func,
  
  error: React.PropTypes.string,
  warning: React.PropTypes.string
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
    if(this.props.meta){
      inputStyle += this.props.meta.error || this.props.meta.warning? ' ' + css.textFieldHasFeedback : '';
      inputStyle += this.props.meta.touched && this.props.meta.error? ' ' + css.textFieldHasError : ''; 
    }
    inputStyle += this.props.rounded? ' ' + css.rounded : '';
    inputStyle += this.props.endControl? ' ' + css.hasEndControl: '';
    inputStyle += this.props.startControl? ' ' + css.hasStartControl: '';
    inputStyle += this.props.marginBottom0? ' marginBottom0': '';
    return inputStyle;
  }
  
  getLabelStyle(){
    let labelStyle = css.textFieldLabel;
    labelStyle += this.props.required? ' '+ css.required: '';
    return labelStyle;
  }
  
  render(){
    let cleanedProps, inputProps;
    if(this.props.input){
      var {input, meta:{error, warning, touched}, ...rest} = this.props;
      var {...inputAttr} = input;
      inputProps = {...inputAttr};
      cleanedProps = {...rest}
    }else{
      cleanedProps = this.props;
      inputProps = null;
    }
    
    const {label, endControl, startControl, rounded, required, fullWidth, bottomMargin0, ...inputCustom} = cleanedProps;
    
    const component = <input className={this.getInputStyle()} {...inputProps} {...inputCustom} aria-required={required}/>
    
    const endControlElement = <div className={css.endControl}>{endControl}</div>;
    const startControlElement = <div className={css.startControl}>{startControl}</div>;
    
    let warningElement, errorElement;
    if(this.props.meta){
      warningElement = touched && warning?  <div className={css.textfieldWarning}>{warning}</div> : null;
      errorElement = touched && error? <div className={css.textfieldError}>{error}</div> : null;
    }
    if(label || endControl){
      return(
        <div className={this.getRootStyle()}>
          <label htmlFor={this.props.id} className={this.getLabelStyle()}>{this.props.label}</label>
          {startControlElement}
          {component}
          {endControlElement}
          {warningElement}
          {errorElement}
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


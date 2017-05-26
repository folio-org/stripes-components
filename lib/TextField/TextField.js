import React from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import Button from '../Button';
import css from './TextField.css';

const propTypes = {
  /**
   * Can be "type" or "number". Standard html attribute.
   */
  type: React.PropTypes.string,
  /**
   * String of preset styles to apply to textfield. possible values: noBorder, rounded
   */
  inputStyle: React.PropTypes.string,
  /**
   * Control or Icon to display at the start of the textfield.
   */
  startControl: React.PropTypes.element,
  /**
   * Control or Icon to display at the end of the textfield.
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
  
  /**
   * Render textfield as readonly, disable clear action.
   */
  readOnly: React.PropTypes.bool,
  asyncValidating: React.PropTypes.string,
  
  error: React.PropTypes.string,
  warning: React.PropTypes.string
};

const defaultProps = {
  type: "text"
};

class TextField extends React.Component {
  constructor(props){
    super(props);
    
    this.input = null;
    this.startControl = null;
    this.endControl = null;
    
    this.calcPadding = this.calcPadding.bind(this);
    this.clearField = this.clearField.bind(this);
  }
  
  componentDidMount(){
    // calculate padding only if endControl or startControl are in use.
    if(this.props.endControl || this.props.startControl){
      requestAnimationFrame(()=>{
        if (this.input){
          const paddingObject = this.calcPadding();
          Object.assign(this.input.style, paddingObject);
        }
      });
    }
  }
  
  componentDidUpdate(prevProps){
    let shouldUpdatePadding = false;
    if(prevProps.endControl !== this.props.endControl ||
        prevProps.startControl !== this.props.startControl){
      shouldUpdatePadding = true;
    }
    
    if(prevProps.meta){
      if(prevProps.meta.asyncValidating !== this.props.meta.asyncValidating){
        shouldUpdatePadding = true;
      }
    }

    if (shouldUpdatePadding) {
      requestAnimationFrame(()=>{
        if (this.input){
          const paddingObject = this.calcPadding();
          Object.assign(this.input.style, paddingObject);
        }
      });
    }
  }
  
  getInput(){
    return this.input;
  }
  
  focusInput(){
    this.input.focus();
  }

  getInputStyle(){;
    let csslist;
    if(/\s/.test(this.props.inputStyle)){
      let tempClasses = this.props.inputStyle.split(/\s+/);
      csslist = tempClasses.map( classname => inputStyle += ' ' + css[classname]);
    }
    
    let validationClasses;
    if(this.props.meta){
      validationClasses = classNames(
        {[`${css.textFieldHasFeedback}`]:this.props.meta.error || this.props.meta.warning},
        {[`${css.textFieldError}`]: this.props.meta.touched && this.props.meta.error},
        {[`${css.textFieldValid}`]: this.props.meta.touched && !this.props.meta.asyncValidating && this.props.meta.valid},
      )
    }
    
    return classNames(
      css.input, 
      csslist, 
      {[`${css.rounded}`] : this.props.rounded },
      {[`${css.noBorder}`] : this.props.noBorder },
      {[`${css.marginBottom0}`] : this.props.marginBottom0 },
      validationClasses
    );
  }
  
  calcPadding(){
    let start, end;
    if(window.getComputedStyle(this.input).direction === 'rtl'){
      start = "right";
      end = "left";
    }else{
      start = "left";
      end = "right";
    }
    
    const startWidth = this.startControl.getBoundingClientRect().width + 4;
    const endWidth = this.endControl.getBoundingClientRect().width + 4;
    
    let styleObject = {};
    styleObject[`padding-${start}`] = `${startWidth}px`;
    styleObject[`padding-${end}`] = `${endWidth}px`;
    
    return styleObject;
  }
  
  clearField(e){
    this.input.value = "";
    if(this.props.input) {
      var event = new Event('input', { bubbles: true });
      this.input.dispatchEvent(event);
    }
    setTimeout(() => {this.input.focus()}, 5);
  }
  
  render() {
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
    
    const {
      label,
      endControl, 
      startControl, 
      rounded, 
      required, 
      fullWidth, 
      marginBottom0, 
      noBorder, 
      ...inputCustom
    } = cleanedProps;

    const component = ( 
      <input 
        ref={(ref) => {this.input = ref;}} 
        className={this.getInputStyle()} 
        {...inputProps} 
        {...inputCustom} 
        aria-required={required}
      />
    );
    
    let validation = null;
    let clearField = null;
    if(this.props.meta){
      if(this.props.meta.asyncValidating && !this.props.meta.active){ validation = <Icon title="validating" width="30px" height="28px" icon="spinner-ellipsis" />;}
      
      if(this.props.meta.touched && !this.props.meta.active && this.props.meta.valid && !this.props.meta.asyncValidating){ validation =  <Icon title="Field is valid" icon="validation-check" />;}
      if(this.props.meta.touched && !this.props.meta.active && !this.props.meta.valid && !this.props.meta.asyncValidating){ 
        if(this.input.value === "" || !this.input.value){
          validation = <Icon title="Field has error" icon="validation-error" />;
        }else{
          validation = <div style={{display:"flex", alignItems:"center"}}><Icon title="Field has error" icon="validation-error" /></div>;
          clearField = <div style={{display:"flex", alignItems:"center"}}><Button title="Clear this field" buttonStyle="fieldControl" onClick={this.clearField}><Icon icon="closeX" /></Button></div>
        }
      }
      if(this.props.meta.active && this.props.input.value !== ''){
        clearField = <div style={{display:"flex", alignItems:"center"}}><Button title="Clear this field" buttonStyle="fieldControl" onMouseDown={this.clearField} tabIndex="-1"><Icon icon="closeX" /></Button></div>
      }
    }
    
    const endControlElement = <div className={css.endControls}><div className={css.controlGroup} ref={ref => this.endControl = ref}>{!this.props.readOnly && clearField}{validation}{endControl}</div></div>;
    const startControlElement = <div className={css.startControls}><div className={css.controlGroup} ref={ref => this.startControl = ref}>{startControl}</div></div>;

    let warningElement, errorElement;
    if(this.props.meta){
      warningElement = touched && warning?  <div className={css.textfieldWarning}>{warning}</div> : null;
      errorElement = touched && error? <div className={css.textfieldError}>{error}</div> : null;
    }

    return (
      <div className={css.root}>
        { label && <label htmlFor={this.props.id} className={css.label}>{label}</label> }
        <div className={css.inputGroup}>
          {startControlElement}
          {component}
          {endControlElement}
        </div>
        {warningElement}
        {errorElement}
      </div>
    );
  }
  
}

export default TextField;

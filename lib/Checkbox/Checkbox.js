import React from 'react';
import css from './Checkbox.css';

const propTypes = {
  checkedIcon: React.PropTypes.element,
  uncheckedIcon: React.PropTypes.element,
  tertiaryIcon: React.PropTypes.element,
}

class Checkbox extends React.Component{
  constructor(props){
    super(props);
    
    this.state = {
      inputChecked: false,
      inputIndeterminate: false,
      inputInFocus: false,
    }
    
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  getLabelStyle(){
    return this.props.labelClass || css.checkboxLabel;
  }

 getRootStyle(){
  let rootStyle = this.props.hover? css.root + ' ' + css.rootHover : css.root;
  let hovered = '';
  if(this.props.hover && this.state.inputInFocus){
    hovered = ' ' + css.hovered;
  }
  rootStyle += hovered;
  rootStyle += this.props.fullWidth? ' ' +css.rootFullWidth : ' ';
  rootStyle += this.props.marginBottom0? ' '+css.marginBottom0 : ' ';
  rootStyle += this.props.inline? ' ' + css.inline: '';
  if(this.props.meta){
    rootStyle += this.props.meta.error || this.props.meta.warning? ' ' + css.checkboxHasFeedback: '';
  }
  
   return rootStyle;
 }

  getContainerStyle(){
    let containerStyle = css.root;
    containerStyle += this.props.fullWidth? ' ' +css.rootFullWidth : ' ';
    containerStyle += this.props.marginBottom0? ' '+css.marginBottom0 : ' ';
    containerStyle += this.props.inline? ' ' + css.inline: '';
    return containerStyle;
  }

  getInputStyle(){
    const base = css.checkboxInput;
    let hidden = '';
    if(this.props.checkedIcon || this.props.uncheckedIcon || this.props.tertiaryIcon){
      hidden = css.hidden;
    }
    return `${base} ${hidden}`;
  }
  
  componentDidMount(){
    this.setState({
      inputChecked: this.input.checked,
      inputIndeterminate: this.input.indeterminate,
    })
  }
  
  handleChange(e){
    this.setState({
      inputChecked: this.input.checked,
      inputIndeterminate: this.input.indeterminate,
    });
   
    this.props.input? this.props.input.onChange(e): this.props.onChange(e);
  }
  
  handleFocus(e){
    this.setState({
      inputInFocus:true
    });
    
    this.props.input? this.props.input.onFocus(e): null;
    this.props.onFocus? this.props.onFocus(e) : null;
  }
  
  handleBlur(e){
    this.setState({
      inputInFocus:false
    });
    
    this.props.input? this.props.input.onBlur(e): null;
    this.props.onBlur? this.props.onBlur(e): null;
  }
  
  render(){
    let cleanedProps, inputProps;
    if(this.props.input){
      var {input, meta:{error, warning, touched}, ...rest} = this.props;
      var {onChange, onFocus, onBlur, ...inputAttr} = input;
      inputProps = {...inputAttr};
      cleanedProps = {...rest};
    }else{
      cleanedProps = this.props;
      inputProps = null;
    }
    
    const {label, required, fullWidth, marginBottom0, hover, checkedIcon, uncheckedIcon, tertiaryIcon, ...inputCustom} = cleanedProps;
    
    let warningElement;
    if(this.props.meta){
      warningElement = touched && warning? <div className={css.checkboxWarning}>{warning}</div>: null;
    }
    
    
    let iconElement = null;
    if(checkedIcon || uncheckedIcon || tertiaryIcon){
      let icon = null;
      let ariaStatus = null;
      if(this.state.inputChecked){
        icon = this.props.checkedIcon;
        ariaStatus = "true";
      }else{
        icon = this.props.uncheckedIcon;
        ariaStatus = "false";
      }
      if(this.state.inputIndeterminate){
        icon = this.props.tertiaryIcon;
        ariaStatus = "mixed";
      }
      iconElement = <label className={css.iconContainer} htmlFor={this.props.id} >{icon}</label>
    }
    
    let ariaProps = {};
    if(!this.props.name || !this.props.input){
      ariaProps['aria-label'] = `checkbox ${this.props.label}`;
    }
    const {...inputAriaProps} = ariaProps;
    
    return (
      <div className={this.getContainerStyle()}>
        <div className={this.getRootStyle()}>
          <input type="checkbox" {...inputAriaProps} {...inputProps} {...inputCustom} className={this.getInputStyle()} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} ref={(ref)=> this.input = ref} />
          {iconElement}
          <label className={this.getLabelStyle()} htmlFor={this.props.id}>
              {label}
          </label>
        </div>
        {warningElement}
     </div>
    );
  }
}

Checkbox.proptypes = propTypes;

export default Checkbox;



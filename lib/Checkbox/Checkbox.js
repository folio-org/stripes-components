import React from 'react';
import css from './Checkbox.css';

class Checkbox extends React.Component{
  constructor(props){
      super(props);
  }

  getLabelStyle(){
    return this.props.className || css.checkboxLabel;
  }

 getRootStyle(){
  let rootStyle = this.props.hover? css.root + ' ' + css.rootHover : css.root;
  rootStyle += this.props.fullWidth? ' ' +css.rootFullWidth : ' ';
  rootStyle += this.props.marginBottom0? ' '+css.marginBottom0 : ' ';
  rootStyle += this.props.inline? ' ' + css.inline: '';
  if(this.props.meta){
    rootStyle += this.props.meta.error || this.props.meta.warning? ' ' + css.checkboxHasFeedback: '';
  }
   return rootStyle;
 }

  render(){
    let cleanedProps, inputProps;
    if(this.props.input){
      var {input, meta:{error, warning, touched}, ...rest} = this.props;
      var {...inputAttr} = input;
      inputProps = {...inputAttr};
      cleanedProps = {...rest};
    }else{
      cleanedProps = this.props;
      inputProps = null;
    }
    
    const {label, required, fullWidth, marginBottom0, hover, ...inputCustom} = cleanedProps;
    
    let warningElement;
    if(this.props.meta){
      warningElement = touched && warning? <div className={css.checkboxWarning}>{warning}</div>: null;
    }
    return(
      <div>
        <div className={this.getRootStyle()}>
          <input type="checkbox" {...inputProps} {...inputCustom} className={css.checkboxInput} />
          <label className={this.getLabelStyle()} htmlFor={this.props.id}>
              {label}
          </label>
        </div>
        {warningElement}
     </div>
    );
  }
}

export default Checkbox;



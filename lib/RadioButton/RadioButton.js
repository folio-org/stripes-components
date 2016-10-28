import React from 'react';
import css from './RadioButton.css'

class RadioButton extends React.Component{
  constructor(props){
    super(props);
  }
  
  
  getLabelStyle(){
    let labelStyle = css.label;
    labelStyle += this.props.error? ' ' + css.error: '';
    return labelStyle;
  }
  
  getRootStyle(){
    let rootStyle = css.root;
    rootStyle += this.props.inline? ' ' + css.inline: '';
    return rootStyle;
  }
  
  render(){
    let style = {
      display: this.props.inline? 'inline':'block' 
    };
    
    return(
      <div className={this.getRootStyle()}>
        <input checked={this.props.checked} className={css.input} type="radio" id={this.props.id} name={this.props.name}  />
        <label htmlFor={this.props.id} className={this.getLabelStyle()}>{this.props.label}</label>
      </div>
    );
  }
}

export default RadioButton;
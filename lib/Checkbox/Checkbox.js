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
   var rootStyle = this.props.hover? css.root + ' ' + css.rootHover : css.root;
   rootStyle += this.props.fullWidth? ' ' +css.rootFullWidth : ' ';
   rootStyle += this.props.noSpacer? ' '+css.marginBottom0 : ' ';
   return rootStyle;
 }

  render(){
    return(
      <div className={this.getRootStyle()}>
        <input type="checkbox" checked={this.props.checked} className={css.checkboxInput} id={this.props.id} onChange={this.props.onChange}/>
        <label className={this.getLabelStyle()} htmlFor={this.props.id}>
            {this.props.label}
        </label>
     </div>
    );
  }
}

export default Checkbox;



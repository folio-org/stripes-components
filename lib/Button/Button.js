import React from 'react';
import css from './Button.css';

const propTypes = {
  buttonStyle : React.PropTypes.string,
  type: React.PropTypes.string, 
  buttonClass: React.PropTypes.string,
};

const defaultProps = {
  buttonStyle : 'primary',
  type : 'button'
};

function Button(props){

  function handleKeyDown(e){
    alert("keydown")
    props.onKeyDown(e);
  }
  
  function getStyle(){
    if(!props.className){
      let buttonStyle = css.button;
      if(/\s/.test(props.buttonStyle)){
        let csslist = props.buttonStyle.split(/\s+/);
        csslist.forEach( classname => buttonStyle += ' ' + css[classname]);
      }
      buttonStyle += ' ' + css[props.buttonStyle];
     
      buttonStyle += props.bottomMargin0? ' marginBottom0': '';
      buttonStyle += props.marginBottom0? ' marginBottom0': '';
      buttonStyle += props.fullWidth? ' ' + css.fullWidth : '';
      buttonStyle += props.align === 'end'? ' floatEnd': '';
      buttonStyle += props.hollow? ' ' + css.hollow : '';
      return buttonStyle;
    }else{
      return props.className;
    }
  }
  
  const {buttonStyle, bottomMargin0, marginBottom0, align, hollow, fullWidth, bsRole, bsClass, ...buttonProps} = props
  
  return(
      <button 
        className={getStyle()} 
        {...buttonProps}
      >
        {props.children}
      </button>
    );
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;



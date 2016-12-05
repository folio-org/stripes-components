import React from 'react';
import css from './Button.css';

const propTypes = {
  buttonStyle : React.PropTypes.string,
  type: React.PropTypes.string
};

const defaultProps = {
  buttonStyle : 'primary',
  type : 'button'
};

function Button(props){

  function getStyle(){
    if(!props.className){
      let buttonStyle = css.button + ' ' + css[props.buttonStyle];
      buttonStyle += props.bottomMargin0? ' marginBottom0': '';
      buttonStyle += props.fullWidth? ' ' + css.fullWidth : '';
      buttonStyle += props.align === 'end'? ' floatEnd': '';
      buttonStyle += props.hollow? ' ' + css.hollow : '';
      return buttonStyle;
    }else{
      return props.className;
    }
  }
  
  const {buttonStyle, bottomMargin0, align, hollow, fullWidth, ...buttonProps} = props
  
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



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

class Button extends React.Component{
  constructor(props){
    super(props);
  }

  getStyle(){
    if(!this.props.className){
      let buttonStyle = css.button + ' ' + css[this.props.buttonStyle];
      buttonStyle += this.props.bottomMargin0? ' marginBottom0': '';
      buttonStyle += this.props.fullWidth? ' ' + css.fullWidth : '';
      buttonStyle += this.props.align === 'end'? ' floatEnd': '';
      buttonStyle += this.props.hollow? ' ' + css.hollow : '';
      return buttonStyle;
    }else{
      return this.props.className;
    }
  }

  render(){
    return(
      <button 
        className={this.getStyle()} 
        type={this.props.type} 
      >
        {this.props.children}
      </button>
    );
  }
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;



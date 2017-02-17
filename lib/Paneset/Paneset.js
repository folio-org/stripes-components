import React from 'react';
import css from './Paneset.css';

const propTypes = {
  nested: React.PropTypes.bool,
  static: React.PropTypes.bool,
}

class Paneset extends React.Component{
  constructor(props){
    super(props);
    
  }
  
  getClassName(){
    const nested = this.props.nested ? css.nested : '';
    const staticClass = this.props.static === true ? css.static : '';
    const base = css.paneset;
    return `${base} ${nested} ${staticClass}`;
  }
  
  render(){
    return(
      <div className={this.getClassName()}>{this.props.children}</div>
    );
  }
}

Paneset.propTypes = propTypes;

export default Paneset;



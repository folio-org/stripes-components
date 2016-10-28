import React from 'react';
import css from './Paneset.css';

class Paneset extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className={css.paneset}>{this.props.children}</div>
    );
  }
}

export default Paneset;



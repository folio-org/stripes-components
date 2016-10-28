import React from 'react';
import css from './KeyValue.css';


class KeyValue extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    return(
      <div>
        <label className={css.keyValueLabel}>{this.props.label}</label>
        <div>{this.props.value}</div>
      </div>
    );
  }
}

export default KeyValue;



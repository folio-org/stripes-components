import React from 'react';
import css from './KeyValue.css';


function KeyValue(props){
    return(
      <div className={css.kvRoot}>
        <label className={css.kvLabel}>{props.label}</label>
        <div className={css.kvValue}>{props.value}</div>
      </div>
    );
}

export default KeyValue;



import React from 'react';
import css from './Layout.css';

function Layout(props) {
  
  function getClassName(){
    let classString = props.className;
    let classArray = classString.split(" ");
    const scopedArray = classArray.map(c => css[c]);
    return scopedArray.join(" ");
  }
  
  return(
    <div className={getClassName()}>{props.children}</div>
  )
}

export default Layout;

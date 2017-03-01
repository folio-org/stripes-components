import React from 'react';
import css from './List.css';

const propTypes = {
  itemFormatter : React.PropTypes.func,
  items : React.PropTypes.array.isRequired,
  isEmptyMessage: React.PropTypes.string,
}

function List(props){
  function getListClass(){
    const rootClass = props.listClass? props.listClass : css.root;
    const marginBot0 = props.marginBottom0? css.marginBottom0 : ''
    return `${rootClass} ${marginBot0}`;
  }

  if (!props.items) {
    console.log("stripes-components/List: items is null");
  }
  if(props.items.length === 0 && props.isEmptyMessage){
    return <p style={{color: "#c80", padding: "8px", marginBottom: "1rem"}}>{props.isEmptyMessage}</p>;
  }
  
  return(
    <ul className={getListClass()}>
      {props.items.map(props.itemFormatter, this)}
    </ul>
  );
}

export default List;

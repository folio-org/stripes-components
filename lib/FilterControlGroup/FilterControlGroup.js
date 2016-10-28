import React from 'react';
import css from './FilterControlGroup.css';

class FilterControlGroup extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    return(
      <div>
        <label className={css.listTopLabel}>{this.props.label}</label>
        <ul className={css.filterList}>
          {React.Children.map(this.props.children, function(child, i){
            return <li key={child.id} className={css.listItem}>{child}</li>;
          }, this)}
        </ul>
      </div>
    );
  }
}

export default FilterControlGroup;

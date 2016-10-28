import React from 'react';
import css from './FilterPaneSearch.css';
import Icon from '../Icon';
import Button from '../Button';

class FilterPaneSearch extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className={css.headerSearchContainer}>
        <input className={css.headerSearchInput} type="text" value = {this.props.value} onChange={this.props.onChange} placeholder="Search"/>
        <Button className={css.headerSearchClearButton} ><Icon icon="clearX" iconClassName={css.clearIcon}/></Button>
      </div>
    );
  }
}

export default FilterPaneSearch;


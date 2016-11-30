import React from 'react';
import css from './FilterPaneSearch.css';
import Icon from '../Icon';
import Button from '../Button';

class FilterPaneSearch extends React.Component{
  render(){
    return(
      <div className={css.headerSearchContainer}>
        <div style={{alignSelf:"center"}}><Icon icon="search"/></div>
        <input className={css.headerSearchInput} type="text" value = {this.props.value} onChange={this.props.onChange} placeholder="Search"/>
        <Button className={css.headerSearchClearButton} onClick={this.props.onClear} ><Icon icon="clearX" iconClassName={css.clearIcon}/></Button>
      </div>
    );
  }
}

export default FilterPaneSearch;


import React from 'react';
import css from './FilterPaneSearch.css';
import Icon from '../Icon';
import Button from '../Button';

class FilterPaneSearch extends React.Component{
  constructor(props){
    super(props);
    this.searchInput = null;
  }

  clearSearchField(){
    this.searchInput.value = '';
    const evt =  new Event('input', {bubbles: true});
    this.searchInput.dispatchEvent(evt);
  }
  
  render(){
    return(
      <div className={css.headerSearchContainer}>
        <div style={{alignSelf:"center"}}><Icon icon="search"/></div>
        <input className={css.headerSearchInput} ref={(ref) => this.searchInput = ref} type="text" value = {this.props.value} onChange={this.props.onChange} placeholder="Search"/>
        <Button className={css.headerSearchClearButton} onClick={this.clearSearchField.bind(this)} ><Icon icon="clearX" iconClassName={css.clearIcon}/></Button>
      </div>
    );
  }
}

export default FilterPaneSearch;


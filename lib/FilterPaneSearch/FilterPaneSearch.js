import React from 'react';
import css from './FilterPaneSearch.css';
import Icon from '../Icon';
import Button from '../Button';
import FocusLink from '../FocusLink';

class FilterPaneSearch extends React.Component {
  render() {
    return (
      <div className={css.headerSearchContainer}>
        <div style={{ alignSelf: 'center' }}><Icon icon="search" /></div>
        <input className={css.headerSearchInput} type="text" id={this.props.searchFieldId} role="search" aria-label={this.props.searchAriaLabel} value={this.props.value} onChange={this.props.onChange} placeholder="Search" />
        <Button className={css.headerSearchClearButton} id={this.props.clearSearchId} onClick={this.props.onClear} aria-label="Clear search field"><Icon icon="clearX" iconClassName={css.clearIcon} /></Button>
        { this.props.resultsList &&
          <FocusLink target={this.props.resultsList} aria-label="Skip to results" style={{ alignSelf: 'stretch', paddingTop: '14px' }} component="div" showOnFocus >
            <Icon icon="right-double-chevron-bold" />
          </FocusLink>
        }
      </div>
    );
  }
}

export default FilterPaneSearch;

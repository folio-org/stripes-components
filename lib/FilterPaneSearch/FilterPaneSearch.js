import React from 'react';
import PropTypes from 'prop-types';
import css from './FilterPaneSearch.css';
import Icon from '../Icon';
import Button from '../Button';
import FocusLink from '../FocusLink';

const propTypes = {
  searchFieldId: PropTypes.string,
  searchAriaLabel: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  clearSearchId: PropTypes.string,
  onClear: PropTypes.func,
  resultsList: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.node,
    PropTypes.element,
  ]),
};

const FilterPaneSearch = props => (
  <div className={css.headerSearchContainer}>
    <div style={{ alignSelf: 'center' }}><Icon icon="search" /></div>
    <input className={css.headerSearchInput} type="text" id={props.searchFieldId} role="search" aria-label={props.searchAriaLabel} value={props.value} onChange={props.onChange} placeholder="Search" />
    <Button className={css.headerSearchClearButton} id={props.clearSearchId} onClick={props.onClear} aria-label="Clear search field"><Icon icon="clearX" iconClassName={css.clearIcon} /></Button>
    { props.resultsList &&
      <FocusLink target={props.resultsList} aria-label="Skip to results" style={{ alignSelf: 'stretch', paddingTop: '14px' }} component="div" showOnFocus >
        <Icon icon="right-double-chevron-bold" />
      </FocusLink>
    }
  </div>
);

FilterPaneSearch.propTypes = propTypes;

export default FilterPaneSearch;

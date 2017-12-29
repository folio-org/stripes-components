import React from 'react';
import PropTypes from 'prop-types';
import css from './FilterPaneSearch.css';
import Icon from '../Icon';
import FocusLink from '../FocusLink';
import IconButton from '../IconButton';
import Select from '../Select';

const propTypes = {
  searchFieldId: PropTypes.string,
  searchAriaLabel: PropTypes.string,
  searchableFields: PropTypes.arrayOf(
    PropTypes.object,
  ),
  onChangeField: PropTypes.func,
  value: PropTypes.string,
  onChange: PropTypes.func,
  clearSearchId: PropTypes.string,
  onClear: PropTypes.func,
  resultsList: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.node,
    PropTypes.element,
  ]),
  placeholder: PropTypes.string,
};

const FilterPaneSearch = props => (
  <div className={css.headerSearchContainer} role="search">
    {!props.searchableFields ?
      null :
      <span>
        <Select
          id={`${props.searchFieldId}-field`}
          label=""
          dataOptions={props.searchableFields}
          onChange={props.onChangeField}
        />
        <br />
      </span>
    }
    <input className={css.headerSearchInput} type="text" id={props.searchFieldId} role="searchbox" aria-label={props.searchAriaLabel} value={props.value} onChange={props.onChange} placeholder={props.placeholder || 'Search'} />
    <IconButton
      className={css.headerSearchClearButton}
      id={props.clearSearchId}
      onClick={props.onClear}
      ariaLabel="Clear search field"
      icon="clearX"
    />
    { props.resultsList &&
      <FocusLink target={props.resultsList} aria-label="Skip to results" style={{ alignSelf: 'stretch', paddingTop: '14px' }} component="div" showOnFocus >
        <Icon icon="right-double-chevron" />
      </FocusLink>
    }
  </div>
);

FilterPaneSearch.propTypes = propTypes;

export default FilterPaneSearch;

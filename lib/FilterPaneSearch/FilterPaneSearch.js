import React from 'react';
import PropTypes from 'prop-types';
import css from './FilterPaneSearch.css';
import Icon from '../Icon';
import FocusLink from '../FocusLink';
import IconButton from '../IconButton';

const propTypes = {
  clearSearchId: PropTypes.string,
  onChange: PropTypes.func,
  onChangeIndex: PropTypes.func,
  onClear: PropTypes.func,
  placeholder: PropTypes.string,
  resultsList: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.node,
    PropTypes.element,
  ]),
  searchableIndexes: PropTypes.arrayOf(
    PropTypes.object,
  ),
  searchAriaLabel: PropTypes.string,
  searchFieldId: PropTypes.string,
  selectedIndex: PropTypes.string,
  value: PropTypes.string,
};

const FilterPaneSearch = props => (
  <div className={css.headerSearchContainer} role="search">
    {!props.searchableIndexes ?
      null : (
        <div className={css.selectWrap}>
          <select
            className={css.headerSearchSelect}
            id={`${props.searchFieldId}-index`}
            aria-label="Search field select"
            value={props.selectedIndex}
            onChange={props.onChangeIndex}
            data-test-search-field-selector
          >
            {props.searchableIndexes.map(si => (
              <option key={`${si.value}-search-option`} value={si.value} disabled={si.disabled}>{si.label}</option>
            ))}
          </select>
          <div className={css.iconWrap}>
            <Icon icon="triangle-down" />
          </div>
        </div>
      )
    }
    <input
      className={css.headerSearchInput}
      type="text"
      id={props.searchFieldId}
      role="searchbox"
      aria-label={props.searchAriaLabel}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder || 'Search'}
      data-test-search-box
    />
    <IconButton
      className={css.headerSearchClearButton}
      id={props.clearSearchId}
      onClick={props.onClear}
      data-test-clear-search
      aria-label="Clear search field"
      icon="times-circle-solid"
    />
    { props.resultsList &&
      <FocusLink
        target={props.resultsList}
        aria-label="Skip to results"
        style={{ alignSelf: 'stretch', paddingTop: '14px' }}
        component="div"
        showOnFocus
        data-test-results-link
      >
        <Icon icon="chevron-double-right" />
      </FocusLink>
    }
  </div>
);

FilterPaneSearch.propTypes = propTypes;

export default FilterPaneSearch;

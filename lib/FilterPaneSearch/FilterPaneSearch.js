import React from 'react';
import PropTypes from 'prop-types';
import css from './FilterPaneSearch.css';
import Icon from '../Icon';
import FocusLink from '../FocusLink';
import Button from '../Button';

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
          >
            {props.searchableIndexes.map(si => (
              <option key={`${si.value}-search-option`} value={si.value} disabled={si.disabled}>{si.label}</option>
            ))}
          </select>
          <div className={css.iconWrap}>
            <Icon icon="down-triangle" />
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
    />
    <Button
      className={css.headerSearchClearButton}
      id={props.clearSearchId}
      onClick={props.onClear}
      ariaLabel="Clear search field"
      buttonStyle="plain"
    >
      <Icon icon="clearX" />
    </Button>
    { props.resultsList &&
      <FocusLink
        target={props.resultsList}
        aria-label="Skip to results"
        style={{ alignSelf: 'stretch', paddingTop: '14px' }}
        component="div"
        showOnFocus
      >
        <Icon icon="right-double-chevron" />
      </FocusLink>
    }
  </div>
);

FilterPaneSearch.propTypes = propTypes;

export default FilterPaneSearch;

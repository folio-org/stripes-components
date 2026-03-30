// @ts-nocheck
import React from "react";
import css from "./FilterPaneSearch.css";
import Icon from "../Icon";
import FocusLink from "../FocusLink";
import IconButton from "../IconButton";
type FilterPaneSearchProps = {
  clearSearchId?: string;
  onChange?: (...args: any[]) => any;
  onChangeIndex?: (...args: any[]) => any;
  onClear?: (...args: any[]) => any;
  placeholder?: string;
  resultsList?: Record<string, any> | React.ReactNode | React.ReactElement;
  searchableIndexes?: Record<string, any>[];
  searchAriaLabel?: string;
  searchFieldId?: string;
  selectedIndex?: string;
  value?: string;
};

const FilterPaneSearch = (props: FilterPaneSearchProps) => (
  <div className={css.headerSearchContainer} role="search">
    {!props.searchableIndexes ? null : (
      <div className={css.selectWrap}>
        <select
          className={css.headerSearchSelect}
          id={`${props.searchFieldId}-index`}
          aria-label="Search field select"
          value={props.selectedIndex}
          onChange={props.onChangeIndex}
          data-test-search-field-selector
        >
          {props.searchableIndexes.map((si) => (
            <option
              key={`${si.value}-search-option`}
              value={si.value}
              disabled={si.disabled}
            >
              {si.label}
            </option>
          ))}
        </select>
        <div className={css.iconWrap}>
          <Icon icon="triangle-down" />
        </div>
      </div>
    )}
    <input
      className={css.headerSearchInput}
      type="text"
      id={props.searchFieldId}
      role="searchbox"
      aria-label={props.searchAriaLabel}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder || "Search"}
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

    {props.resultsList && (
      <FocusLink
        target={props.resultsList}
        aria-label="Skip to results"
        style={{ alignSelf: "stretch", paddingTop: "14px" }}
        component="div"
        showOnFocus
        data-test-results-link
      >
        <Icon icon="chevron-double-right" />
      </FocusLink>
    )}
  </div>
);

export default FilterPaneSearch;

import kebabCase from 'lodash/kebabCase';
import React from 'react';
import PropTypes from 'prop-types';
import FilterControlGroup from '../FilterControlGroup';
import css from './FilterGroups.css';

import {
  AccordionSet,
  Accordion,
  FilterAccordionHeader,
} from '../Accordion';
import Checkbox from '../Checkbox';

// private
const FilterCheckbox = (props) => {
  const { groupName, name, displayName, checked, onChangeFilter: ocf, disabled } = props;
  const fullName = `${groupName}.${name}`;

  return (<Checkbox
    data-test-filter-checkbox
    id={`clickable-filter-${kebabCase(fullName)}`}
    label={displayName}
    name={fullName}
    checked={checked}
    onChange={ocf}
    innerClass={css.filterGroupLabel}
    fullWidth
    disabled={disabled}
  />);
};

FilterCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  displayName: PropTypes.node.isRequired,
  groupName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
};


// private
const FilterGroup = (props) => {
  const { label, groupName, names, filters, onChangeFilter: ocf, disabled } = props;

  return (
    <FilterControlGroup
      data-test-filter-group
      label={label}
      disabled={disabled}
    >
      {names.map((name, index) => (
        <FilterCheckbox
          key={index}
          groupName={groupName}
          name={name.value}
          displayName={name.displayName}
          onChangeFilter={ocf}
          checked={!!filters[`${groupName}.${name.value}`]}
          disabled={disabled}
        />))}
    </FilterControlGroup>
  );
};

FilterGroup.propTypes = {
  disabled: PropTypes.bool,
  filters: PropTypes.object.isRequired,
  groupName: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  names: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeFilter: PropTypes.func.isRequired,
};


// DEPRECATED in favour of filterState
export function initialFilterState(config, filters) {
  const state = {};

  if (filters) {
    const fullNames = filters.split(',');
    const register = {};
    for (const fullName of fullNames) {
      register[fullName] = true;
    }

    for (const group of config) {
      for (const value of group.values) {
        const valueName = (typeof value === 'object') ? value.name : value;
        const fullName = `${group.name}.${valueName}`;
        if (register[fullName]) state[fullName] = true;
      }
    }
  }

  return state;
}


export function filterState(filters) {
  const state = {};

  if (filters) {
    const fullNames = filters.split(',');
    for (const fullName of fullNames) {
      state[fullName] = true;
    }
  }

  return state;
}


/**
 * Filters come in groups. Within each group, we want to OR together
 * the filters that have been selected; and we want to AND together
 * the output of each group. Groups where no filter has been selected
 * have no effect at all. And Groups where all filters have been
 * selected have no effect unless the `restrictWhenAllSelected`
 * setting is on.
 *
 * config values with the attribute "hidden: true" are not exposed in the UI
 * (i.e. no checkbox is presented in the UI) but the filter value is always
 * applied. For example, suppose a filter group "species" existed and the
 * query should *always* include Humans and allow the user to choose whether
 * Ewok, Jawa, or Wookie members should also be included in the search. The
 * values entry with the attribute `name: "human"` would also contain the
 * attribute `hidden: true`.
 *
 * @param config array list of objects with keys label, name, cql, values[]
 * @param filters string comma-delimited list of active filters, e.g. foo.someValue,bar.otherValue
 *
 */
export function filters2cql(config, filters = '') {
  const groups = {};
  const fullNames = filters.split(',');

  // restructure the "filters" argument from a string,
  // e.g. "foo.valueOne,foo.valueTwo,bar.valueThree", to an object,
  // e.g. { foo: [ valueOne, valueTwo ], bar: [ valueThree ]}
  for (const fullName of fullNames) {
    // Note: splitting an empty string returns an empty string,
    // so we need to check if fullName is actually a legit filtername
    if (fullName) {
      const [groupName, fieldName] = fullName.split('.');
      if (groups[groupName] === undefined) groups[groupName] = [];
      groups[groupName].push(fieldName);
    }
  }

  // pull in hidden config values which must always be applied.
  for (const filter of config) {
    for (const value of filter.values) {
      if (typeof value === 'object' && value.hidden) {
        if (groups[filter.name] === undefined) {
          groups[filter.name] = [];
        }

        groups[filter.name].push(value.name);
      }
    }
  }

  // nothing to do if there are no filters.
  // note that we can't simply bail when "filters" is empty up at the top
  // because hidden values in config may also be present.
  if (!filters && !Object.keys(groups).length) {
    return undefined;
  }

  const conds = [];
  for (const groupName of Object.keys(groups)) {
    // config is an array and therefore may contain multiple filters
    // with the same name. that *shouldn't* happen, but just in case it
    // does, only use the first one.
    const group = config.filter(g => g.name === groupName)[0];
    if (group && group.cql) {
      const cqlIndex = group.cql;

      // values contains the selected filters
      const values = groups[groupName];
      if (!(values.length === (group.values.length) && !group.restrictWhenAllSelected)) {
        const mappedValues = values.map((v) => {
          // If the field is a {name,cql} object, use the CQL.
          const obj = group.values.filter(f => typeof f === 'object' && f.name === v);
          return (obj.length > 0) ? obj[0].cql : v;
        });

        // parse to CQL manually via parse
        if (typeof group.parse === 'function') {
          conds.push(group.parse(mappedValues));
        } else if (group.isRange) {
          const { isIncludingStart = true, isIncludingEnd = true, rangeSeparator = ':' } = group;
          const [start, end] = mappedValues[0].split(rangeSeparator);
          const startCondition = `${cqlIndex}>${isIncludingStart ? '=' : ''}"${start}"`;
          const endCondition = `${cqlIndex}<${isIncludingEnd ? '=' : ''}"${end}"`;

          conds.push(`(${startCondition} and ${endCondition})`);
        } else {
          let joinedValues = mappedValues.map(v => `"${v}"`).join(' or ');
          if (values.length > 1) joinedValues = `(${joinedValues})`;
          conds.push(`${cqlIndex}=${joinedValues}`);
        }
      }
    } else {
      console.warn(`Expected to find match for ${groupName} in filter-config`, config);
    }
  }

  return conds.join(' and ');
}


// Requires calling component to have a this.updateFilters method
// DEPRECATED in favour of handleFilterChange
//
export function onChangeFilter(e) {
  this.setState(prevState => {
    const filters = Object.assign({}, prevState.filters);
    filters[e.target.name] = e.target.checked;
    this.updateFilters(filters);
    return { filters };
  });
}

// Relies on caller providing both queryParam and transitionToParams
export function handleFilterChange(e) {
  const state = filterState(this.queryParam('filters'));
  state[e.target.name] = e.target.checked;
  this.transitionToParams({ filters: Object.keys(state).filter(key => state[key]).join(',') });
  return state;
}

export function handleFilterClear(name) {
  const state = filterState(this.queryParam('filters'));

  Object.keys(state).forEach((key) => {
    if (key.startsWith(`${name}.`)) {
      state[key] = false;
    }
  });

  this.transitionToParams({ filters: Object.keys(state).filter(key => state[key]).join(',') });
  return state;
}

export function handleClearAllFilters() {
  // Access the initialFilters that were passed to the calling component. This is probably SearchAndSort.
  this.transitionToParams({ filters: this.props.initialFilters || '', query: '' });
}

const FilterGroups = (props) => {
  const { config, filters, onChangeFilter: ocf, onClearFilter } = props;
  const disableNames = props.disableNames || {};

  const filterGroupNames = (group) => {
    const names = [];

    for (const value of group.values) {
      if (typeof value === 'object') {
        if (!value.hidden) {
          names.push({ value: value.name, displayName: value.displayName || value.name });
        }
      } else {
        names.push({ value, displayName: value });
      }
    }

    return names;
  };

  return (
    <div data-test-filter-groups>
      <AccordionSet>
        {config.map((group, index) => (
          <Accordion
            label={group.label}
            id={`${group.label}-${index}`}
            name={group.name}
            key={index}
            separator={false}
            header={FilterAccordionHeader}
            disabled={disableNames[group.name]}
            // If any of the filters start with this group's name, then we should display the 'clear all'
            // button for this accordion.
            displayClearButton={Object.keys(filters).some(filter => filter.startsWith(group.name))}
            onClearFilter={onClearFilter}
          >
            <FilterGroup
              key={index}
              label={group.label}
              groupName={group.name}
              disabled={disableNames[group.name]}
              names={filterGroupNames(group)}
              filters={filters}
              onChangeFilter={ocf}
            />
          </Accordion>
        ))}
      </AccordionSet>
    </div>
  );
};

FilterGroups.propTypes = {
  config: PropTypes.arrayOf(
    PropTypes.shape({
      cql: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      name: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            cql: PropTypes.string.isRequired,
            displayName: PropTypes.node,
            name: PropTypes.string.isRequired,
          }),
        ]),
      ).isRequired,
    }),
  ).isRequired,
  disableNames: PropTypes.shape({}),
  filters: PropTypes.object.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  onClearFilter: PropTypes.func.isRequired,
};

export default FilterGroups;

import React from 'react';
import PropTypes from 'prop-types';
import FilterControlGroup from '../FilterControlGroup';
import {
  AccordionSet,
  Accordion,
  FilterAccordionHeader,
} from '../Accordion';
import Checkbox from '../Checkbox';
import Button from '../Button/Button';
import Icon from '../Icon';


// private
const FilterCheckbox = (props) => {
  const { groupName, name, checked, onChangeFilter: ocf, disabled } = props;
  const fullName = `${groupName}.${name}`;

  return (<Checkbox
    id={`${fullName}-ItemFilter`}
    label={name}
    name={fullName}
    checked={checked}
    onChange={ocf}
    marginBottom0
    fullWidth
    disabled={disabled}
  />);
};

FilterCheckbox.propTypes = {
  groupName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};


// private
const FilterGroup = (props) => {
  const { label, groupName, names, filters, onChangeFilter: ocf, disabled } = props;

  return (<FilterControlGroup
    label={label}
    disabled={disabled}
  >
    {names.map((name, index) => (
      <FilterCheckbox
        key={index}
        groupName={groupName}
        name={name}
        onChangeFilter={ocf}
        checked={!!filters[`${groupName}.${name}`]}
        disabled={disabled}
      />))}
  </FilterControlGroup>);
};

FilterGroup.propTypes = {
  label: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
  filters: PropTypes.object.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
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


// Filters come in groups. Within each group, we want to OR together
// the filters that have been selected; and we want to AND together
// the output of each group. Groups where no filter has been selected
// have no effect at all.
//
export function filters2cql(config, filters) {
  if (!filters) return undefined;

  const groups = {};
  const fullNames = filters.split(',');
  for (const fullName of fullNames) {
    const [groupName, fieldName] = fullName.split('.');
    if (groups[groupName] === undefined) groups[groupName] = [];
    groups[groupName].push(fieldName);
  }

  const conds = [];
  for (const groupName of Object.keys(groups)) {
    const group = config.filter(g => g.name === groupName)[0];
    const cqlIndex = group.cql;

    const values = groups[groupName];
    const mappedValues = values.map((v) => {
      // If the field is a {name,cql} object, use the CQL.
      const obj = group.values.filter(f => typeof f === 'object' && f.name === v);
      return (obj.length > 0) ? obj[0].cql : v;
    });
    let joinedValues = mappedValues.map(v => `"${v}"`).join(' or ');
    if (values.length > 1) joinedValues = `(${joinedValues})`;

    conds.push(`${cqlIndex}=${joinedValues}`);
  }

  return conds.join(' and ');
}


// Requires calling component to have a this.updateFilters method
// DEPRECATED in favour of handleFilterChange
//
export function onChangeFilter(e) {
  const filters = Object.assign({}, this.state.filters);
  filters[e.target.name] = e.target.checked;

  this.setState({ filters });
  this.updateFilters(filters);
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
  this.transitionToParams({ filters: this.props.initialFilters || '' });
}

const FilterGroups = (props) => {
  const { config, filters, onChangeFilter: ocf, onClearFilter, onClearAllFilters } = props;
  const disableNames = props.disableNames || {};

  return (
    <div>
      <Button buttonStyle="transparent" hollow paddingSide0 onClick={onClearAllFilters}>
        <Icon size="small" icon="clearX" />
        <div>Reset all</div>
      </Button>
      <AccordionSet>
        {config.map((group, index) => (
          <Accordion
            label={group.label}
            id={`${group.label}-${index}`}
            name={group.name}
            key={index}
            separator={false}
            header={FilterAccordionHeader}
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
              names={group.values.map(f => ((typeof f === 'object') ? f.name : f))}
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
      label: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      cql: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            cql: PropTypes.string.isRequired,
          }),
        ]),
      ).isRequired,
    }),
  ).isRequired,
  filters: PropTypes.object.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  disableNames: PropTypes.shape({}),
  onClearFilter: PropTypes.func.isRequired,
  onClearAllFilters: PropTypes.func.isRequired,
};

export default FilterGroups;

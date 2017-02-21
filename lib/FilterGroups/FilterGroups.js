import React, { PropTypes } from 'react'; // eslint-disable-line
import FilterControlGroup from '@folio/stripes-components/lib/FilterControlGroup'; // eslint-disable-line
import Checkbox from '@folio/stripes-components/lib/Checkbox'; // eslint-disable-line
import Icon from '@folio/stripes-components/lib/Icon'; // eslint-disable-line


// private
const FilterCheckbox = (props) => {
  const { groupName, name, checked, onChangeFilter } = props;
  const fullName = `${groupName}.${name}`;

  return (<Checkbox
    id={`${fullName}-ItemFilter`}
    label={name}
    name={fullName}
    checked={checked}
    onChange={onChangeFilter}
    marginBottom0
    hover
    fullWidth
    checkedIcon={<Icon icon="eye" />}
  />);
};

FilterCheckbox.propTypes = {
  groupName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
};


// private
const FilterGroup = (props) => {
  const { label, groupName, names, filters, onChangeFilter } = props;

  return (<FilterControlGroup label={label}>
    {names.map((name, index) =>
      <FilterCheckbox
        key={index} groupName={groupName} name={name}
        onChangeFilter={onChangeFilter}
        checked={!!filters[`${groupName}.${name}`]}
      />)}
  </FilterControlGroup>);
};

FilterGroup.propTypes = {
  label: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
  filters: PropTypes.object.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
};


// public
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
      if (obj.length > 0) {
        // console.log(`mapping value '${v}' to CQL '${obj[0].cql}'`);
        return obj[0].cql;
      }
      return v;
    });
    let joinedValues = mappedValues.map(v => `"${v}"`).join(' or ');
    if (values.length > 1) joinedValues = `(${joinedValues})`;

    conds.push(`${cqlIndex}=${joinedValues}`);
  }

  return conds.join(' and ');
}


const FilterGroups = (props) => {
  const { config, filters, onChangeFilter } = props;

  return (<span>
    {config.map((group, index) =>
      <FilterGroup
        key={index}
        label={group.label}
        groupName={group.name}
        names={group.values.map(f => ((typeof f === 'object') ? f.name : f))}
        filters={filters} onChangeFilter={onChangeFilter}
      />)
    }
  </span>);
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
};

export default FilterGroups;

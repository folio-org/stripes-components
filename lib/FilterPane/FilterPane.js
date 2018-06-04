import React from 'react';
import PropTypes from 'prop-types';
import FilterPaneSearch from '../FilterPaneSearch';
import Pane from '../Pane';
import FilterControlGroup from '../FilterControlGroup';
import Checkbox from '../Checkbox';
import Button from '../Button';

const propTypes = {
  clearSearchId: PropTypes.string,
  searchFieldId: PropTypes.string,
};

class FilterPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patronFilter: true,
      employeeFilter: false,
      searchTerm: '',
    };
  }

  updateFilters(e) {
    const stateObj = {};
    stateObj[e.target.id] = !this.state[e.target.id];
    this.setState(stateObj);
  }

  updateSearchTerm(e) {
    const term = e.target.value;
    this.setState({ searchTerm: term });
  }

  render() {
    return (
      <Pane
        defaultWidth="16%"
        header={
          <FilterPaneSearch
            searchFieldId={this.props.searchFieldId}
            clearSearchId={this.props.clearSearchId}
          />
        }
      >
        <FilterControlGroup label="Filters">
          <Checkbox id="patronFilter" label="Patrons" noSpacer hover fullWidth />
          <Checkbox id="employeeFilter" label="Employees" noSpacer hover fullWidth />
          <Checkbox id="uncontrolledFilter" label="Uncontrolled" noSpacer hover fullWidth />
        </FilterControlGroup>
        <FilterControlGroup label="Actions">
          <Button fullWidth>Add User</Button>
        </FilterControlGroup>
      </Pane>
    );
  }
}

FilterPane.propTypes = propTypes;

export default FilterPane;

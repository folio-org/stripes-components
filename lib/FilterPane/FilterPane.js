import React from 'react';
import FilterPaneSearch from '../FilterPaneSearch';
import Pane from '../Pane';
import FilterControlGroup from '../FilterControlGroup';
import Checkbox from '../Checkbox';
import Button from '../Button';
import RadioButton from '../RadioButton';
import Select from '../Select'
import TextField from '../TextField'

class FilterPane extends React.Component{
  constructor(props){
    super(props);
    this.state={
      patronFilter: true,
      employeeFilter: false,
      searchTerm: ''
    };
  }
  
  updateFilters(e){
    let stateObj = {};
    stateObj[e.target.id] = !this.state[e.target.id];
    this.setState(stateObj);
  }
  
  updateSearchTerm(e){
    let term = e.target.value;
    this.setState({searchTerm:term});
  }
  
  render(){
    return(
      <Pane 
        defaultWidth="16%" 
        header={
          <FilterPaneSearch 
            id="SearchField" 
            
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

export default FilterPane;
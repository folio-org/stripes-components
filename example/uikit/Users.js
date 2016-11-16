import React from 'react'
import { connect } from 'stripes-connect';

/* shared stripes components */
import Pane from '@folio/stripes-components/lib/Pane'
import Paneset from '@folio/stripes-components/lib/Paneset'
import PaneMenu from '@folio/stripes-components/lib/PaneMenu'
import Button from '@folio/stripes-components/lib/Button'
import Icon from '@folio/stripes-components/lib/Icon'
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList'
import KeyValue from '@folio/stripes-components/lib/KeyValue'
import {Row, Col} from 'react-bootstrap'
import TextField from '@folio/stripes-components/lib/TextField'
import Checkbox from '@folio/stripes-components/lib/Checkbox'
import FilterPaneSearch from '@folio/stripes-components/lib/FilterPaneSearch'
import FilterControlGroup from '@folio/stripes-components/lib/FilterControlGroup'
import Select from '@folio/stripes-components/lib/Select'

class Users extends React.Component{
  constructor(props){
    super(props);
    this.state={
      //Search/Filter state...
      patronFilter: true,
      employeeFilter: false,
      searchTerm: ''
    };
  }
  
  static manifest = { 
    searchResults: [],
    /*detail: {
      fineHistory:[]
    }*/
  };
                        
  componentWillMount() {
    const resultData = [{Name:'Pete Sherman', Address:'391 W. Richardson St. Duarte, CA 91010', Fines:'$34.23'}];
    //const fineHistory = [{"Due Date": "11/12/2014", "Amount":"34.23", "Status":"Unpaid"}];
    this.props.mutator.searchResults.replace(resultData);
    //this.props.mutator.detail.replace({fineHistory: fineHistory});
  }

  //search Handlers...
  onChangeFilter(e){
    let stateObj = {};
    stateObj[e.target.id] = !this.state[e.target.id];
    this.setState(stateObj);
  }
  
  onChangeSearch(e){
    let term = e.target.value;
    this.setState({searchTerm:term});
  }
  //end search Handlers

  render(){
    const resultMenu = <PaneMenu><button><Icon icon="bookmark"/></button></PaneMenu>
    const fineHistory = [{"Due Date": "11/12/2014", "Amount":"34.23", "Status":"Unpaid"}];
    
    /*searchHeader is a 'custom pane header'*/
    const searchHeader = <FilterPaneSearch id="SearchField" onChange={this.onChangeSearch.bind(this)} />
    
    return(
            <Paneset>
              {/*Filter Pane */}
              <Pane defaultWidth="16%" header={searchHeader}>
                <FilterControlGroup label="Filters">
                  <Checkbox 
                    id="patronFilter" 
                    label="Patrons" 
                    checked={this.state.patronFilter} 
                    onChange={this.onChangeFilter.bind(this)}
                    marginBottom0 
                    hover 
                    fullWidth 
                  />
                  <Checkbox 
                    id="employeeFilter" 
                    label="Employees" 
                    checked={this.state.employeeFilter} 
                    onChange={this.onChangeFilter.bind(this)}
                    marginBottom0 hover fullWidth 
                  />
                </FilterControlGroup>
                <FilterControlGroup label="Actions">
                  <Button fullWidth>Add User</Button>
                </FilterControlGroup>
              </Pane>
              
              {/*Results Pane*/}
              <Pane defaultWidth="fit-content" paneTitle="Results" lastMenu={resultMenu}>
                     <MultiColumnList contentData={this.props.data.searchResults}/>
              </Pane>
              
              {/*Details Pane*/}
              <Pane defaultWidth="fill">
                <Row>
                  <Col xs={8} >
                    <Row>
                      <Col xs={12}>
                        <h2>Pete Sherman</h2>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}>
                        <KeyValue label="Address" value="391 W. Richardson St. Duarte, CA 91010"/>
                      </Col>
                      <Col xs={4}>
                        <KeyValue label="Phone" value="714-445-1124"/>
                      </Col>
                      <Col xs={4}>
                        <KeyValue label="Fines" value="$34.75"/>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={4} >
                    <img className="floatEnd" src="http://placehold.it/175x175"/>
                  </Col>
                </Row>
                <br/>
                <hr/>
                <br/>
                <Row>
                <Col xs={3}>
                  <h3 className="marginTopHalf">Fines</h3>        
                </Col>
                <Col xs={4} sm={3}>
                    <TextField 
                      rounded 
                      endControl={<Button buttonStyle="fieldControl"><Icon icon='clearX'/></Button>}
                      startControl={<Icon icon='search'/>}
                      placeholder="Search"
                      />
                      
                </Col>
                <Col xs={5} sm={6}>
                  <Button align="end" bottomMargin0 >View Full History</Button>        
                </Col>
                </Row>
                <MultiColumnList fullWidth contentData={fineHistory} />
              </Pane>
            </Paneset>
            )
  }
    
}

export default connect(Users, 'Users');



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
import FilterPane from '@folio/stripes-components/lib/FilterPane'
import Select from '@folio/stripes-components/lib/Select'

class Users extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      patrons:"true"
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

  render(){
    const resultMenu = <PaneMenu><button><Icon icon="bookmark"/></button></PaneMenu>
    const fineHistory = [{"Due Date": "11/12/2014", "Amount":"34.23", "Status":"Unpaid"}];
    
    return(
            <Paneset>
              <FilterPane/>
              <Pane defaultWidth="fit-content" paneTitle="Results" lastMenu={resultMenu}>
                     <MultiColumnList contentData={this.props.data.searchResults}/>
              </Pane>
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
                  <h3 className="marginTopHalf">{this.state.patrons}</h3>        
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



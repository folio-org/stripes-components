import React from 'react';

import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Select from '@folio/stripes-components/lib/Select';
import Button from '@folio/stripes-components/lib/Button';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import TextField from '@folio/stripes-components/lib/TextField';
import {Row, Col} from 'react-bootstrap';

const propTypes = {
  onChangeMode: React.PropTypes.func,
  modeSelector: React.PropTypes.element,
  items: React.PropTypes.arrayOf(React.PropTypes.object),
  patron: React.PropTypes.object,   // eslint-disable-line
}

class CheckOut extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    
    
    const containerStyle = {
      display: 'flex',
      flexDirection:'column',
      justifyContent: 'space-between',
      height: '100%',
      width: '100%',
      position: 'absolute',
    };
    
    if(this.props.patron !== null && this.props.items.length !== 0){
      containerStyle.height = '98.6%';
    }
    
    const itemListFormatter = {
      '': item => <td key={item.name}><Button buttonStyle="negative hollow" align="end" marginBottom0 >Cancel</Button></td>,
    }
    
    return(
      <div style={containerStyle}>
        <Paneset static>
          <Pane defaultWidth="50%" paneTitle="Patron" firstMenu={this.props.modeSelector}>
            <Row>
              <Col xs={9}>
                <TextField placeholder='Enter Patron ID' aria-label='Patron ID' fullWidth/>
              </Col>
              <Col xs={3}>
                <Button buttonStyle="primary noRadius" fullWidth >Find Patron</Button>
              </Col>
            </Row>
            <div style={{width: '100%', textAlign:'center', padding: '2rem 1rem'}}><em>No patron selected</em></div>
          </Pane>
          <Pane defaultWidth="50%" paneTitle="Scanned Items">
          <Row>
            <Col xs={9}>
              <TextField placeholder='Enter Item ID' aria-label='Item ID' fullWidth/>
            </Col>
            <Col xs={3}>
              <Button buttonStyle="primary noRadius" fullWidth >+ Add item</Button>
            </Col>
          </Row>
          <MultiColumnList 
            visibleColumns={['id', 'name', 'due date', '']} 
            contentData={this.props.items} 
            formatter={itemListFormatter} 
            isEmptyMessage="No items have been entered yet."
            fullWidth
          />
          </Pane>

        </Paneset>
        {this.props.patron !== null && this.props.items.length !== 0 &&
          <Button buttonStyle="primary mega" >Done</Button>
        }
      </div>
    );
  }
}

CheckOut.propTypes = propTypes;

export default CheckOut;



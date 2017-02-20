import React from 'react';

import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Select from '@folio/stripes-components/lib/Select';
import Button from '@folio/stripes-components/lib/Button';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';

const propTypes = {
  onChangeMode: React.PropTypes.func,
  modeSelector: React.PropTypes.element,
  items: React.PropTypes.arrayOf(React.PropTypes.object),
  patron: React.PropTypes.object,   // eslint-disable-line
}

class CheckIn extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    const itemListFormatter = {
      '': item => <td key={item.name}><Button buttonStyle="negative hollow" align="end" marginBottom0 >Cancel</Button></td>,
    };
    
    return(
      <Paneset>
        <Pane paneTitle="Scanned Items" defaultWidth='100%' firstMenu={this.props.modeSelector}>
          <div style={{width:'100%', maxWidth:'1024px', margin:'auto'}}>
            <MultiColumnList 
              visibleColumns={['id', 'name', 'due date', '']} 
              contentData={this.props.items} 
              formatter={itemListFormatter} 
              isEmptyMessage="No items have been entered yet."
              fullWidth
            />
          </div>
        </Pane>
      </Paneset>
    )
  }
  
}

export default CheckIn;

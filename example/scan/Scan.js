import React from 'react';

import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Select from '@folio/stripes-components/lib/Select';

//import Automatic from './Automatic';
import CheckIn from './CheckIn';
import CheckOut from './CheckOut';

class Scan extends React.Component{
  constructor(props){
    super(props);
    
    this.state = {
      mode : 'CheckOut',
      items: [{id: '01', name:'item1', 'due date': '2/28/2017' },{id: '02', name:'item2', 'due date': '2/28/2017'}],
      patron: {},
    }
    
    this.componentMap= {
      'CheckOut': CheckOut,
      'CheckIn': CheckIn,
      //'Automatic': Automatic,
    };
    
    this.onChangeMode = this.onChangeMode.bind(this);
  }
  
  onChangeMode(e){
    const nextMode = e.target.value;
    this.setState({
      mode: nextMode,
    });
  }
  
  render(){
    const modeOptions = [
      { label: 'Check items out', value: 'CheckOut' },
      { label: 'Automatic Mode', value: 'Automatic' },
      { label: 'Check items in', value: 'CheckIn' }
    ];
    
    const modeMenu = (
      <PaneMenu><Select marginBottom0 dataOptions={modeOptions} value={this.state.mode} onChange={this.onChangeMode}></Select></PaneMenu>
    );
    
    return React.createElement(this.componentMap[this.state.mode], {onChangeMode: this.onChangeMode, modeSelector: modeMenu, patron: this.state.patron, items: this.state.items});
  }
  
}

export default Scan;

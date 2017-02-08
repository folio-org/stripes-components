import React from 'react';
import css from './Pane.css';
import PaneHeader from '../PaneHeader';

const propTypes = {
  defaultWidth: React.PropTypes.string
};

class Pane extends React.Component{
  constructor(props){
      super(props);
  }
  
  render(){
    let paneWidth = {};
    if(this.props.defaultWidth !== 'fill'){
        //flex-basis was removed - potential impact in behavior
        paneWidth = { width:this.props.defaultWidth};
    }
    else
    {
        paneWidth = {flexGrow:2};
    }

    let {defaultWidth, children, ...headerProps} = this.props;

    return(
      <div className={css.pane} style={paneWidth}>
        <PaneHeader {...headerProps}></PaneHeader>
        <div style={{width: "100%", height:"100%", overflow: "auto", padding: "16px"}}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Pane.propTypes = propTypes;

export default Pane;



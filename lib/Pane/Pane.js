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
        paneWidth = {flexBasis:this.props.defaultWidth, width:this.props.defaultWidth};
    }
    else
    {
        paneWidth = {flexGrow:2};
    }

    let {defaultWidth, children, ...headerProps} = this.props;

    return(
      <div className={css.pane} style={paneWidth}>
        <PaneHeader {...headerProps}></PaneHeader>
        <div style={{width: "100%", height:"100%", overflow: "auto", padding: "14px"}}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Pane.propTypes = propTypes;

export default Pane;



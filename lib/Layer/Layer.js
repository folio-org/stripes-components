/*
 * basic pane container with transitions.
 * used to create a new layer of panes within a <Paneset/>
 */

import React from 'react';
import css from './Layer.css';
import { Portal } from 'react-overlays'
import Paneset from '../Paneset'

//import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
const propTypes={
  isOpen: React.PropTypes.bool,
  container: React.PropTypes.node,
  transitionName: React.PropTypes.string
};

const contextTypes = {
  paneset: React.PropTypes.instanceOf(Paneset),
};

class Layer extends React.Component{
  constructor(props){
    super(props);
    this.container = null;
    this.contentRef = null;
  }
  
  componentWillMount(){
    this.container = this.props.container || this.context.paneset;
  }

  componentDidUpdate(prevProps){
    if(this.props.isOpen){
      const modal = this.contentRef;
    }
  }
  
  render(){
    let content = null;
    let overlay = null;
    if(this.props.isOpen){
      overlay = <div className={css.overlay}></div>;
      content = <div className={css.LayerRoot} open role="dialog" key="container" tabIndex="0" ref={(ref)=>this.contentRef = ref} aria-label={this.props.contentLabel}>{this.props.children}</div>;
    }

    
    return (
      <Portal container={this.container} >
        {content}
      </Portal>
    );
  }
}

Layer.propTypes = propTypes;
Layer.contextTypes = contextTypes;

export default Layer;


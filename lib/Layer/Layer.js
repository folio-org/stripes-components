/*
 * basic container with transitions.
 */

import React from 'react';
import css from './Layer.css';
//import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
const propTypes={
  isOpen: React.PropTypes.bool,
  transitionName: React.PropTypes.string
};

const fadeTransitions = {
  enter: css.fadeEnter,
  enterActive: css.fadeEnterActive,
  leave: css.fadeLeave,
  leaveActive: css.fadeLeaveActive,
};

const slideTransitions = {
  enter: css.slideEnter,
  enterActive: css.slideEnterActive,
  leave: css.slideLeave,
  leaveActive: css.slideLeaveActive,
};

const olayTransitions = {
  enter: css.olayEnter,
  enterActive: css.olayEnterActive,
  leave: css.olayLeave,
  leaveActive: css.olayLeaveActive,
};

const transitionTime = 300;

class Layer extends React.Component{
  constructor(props){
    super(props);
    this.contentRef = null;
  }
  
  componentDidUpdate(prevProps){
    if(this.props.isOpen){
      const modal = this.contentRef;
      //window.setTimeout(function(){modal.focus();}, transitionTime);
    }
  }
  
  render(){
    let content = null;
    let overlay = null;
    if(this.props.isOpen){
      overlay = <div className={css.overlay}></div>;
      content = <div className={css.LayerRoot} open role="dialog" key="container" tabIndex="0" ref={(ref)=>this.contentRef = ref} aria-label={this.props.contentLabel}>{this.props.children}</div>;
    }

    return(
      <div>
        {/*<ReactCSSTransitionGroup
          transitionName={olayTransitions} 
          transitionEnterTimeout={400} 
          transitionLeaveTimeout={400}>
          {overlay}     
        </ReactCSSTransitionGroup>*/}
        {/*<ReactCSSTransitionGroup 
          transitionName={slideTransitions} 
          transitionEnterTimeout={transitionTime} 
          transitionLeaveTimeout={transitionTime}>*/}
          {content}
        {/*</ReactCSSTransitionGroup> */}
      </div> 
    ); 
  }
}

Layer.propTypes = propTypes;

export default Layer;


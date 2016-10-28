import React from 'react';
import css from './ControlGroup.css'

class ControlGroup extends React.Component{
  constructor(props){
    super(props);
  }
  
  getStyle(child){
    let style = {};
    switch(child.props.type){
      case 'button':
        style.alignSelf = 'stretch';
    }
    return style;
  }
  
  wrapIfNeeded(child, i){
    if(child.props.type){
      switch(child.props.type){
        case 'button':
        case 'submit':
        case 'text':
        case 'number':
          return child;
          break;
      }
    }
    return <div key={"control-" + i} className={css.groupBorder}>{child}</div>;
  }
  
  render(){
    return(
      <div className={css.root}>
        {
          React.Children.map(
            this.props.children, 
            function(child, i){
              return this.wrapIfNeeded(child, i);
            }, 
            this
          )
        }
      </div>      
            );
  }
}

export default ControlGroup


